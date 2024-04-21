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

const router = useRouter();

const isModalActive = ref(false);

function createProduct() {
  router.push("/products/create");
}

export default {
  components: {
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
      reference: "STOCKOUT-" + Math.random().toString(36).toUpperCase().slice(2),
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
            house_id: productInChart.house_id,
            creator: productInChart.creator,

            user_id: productInChart.user_id,
            survey_id: productInChart.id,
            productQuantity: productInChart.quantity,
            productName: productInChart.productName,
            quantity: 1,
            salesPrice: productInChart.salesPrice,
            purchasePrice: productInChart.purchasePrice,
            barCode: productInChart.barCode,
            reference: this.reference,

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
      this.load = true;

      this.$store
        .dispatch("addProductToCart", {
          tax: this.model.tax,
          shipping: this.model.shipping,
          amount: this.$refs.Amount.value,
          TotalQuantity: this.$refs.totalQuantity.value,
          TotalProduct: this.$refs.length.value,
          Reference: "REF" + Math.random().toString(36).toUpperCase().slice(2),
          name: this.customer.name,
          email: this.customer.email,
          phone: this.customer.phone,
          address: this.customer.address,
          Vat: this.customer.vat,
          Tin: this.customer.tin,
          Note: this.customer.note,
          paymentMethod: this.customer.selected,
          PayedAmount: this.$refs.PayedAmount.value,
          GrandTotal: this.$refs.GrandTotal.value,
          Due: this.customer.due,
          questions: cart,
        })
        .then(({ response }) => {
          //console.log(this.$refs.Amount.value)
          if (response) {
            this.showCustomer = false;
          }
          this.load = false;
          this.showCustomer = false;

          this.$store.commit("notify", {
            type: "success",
            message: "Product was successfully Stockd Out ",
          });
          this.cart = [];
          this.loadProducts();
          this.showModal = true;
          this.model.tax = 0;
          this.model.shipping = 0;
          this.customer = [];
          this.customer.due = 0;
        })
        .catch((error) => {
          this.load = false;

          if (error.response.status === 422) {
            // this.notifmsg = error.response.data.error;
            this.showCustomer = false;

            this.$store.commit("notify", {
              type: "error",
              message: error.response.data.error,
            });
          }
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
          house_id: product.house_id,
          creator: product.creator,
          survey_id: product.id,
          image: product.image_url,
          user_id: product.user_id,
          productQuantity: product.quantity,
          productName: product.productName,
          quantity: 1,
          salesPrice: product.salesPrice,
          purchasePrice: product.purchasePrice,
          barCode: product.barCode,
          reference: this.reference,
          profit: 0,
          remaining: 0,
          previous: 0,
          totalStockOutPrice: 0,
          Transaction: "Stock Out ",
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

      <!-- component -->
      <div class="space-y-5 border shadow-sm rounded-sm mb-4 text-xm">
        <div class="border-b border-b-gray-200">
          <ul class="-mb-px flex items-center gap-4 text-sm font-medium">
            <li class="flex-1">
              <div
                class="relative flex items-center justify-center gap-2 px-1 py-1 text-blue-700 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-blue-700 hover:text-blue-700"
              >
                Filter By Categories
              </div>
            </li>
          </ul>
        </div>
        <div>
          <ul class="flex flex-wrap space-x-3 items-center gap-2 mr-3 text-xs">
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

      <CardBox class="flex flex-wrap bg-gray-20" has-table>
        <hr />

        <div class="grid lg:grid-cols-2 grid-cols-1 rounded-lg">
          <div class="relative p-6 overflow-x-auto">
            <div class="text-xs">Select Product</div>

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
                  class="block p-2 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
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
              <div class="overflow-y-scroll overflow-x-auto h-auto w-full">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Product name</th>
                      <th scope="col">BarCode</th>
                      <th scope="col">Category</th>
                      <th scope="col">Quantity</th>
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
                      class="cursor-pointer"
                    >
                      <td
                        data-label="Product Image"
                        class="border-b-0 lg:w-6 before:hidden"
                      >
                        <div
                          v-if="product.image_url"
                          class="relative w-10 h-10 transition-all rounded-md transform hover:scale-125"
                        >
                          <img
                            class="shadow-lg rounded-full max-w-full h-auto align-middle border-none"
                            :src="product.image_url"
                            alt="product image"
                          />
                        </div>
                        <div
                          v-else
                          class="relative w-10 h-10 transition-all rounded-md transform hover:scale-125"
                        >
                          <img
                            class="shadow-lg rounded-full max-w-full h-auto align-middle border-none"
                            src="../assets/noimage.jpg"
                            alt="product image"
                          />
                        </div>
                      </td>
                      <td data-label="Product Name" scope="row">
                        {{ product.productName }}
                      </td>
                      <td data-label="Product barCode">
                        {{ product.barCode }}
                      </td>
                      <td data-label="Category" v-if="product.category">
                        {{ product.category.category }}
                      </td>
                      <td data-label="Category" v-else>No Category</td>
                      <td data-label="Product Quantity">
                        {{ product.quantity }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            class="ml-3 w-auto p-6 border-l-4 border-gray-100 dark:bg-gray-800 text-xs dark:border-gray-700"
          >
            <div calss="inline-flex">
              <div class=" ">Stock Out</div>
              <div>
                <input type="checkbox" v-model="isChecked" />
                Enable Sound
              </div>
            </div>
            <hr class="m-4" />

            <form @submit.prevent="create(cart)">
              <div class="overflow-y-scroll overflow-x-auto h-auto w-full">
                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="flex flex-wrap gap-2 mb-2"
                >
                  <div class="flex-grow w-24 h-10 mb-6">
                    <FormField
                      class="text-xl"
                      :help="
                        $filters.currencyUSD(Math.abs(item.salesPrice * item.quantity))
                      "
                    >
                      <button
                        id="dropdown-button"
                        class="flex-shrink-0 w-full mb-2 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                        type="button"
                      >
                        <span
                          class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
                        >
                          - {{ item.quantity }}
                        </span>
                        {{ item.productName }}
                      </button>
                    </FormField>
                  </div>

                  <div class="flex-1">
                    <div
                      class="flex flex-row h-10 w-full rounded-lg relative bg-transparent"
                    >
                      <button
                        type="button"
                        @click="decrement(item)"
                        data-action="decrement"
                        class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                      >
                        <span class="m-auto text-2xl font-thin">−</span>
                      </button>

                      <input
                        type="number"
                        v-model="item.quantity"
                        :disabled="item.quantity >= item.productQuantity"
                        class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700"
                        name="quantity"
                      />

                      <button
                        type="button"
                        @click="increment(item)"
                        data-action="increment"
                        :disabled="item.quantity >= item.productQuantity"
                        class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                      >
                        <span class="m-auto text-2xl font-thin">+</span>
                      </button>
                    </div>
                  </div>

                  <div class="flex-grow h-10 w-12 bg-transparent">
                    <FormField help="You can update sales price">
                      <input
                        type="text"
                        id="sell-Price"
                        v-model="item.salesPrice"
                        class="bg-gray-50 h- border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Sell Price"
                        required
                      />
                    </FormField>
                  </div>

                  <div class="flex-grow h-4 w-4 bg-transparent">
                    <!-- Delete question -->
                    <button
                      type="button"
                      @click="deleteCart(item)"
                      class="flex-grow h-4 w-4 items-center text-xs rounded-lg m-3 border border-transparent text-red-500 hover:border-red-600"
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

                <div></div>

                <div
                  v-if="!cart.length"
                  class="text-xl text-center text-gray-500 black:text-white m-auto"
                >
                  <h2>Select product and input quantity.</h2>
                </div>
                <div
                  class="grid grid-cols-3 msm:grid-cols-1 ssm:grid-cols-1 mb-4 mt-[100px]"
                >
                  <div class="flex items-baseline">
                    <p class="text-gray-500 text-lg ml-1 mr-2">Total Products:</p>
                    <p v-if="cart.length" class="text-green-500 text-lg font-bold">
                      {{ Math.abs(cart.length) }}
                    </p>
                    <p v-else class="text-red-500 text-lg font-bold">0</p>
                    <input hidden type="text" ref="length" :value="cart.length" />
                  </div>
                  <div class="flex items-baseline float-right">
                    <p class="text-gray-500 text-lg ml-1 mr-2">Total Quantity:</p>
                    <p v-if="totalQuantity > 0" class="text-red-500 text-lg font-bold">
                      - {{ Math.abs(totalQuantity) }}
                    </p>
                    <p v-else class="text-red-500 text-lg font-bold">0</p>
                    <input
                      hidden
                      type="text"
                      ref="totalQuantity"
                      :value="totalQuantity"
                    />
                  </div>

                  <div class="flex items-baseline float-right">
                    <p class="text-gray-500 text-lg ml-1 mr-2">Total Price:</p>
                    <p v-if="totalCartPrice > 0" class="text-green-500 text-lg font-bold">
                      {{ Math.abs(totalCartPrice) }}
                    </p>
                    <p v-else class="text-red-500 text-lg font-bold">0</p>
                    <input hidden type="text" ref="Amount" :value="subTotal" />
                  </div>
                </div>
              </div>

              <div></div>

              <div
                class="grid grid-cols-2 mt-4 gap-4 custom-number-input h-10 mr-3 w-full"
              >
                <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                  <FormField help="Enter Tax">
                    <input
                      type="text"
                      id="sell-Price"
                      v-model="model.tax"
                      min="0"
                      class="bg-gray-50 h- border w-full border-gray-300 text-gray-900 text-sm rounded-l focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Tax"
                      required
                    />
                  </FormField>

                  <button
                    type="button"
                    data-action="decrement"
                    class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 w-10 rounded-r cursor-pointer outline-none"
                  >
                    <span class="m-auto text-2xl font-thin">%</span>
                  </button>
                </div>

                <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
                  <FormField help="Enter Shipping">
                    <input
                      type="text"
                      id="sell-Price"
                      v-model="model.shipping"
                      min="0"
                      class="bg-gray-50 h- border w-full border-gray-300 text-gray-900 text-sm rounded-l focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Shipping"
                      required
                    />
                  </FormField>

                  <button
                    type="button"
                    data-action="decrement"
                    class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 w-10 rounded-r cursor-pointer outline-none"
                  >
                    <span class="m-auto text-2xl font-thin">ETB</span>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-8">
                <button
                  @click="customerInfo()"
                  type="button"
                  class="w-auto mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
                  Stock Out
                </button>

                <button
                  type="button"
                  @click="cartView()"
                  class="w-auto mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-green-700 shadow-sm sm:text-sm mb-10 hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50"
                >
                  <span
                    class="inline-flex items-center justify-center px-2 py-1 mr-2 text-md font-bold leading-none text-white bg-yellow-600 rounded-full"
                    >{{ cartItemCount }}</span
                  >
                  Cart
                </button>
              </div>

              <div
                v-if="showCustomer"
                :style="{ animationDelay: `${ind * 1}s` }"
                class="overflow-x-hidden animate-fade-in overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
              >
                <div
                  class="relative z-10"
                  aria-labelledby="slide-over-title"
                  role="dialog"
                  aria-modal="true"
                >
                  <!--
          Background backdrop, show/hide based on slide-over state.

          Entering: "ease-in-out duration-500"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in-out duration-500"
            From: "opacity-100"
            To: "opacity-0"
        -->
                  <div
                    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  ></div>

                  <div class="fixed inset-0 overflow-hidden">
                    <div class="absolute inset-0 overflow-y-auto">
                      <div
                        class="pointer-events-none lg:fixed inset-y-0 right-0 flex max-w-full pl-10"
                      >
                        <div
                          class="grid grid-cols-2 sm:grid-cols-1 msm:grid-cols-1 ssm:grid-cols-1 overflow-scroll pointer-events-auto w-screen max-w-5xl"
                        >
                          <div class="w-auto my-6 mx-auto max-w-sm">
                            <!--content-->
                            <div
                              class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                            >
                              <!--header-->

                              <!--body-->

                              <div
                                class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
                              >
                                <div class="space-y-6">
                                  <div
                                    class="flex items-start justify-between text-black p-5 border-b border-solid border-slate-200 rounded-t"
                                  >
                                    <h3 class="text-2xl font-semibold dark:text-gray-400">
                                      Customer Information
                                    </h3>
                                    <button
                                      v-on:click="customerInfo()"
                                      type="button"
                                      class="ml-3 bg-white rounded-md dark:bg-gray-700 p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                    >
                                      <span class="sr-only">Close menu</span>
                                      <!-- Heroicon name: outline/x -->
                                      <svg
                                        class="h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
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
                                  <div
                                    class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-3"
                                  >
                                    <div>
                                      <input
                                        type="name"
                                        v-model="customer.name"
                                        name="name"
                                        id="name"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Customer Name"
                                      />
                                    </div>
                                    <div>
                                      <input
                                        type="email"
                                        v-model="customer.email"
                                        name="email"
                                        id="email"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Customer Email"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-3"
                                  >
                                    <div>
                                      <input
                                        type="phone"
                                        v-model="customer.phone"
                                        name="phone"
                                        id="phone"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Customer Phone"
                                      />
                                    </div>
                                    <div>
                                      <input
                                        type="address"
                                        v-model="customer.address"
                                        name="address"
                                        id="address"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Customer Address"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-3"
                                  >
                                    <div>
                                      <input
                                        type="tin"
                                        v-model="customer.tin"
                                        name="tin"
                                        id="tin"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Customer's TIN Reg.No"
                                      />
                                    </div>
                                    <div>
                                      <input
                                        type="vat"
                                        v-model="customer.vat"
                                        name="vat"
                                        id="vat"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Customer's VAT Reg.No"
                                      />
                                    </div>
                                  </div>

                                  <div
                                    class="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-3"
                                  >
                                    <FormField help="Enter Paying Amount">
                                      <input
                                        type="payed_amount"
                                        ref="PayedAmount"
                                        @change="onChange($event)"
                                        :value="Math.abs(totalCartPrice)"
                                        name="payed_amount"
                                        id="payed_amount"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="  Payed Amount"
                                      />
                                    </FormField>

                                    <FormField help="Due ">
                                      <input
                                        disabled
                                        type="text"
                                        @change="onChange($event)"
                                        v-model="customer.due"
                                        name="payed_amount"
                                        id="payed_amount"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                      />
                                    </FormField>

                                    <input
                                      type="hidden"
                                      disabled
                                      ref="Recived"
                                      :value="Math.abs(totalCartPrice)"
                                      name="Recived"
                                      id="Recived"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                      placeholder=" Recived "
                                    />
                                    <input
                                      type="hidden"
                                      ref="GrandTotal"
                                      :value="Math.abs(totalCartPrice)"
                                      name="payed_amount"
                                      id="payed_amount"
                                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      for="payment"
                                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                                      >Payment Method</label
                                    >
                                    <select
                                      id="payment"
                                      v-model="customer.selected"
                                      class="bg-gray-50 uppercase border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                      <option value="Cash">Cash</option>
                                      <option value="Bank">Bank</option>
                                      <option value="TeleBirr">TeleBirr</option>
                                      <option value="TeleBirr">Cheque</option>
                                      <option value="Others">Others</option>
                                    </select>
                                  </div>
                                  <div>
                                    <!-- Description -->
                                    <FormField>
                                      <FormControl
                                        id="note"
                                        name="note"
                                        type="textarea"
                                        rows="3"
                                        v-model="customer.note"
                                        autocomplete="payment_note"
                                        class="mt-6"
                                        placeholder="Take a Note"
                                      >
                                      </FormControl>
                                    </FormField>

                                    <!-- Description -->
                                  </div>
                                </div>
                              </div>
                              <!--footer-->
                            </div>
                          </div>
                          <div
                            class="flex h-full rounded-lg check:mr-4 dark:bg-gray-700 lg:mr-0 flex-col overflow-hidden bg-white shadow-xl"
                          >
                            <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                              <div class="flex items-start justify-between">
                                <h2
                                  class="text-lg font-medium dark:text-gray-400 text-gray-900"
                                  id="slide-over-title"
                                >
                                  Shopping cart
                                </h2>
                                <div class="ml-3 flex h-7 items-center">
                                  <button
                                    v-on:click="customerInfo()"
                                    type="button"
                                    class="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                  >
                                    <span class="sr-only">Close panel</span>
                                    <svg
                                      class="h-6 w-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              <div class="mt-8">
                                <p
                                  v-if="!cart.length"
                                  class="mt-0.5 text-lg text-center dark:bg-gray-700 text-gray-500"
                                >
                                  Check out Empty
                                </p>

                                <div
                                  v-else
                                  class="lg:flow-root h-[400px] overflow-y-auto"
                                >
                                  <ul
                                    v-for="item in cart"
                                    :key="item.id"
                                    role="list"
                                    class="-my-6 divide-y divide-gray-200"
                                  >
                                    <li class="flex py-6 mr-5">
                                      <div
                                        v-if="item.image"
                                        class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                                      >
                                        <img
                                          :src="item.image"
                                          alt="Product Cart"
                                          class="h-full w-full object-cover object-center"
                                        />
                                      </div>
                                      <div
                                        v-else
                                        class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
                                      >
                                        <img
                                          src="../assets/product.jpg"
                                          alt="Product Cart"
                                          class="h-full w-full object-cover object-center"
                                        />
                                      </div>
                                      <div class="ml-4 flex flex-1 flex-col">
                                        <div>
                                          <div
                                            class="flex dark:text-gray-400 justify-between text-base font-medium text-gray-900"
                                          >
                                            <h3>
                                              <a>{{ item.productName }}</a>
                                            </h3>
                                            <p class="ml-4 dark:text-gray-400">
                                              {{
                                                $filters.currencyUSD(
                                                  Math.abs(
                                                    parseInt(item.quantity) *
                                                      parseInt(item.salesPrice)
                                                  )
                                                )
                                              }}
                                            </p>
                                          </div>
                                        </div>
                                        <div
                                          class="flex flex-row h-10 w-full rounded-lg relative bg-transparent"
                                        >
                                          <button
                                            type="button"
                                            @click="decrement(item)"
                                            data-action="decrement"
                                            class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-l cursor-pointer outline-none"
                                          >
                                            <span class="m-auto text-2xl font-thin"
                                              >−</span
                                            >
                                          </button>

                                          <button
                                            type="button"
                                            @click="increment(item)"
                                            data-action="increment"
                                            :disabled="
                                              item.quantity >= item.productQuantity
                                            "
                                            class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-r cursor-pointer"
                                          >
                                            <span class="m-auto text-2xl font-thin"
                                              >+</span
                                            >
                                          </button>
                                        </div>
                                        <div
                                          class="flex flex-1 items-end justify-between text-sm"
                                        >
                                          <p class="text-gray-500 dark:text-gray-400">
                                            Qty
                                            <span
                                              class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-white bg-green-600 rounded-full"
                                              >{{ item.quantity }}</span
                                            >
                                          </p>

                                          <div class="flex">
                                            <button
                                              @click="deleteCart(item)"
                                              type="button"
                                              class="font-medium text-indigo-600 dark:text-red-500 hover:text-indigo-500"
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                    <hr class="m-3" />

                                    <!-- More products... -->
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div class="border-t border-gray-200 px-4 mt-3 py-6 sm:px-6">
                              <div
                                class="flex mb-2 justify-between text-base font-medium dark:text-gray-400 text-gray-900"
                              >
                                <p>Subtotal</p>
                                <p>{{ $filters.currencyUSD(Math.abs(subTotal)) }}</p>
                              </div>
                              <div
                                class="flex mb-2 justify-between text-base font-medium dark:text-gray-400 text-gray-900"
                              >
                                <p>Tax({{ this.model.tax }})%</p>
                                <p>{{ $filters.currencyUSD(Math.abs(Tax)) }}</p>
                              </div>
                              <div
                                class="flex mb-2 justify-between text-base font-medium dark:text-gray-400 text-gray-900"
                              >
                                <p>Shipping</p>
                                <p>
                                  {{
                                    $filters.currencyUSD(Math.abs(this.model.shipping))
                                  }}
                                </p>
                              </div>
                              <div
                                class="flex mb-2 justify-between text-base font-medium dark:text-gray-400 text-gray-900"
                              >
                                <p>Grand Total</p>
                                <p>
                                  {{ $filters.currencyUSD(Math.abs(totalCartPrice)) }}
                                </p>
                              </div>

                              <button
                                type="submit"
                                :disabled="load || !cart.length"
                                class="w-full mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-gray-400 font-medium bg-blue-700 shadow-sm sm:text-sm mb-10 hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-50"
                                :class="{
                                  'cursor-not-allowed': load,
                                  'hover:bg-blue-700': load,
                                }"
                              >
                                <svg
                                  v-if="load"
                                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
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
                                Checkout
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
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
</style>
