<script setup>
import { computed, ref, watch, onMounted } from "vue";
//import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan, mdiBarcode } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import store from "../store";
import router from "@/router";
import OverlayLayer from "@/components/OverlayLayer.vue";
import FormControl from "@/components/FormControl.vue";
import axiosClient from "../axios.js";
import { excelParser } from "../excel-parser";
import { generateAndDownloadBarcodeInPDF } from "../barCodeGen";
import VueBarcode from "vue-barcode";
import ModelShow from "@/components/ModelShow.vue";
import ProductOnce from "@/components/ProductOnce.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

defineProps({
  checkable: Boolean,
});

const search = ref("");
const sortField = ref("updated_at");
const sortDirection = ref("desc");

const members = computed(() => store.state.AllProductList.data);
const loading = computed(() => store.state.AllProductList.loading);

store.dispatch("getAllProductList", { search: search.value });

watch(search, (newValue, oldValue) => {
  store.dispatch("getAllProductList", {
    search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
  });
});
function getAllProductList(url = null) {
  store.dispatch("getAllProductList", {
    url,
    search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
  });
}

onMounted(() => {
  getAllProductList();
});

function generateAndDownloadBarCode(barCode) {
  generateAndDownloadBarcodeInPDF(barCode);
}

function createUser() {
  router.push("/product-list/create");
  store.dispatch("getAllProductList");
}
function sortMembers(field) {
  if (field === sortField.value) {
    if (sortDirection.value === "desc") {
      sortDirection.value = "asc";
    } else {
      sortDirection.value = "desc";
    }
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }

  getAllProductList();
}
function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getAllProductList(link.url);
}
function deleteProductList(member) {
  if (
    confirm(`Are you sure you want to delete this product? Operation can't be undone!!`)
  ) {
    store.dispatch("deleteProductList", member.id).then(() => {
      store.commit("notify", {
        type: "success",
        message: "Product was successfully deleted!",
      });
      store.dispatch("getAllProductList");
    });
  }
}

function deleteAllProductList(checked) {
  if (checked.length) {
    if (
      confirm(`Are you sure you want to delete this product? Operation can't be undone!!`)
    ) {
      store.dispatch("deleteAllProductList", checked).then(() => {
        store.commit("notify", {
          type: "success",
          message: "Product was successfully deleted!",
        });
        store.dispatch("getAllProductList");
      });
    }
  } else {
    store.commit("notify", {
      type: "success",
      message: "No data selected to delete",
    });
  }
}
const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const showOnce = ref(false);

const showModel = ref(false);

function toggleModal() {
  showModel.value = !showModel.value;
}

function toggleCreateOnce() {
  showOnce.value = !showOnce.value;
}

