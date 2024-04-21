<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxMember from "@/components/CardBoxMember.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormControl from "@/components/FormControl.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import EditMember from "@/views/EditMember.vue";
import store from "../store";
import Notification from "@/components/Notification.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import OverSpin from "./OverSpin.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import CardBox from "@/components/CardBox.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import { useRoute, useRouter } from "vue-router";
import { writeFile } from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";

const router = useRouter();
const route = useRoute();

defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();

//const items = computed(() => mainStore.reports)
const selectDate = ref([
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
const search = ref("");
const sortField = ref("updated_at");
const sortDirection = ref("desc");
const id = ref(route.params.id);
let keyword = ref("today");

const reports = computed(() => store.state.userReports.data);
const loading = computed(() => store.state.userReports.loading);

store.dispatch("getUserReports", { search: search.value });

watch([keyword, search], ([newKeyword, newSearch], [oldKeyword, oldSearch]) => {
  store.dispatch("getUserReports", {
    search: newSearch,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
    id: route.params.id,
    keyword: newKeyword,
  });
});

function getUserReports(url = null) {
  store.dispatch("getUserReports", {
    url,
    search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
    id: route.params.id,
    keyword: keyword.value,
  });
}

onMounted(() => {
  getUserReports();
});

// Calculate total data
// Function to calculate totals

function sortreports(field) {
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

  getUserReports();
}

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  reports.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(reports.value.length / perPage.value));

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

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const data = ref({
  id: "",
});
const del = ref("");

let deleteModel = ref(false);

function deleteMember(id) {
  deleteModel.value = !deleteModel.value;
  del.value = id;
  // alert(del.value)
}
function yesDelete(del) {
  store.dispatch("deleteMember", del).then((response) => {
    deleteModel.value = false;
    store.commit("notify", {
      type: "success",
      message: response.data.message,
    });
    //console.log(response.data.message)
    store.dispatch("getUserReports");
  });
}

let deleteAllModel = ref(false);
const delVal = ref([]);

function deleteAll(checked) {
  deleteAllModel.value = !deleteAllModel.value;
  delVal.value = checked;
  // alert(del.value)
}
function yesDeleteAll(delVal) {
  deleteAllModel.value = false;
  if (delVal.length) {
    store.dispatch("deleteAllMember", delVal).then((response) => {
      store.commit("notify", {
        type: "success",
        message: response.data.message,
      });
      store.dispatch("getUserReports");
    });
  }
}
let showModal = ref(false);

function openModal(id) {
  showModal.value = !showModal.value;
  data.value.id = id;
  //store.dispatch("showMember");

  //alert(  data.value.id)
}

function getData() {
  store.dispatch("getUserReports", {
    keyword: keyword.value,
  });
}
const checked = ref([]);
const selected = ref([]);
const selectAll = ref(false);

function select() {
  selected.value = [];
  if (!selectAll.value) {
    for (let i in reports.value) {
      selected.value.push(reports.value[i]);
    }
  }
}

function updateCheckall() {
  if (reports.value.length == selected.value.length) {
    selectAll.value = true;
  } else {
    selectAll.value = false;
  }
}

function routeReport(id) {
  router.push({ name: "UserReportsView", params: { id } });
}

// Add house.name field to each item in reports
const modifiedReports = computed(() => {
  return reports.value.map((item) => {
    return {
      ...item,
      Warehouse: item.house.name,
    };
  });
});

function exportToPDF() {
  const data = modifiedReports.value.map((item) => {
    // Remove house object from data
    const { house, ...rest } = item;
    return rest;
  });

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Save the workbook as an Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(excelBlob, "exported_data.xlsx");
}

// Computed property to calculate totals
const totalData = computed(() => {
  let totalQuantity = 0;
  let totalProfit = 0;
  let totalStockedOutPrice = 0;
  let totalRemaining = 0;

  reports.value.forEach((item) => {
    totalQuantity += Math.abs(item.quantity);
    totalProfit += parseInt(item.profit);
    totalStockedOutPrice += parseInt(item.totalStockOutPrice);
    totalRemaining += parseInt(item.remaining);
  });
  // console.log(totalQuantity);
  return {
    totalQuantity,
    totalProfit,
    totalStockedOutPrice,
    totalRemaining,
  };
});

function purchaseReports() {
  router.push({ name: "UserBuyReports", params: route.params.id });
}
function stock() {
  router.push({ name: "MergeReports", params: route.params.id });
}
</script>

<template>
  <div
    v-if="deleteModel"
    id="popup-modal"
    tabindex="-1"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center max-h-full"
  >
    <OverlayLayer>
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            @click="deleteMember()"
            type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg
              class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this supplier?
            </h3>
            <button
              @click="yesDelete(del)"
              data-modal-hide="popup-modal"
              type="button"
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
            >
              Yes, I'm sure
            </button>
            <button
              @click="deleteMember()"
              data-modal-hide="popup-modal"
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </OverlayLayer>
  </div>

  <div
    v-if="deleteAllModel"
    id="popup-modal"
    tabindex="-1"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center max-h-full"
  >
    <OverlayLayer>
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            @click="deleteAll()"
            type="button"
            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg
              class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete?
            </h3>
            <button
              @click="yesDeleteAll(delVal)"
              data-modal-hide="popup-modal"
              type="button"
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
            >
              Yes, I'm sure
            </button>
            <button
              @click="deleteAll()"
              data-modal-hide="popup-modal"
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </OverlayLayer>
  </div>
  <CardBoxMember
    v-if="showModal"
    @openModal="openModal"
    title="Update Supplier "
    has-cancel
  >
    <EditMember :id="data.id" />
  </CardBoxMember>
  <Notification />

  <div v-if="loading"><OverSpin /></div>

  <div>
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
      <div
        class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <select
            @change="getUserReports(null)"
            v-model="perPage"
            class="appearance-none block w-24 px-3 py-2 border dark:bg-gray-900 dark:text-white border-gray-300] placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div class="relative flex-1 w-14 ml-3">
          <button
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            @click="exportToPDF()"
          >
            Export to Excel
          </button>
        </div>
        <div class="relative flex-1 w-14 ml-3">
          <button
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            @click="purchaseReports()"
          >
            User Purchase Reports
          </button>
        </div>
        <div class="relative flex-1 w-14 ml-3">
          <button
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            @click="stock()"
          >
            Stock In and Stock Out
          </button>
        </div>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div class="w-full">
            <select
              id="countries"
              v-model="keyword"
              class="bg-gray-50 py-2.5 px-5 mr-2 mb-4 mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option class="text-xl font-semibold" selected>All Products</option>
              <option
                class="text-xl font-semibold"
                @click="getData()"
                v-for="sel in selectDate"
                :key="sel.id"
                :value="sel.value"
              >
                {{ sel.name }}
              </option>
            </select>
          </div>

          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >Search</label
          >
          <div class="relative float-right mt-3 mr-3">
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
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul
            class="flex flex-col text-xs font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li v-if="selected.length">
              <button
                @click="deleteAll(selected)"
                class="block dark:text-white dark:hover:bg-slate-800 hover:text-slate-500 text-center rounded-lg pl-3 pr-3 pt-0 pb-0 border border-slate-600 text-xs"
              >
                Delete all
              </button>
              <span></span>
            </li>

            <li v-if="selected.length">
              <div
                class="block py-2 px-3 md:p-0 rounded md:bg-transparent"
                aria-current="page"
              >
                Selected
                <b class="border border-gray-600 p-1 rounded-full">{{
                  selected.length
                }}</b>
              </div>
            </li>
            <li>
              <div
                href="#"
                class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Total
                <b class="border border-slate-500 p-1 rounded-full">{{
                  reports.length
                }}</b>
              </div>
            </li>
            <li>
              <a
                href="#"
                class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 d:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >Services</a
              >
            </li>
            <li>
              <a
                href="#"
                class="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >Contact</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="overflow-x-auto w-full">
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @click="select()" />
            </th>
            <th />
            <th
              field="fullname"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortreports('fullname')"
            >
              Creator
            </th>
            <th>Warehouse</th>

            <th>productName</th>
            <th>barCode</th>
            <th>purchasePrice</th>
            <th>salesPrice</th>
            <th>Previous</th>
            <th>quantity</th>

            <th>remaining</th>

            <th>profit</th>
            <th>Total Price</th>

            <th>Transaction</th>

            <th
              field="updated_at"
              :sort-field="sortField"
              :sort-direction="sortDirection"
              @click="sortreports('updated_at')"
            >
              Updated At
            </th>
            <th />
          </tr>
        </thead>

        <tbody>
          <tr class="courser-pointer" v-for="member in itemsPaginated" :key="member.id">
            <td>
              <input
                type="checkbox"
                :value="member"
                v-model="selected"
                @change="updateCheckall()"
              />
            </td>
            <td class="border-b-0 lg:w-6 before:hidden"></td>
            <td data-label="Creator">
              {{ member.creator }}
            </td>
            <td data-label="Warehouse">
              <div v-if="member.house">
                {{ member.house.name }}
              </div>
              <div v-else>No warehouse</div>
            </td>

            <td data-label="productName">
              {{ member.productName }}
            </td>
            <td data-label="barCode">
              {{ member.barCode }}
            </td>
            <td data-label="purchasePrice">
              {{ member.purchasePrice }}
            </td>

            <td data-label="salesPrice">
              {{ member.salesPrice }}
            </td>
            <td data-label="Previous">
              {{ parseInt(member.remaining) + parseInt(member.quantity * -1) }}
            </td>

            <td data-label="Quantity">
              {{ member.quantity }}
            </td>
            <td data-label="Remaining">
              {{ member.remaining }}
            </td>
            <td data-label="Profit">
              {{ member.profit }}
            </td>

            <td data-label="Price">
              {{ member.totalStockOutPrice }}
            </td>
            <td data-label="Transaction">
              {{ member.Transaction }}
            </td>
            <td data-label="Created" class="lg:w-1 whitespace-nowrap">
              <small
                class="text-gray-500 dark:text-slate-400"
                :title="member.updated_at"
                >{{ member.updated_at }}</small
              >
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th />
            <th></th>
            <th></th>
            <th></th>
            <th></th>

            <th></th>
            <th></th>
            <th></th>
            <th>{{ totalData.totalQuantity + totalData.totalRemaining }}</th>
            <th>{{ totalData.totalQuantity }}</th>
            <th>{{ totalData.totalRemaining }}</th>

            <th>{{ $filters.currencyUSD(Math.abs(totalData.totalProfit)) }}</th>

            <th>{{ $filters.currencyUSD(Math.abs(totalData.totalStockedOutPrice)) }}</th>

            <th></th>

            <th></th>
            <th />
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  <div v-if="!reports.length" class="w-full">
    <CardBox>
      <CardBoxComponentEmpty class="py-[60px]" />
    </CardBox>
  </div>
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
</template>
