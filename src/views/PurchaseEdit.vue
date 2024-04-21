<script>
import { reactive, ref, watch } from "vue";
import {
  mdiBallotOutline,
  mdiAccountPlus,
  mdiAccount,
  mdiMail,
  mdiGithub,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";
import CardBoxMember from "@/components/CardBoxMember.vue";
import Alert from "@/components/Alert.vue";
import OverSpin from "@/components/OverSpin.vue";
import router from "@/router";

import EditMember from "./EditMember.vue";
import axios from "../axios.js";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

export default {
  components: {
    route,
    router,
    mdiAccountPlus,
    OverSpin,
    Alert,
    CardBox,
    FormCheckRadioGroup,
    FormFilePicker,
    FormField,
    BaseButtons,
    SectionTitle,
    NotificationBarInCard,
    CardBoxMember,
    EditMember,
    reactive,
    ref,
    mdiBallotOutline,
    mdiAccount,
    mdiMail,
    mdiGithub,
    SectionMain,
    FormControl,
    BaseButton,
    LayoutAuthenticated,
    SectionTitleLineWithButton,
    FormControl,
    SectionMain,
    LayoutAuthenticated,
    BaseButton,
    BaseDivider,
  },

  data: function () {
    const current = new Date();
    const year = `${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()}`;

    let purchase = ref({
      supplier_id: null,
      dateOfPurchase: "",
      dateOfDelivery: "",
      note: " ",
      status: true,
      stockInStatus: false,
    });
    return {
      year: year,
      items: [],
      suppliers: [],
      isModalDangerActive: false,
      showModal: false,
      purchase,
      products: [],
      selectedProduct: null,
      cart: [],
      quantity: 1,
      amount: 0,
      searchQuery: "",
      total: 0,
      totalQuantity: 0,
      load: false,
      errors: false,
      loading: false,
      purchases: [],
      reference: "STOCKIN" + Math.random().toString(36).toUpperCase().slice(2),
    };
  },
  computed: {
    filteredProducts() {
      const query = this.searchQuery.toLowerCase();
      return this.products.filter((product) =>
        product.productName.toLowerCase().includes(query)
      );
    },

    totalCartPrice() {
      let total = this.total;

      this.cart.forEach((item, i) => {
        total += item.purchasePrice * item.quantity;
      });

      return total;
      //console.log(total);
    },
    totalQuantity() {
      let total = this.totalQuantity;
      this.cart.forEach((item, i) => {
        total += item.quantity;
      });

      return total;
    },
  },
  mounted() {
    this.getSupplier();
    this.getProducts();

    if (this.$route.params.id) {
      this.getPurchase();
    }
  },
  created() {
    this.getSupplier();
    this.getProducts();
    if (this.$route.params.id) {
      this.getPurchase();
    }
  },
  watch: {
    "purchase.stockInStatus"(newValue) {
      if (!newValue) {
        // If stockInStatus is unchecked, keep the current status value
        return;
      }
      // If stockInStatus is checked, set status to true
      this.purchases.status = true;
    },
    keyword(after, before) {
      this.getSupplier();
      this.getProducts();
    },
    getPurchase(newVal, oldVal) {
      this.cart = {
        ...JSON.parse(JSON.stringify(newVal)),
        status: !!newVal.status,
      };
    },
  },
  methods: {
    getPurchase() {
      this.loading = true;
      const slug = this.$route.params.id;

      axios
        .get(`/purchase/${slug}`)
        .then((res) => {
          this.loading = false;
          this.purchases = res.data.data;
          this.cart = res.data.data.purchases;
          this.purchase.supplier_id = res.data.data.supplier.id;
          this.purchase.note = res.data.data.note;

          // Convert date strings to Date objects
          const dateOfPurchase = new Date(res.data.data.dateOfPurchase);
          const dateOfDelivery = new Date(res.data.data.dateOfDelivery);

          // Format Date objects to YYYY-MM-DD strings
          const formattedDateOfPurchase = dateOfPurchase.toISOString().split("T")[0];
          const formattedDateOfDelivery = dateOfDelivery.toISOString().split("T")[0];

          // Assign formatted date strings to the purchase object
          this.purchase.dateOfPurchase = formattedDateOfPurchase;
          this.purchase.dateOfDelivery = formattedDateOfDelivery;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    getSupplier() {
      this.loading = true;

      axios
        .get(`/members`)
        .then((res) => {
          this.loading = false;
          this.suppliers = res.data.data;

          this.data = [res.data.data];
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    getProducts() {
      this.loading = true;

      axios
        .get(`/survey`)
        .then((res) => {
          this.loading = false;
          this.products = res.data.data;

          //this.data = [res.data.data];
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    openModal() {
      this.showModal = !this.showModal;
    },
    addToCart() {
      if (this.selectedProduct) {
        // Check if the selected product is already in the cart
        const existingItemIndex = this.cart.findIndex(
          (item) => item.id === this.selectedProduct.id
        );

        if (existingItemIndex !== -1) {
          // If the product is already in the cart, increase its quantity
          this.cart[existingItemIndex].quantity++;
        } else {
          this.cart.push({
            id: this.selectedProduct.id,
            productName: this.selectedProduct.productName,
            salesPrice: this.selectedProduct.salesPrice,
            quantity: this.selectedProduct.quantity,
            amount: this.quantity * this.selectedProduct.salesPrice,
            survey_id: this.selectedProduct.id,
            user_id: this.selectedProduct.user_id,
            productQuantity: this.selectedProduct.quantity,
            purchasePrice: this.selectedProduct.purchasePrice,
            barCode: this.selectedProduct.barCode,
            status: this.selectedProduct.status,
            house_id: this.selectedProduct.house_id,
            creator: this.selectedProduct.creator,
            reference: this.reference,

            quantity: 1,
            previous: 0,
            remaining: 0,
            Transaction: "Stock In ",
          });
          const selectedIndex = this.products.findIndex(
            (product) => product.id === this.selectedProduct.id
          );
          if (selectedIndex !== -1) {
            this.products.splice(selectedIndex, 1);
            this.selectedProduct = null; // Clear selected product after adding to cart

            // this.selectedProduct = null;
          }
        }
      }
    },
    async create(cart) {
      this.loading = true;
      let year = null;
      if (this.year && this.purchase.stockInStatus) {
        year = this.year;
      } else {
        year = this.purchase.dateOfDelivery;
      }

      if (this.purchase.stockInStatus && cart && this.purchase.dateOfPurchase) {
        await axios
          .post("/product-stockIn", {
            cart,
          })
          .then((response) => {
            this.loading = false;

            this.$store.commit("notify", {
              type: "success",
              message: "Product was successfully Stockd In ",
            });
            this.getSupplier();
            this.getProducts();
          })
          .catch((error) => {
            this.loading = false;
          });
      }

      this.$store
        .dispatch("updatePurchseToCart", {
          id: this.$route.params.id,
          supplier_id: this.purchase.supplier_id,
          status: this.purchases.status,
          note: this.purchase.note,
          dateOfPurchase: this.purchase.dateOfPurchase,
          dateOfDelivery: year,
          purchases: cart,
        })
        .then(({ response }) => {
          //console.log(this.$refs.Amount.value)

          this.loading = false;
          this.stockInStatus = false;
          this.$store.commit("notify", {
            type: "success",
            message: "Purchase was successfully Updated ",
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
    calculateAmount(item) {
      item.amount = item.quantity * item.purchasePrice;
      this.amount = item.amount;
    },
    cancel() {
      this.$router.push({
        name: "PurchaseSlug",
        id: this.$route.params.id,
      });
    },

    deleteCart(item) {
      const index = this.cart.indexOf(item);

      if (index !== -1) {
        // Check if the item is not already present in the products list
        const productIndex = this.products.findIndex((product) => product.id === item.id);
        if (productIndex === -1) {
          this.products.push(item); // Add the item back to the products list
        }
        this.cart.splice(index, 1); // Remove the item from the cart
      }
    },
  },
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiPlus"
        title="Update purchase order
    "
        main
      >
        <BaseButton
          target="_blank"
          :icon="mdiAccountPlus"
          label="Go Back"
          color="contrast"
          rounded-full
          small
          @click="cancel()"
        />
      </SectionTitleLineWithButton>

      <CardBoxMember
        v-if="showModal"
        @openModal="openModal"
        title="Add Supplier "
        has-cancel
      >
        <EditMember />
      </CardBoxMember>

      <div v-if="loading"><OverSpin /></div>
      <form v-else @submit.prevent="create(cart)">
        <Alert v-if="Object.keys(errors).length" class="flex-col items-stretch text-sm">
          <div v-for="(field, i) of Object.keys(errors)" :key="i">
            <div v-for="(error, ind) of errors[field] || []" :key="ind">
              * {{ error }}
            </div>
          </div>
        </Alert>
        <CardBox>
          <div class="flex flex-wrap gap-2 m-2">
            <div class="relative grow">
              <select
                id="productSelect"
                v-model="purchase.supplier_id"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option
                  v-for="(supplier, index) in suppliers"
                  :key="index"
                  :value="supplier.id"
                >
                  {{ supplier.fullname }}
                </option>
              </select>
              <label
                for="floating_outlined"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >Supplier
              </label>
              <button
                type="button"
                @click="openModal()"
                class="text-white bg-gradient-to-br mt-2 from-purple-600 to-blue-500 hover :bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Add Supplier
              </button>
            </div>

            <div class="relative flex-1 w-14">
              <input
                v-model="purchase.dateOfPurchase"
                type="date"
                id="floating_outlined"
                class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="floating_outlined"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >Date of Purchase
              </label>
            </div>
            <div class="relative flex-1 w-14">
              <input
                :disabled="purchase.status"
                v-model="purchase.dateOfDelivery"
                type="date"
                id="floating_outlined"
                class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="floating_outlined"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >Expected Delivery Date
              </label>
            </div>
          </div>

          <BaseDivider />

          <div
            class="flex flex-wrap gap-2 m-2"
            v-for="(item, index) in cart"
            :key="index"
          >
            <!-- Delete question -->
            <button
              type="button"
              @click="deleteCart(item)"
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
            <div class="relative grow">
              <input
                v-model="item.productName"
                type="text"
                id="floating_outlined"
                class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="floating_outlined"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >Item
              </label>
            </div>
            <div class="relative flex-1 w-14">
              <input
                v-model="item.quantity"
                @input="calculateAmount(item)"
                type="number"
                id="floating_outlined"
                class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="floating_outlined"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >Quantity</label
              >
            </div>
            <div class="relative flex-1 w-14">
              <input
                @input="calculateAmount(item)"
                v-model="item.purchasePrice"
                type="text"
                id="floating_outlined"
                class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="floating_outlined"
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >Unit Price
              </label>
            </div>
            <div class="relative flex-1 w-14">
              <input
                v-model="item.amount"
                disabled
                type="text"
                id="floating_outlined"
                class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />

              <label
                for="floating_outlined"
                disabled
                class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >Amount</label
              >
            </div>
          </div>

          <div class="max-w-sm mb-3 flex flex-wrap gap-3">
            <div class="flex-1 ml-14">
              <input
                v-model="searchQuery"
                type="text"
                id="searchInput"
                class="block px-4 py-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Search product..."
              />
            </div>
            <div class="flex-1">
              <select
                id="productSelect"
                v-model="selectedProduct"
                @change="addToCart"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option
                  v-for="(product, index) in filteredProducts"
                  :key="index"
                  :value="product"
                >
                  {{ product.productName }}
                </option>
              </select>
            </div>
          </div>
          <div
            v-if="!cart.length"
            class="text-xl text-center text-gray-500 black:text-white m-auto"
          >
            <h2>Select product and input quantity.</h2>
          </div>
          <div class="grid grid-cols-3 msm:grid-cols-1 ssm:grid-cols-1 mb-4 mt-[100px]">
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
              <input hidden type="text" ref="totalQuantity" :value="totalQuantity" />
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
          <BaseDivider />

          <FormField label="Note">
            <FormControl
              type="textarea"
              v-model="purchase.note"
              placeholder="Take a note"
            />
          </FormField>

          <FormField
            v-if="!purchases.status"
            label="if you enable this automatically stocked in "
          >
            <input type="checkbox" v-model="purchase.stockInStatus" />
          </FormField>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="status"
                name="status"
                type="checkbox"
                :checked="purchases.status === true || purchases.status === 1"
                v-model="purchases.status"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="status" class="font-medium text-200-700">
                {{ purchases.status != 0 ? "Already received" : "Padding to receive" }}
              </label>
            </div>
          </div>
          <button class="" type="button">
            <span
              class="inline-block mt-2 rounded-sm px-8 py-2 text-sm font-semibold border mr-2 mb-2"
              :class="[
                purchases.status == 0
                  ? 'text-white   bg-red-500 '
                  : 'text-blue-500 border-blue-500 ',
              ]"
              >{{
                purchases.status != 0
                  ? "If you change or add anything you must add or change in stock in"
                  : "Make It  Received"
              }}
            </span>
          </button>
          <BaseDivider />
          <div class="flex flex-row gap-4">
            <button
              :disabled="load || !cart.length"
              type="submit"
              class="w-30 mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-gray-400 font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
              Submit
            </button>
            <button
              @click="cancel"
              type="button"
              class="w-30 mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-sky-400 font-medium bg-sky-700 shadow-sm sm:text-sm mb-10 hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50"
            >
              Back
            </button>
          </div>
        </CardBox>
      </form>
    </SectionMain>
  </LayoutAuthenticated>
</template>
