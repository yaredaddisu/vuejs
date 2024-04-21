<script setup>
import { computed, ref, watch, onMounted } from "vue";
//import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
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
import { sampleData } from "../sample-data";
import ShowOrderModel from "@/components/ShowOrderModel.vue";
import html2pdf from "html2pdf.js";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

defineProps({
  checkable: Boolean,
});

function exportToPDF() {
  html2pdf(document.getElementById("element-to-convert"), {
    margin: 1,
    filename: "details.pdf",
  });
}

const search = ref("");
const keyword = ref("today");

const sortField = ref("updated_at");
const sortDirection = ref("desc");

const details = computed(() => store.state.details.data);
const loading = computed(() => store.state.details.loading);

store.dispatch("getDetails", { search: search.value, keyword: keyword.value });

watch(search, (newValue, oldValue) => {
  store.dispatch("getDetails", {
    search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
  });
});

watch(keyword, (newValue, oldValue) => {
  store.dispatch("getDetails", {
    keyword: keyword.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
  });
});

function getDetails(url = null) {
  store.dispatch("getDetails", {
    url,
    search: search.value,
    keyword: keyword.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
  });
}

onMounted(() => {
  getDetails();
});
function stockout() {
  router.push("/stock-out");
}
function sortDetails(field) {
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

  getDetails();
}
function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getDetails(link.url);
}

