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
import OverlayLayer from "@/components/OverlayLayer.vue";
import { useRoute, useRouter } from "vue-router";
import axios from "../axios.js";
import { StreamBarcodeReader } from "vue-barcode-reader";

const router = useRouter();

const isModalActive = ref(false);

function createProduct() {
  router.push("/products/create");
}

export default {
  components: {
    StreamBarcodeReader,
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
  },

  data: function () {
    return {
      searchOrderNo: "",
      cart: [],
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
      quantity: 1,
      total: 0,
      totalQuantity: 0,
      totalPrice: 0,
      open: false,
      reference: "STOCKIN-" + Math.random().toString(36).toUpperCase().slice(2),
    };
  },

  mounted() {
    this.audio = new Audio();

    this.loadCategories();
    this.loadProducts();
  },
  created() {},
  watch: {
    selected: {
      handler: function () {
        this.loadCategories();
        this.loadProducts();
        this.onDecode();
      },
      deep: true,
    },
    search(after, before) {
      this.getResults();
    },
  },

  computed: {
    totalCartPrice() {
      let total = this.total;
      this.cart.forEach((item, i) => {
        total += item.salesPrice * item.quantity;
      });

      //console.log(total);

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
    onDecode(text) {
      // this.search = text;
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
            survey_id: productInChart.id,
            user_id: productInChart.user_id,
            salesPrice: productInChart.salesPrice,
            productQuantity: productInChart.quantity,
            productName: productInChart.productName,
            purchasePrice: productInChart.purchasePrice,
            house_id: productInChart.house_id,
            creator: productInChart.creator,
            reference: this.reference,
            quantity: 1,
            remaining: 0,
            previous: 0,
            Transaction: "Stock In ",
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
    async stockIn(cart) {
      this.load = true;

      await axios
        .post("/product-stockIn", {
          cart,
        })
        .then((response) => {
          this.load = false;

          this.$store.commit("notify", {
            type: "success",
            message: "Product was successfully Stockd In ",
          });
          this.cart = [];

          this.loadProducts();
        })
        .catch((error) => {
          this.load = false;

          console.log(error);
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

      let productInChart = this.cart.find((item) => item.id === product.id);
      if (productInChart) {
        productInChart.quantity++;
      } else {
        this.cart.push({
          id: product.id,
          survey_id: product.id,
          user_id: product.user_id,
          salesPrice: product.salesPrice,
          productQuantity: product.quantity,
          productName: product.productName,
          purchasePrice: product.purchasePrice,
          creator: product.creator,
          house_id: product.house_id,
          reference: this.reference,
          barCode: product.barCode,
          quantity: 1,
          previous: 0,
          remaining: 0,
          Transaction: "Stock In ",
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
      this.$router.push("/history-stock-in");
    },
    Open: function () {
      this.open = !this.open;
    },
    getResults() {
      this.loading = true;

      axios
        .get("/livesearch", { params: { search: this.search } })
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
      axios
        .get("/categories", {
          params: (this.selected, "categories"),
        })
        .then((response) => {
          this.categories = response.data.data;
        })
        .catch(function (error) {
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
  },
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" has-cancel> </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiArrowExpandUp" title="Stock In" main>
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
          <div class="relative p-2 overflow-x-auto">
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
            <div class="text-xs font-bold mb-2">Select Product</div>

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
            <div class="overflow-x-auto w-full">
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
              <span
                class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-white bg-green-600 rounded-full"
                >{{ products.length }}
              </span>
              <div class="overflow-y-scroll overflow-x-auto h-auto w-full text-xs">
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
                    <tr
                      @click="addToCart(product)"
                      v-for="(product, index) in products"
                      :key="index"
                    >
                      <td
                        data-label="Product Image"
                        class="border-b-0 lg:w-6 before:hidden"
                      >
                        <div v-if="product.image_url">
                          <img
                            class="shadow-lg rounded-full w-10 h-10 align-middle border-none"
                            :src="product.image_url"
                            alt="product image"
                          />
                        </div>
                        <div
                          v-else
                          class="relative w-12 h-12 transition-all rounded-md transform hover:scale-125"
                        >
                          <img
                            class="shadow-lg rounded-full w-10 h-10 align-middle border-none"
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
            <div class=" ">Stock In</div>
            <div>
              <input type="checkbox" v-model="isChecked" />
              Enable Sound
            </div>
            <hr class="m-4" />

            <form @submit.prevent="stockIn(cart)">
              <div class="overflow-y-scroll overflow-x-auto h-auto w-full">
                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="flex flex-wrap gap-2 mb-2"
                >
                  <div class="flex-grow w-24 h-10">
                    <FormField class="text-xl">
                      <button
                        id="dropdown-button"
                        class="flex-shrink-0 w-full mb-2 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                        type="button"
                      >
                        <span
                          class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-green-600 rounded-full"
                        >
                          + {{ item.quantity }}
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
                        class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700"
                        name="quantity"
                      />

                      <button
                        type="button"
                        @click="increment(item)"
                        data-action="increment"
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
                  </div>
                  <div class="flex items-baseline float-right">
                    <p class="text-gray-500 text-lg ml-1 mr-2">Total Quantity:</p>
                    <p
                      v-if="totalQuantity > 0"
                      class="flex text-green-500 text-lg font-bold"
                    >
                      + {{ Math.abs(totalQuantity) }}
                    </p>
                    <p v-else class="text-red-500 text-lg font-bold">0</p>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-8">
                <button
                  :disabled="load || !cart.length"
                  type="submit"
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
                  Stock In
                </button>
                <button
                  type="button"
                  @click="clearCart()"
                  class="w-auto mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-green-700 shadow-sm sm:text-sm mb-10 hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 focus-visible:ring-offset-green-50"
                >
                  Clear Cart
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr class="mt-10" />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