const itemsPaginated = computed(() =>
  members.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(members.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((member) => {
    if (!cb(member)) {
      newArr.push(member);
    }
  });

  return newArr;
};

const checked = ref([]);
const selected = ref([]);
const selectAll = ref(false);

function select() {
  selected.value = [];
  if (!selectAll.value) {
    for (let i in members.value) {
      selected.value.push(members.value[i]);
    }
  }
}

function updateCheckall() {
  if (members.value.length == selected.value.length) {
    selectAll.value = true;
  } else {
    selectAll.value = false;
  }
}
function exportCSV(index) {
  const sample = ref({
    questions: [],
  });

  selected.value.forEach((item, _) => {
    sample.value.questions.splice(index, 0, {
      id: item.id,
      ProductName: item.productName,
      BarCode: item.barCode,
      PurchasePrice: item.purchasePrice,
      SalesPrice: item.salesPrice,
      Quantity: item.quantity,
      Code: item.code,
      Size: item.size,
      Color: item.color,
      Brand: item.brand,
      Date: item.updated_at,
    });
  });

  excelParser().exportDataFromCsv(sample.value.questions, null, null);
}
function exportExcel(index) {
  const sample = ref({
    questions: [],
  });

  selected.value.forEach((item, _) => {
    sample.value.questions.splice(index, 0, {
      id: item.id,
      ProductName: item.productName,
      BarCode: item.barCode,
      PurchasePrice: item.purchasePrice,
      SalesPrice: item.salesPrice,
      Quantity: item.quantity,
      Code: item.code,
      Size: item.size,
      Color: item.color,
      Brand: item.brand,
      Date: item.updated_at,
    });
  });

  excelParser().exportDataFromExcel(sample.value.questions, null, null);
}

store.dispatch("getUser");
</script>

<template>
  <div class="border">
    <div class="grid lg:grid-cols-4 grid-cols-2 gap-4 items-center m-3">
      <select
        @change="getAllProductList(null)"
        v-model="perPage"
        class="appearance-none w-full mb-2 block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <div class="w-full">
        <Menu as="div" class="relative text-left">
          <div>
            <MenuButton
              :disabled="!selected.length"
              class="inline-flex w-full dark:bg-gray-700 dark:text-gray-400 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Export Product
              <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition   ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute dark:bg-gray-700 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <MenuItem v-slot="{ active }" @click="exportCSV()">
                  <a
                    :class="[
                      active
                        ? 'courser-pointer bg-gray-100 text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                        : 'text-gray-700 dark:text-white ',
                      'block px-4 py-2 text-sm',
                    ]"
                    >Export CSV</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }" @click="exportExcel()">
                  <a
                    :class="[
                      active
                        ? 'courser-pointer bg-gray-100  text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                        : 'text-gray-700 dark:text-white ',
                      'block px-4 py-2 text-sm',
                    ]"
                    >Export Excel</a
                  >
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>

      <button
        @click="deleteAllProductList(selected)"
        type="button"
        class="w-full py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Delete
      </button>

      <button
        @click="toggleCreateOnce()"
        type="button"
        class="w-full py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Create Once
      </button>
    </div>
    <span
      class="bg-blue-100 float-left mt-3 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
    >
      <svg
        aria-hidden="true"
        class="w-3 h-3 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        ></path>
      </svg>
      Total Selected {{ selected.length }}
    </span>
    <div>
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >Search</label
      >
      <div class="grid grid-cols-2 float-right gap-8 mt-3 mr-3">
        <div>
          <span
            class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
          >
            <svg
              aria-hidden="true"
              class="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Total Products {{ members.length }}
          </span>
        </div>
        <FormControl
          placeholder="Search (ctrl+k)"
          ctrl-k-focus
          transparent
          borderless
          v-model="search"
          type="search"
        />
      </div>
    </div>
  </div>

  <div class="overflow-x-auto w-full">
    <table>
      <div class="lg:hidden m-4" v-if="members.length">
        <input type="checkbox" v-model="selectAll" @click="select()" />

        <strong class="ml-2">Select All</strong>
      </div>
      <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="selectAll" @click="select()" />
          </th>
          <th />
          <th
            field="productName"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('productName')"
          >
            Name
          </th>

          <th
            field="barCode"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('barCode')"
          >
            Barcode
          </th>
          <th
            field="category"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('category')"
          >
            Category
          </th>
          <th
            field="quantity"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('quantity')"
          >
            Quantity
          </th>
          <th
            field="purchasePrice"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('purchasePrice')"
          >
            Purchase Price
          </th>
          <th
            field="salesPrice"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('salesPrice')"
          >
            Sales Price
          </th>
          <th
            field="status"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('status')"
          >
            Status
          </th>
          <th
            field="updated_at"
            :sort-field="sortField"
            :sort-direction="sortDirection"
            @click="sortMembers('updated_at')"
          >
            Updated At
          </th>
          <th>History</th>

          <th>Action</th>
          <th />
        </tr>
      </thead>
      <tbody v-if="loading || !members.length">
        <tr>
          <td colspan="12">
            <div v-if="loading">
              <OverlayLayer />
            </div>

            <div
              v-else
              class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
              role="alert"
            >
              <div class="flex">
                <div class="py-1">
                  <svg
                    class="fill-current h-6 w-6 text-teal-500 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-bold">Ooops Their is Something Error</p>
                  <p class="text-sm">Their is no data found here.</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="member of itemsPaginated" :key="member.id">
          <td>
            <input
              type="checkbox"
              :value="member"
              v-model="selected"
              @change="updateCheckall()"
            />
          </td>

          <td class="border-b-0 cursor-pointer lg:w-6 before:hidden">
            <div
              v-if="member.image_url"
              class="relative w-12 h-12 transition-all rounded-md transform hover:scale-125"
            >
              <img
                class="shadow-lg rounded-full max-w-full h-auto align-middle border-none"
                :src="member.image_url"
                alt="user image"
              />
            </div>
            <div
              v-else
              class="relative w-12 h-12 transition-all rounded-md transform hover:scale-125"
            >
              <img
                class="shadow-lg rounded-full max-w-full h-auto align-middle border-none"
                src="../assets/noimage.jpg"
                alt="product image"
              />
            </div>
          </td>
          <td data-label="Product Name">
            {{ member.productName }}
          </td>
          <td data-label="Product barCode">
            {{ member.barCode }}
          </td>
          <td data-label="Category" v-if="member.category">
            {{ member.category.category }}
          </td>
          <td data-label="Category" v-else>No Category</td>
          <td data-label="Product Quantity">
            {{ member.quantity }}
          </td>
          <td data-label="Purchase Price">
            {{ member.purchasePrice }}
          </td>
          <td data-label="Sales Price">
            {{ member.salesPrice }}
          </td>

          <td
            data-label="Status"
            class="m-2"
            :class="[member.status != 0 ? 'text-green-600' : 'text-red-600']"
          >
            {{ member.status != 0 ? "Active" : "In Active" }}
          </td>

          <td data-label="Updated Date" class="lg:w-1 font-bold whitespace-nowrap">
            <small class="text-gray-500 dark:text-slate-400">{{
              member.updated_at
            }}</small>
          </td>

          <td>
            <ModelShow :member="member" @toggleModal="toggleModal" />
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton
                color="green"
                :icon="mdiBarcode"
                small
                @click.prevent="generateAndDownloadBarCode(member.barCode)"
              />
              <BaseButton
                color="info"
                :icon="mdiEye"
                small
                :to="{ name: 'ProductListView', params: { id: member.id } }"
              />
              <BaseButton
                v-if="member.id"
                color="danger"
                :icon="mdiTrashCan"
                small
                type="button"
                @click="deleteProductList(member)"
              />
            </BaseButtons>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
      <BaseLevel>
        <BaseButtons>
          <BaseButton
            v-for="page in pagesList"
            :key="page"
            :active="page === currentPage"
            :label="page + 1"
            :color="page === currentPage ? 'lightDark' : 'whiteDark'"
            small
            @click="currentPage = page"
          />
        </BaseButtons>
        <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      </BaseLevel>
    </div>
  </div>
  <div
    v-if="showOnce"
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
  >
    <ProductOnce @toggleCreateOnce="toggleCreateOnce" />
  </div>
</template>
