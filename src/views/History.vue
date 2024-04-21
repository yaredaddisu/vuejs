<script>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
  mdiSitemap,
  mdiArrowExpandUp,
  mdiArrowRightBold,
  mdiEye,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableProducts from "@/components/TableProducts.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import FormControl from "@/components/FormControl.vue";

import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import router from "@/router";
import store from "@/store";
import FormField from "@/components/FormField.vue";

import OverlayLayer from "@/components/OverlayLayer.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { excelParser } from "../excel-parser";
import { sampleData } from "../sample-data";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
const isModalActive = ref(false);

import axios from "../axios.js";

export default {
  components: {
    FormControl,
    excelParser,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    sampleData,
    OverlayLayer,
    CardBoxModal,
    SvgIcon,
    mdiEye,
    SectionMain,
    NotificationBar,
    TableProducts,
    CardBox,
    LayoutAuthenticated,
    SectionTitleLineWithButton,
    BaseButton,
    CardBoxComponentEmpty,
    router,
    store,
    FormField,
    BaseButtons,
    BaseButtons,
  },

  data() {
    return {
      keyword: null,
      UserSecret: null,

      products: [],
      loading: false,
      load: false,
      category: [],
      checked: [],
      date: null,
      showModal: false,
      notifmsg: "",
      keyword: "today",

      search: null,

      selectAll: false,
      selectDate: [
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
      ],
      currentPage: 1,
      perPage: 10,
      isOpen: false,
      cart: [],
    };
  },

  computed: {
    paginatedPurchases() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.products.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.perPage);
    },
  },

  methods: {
    deleteCart: function (item) {
      var index = this.cart.indexOf(item);

      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },

    async updateProduct(cart) {
      this.load = true;

      await axios
        .put("/product-update", {
          cart,
        })
        .then((response) => {
          this.load = false;

          this.$store.commit("notify", {
            type: "success",
            message: "Product was successfully Stockd In ",
          });
          this.cart = [];
          this.isOpen = false;

          this.getByDate();
        })
        .catch((error) => {
          this.load = false;

          console.log(error);
        });
    },
    clear() {
      this.cart = [];
      this.isOpen = false;
    },
    openModal(product) {
      this.isOpen = true;

      let productInChart = this.cart.find((item) => item.id === product.id);
      if (productInChart) {
        productInChart;
      } else {
        this.cart.push({
          id: product.id,
          survey_id: product.survey_id,
          user_id: product.user_id,
          salesPrice: product.salesPrice,
          productName: product.productName,
          purchasePrice: product.purchasePrice,
          creator: product.creator,
          house_id: product.house_id,
          reference: product.reference,
          barCode: product.barCode,
          quantity: product.quantity,
          previous: product.previous,
          remaining: product.remaining,
          totalStockOutPrice: 0,
          Transaction: "Stock Out ",
        });
      }
    },
    closeModal() {
      this.isOpen = false;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    stockOut: function () {
      this.$router.push("/stock-out");
    },
    stockIn: function () {
      this.$router.push("/stock-in");
    },
    // Export CSV function
    // Export CSV function
    exportCSV() {
      // Manually define headers
      const headersMapping = {
        reference: "Reference",
        productName: "Product Name",
        barCode: "Barcode",
        creator: "Creator",
        purchasePrice: "Purchase Price",
        salesPrice: "Sales Price",
        previous: "Previous",
        quantity: "Quantity",
        remaining: "Remaining",
        profit: "Profit",
        totalStockOutPrice: "Total Price",

        updated: "Updated",

        Transaction: "Transaction",
        created_at: "Created At",
        updated_at: "Updated At",
      };

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add header row
      const headers = Object.values(headersMapping);
      csvContent += headers.join(",") + "\n";

      // Add data rows
      this.checked.forEach((item) => {
        // Convert boolean value to string representation
        const updatedValue = item.updated ? "true" : "false";

        // Create a new array to hold the row data with mapped headers
        const rowData = Object.keys(headersMapping).map((header) => {
          if (header === "updated") {
            return updatedValue;
          } else {
            return item[header] || "";
          }
        });

        // Add the row data to csvContent
        csvContent += rowData.join(",") + "\n";
      });

      // Create a link and trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "export.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
    },

    //
    // Function to manually assign values to attributes

    // Export Excel function
    // Export Excel function
    exportExcel() {
      // Manually define headers
      const headersMapping = {
        reference: "Reference",
        productName: "Product Name",
        barCode: "Barcode",
        creator: "Creator",
        purchasePrice: "Purchase Price",
        salesPrice: "Sales Price",
        previous: "Previous",
        quantity: "Quantity",
        remaining: "Remaining",
        profit: "Profit",
        totalStockOutPrice: "Total Price",

        updated: "Updated",
        Transaction: "Transaction",
        created_at: "Created At",
        updated_at: "Updated At",
      };

      // Create an array to hold the rows
      const excelData = [];

      // Add header row
      const headers = Object.values(headersMapping);
      excelData.push(headers);

      // Add data rows
      this.checked.forEach((item) => {
        // Convert boolean value to string representation
        const updatedValue = item.updated ? "true" : "false";

        // Create a new array to hold the row data with mapped headers
        const rowData = Object.keys(headersMapping).map((header) => {
          if (header === "updated") {
            return updatedValue;
          } else {
            return item[header] || "";
          }
        });

        // Add the row data to excelData
        excelData.push(rowData);
      });

      // Export data to Excel
      excelParser().exportDataFromExcel(excelData, null, null);
    },

    //

    deleteAllHistory(checked, password) {
      this.load = true;
      if (this.checked.length) {
        if (
          confirm(
            `Are you sure you want to delete this History? Operation can't be undone!!`
          )
        )
          axios
            .post("/deleteAll-history", {
              data: this.checked,

              UserSecret: this.UserSecret,
            })
            .then((response) => {
              this.load = false;
              this.showModal = false;
              this.UserSecret = null;
              this.$store.commit("notify", {
                type: "success",
                message: "History was successfully Deleted ",
              });
              this.getByDate();
            })
            .catch((error) => {
              this.load = false;
              this.UserSecret = null;
              this.showModal = false;
              if (error.response.status === 422) {
                this.$store.commit("notify", {
                  type: "error",
                  message: error.response.data.error,
                });
              }
            });
      }
    },

    getByDate() {
      this.loading = true;

      axios
        .get("/product-cart", {
          params: {
            keyword: this.keyword,
            search: this.search,
            id: this.$route.params.id,
          },
        })
        .then((res) => {
          this.loading = false;

          this.products = res.data.data;
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    select() {
      this.checked = [];
      if (!this.selectAll) {
        for (let i in this.products) {
          this.checked.push(this.products[i]);
        }
      }
    },

    updateCheckall: function () {
      if (this.products.length == this.checked.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    },

    getDateTime: function () {
      axios
        .get("/product-date")
        .then((response) => {
          this.date = response.data;
          //console.log(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    ///
    getData: function () {
      this.getByDate();
    },

    toggleModal: function () {
      this.showModal = !this.showModal;
    },
  },
  created() {
    this.getByDate();
    this.getDateTime();
  },
  watch: {
    keyword(after, before) {
      this.getByDate();
      this.getDateTime();
    },
    search() {
      this.getByDate();
      this.getDateTime();
    },
    cart: {
      handler(newCart, oldCart) {
        // Iterate over the updated cart array
        newCart.forEach((item) => {
          // Calculate the remaining value for each item
          item.remaining = parseInt(item.previous) + parseInt(item.quantity);
          item.quantity = parseInt(item.quantity);
          item.previous = parseInt(item.previous);
        });
      },
      deep: true, // Watch for changes deeply in the cart array
    },
  },
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" has-cancel> </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiArrowExpandUp" title="Stock Out History" main>
        <BaseButton
          target="_blank"
          :icon="mdiArrowExpandUp"
          label="Stock Out"
          color="contrast"
          rounded-full
          small
          @click="stockOut"
        />
        <BaseButton
          target="_blank"
          :icon="mdiArrowExpandUp"
          label="Stock In"
          color="contrast"
          rounded-full
          small
          @click="stockIn"
        />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6 bg-gray-20" has-table>
        <!-- Main modal -->
        <OverlayLayer v-if="showModal" />

        <div
          v-if="showModal"
          class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
        >
          <div class="relative w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                @click="toggleModal()"
                type="button"
                class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
              <div class="px-6 py-6 lg:px-8">
                <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                  Enter Your Secret Word
                </h3>
                <div class="space-y-6">
                  <div>
                    <input
                      type="password"
                      v-model="UserSecret"
                      name="password"
                      id="password"
                      placeholder="Enter Your Secret Word"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <p class="text-sm">
                    Required. Your default Secret Word is '1234' change this word
                  </p>

                  <button
                    :disabled="!UserSecret"
                    @click="deleteAllHistory(checked)"
                    type="submit"
                    class="w-full mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                    :class="{ 'cursor-not-allowed': load, 'hover:bg-gray-700': load }"
                  >
                    <svg
                      v-if="load"
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <div class="w-full rounded-lg">
          <div class="relative p-6 overflow-x-auto">
            You have selected <strong>{{ checked.length }}</strong>
            <hr />
            <div class=" ">
              <div class="grid gap-x-8 gap-y-4 lg:grid-cols-4 md:grid-cols-2">
                <div>
                  <button
                    class="h-10 mt-10 px-5 w-full text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                  >
                    <span class="mr-2">Total Products Sold </span>
                    <span
                      class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
                      >{{ products.length }}</span
                    >
                  </button>
                </div>
                <div class="mt-10 w-full">
                  <Menu as="div" class="relative text-left">
                    <div>
                      <MenuButton
                        class="inline-flex w-full dark:bg-gray-700 dark:text-gray-400 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Export History
                        <ChevronDownIcon
                          class="-mr-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
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
                        :disabled="!this.checked.length"
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

                <div class="mt-10 w-full">
                  <button
                    @click="toggleModal()"
                    :disabled="!this.checked.length"
                    type="button"
                    class="w-full py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Delete History
                  </button>
                </div>

                <div class="mt-10 w-full">
                  <select
                    id="countries"
                    v-model="keyword"
                    class="bg-gray-50 py-2.5 px-5 mr-2 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                <div class="mt-2 w-full">
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

            <div class="overflow-auto">
              <table class="">
                <tbody v-if="loading || !products.length">
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
                <div class="lg:hidden m-4">
                  <input type="checkbox" v-model="selectAll" @click="select()" />

                  <strong class="ml-2">Select All</strong>
                </div>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" v-model="selectAll" @click="select()" />
                    </th>
                    <th>Reference</th>
                    <th>Name</th>
                    <th>BarCode</th>

                    <th>Purchase Price</th>

                    <th>Sales Price</th>
                    <th>Total Profit</th>
                    <th>Previous Quantity</th>
                    <th>Stock Out Quantity</th>
                    <th>Stock In Quantity</th>
                    <th>Stock Out Date</th>

                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(product, index) in paginatedPurchases" :key="index">
                    <td>
                      <input
                        type="checkbox"
                        :value="product"
                        v-model="checked"
                        @change="updateCheckall()"
                      />
                    </td>
                    <td data-label="Reference" scope="row">
                      {{ product.reference }}
                    </td>
                    <td data-label="Product Name" scope="row">
                      {{ product.productName }}
                      <span
                        v-if="this.date === product.cart_date"
                        class="inline-flex items-center justify-center px-1 py-1 mr-2 text-xs font-bold leading-none text-white bg-green-600 rounded-full"
                        >NEW</span
                      >
                    </td>
                    <td data-label="Bar Code" scope="row">
                      {{ product.barCode }}
                    </td>
                    <td data-label="Purchase Price" scope="row">
                      {{ $filters.currencyUSD(product.purchasePrice) }}
                    </td>
                    <td data-label="Sales Price" scope="row">
                      {{ $filters.currencyUSD(product.salesPrice) }}
                    </td>
                    <td data-label="Profit" scope="row">
                      {{ $filters.currencyUSD(product.profit) }}
                    </td>
                    <td
                      data-label="Previous Quantity"
                      class="px-6 py-4 text-xl font-bold text-sky-500"
                    >
                      {{ product.previous }}
                    </td>
                    <td
                      data-label="Stock Out Quantity"
                      class="px-6 py-4 text-xl font-bold text-red-500"
                    >
                      {{ product.quantity }}
                    </td>
                    <td
                      data-label="Remaining Quantity"
                      class="px-6 py-4 text-xl font-bold text-green-500"
                    >
                      {{ product.remaining }}
                    </td>

                    <td data-label="Created Date" class="px-6 py-4">
                      {{ product.created_at }}
                    </td>
                    <td data-label="Created Date" class="px-6 py-4">
                      <span
                        v-if="product.updated"
                        class="inline-flex items-center justify-center px-1 py-1 mr-2 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
                      >
                        Edited
                      </span>
                      {{ product.updated_at }}
                    </td>
                    <td class="before:hidden lg:w-1 whitespace-nowrap">
                      <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <button
                          type="button"
                          @click="openModal(product)"
                          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Edit
                        </button>
                      </BaseButtons>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="flex items-center justify-center mt-4 mb-6">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span class="mx-4 text-sm"
                  >Page {{ currentPage }} of {{ totalPages }}</span
                >
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div
                v-show="isOpen"
                class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
              >
                <div
                  class="bg-gray-100 dark:bg-gray-700 dark:bg-opacity-75 p-8 rounded-lg w-full m-6 h-[400px] overflow-scroll"
                >
                  <h2 class="text-2xl font-bold mb-4">Update</h2>
                  <form @submit.prevent="updateProduct(cart)">
                    <div class="mb-4" v-for="item in cart" :key="item.id">
                      <div class="flex flex-wrap space-x-3 rounded-md">
                        <div class="flex-1">
                          <label
                            for="email"
                            class="block text-sm font-medium dark:text-white text-gray-700"
                            >Product Name</label
                          >
                          <button
                            type="button"
                            class="inline-flex dark:bg-gray-600 dark:text-white justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {{ item.productName }}
                          </button>
                        </div>
                        <div class="flex-1">
                          <label
                            for="email"
                            class="block text-sm font-medium dark:text-white text-gray-700"
                            >Stock Out Quantity</label
                          >
                          <input
                            type="number"
                            v-model="item.quantity"
                            class="outline-none dark:bg-gray-600 dark:text-white focus:outline-none text-center w-full font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700"
                            name="quantity"
                          />
                        </div>
                        <div class="flex-1">
                          <label
                            for="email"
                            class="block text-sm font-medium dark:text-white text-gray-700"
                            >Previous Product
                          </label>
                          <input
                            type="number"
                            v-model="item.previous"
                            class="outline-none dark:bg-gray-600 dark:text-white focus:outline-none text-center w-full font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700"
                            name="quantity"
                          />
                        </div>
                        <div class="flex-1">
                          <label
                            for="email"
                            class="block text-sm font-medium dark:text-white text-gray-700"
                            >Remaining Product
                          </label>
                          <input
                            type="number"
                            v-model="item.remaining"
                            class="outline-none dark:bg-gray-600 dark:text-white focus:outline-none text-center w-full font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700"
                            name="quantity"
                          />
                        </div>
                        <div class="flex-1">
                          <!-- Delete question -->
                          <button
                            type="button"
                            @click="deleteCart(item)"
                            class="items-center mt-6 h-10 px-3 py-2 text-xs rounded-lg border border-transparent text-red-500 hover:border-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </button>
                          <!--/ Delete question -->
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-between">
                      <button
                        @click="clear()"
                        type="button"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Clear
                      </button>
                      <div class="space-x-3 flex">
                        <button
                          type="button"
                          @click="closeModal"
                          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
