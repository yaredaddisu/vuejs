<script>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
  mdiSitemap,
  mdiArrowExpandUp,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableProducts from "@/components/TableProducts.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import store from "@/store";
import FormField from "@/components/FormField.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import { useRoute, useRouter } from "vue-router";
import axios from "../axios.js";
import FormControl from "@/components/FormControl.vue";
import { StreamBarcodeReader } from "vue-barcode-reader";
import InvoiceOverlay from "@/components/InvoiceOverlay.vue";
import html2pdf from "html2pdf.js";

import VueBarcode from "@chenfengyuan/vue-barcode";

const router = useRouter();

const isModalActive = ref(false);

function createProduct() {
  router.push("/products/create");
}

export default {
  components: {
    VueBarcode,
    InvoiceOverlay,
    StreamBarcodeReader,
    FormField,
    FormControl,
    OverlayLayer,
    CardBoxModal,
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
  },

  data: function () {
    let showCustomer = ref(false);

    let customer = ref({
      name: "",
      email: "",
      phone: "",
      address: "",
      selected: "",
      vat: "",
      tin: "",
      payment_status: "",
      note: "",
      due: 0,
    });

    return {
      showModelBarcode: false,
      audio: null,
      isChecked: false,
      customer,
      showCustomer,
      paginate: 10,
      notifmsg: "",
      cart: [],
      print: [],
      prices: [],
      search: null,
      categories: [],
      manufacturers: [],
      products: [],
      loading: true,
      load: false,
      selected: {
        prices: [],
        categories: [],
        manufacturers: [],
      },
      showModal: false,

      quantity: 1,
      total: 0,
      totalQuantity: 0,
      totalPrice: 0,
      open: false,
      model: {
        tax: 0,
        shipping: 0,
        amount: 0,
      },
    };
  },

  mounted() {
    this.audio = new Audio();

    this.loadCategories();
    this.loadProducts();
    this.$store.dispatch("getCartItems");
  },
  created() {},
  watch: {
    paginate: function (value) {
      this.loadProducts();
    },
    selected: {
      handler: function () {
        this.loadCategories();
        this.loadProducts();
      },
      deep: true,
    },
    search(after, before) {
      this.getResults();
    },
  },

  computed: {
    cartItemCount() {
      return this.$store.getters.cartItemCount;
    },

    Tax() {
      let tax = 0;

      let subtotal = 0;

      this.cart.forEach((item, i) => {
        subtotal += item.salesPrice * item.quantity;

        tax = subtotal * (this.model.tax / 100);
      });

      return tax;

      //console.log(totalCartPrice);
    },
    subTotal() {
      let total = this.total;

      this.cart.forEach((item, i) => {
        total += item.salesPrice * item.quantity;
      });

      return total;

      //console.log(totalCartPrice);
    },
    totalCartPrice() {
      let total = this.total;
      let shipping = this.model.shipping;
      let subtotal = 0;

      this.cart.forEach((item, i) => {
        subtotal += item.salesPrice * item.quantity;

        let tax = subtotal * (this.model.tax / 100);

        total = parseInt(subtotal) + parseInt(tax) + parseInt(shipping);
        console.log(total);
      });

      return total;

      //console.log(totalCartPrice);
    },
    totalQuantity() {
      let total = this.totalQuantity;
      this.cart.forEach((item, i) => {
        total += item.quantity;
      });

      //console.log(total);

      return total;

      //console.log(totalCartPrice);
    },

    itemQuantity() {
      let total = 0;

      this.cart.forEach((item, i) => {
        total = item.quantity;
      });

      return total;
    },
  },

  methods: {
    generatePDF() {
      const element = document.getElementById("pdfContent");
      const options = {
        //margin: 10,
        filename: "barcodes.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 8 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().from(element).set(options).save();
    },

    closeModal() {
      this.showModelBarcode = !this.showModelBarcode;
    },
    onChange: function (event) {
      this.customer.due = this.$refs.GrandTotal.value - this.$refs.PayedAmount.value;
    },

    addToPrint() {},
    onDecode(text) {
      // this.search = text;
      if (this.isChecked === true) {
        this.playAudio("bamboo.mp3");
        this.audio.play();
      } else {
        this.stopAudio();
      }

      let quantity = this.quantity;

      let barCode = text;

      let productInChart = this.products.find((item) => item.barCode === barCode);
      if (productInChart) {
        let InChart = this.cart.find((item) => item.id === productInChart.id);

        if (InChart) {
          InChart.quantity++;
        } else {
          this.cart.push({
            id: productInChart.id,
            user_id: productInChart.user_id,
            survey_id: productInChart.id,
            productQuantity: productInChart.quantity,
            productName: productInChart.productName,
            quantity: 1,
            salesPrice: productInChart.salesPrice,
            purchasePrice: productInChart.purchasePrice,
            barCode: productInChart.barCode,
            profit: 0,
            remaining: 0,
            previous: 0,
            totalStockOutPrice: 0,
            Transaction: "Stock Out ",
          });
        }
      } else if (!InChart) {
        this.$store.commit("notify", {
          type: "error",
          message: "Product Not Found ",
        });
      }
    },
    onLoaded() {
      this.$store.commit("notify", {
        type: "success",
        message: "Ready to start scanning barcodes ",
      });
      //console.log(`Ready to start scanning barcodes`)
    },

    clearCart() {
      this.cart = [];
    },
    async create(cart) {
      await this.$router.push({
        path: "/label-generator",
        query: { cart: JSON.stringify(cart) }, // Pass cart values as query parameters
        target: "_blank", // Open in a new tab
      });
    },

    addToCart: function (product) {
      if (this.isChecked === true) {
        this.playAudio("bamboo.mp3");
        this.audio.play();
      } else {
        this.stopAudio();
      }

      let quantity = this.quantity;

      let productInChart = this.cart.find((item) => item.barCode === product.barCode);

      if (productInChart) {
        if (productInChart.quantity < product.quantity) {
          productInChart.quantity++;
        } else {
          this.playAudio("error.mp3");
          this.audio.play();
        }
      } else {
        this.cart.push({
          id: product.id,
          user_id: product.user_id,
          productName: product.productName,
          barCode: product.barCode,
          category: product.category,
        });
      }
    },

    playAudio(filename) {
      // Set audio source to the provided filename
      this.audio.src = `/audio/${filename}`;

      // Play the audio
      this.audio.play();
    },

    stopAudio() {
      // Pause the audio
      this.audio.pause();
    },

    history: function () {
      this.$router.push("/history-stock-out");
    },

    Open: function () {
      this.open = !this.open;
    },
    getResults() {
      this.loading = true;

      axios
        .get("/livesearch", {
          params: {
            search: this.search,
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

    increment: function (item) {
      if (this.isChecked === true) {
        this.playAudio("bamboo.mp3");
        this.audio.play();
      } else {
        this.stopAudio();
      }
      item.quantity++;
    },
    decrement: function (item) {
      if (this.isChecked === true) {
        this.playAudio("dec.mp3");
        this.audio.play();
      } else {
        this.stopAudio();
      } // item.quantity--;
      //item.product.quantity++;

      item.quantity--;

      if (item.quantity == 0) {
        this.deleteCart(item);
      }
    },

    deleteCart: function (item) {
      var index = this.cart.indexOf(item);

      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },

    loadCategories: function () {
      this.loading = true;

      axios
        .get("/categories", {
          params: (this.selected, "categories"),
        })
        .then((response) => {
          this.loading = false;

          this.categories = response.data.data;
        })
        .catch(function (error) {
          this.loading = false;

          console.log(error);
        });
    },

    loadProducts: function () {
      this.loading = true;

      axios
        .get("/products-stock", {
          params: this.selected,
        })
        .then((response) => {
          this.products = response.data.data;
          this.loading = false;
        })
        .catch(function (error) {
          this.loading = false;

          console.log(error);
        });
    },

    toggleModal: function () {
      this.showModal = false;
    },

    cartView: function () {
      this.showModal = true;
    },

    customerInfo: function () {
      this.showCustomer = !this.showCustomer;
    },
  },
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" has-cancel> </CardBoxModal>
  <LayoutAuthenticated class="hide">
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiArrowExpandUp" title="Stock Out" main>
        <BaseButton
          target="_blank"
          :icon="mdiArrowExpandUp"
          label="History"
          color="contrast"
          rounded-full
          small
          @click="history"
        />
      </SectionTitleLineWithButton>
      <hr />

      <InvoiceOverlay v-if="showModal" @toggleModal="toggleModal" />

      <!-- cart -->
      <div class="space-y-5 border shadow-sm rounded-sm mb-4">
        <div class="border-b border-b-gray-200">
          <ul class="-mb-px flex items-center gap-4 text-sm font-medium">
            <li class="flex-1">
              <div
                class="relative flex items-center justify-center gap-2 px-1 py-3 text-blue-700 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-blue-700 hover:text-blue-700"
              >
                Filter By Categories
              </div>
            </li>
          </ul>
        </div>
        <div>
          <ul
            class="grid grid-cols-4 sm:grid-cols-2 ssm:grid-cols-2 msm:grid-cols-2 items-center gap-2 mr-3 text-lg font-medium"
          >
            <div class="ml-4" v-for="(category, index) in categories" :key="index">
              <li class="flex-1 mb-5 border border-gray-700 dark:border-gray-300">
                <div
                  class="flex items-center justify-center gap-2 px-3 py-2 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-500 dark:hover:text-white"
                >
                  <input
                    class=" "
                    type="checkbox"
                    :value="category.id"
                    :id="'category' + index"
                    v-model="selected.categories"
                  />

                  <label class="ml-4" :for="'category' + index">
                    {{ category.category }}
                    <span
                      class="rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-md text-gray-500"
                    >
                      {{ category.products_count }}</span
                    >
                  </label>
                </div>
              </li>
            </div>
          </ul>
        </div>
      </div>

      <CardBox class="mb-6 bg-gray-20" has-table>
        <hr />

        <div class="grid lg:grid-cols-2 grid-cols-1 rounded-lg">
          <div class="relative p-6 overflow-x-auto">
            <div class="text-xl font-bold">Select Product</div>

            <hr class="m-4" />
            <div class="flex flex-col-reverse">
              <div v-if="this.open" class="col-md-6 offset-md-3 h-60 w-60">
                <StreamBarcodeReader
                  @decode="onDecode"
                  @loaded="onLoaded"
                ></StreamBarcodeReader>
              </div>
              <div>
                <button
                  @click="Open()"
                  type="button"
                  class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  {{ this.open ? "Close" : "Open" }} Scanner
                </button>
              </div>
            </div>
            <div class="flex mb-3">
              <div class="relative w-full">
                <input
                  type="search"
                  v-model="search"
                  id="search-dropdown"
                  class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                  placeholder="Search Products, Name, BarCode..."
                />
              </div>
            </div>
            <div class="w-full">
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
              <div class="overflow-y-scroll overflow-x-auto h-[500px] w-full">
                <table>
                  <thead
                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                  >
                    <tr>
                      <th scope="col" class="px-6 py-3">Image</th>
                      <th scope="col" class="px-6 py-3">Product name</th>
                      <th scope="col" class="px-6 py-3">BarCode</th>
                      <th scope="col" class="px-6 py-3">Category</th>
                      <th scope="col" class="px-6 py-3">Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    <span
                      class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-white bg-green-600 rounded-full"
                      >{{ products.length }}
                    </span>
                    <tr
                      @click="addToCart(product)"
                      v-for="(product, index) in products"
                      :key="index"
                      class="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td
                        data-label="Product Image"
                        class="border-b-0 lg:w-6 before:hidden"
                      >
                        <div
                          v-if="product.image_url"
                          class="relative w-12 h-12 transition-all rounded-md transform hover:scale-125"
                        >
                          <img
                            class="shadow-lg rounded-full max-w-full h-auto align-middle border-none"
                            :src="product.image_url"
                            alt="product image"
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
                      <td
                        data-label="Product Name"
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {{ product.productName }}
                      </td>
                      <td data-label="Product barCode" class="px-6 py-4">
                        {{ product.barCode }}
                      </td>
                      <td data-label="Category" v-if="product.category">
                        {{ product.category.category }}
                      </td>
                      <td data-label="Category" v-else>No Category</td>
                      <td data-label="Product Quantity" class="px-6 py-4">
                        {{ product.quantity }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            class="ml-3 w-auto p-6 border-l-4 border-gray-100 dark:bg-gray-800 dark:border-gray-700"
          >
            <div calss="inline-flex">
              <div class="text-xl font-bold">Stock Out</div>
              <div>
                <input type="checkbox" v-model="isChecked" />
                Enable Sound
              </div>
            </div>
            <hr class="m-4" />

            <div>
              <div class="overflow-y-scroll overflow-x-auto h-[400px] w-full">
                <div v-for="item in cart" :key="item.id" class="flex">
                  <button
                    type="button"
                    class="bg-gray-100 p-4 m-1 justify-start hover:text-gray-700 hover:bg-gray-200 h-full w-full rounded-l cursor-pointer outline-none"
                  >
                    {{ item.productName }} {{ item.barCode }} {{ item.category.category }}
                  </button>

                  <!-- Delete question -->
                  <button
                    type="button"
                    @click="showModelBarcode = true"
                    class="flex items-center text-xs ml-0.5 py-1 px-3 rounded-lg ssm:w-14 sm:w-14 msm:w-14 border border-transparent text-red-500 hover:border-red-600"
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

              <button
                @click="showModelBarcode = true"
                type="submit"
                class="w-full mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-gray-400 font-medium bg-blue-700 shadow-sm sm:text-sm mb-10 hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-50"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <button
              @click="showModelBarcode = true"
              class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none"
            >
              Open Modal
            </button>
            <div
              class="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50"
              v-show="showModelBarcode"
              @click="closeModal"
            ></div>

            <!-- Modal -->
            <div
              class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 p-6 overflow-y-scroll w-[80vw] h-[80vh]"
              v-show="showModelBarcode"
            >
              <!-- Modal content -->
              <div>
                <h2 class="text-lg font-semibold mb-4">
                  <button
                    @click="generatePDF"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
                  >
                    Generate PDF
                  </button>
                </h2>
                <div
                  class="a4-page bg-white p-10 overflow-auto border flex flex-wrap justify-between m-auto"
                  ref="pdfContent"
                  id="pdfContent"
                >
                  <!-- Content goes here -->
                  <div
                    v-for="(barcode, index) in cart"
                    :key="index"
                    class="barcode-container"
                  >
                    <vue-barcode
                      :key="`${barcode}-${index}`"
                      :code="barcode.barCode"
                      :width="20"
                      :height="10"
                      v-if="barcode.barCode"
                    ></vue-barcode>
                  </div>
                </div>
              </div>

              <!-- Close button -->
              <button
                @click="closeModal"
                class="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <hr class="mt-10" />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
@media print {
  .hide {
    display: none;
  }
}

.barcode-container {
  margin-bottom: 5mm; /* Adjust the margin to reduce the gap between barcodes */
  cursor: pointer; /* Add cursor pointer to indicate clickable element */
  position: relative; /* Make the container relative for absolute positioning */
}
</style>
