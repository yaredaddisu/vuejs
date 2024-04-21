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
import OverSpin from "@/components/OverSpin.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import router from "@/router";
import store from "@/store";
import FormField from "@/components/FormField.vue";
import BaseDivider from "@/components/BaseDivider.vue";

import OverlayLayer from "@/components/OverlayLayer.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { excelParser } from "../excel-parser";
import { sampleData } from "../sample-data";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
const isModalActive = ref(false);
import { writeFile } from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import axios from "../axios.js";

export default {
  components: {
    jsPDF,
    html2canvas,
    OverSpin,
    excelParser,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    BaseDivider,
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
    const current = new Date();

    const year = `${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()}`;
    return {
      year,
      products: [],
      data: [],
      supplier: [],
      loading: false,
      todoId: this.$route.params.id,
      cart: [],
      currentPage: 1,
      perPage: 10,
    };
  },
  computed: {
    totalPurchasePrice() {
      if (
        this.products &&
        this.products.purchases &&
        this.products.purchases.length > 0
      ) {
        return this.products.purchases.reduce((total, item) => {
          return total + parseFloat(item.purchasePrice);
        }, 0);
      } else {
        return 0; // Return 0 if products.purchases is undefined or empty
      }
    },
    totalQuantity() {
      if (
        this.products &&
        this.products.purchases &&
        this.products.purchases.length > 0
      ) {
        return this.products.purchases.reduce((total, item) => {
          return total + parseInt(item.quantity);
        }, 0);
      } else {
        return 0; // Return 0 if products.purchases is undefined or empty
      }
    },
    totalAmount() {
      if (
        this.products &&
        this.products.purchases &&
        this.products.purchases.length > 0
      ) {
        return this.products.purchases.reduce((total, item) => {
          return total + parseFloat(item.amount);
        }, 0);
      } else {
        return 0; // Return 0 if products.purchases is undefined or empty
      }
    },

    paginatedPurchases() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.products.purchases.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.products.purchases.length / this.perPage);
    },
  },

  methods: {
    Purchase(user_id) {
      this.$router.push(`/user-buy-reports/${user_id}`);
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

    async changeData(products) {
      this.$store
        .dispatch("updatePurchseToCart", {
          id: this.$route.params.id,
          supplier_id: this.products.supplier.id,
          note: this.products.note,
          dateOfPurchase: this.products.dateOfPurchase,
          dateOfDelivery: this.year,
          status: this.products.status,
          purchases: products.purchases,
        })
        .then(({ response }) => {
          this.loading = false;

          this.$store.commit("notify", {
            type: "success",
            message: "Purchase was successfully updated ",
          });
        })
        .catch((error) => {
          this.loading = false;

          if (error.response.status === 422) {
            this.errors = error.response.data.errors;
            setTimeout(() => {
              this.errors = false;
            }, 5000);
          }
        });
    },
    edit(id) {
      this.$router.push({
        name: "PurchaseEdit",
        params: { id },
      });
    },
    async exportToPDF(data) {
      const doc = new jsPDF();
      let yPos = 5;

      // Add supplier details
      yPos += 20;

      doc.setFontSize(12);
      doc.text("Supplier Name: " + data[0].supplier.fullname, 10, yPos);
      yPos += 10;
      doc.text("Supplier Email: " + data[0].supplier.email, 10, yPos);
      yPos += 10;
      doc.text("Supplier Phone: " + data[0].supplier.phone, 10, yPos);
      yPos += 10;
      doc.text("Supplier Address: " + data[0].supplier.address, 10, yPos);
      yPos += 15;
      doc.text("Date of Purchase: " + data[0].dateOfPurchase, 10, yPos);
      yPos += 10;
      doc.text("Date of Delivery: " + data[0].dateOfDelivery, 10, yPos);
      yPos += 15;
      doc.text("Creator Name: " + data[0].creator, 10, yPos);
      yPos += 10;
      doc.text("Warehouse: " + data[0].warehouse, 10, yPos);
      yPos += 15;

      doc.text(
        "Status: " + data[0].status == true ? "Status: Reacived" : "Status: Padding",
        10,
        yPos
      );
      yPos += 10;
      doc.text("Note: " + data[0].note, 10, yPos);
      yPos += 15;
      // Add table headers
      const headers = ["ID", "Product Name", "Price", "Quantity", "Amount"];
      headers.forEach((header, index) => {
        doc.text(header, 10 + index * 30, yPos);
      });
      yPos += 15;

      // Add table rows
      doc.setFont("normal");
      data.forEach((row, rowIndex) => {
        const rowData = [
          row.id,
          row.productName,
          row.purchasePrice,
          row.quantity,
          row.amount,
        ];
        row.purchases.forEach((purchase, purchaseIndex) => {
          const purchaseData = [
            purchase.id,
            purchase.productName,
            purchase.purchasePrice,
            purchase.quantity,
            purchase.amount,
          ];
          purchaseData.forEach((value, index) => {
            doc.text(String(value), 10 + index * 30, yPos + purchaseIndex * 10);
          });
          yPos += 20;
        });
      });

      // Save PDF
      doc.save("export.pdf");
    },

    async exportToExcel(data) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      const headers = [
        "ID",
        "Date of Purchase",
        "Date of Delivery",
        "Creator Name",
        "Warehouse Name",

        "Supplier Name",
        "Supplier Email",
        "Supplier Address",
        "Supplier Phone",

        "Purchases Price",
        "Purchases Quantity",
        "Purchases Amount",
        "Status",

        "Note",
      ];
      worksheet.addRow(headers);

      data.forEach((row) => {
        const purchases = row.purchases.map((purchase) => [
          purchase.purchasePrice,
          purchase.quantity,
          purchase.amount,
        ]);
        purchases.forEach((purchase) => {
          const rowData = [
            row.id,
            row.dateOfPurchase,
            row.dateOfDelivery,
            row.creator,
            row.warehouse,
            row.supplier.fullname,
            row.supplier.email,
            row.supplier.address,
            row.supplier.phone,
            ...purchase,
            row.status ? "Reacived" : "Padding",

            row.note,
          ];
          worksheet.addRow(rowData);
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "export.xlsx");
    },
    getStockIn(todoId) {
      this.loading = true;
      const id = this.todoId;
      axios
        .get(`/purchase/${id}`)
        .then((res) => {
          this.loading = false;
          this.products = res.data.data;
          this.supplier = res.data.data.supplier;

          this.data = [res.data.data];
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    deletePurchase(id) {
      if (
        confirm(
          `Are you sure you want to delete this purchase? Operation can't be undone!!`
        )
      ) {
        store.dispatch("deleteSinglePurchase", id).then(() => {
          store.commit("notify", {
            type: "success",
            message: "Purchase was successfully deleted!",
          });
          router.push({ name: "purchase" });
          store.dispatch("getPurchases");
        });
      }
    },
  },
  created() {
    this.getStockIn();
  },

  watch: {
    keyword(after, before) {
      this.getStockIn();
    },
    todoId(newTodoId, oldTodoId) {
      this.getStockIn(newTodoId);
    },

    status(newStatus, oldStatus) {
      // Perform the necessary action when checkbox value changes
      this.products.status = newStatus; // Update products.status with checkbox value
      // You can call any method or perform any action here based on the new status
    },
  },
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" has-cancel> </CardBoxModal>
  <SectionMain>
    <div v-if="loading"><OverSpin /></div>
    <CardBox v-else class="bg-gray-20" has-table>
      <div class="flex flex-wrap w-auto justify-between gap-7 m-2">
        <div class="relative flex-1 w-14">
          <button
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            @click="Purchase(products.user_id)"
          >
            Back
          </button>
        </div>

        <div class="relative flex-1 w-14">
          <button
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            @click="exportToPDF(data)"
          >
            Export to PDF
          </button>
        </div>
        <div class="relative flex-1 w-14">
          <button
            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            @click="exportToExcel(data)"
          >
            Export to Excel
          </button>
        </div>
      </div>
      <BaseDivider />
      <div class="flex flex-wrap gap-8 m-2">
        <div class="flex-1 w-full">
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="py-3 sm:py-4">
              <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                  <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    Supplier Name
                  </p>
                </div>
                <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ supplier.fullname }}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Supplier Email
                  </p>
                </div>
                <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ supplier.email }}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Supplier Address
                  </p>
                </div>
                <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ supplier.address }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="flex-1 w-full float-right">
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="py-3 sm:py-4">
              <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Date of Purchase
                  </p>
                </div>
                <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ products.dateOfPurchase }}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Date of Delivery
                  </p>
                </div>
                <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ products.dateOfDelivery }}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Warehouse
                  </p>
                </div>
                <div
                  class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
                >
                  {{ products.warehouse }}
                </div>
              </div>
            </li>
          </ul>
          <div class="flex items-start mt-2">
            <div class="flex items-center h-5">
              <input
                id="status"
                name="status"
                type="checkbox"
                disabled
                :checked="products.status === true || products.status === 1"
                v-model="products.status"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="status" class="font-medium text-200-700">
                {{ products.status != 0 ? "Already received" : "Padding to receive" }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-all-search" class="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" class="px-6 py-3">Product name</th>
              <th scope="col" class="px-6 py-3">Purchase Price</th>
              <th scope="col" class="px-6 py-3">Quantity</th>
              <th scope="col" class="px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedPurchases"
              :key="item.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td class="w-4 p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                </div>
              </td>
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {{ item.productName }}
              </th>
              <td class="px-6 py-4">{{ item.purchasePrice }}</td>
              <td class="px-6 py-4">{{ item.quantity }}</td>
              <td class="px-6 py-4">
                {{ $filters.currencyUSD(Math.abs(item.amount)) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="col" class="p-4">Total</th>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3">{{ totalQuantity }}</th>
              <th scope="col" class="px-6 py-3">
                {{ $filters.currencyUSD(Math.abs(totalAmount)) }}
              </th>
            </tr>
          </tfoot>
        </table>

        <div class="flex items-center justify-center mt-4 mb-6">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="mx-4 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </CardBox>
  </SectionMain>
</template>