function deleteAll(checked) {
  if (checked.length) {
    if (
      confirm(`Are you sure you want to delete this detail? Operation can't be undone!!`)
    ) {
      store.dispatch("deleteAlldetail", checked).then(() => {
        store.commit("notify", {
          type: "success",
          message: "detail was successfully deleted!",
        });
        store.dispatch("getDetails");
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

const itemsPaginated = computed(() =>
  details.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(details.value.length / perPage.value));

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

  arr.forEach((detail) => {
    if (!cb(detail)) {
      newArr.push(detail);
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
    for (let i in details.value) {
      selected.value.push(details.value[i]);
    }
  }
}

function updateCheckall() {
  if (details.value.length == selected.value.length) {
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
      Reference: item.Reference,
      CustomerName: item.name,
      CustomerEmail: item.email,
      CustomerPhone: item.phone,
      CustomerAddress: item.address,
      VAT: item.Vat,
      TIN: item.Tin,
      TotalProduct: item.TotalProduct,
      TotalQuantity: item.TotalQuantity,
      SubTotal: item.amount,
      Shipping: item.shipping,
      Tax: item.amount * (item.tax / 100),
      GrandTotal:
        parseInt(item.amount) +
        parseInt(item.shipping) +
        parseInt(item.amount * (item.tax / 100)),
      PaidAmount: item.PayedAmount,
      Due: item.Due,
      PaymentStatus: item.Due == 0 ? "Paid" : "Partial",
      PaymentMethod: item.paymentMethod,
      Date: item.created_at,
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
      Reference: item.Reference,
      CustomerName: item.name,
      CustomerEmail: item.email,
      CustomerPhone: item.phone,
      CustomerAddress: item.address,
      VAT: item.Vat,
      TIN: item.Tin,
      TotalProduct: item.TotalProduct,
      TotalQuantity: item.TotalQuantity,
      SubTotal: item.amount,
      Shipping: item.shipping,
      Tax: item.amount * (item.tax / 100),
      GrandTotal:
        parseInt(item.amount) +
        parseInt(item.shipping) +
        parseInt(item.amount * (item.tax / 100)),
      PaidAmount: item.PayedAmount,
      Due: item.Due,
      PaymentStatus: item.Due == 0 ? "Paid" : "Partial",
      //item.Due == item.PayedAmount ? "Not Paid",
      PaymentMethod: item.paymentMethod,
      Date: item.created_at,
      Date: item.updated_at,
    });
  });
  excelParser().exportDataFromExcel(sample.value.questions, null, null);
}

store.dispatch("getUser");

const showModel = ref(false);

function openToggle() {
  showModel.value = !showModel.value;
}

let selectDate = ref([
  { id: "1", name: "Today ", value: "today" },
  { id: "2", name: " Yesterday", value: "yesterday" },
  { id: "3", name: "This Week ", value: "this_week" },
  {
    id: 1,
    name: "January",
    value: "january",
  },
  {
    id: 2,
    name: "February",
    value: "february",
  },
  {
    id: 3,
    name: "March",
    value: "march",
  },
  {
    id: 4,
    name: "April",
    value: "april",
  },
  {
    id: 5,
    name: "May",
    value: "may",
  },
  {
    id: 6,
    name: "June",
    value: "june",
  },
  {
    id: 7,
    name: "July",
    value: "july",
  },
  {
    id: 8,
    name: "August",
    value: "august",
  },
  {
    id: 9,
    name: "September",
    value: "september",
  },
  {
    id: 10,
    name: "October",
    value: "october",
  },
  {
    id: 11,
    name: "November",
    value: "november",
  },
  {
    id: 12,
    name: "December",
    value: "december",
  },
]);
</script>

<template>
  <div class="border">
    <div class="grid lg:grid-cols-4 grid-cols-2 items-center gap-4 mb-2 mt-3 ml-3">
      <select
        @change="getDetails(null)"
        v-model="perPage"
        class="appearance-none w-full block ml-5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <div class="ml-3 w-full">
        <Menu as="div" class="relative text-left">
          <div>
            <MenuButton
              :disabled="!selected.length"
              class="inline-flex w-full dark:bg-gray-700 dark:text-gray-400 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Export History
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
              :disabled="!selected.length"
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
        @click="deleteAll(selected)"
        type="button"
        class="ml-5 py-2.5 px-5 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Delete
      </button>

      <button
        @click="stockout()"
        type="button"
        class="ml-6 py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Stock Out
      </button>
    </div>
  </div>
  <div class="m-3 grid grid-cols-2 gap-x-3 lg:grid-cols-4 md:grid-cols-4">
    <div class="float-left ml-3">
      <BaseButton
        color="lightDark"
        label="Total Sales "
        :icon="mdiOpenInNew"
        :small="buttonsSmall"
        :outline="buttonsOutline"
        :disabled="buttonsDisabled"
        :rounded-full="buttonsRounded"
      />
      <BaseButton
        color="success"
        :label="details.length"
        :icon="mdiOpenInNew"
        :small="buttonsSmall"
        :outline="buttonsOutline"
        :disabled="buttonsDisabled"
        :rounded-full="buttonsRounded"
        class="w-12 h-10 rounded-full mr-6"
      />
    </div>
    <div class="float-left ml-3">
      <BaseButton
        color="lightDark"
        label="Total Selected "
        :icon="mdiOpenInNew"
        :small="buttonsSmall"
        :outline="buttonsOutline"
        :disabled="buttonsDisabled"
        :rounded-full="buttonsRounded"
      />
      <BaseButton
        color="info"
        :label="selected.length"
        :icon="mdiOpenInNew"
        :small="buttonsSmall"
        :outline="buttonsOutline"
        :disabled="buttonsDisabled"
        :rounded-full="buttonsRounded"
        class="w-12 h-10 rounded-full mr-6"
      />
    </div>

    <div class="  ">
      <select
        id="countries"
        v-model="keyword"
        class="bg-gray-50 py-2.5 px-5 mr-2 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option class="text-xl font-semibold" value="All Details" selected>
          All Details
        </option>
        <option
          class="text-xl font-semibold"
          v-for="sel in selectDate"
          :key="sel.id"
          :value="sel.value"
        >
          {{ sel.name }}
        </option>
      </select>
    </div>

    <div class="   ">
      <div class="w-auto">
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

  <hr />

  <div>
    <div class="overflow-x-auto w-full">
      <div class="lg:hidden m-4" v-if="details.length">
        <input type="checkbox" v-model="selectAll" @click="select()" />

        <strong class="ml-2">Select All</strong>
      </div>
      <table ref="document" id="element-to-convert">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @click="select()" />
            </th>

            <th
              field="Reference"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('Reference')"
            >
              Reference
            </th>
            <th
              field="amount"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('amount')"
            >
              Total Price
            </th>
            <th
              field="TotalProduct"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('TotalProduct')"
            >
              Total Products
            </th>
            <th
              field="TotalQuantity"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('TotalQuantity')"
            >
              Total Quantity
            </th>

            <th
              field="tax"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('tax')"
            >
              Tax
            </th>

            <th
              field="paymentMethod"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('paymentMethod')"
            >
              Payment Method
            </th>
            <th
              field="shipping"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('shipping')"
            >
              Shipping
            </th>
            <th>Grand Total</th>
            <th
              field="status"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('status')"
            >
              Status
            </th>
            <th>Payment Status</th>

            <th
              field="updated_at"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortDetails('updated_at')"
            >
              Updated At
            </th>
            <th>Action</th>

            <th />
          </tr>
        </thead>

        <tbody v-if="loading || !details.length">
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
          <tr
            v-for="detail of itemsPaginated"
            :key="detail.id"
            class="cursor-pointer"
            @click="openToggle()"
          >
            <td>
              <input
                type="checkbox"
                :value="detail"
                v-model="selected"
                @change="updateCheckall()"
              />
            </td>
            <td data-label="Reference">
              {{ detail.Reference }}
            </td>
            <td data-label="Total">
              {{ $filters.currencyUSD(Math.abs(detail.amount)) }}
            </td>
            <td data-label="TotalProduct">
              {{ detail.TotalProduct }}
            </td>
            <td data-label="TotalQuantity">
              {{ detail.TotalQuantity }}
            </td>
            <td data-label="Tax">
              ({{ detail.tax }}%)
              {{
                $filters.currencyUSD(
                  Math.abs(parseInt(parseInt(detail.amount) * (detail.tax / 100)))
                )
              }}
            </td>

            <td data-label="Payment Method">
              {{ detail.paymentMethod }}
            </td>
            <td data-label="Shipping">
              {{ $filters.currencyUSD(Math.abs(parseInt(detail.shipping))) }}
            </td>
            <td data-label="Grand Total">
              {{
                $filters.currencyUSD(
                  Math.abs(
                    parseInt(detail.amount) +
                      parseInt(detail.shipping) +
                      parseInt(detail.amount) * (detail.tax / 100)
                  )
                )
              }}
            </td>

            <td data-label="Status">
              <span
                class="inline-block rounded-full px-3 py-1 text-sm font-semibold border mr-2 mb-2"
                :class="[
                  detail.status == 0
                    ? 'text-yellow-800 border-yellow-500 '
                    : 'text-blue-500 border-blue-500 ',
                ]"
                >{{ detail.status != 0 ? "Completed" : "pedding" }}
              </span>
            </td>
            <td data-label="Payment Status">
              <span
                class="inline-block rounded-full px-3 py-1 text-sm font-semibold border mr-2 mb-2"
                :class="[
                  detail.Due == 0
                    ? 'text-green-800 border-green-500 '
                    : 'text-red-500 border-red-500 ',
                ]"
                >{{ detail.Due == 0 ? "Paid" : "Partial" }}
              </span>
            </td>

            <td data-label="Updated At">
              {{ detail.created_at }}
            </td>

            <td class="before:hidden lg:w-1 whitespace-nowrap">
              <BaseButtons type="justify-start lg:justify-end" no-wrap>
                <ShowOrderModel :detail="detail" @toggleModal="toggleModal" />
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
  </div>
  <div></div>
</template>
