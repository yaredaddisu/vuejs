<script setup>
import { reactive, computed, onMounted, ref, watch } from "vue";
import {
  mdiBallotOutline,
  mdiShapePlus,
  mdiMapMarker,
  mdiAccount,
  mdiPhone,
  mdiMail,
  mdiGithub,
  mdiAccountPlus,
  mdiAccountMultiple,
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";
import store from "../store";
import { useRoute, useRouter } from "vue-router";
import Alert from "@/components/Alert.vue";
import Date from "@/components/Date.vue";
import { PurpleToBlue } from "@/colors";
import OverlayLayer from "@/components/OverlayLayer.vue";
import FormField from "@/components/FormField.vue";

import { v4 as uuidv4 } from "uuid";

const route = useRoute();
const router = useRouter();

const load = computed(() => store.state.currentSurvey.loading);

const category = computed(() => store.state.category.data);

store.dispatch("getCategories");

const isModalActive = ref(false);

const loading = ref(false);
const selected = ref("");
const showModal = ref(false);

let model = ref({
  id: "",
  productName: "",
  barCode: "",
  purchasePrice: null,
  salesPrice: null,
  category_id: " ",
  quantity: null,
  status: false,
  code: null,
  size: null,
  image_url: null,
  image: null,
  color: null,
  brand: null,
  UserSecret: null,
});

const UserSecret = ref({});

function onChange(event) {
  model.value.category_id = event.target.value;
  //console.log(model.value.category_id);
}

// Watch to current survey data change and when this happens we update local model
watch(
  () => store.state.currentSurvey.data,
  (newVal, oldVal) => {
    model.value = {
      ...JSON.parse(JSON.stringify(newVal)),
      status: !!newVal.status,
    };
  }
);

// If the current component is rendered on survey update route we make a request to fetch survey
if (route.params.id) {
  store.dispatch("getSurvey", route.params.id);
}

function getBarCode() {
  model.value.barCode = Math.random().toString(10).slice(10);
}

function onImageChoose(ev) {
  const file = ev.target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    // The field to send on backend and apply validations
    model.value.image = reader.result;

    // The field to display here
    model.value.image_url = reader.result;
    ev.target.value = "";
  };

  reader.readAsDataURL(file);
}

/**
 * Create or update survey
 */
let errors = ref("");

function saveSurvey() {
  let action = "created";
  if (model.value.id) {
    action = "updated";
  }
  loading.value = true;

  store
    .dispatch("saveSurvey", { ...model.value })
    .then(({ data }) => {
      loading.value = false;
      model.value.UserSecret = null;
      showModal.value = false;

      store.commit("notify", {
        type: "success",
        message: "Product was successfully " + action,
      });
      router.push({
        name: "ProductListView",
        params: { id: data.data.id },
      });
    })
    .catch((error) => {
      loading.value = false;
      model.value.UserSecret = null;
      showModal.value = false;

      if (error.response.status === 422) {
        errors.value = error.response.data.errors;
      } else if (error.response.status === 423) {
        store.commit("notify", {
          type: "error",
          message: error.response.data.error,
        });
      }
    });
}
function addNewProduct() {
  router.push("/product-list/create").then(() => {
    window.location.reload(true);
  });
}

function listMember() {
  store.dispatch("getAllProductList");
  router.push("/product-list");
}

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = ["info"];

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
};

store.dispatch("getUser");

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="grid lg:grid-cols-1 grid-cols-2">
        <SectionTitleLineWithButton
          v-if="route.params.id"
          :icon="mdiShapePlus"
          title="Edit Product"
          class="font-bold"
          main
        >
          <BaseButton
            target="_blank"
            :icon="mdiAccountPlus"
            label="Add Product"
            color="contrast"
            rounded-full
            small
            @click="addNewProduct"
          />
        </SectionTitleLineWithButton>
        <SectionTitleLineWithButton
          v-else
          :icon="mdiShapePlus"
          title="Add Product"
          class="font-bold"
          main
        >
        </SectionTitleLineWithButton>
      </div>

      <CardBox class="shadow-xl">
        <div role="status" v-if="load">
          <OverlayLayer />
        </div>
        <form v-else @submit.prevent="saveSurvey">
          <OverlayLayer v-if="showModal" />
          <div
            v-if="showModal"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
          >
            <div v-if="route.params.id" class="relative w-full max-w-md max-h-full">
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
                        v-model="model.UserSecret"
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
                      :disabled="!model.UserSecret"
                      type="submit"
                      class="w-full mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
                      :class="{
                        'cursor-not-allowed': loading,
                        'hover:bg-gray-700': loading,
                      }"
                    >
                      <svg
                        v-if="loading"
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
          <NotificationBarInCard
            :color="formStatusOptions[formStatusCurrent]"
            :is-placed-with-header="formStatusWithHeader"
          >
            <div class="block">
              <span>
                <h1 class="text-xl font-bold text-white float-left">
                  {{ route.params.id ? "Edit Product " : "Add Product " }}
                </h1>
              </span>

              <BaseButton
                class="w-[200px] float-left sm:ssm:msm:mt-3 md:float-right lg:float-right"
                target="_blank"
                :icon="mdiShapePlus"
                label="Product List"
                color="contrast"
                rounded-full
                small
                @click="listMember"
              />
            </div>
          </NotificationBarInCard>

          <Alert v-if="Object.keys(errors).length" class="flex-col items-stretch text-sm">
            <div v-for="(field, i) of Object.keys(errors)" :key="i">
              <div v-for="(error, ind) of errors[field] || []" :key="ind">
                * {{ error }}
              </div>
            </div>
          </Alert>

          <div class="grid lg:grid-cols-3 mb-4 gap-8">
            <FormField label="Product Info">
              <FormControl
                class="m-2"
                v-model="model.productName"
                placeholder="Product Name"
              />
            </FormField>

            <FormField label="Product Category">
              <div
                class="grid grid-cols-1 sm:grid-cols-1 ssm:grid-cols-1 msm:grid-cols-1"
              >
                <div class="gap-4">
                  <select
                    @change="onChange($event)"
                    id="categories"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option selected value=" " v-if="route.params.id">
                      {{ model.category ? model.category.category : "Select Category" }}
                    </option>
                    <option selected value="Select Category " v-else>
                      Select Category
                    </option>

                    <option v-for="cat in category" :key="cat.id" :value="cat.id">
                      {{ cat.category }}
                    </option>
                  </select>
                </div>
              </div>
            </FormField>

            <FormField label="Product Image">
              <!-- Image -->
              <div>
                <div class="ml-3 flex items-center">
                  <img
                    v-if="model.image_url"
                    :src="model.image_url"
                    :alt="model.title"
                    class="w-20 h-20 rounded-full object-cover"
                  />
                  <span
                    v-else
                    class="flex items-center justify-center h-12 w-12 rounded-full overflow-hidden bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-[80%] w-[80%] text-gray-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                  <button
                    type="button"
                    class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <input
                      type="file"
                      @change="onImageChoose"
                      class="absolute left-0 top-0 right-0 bottom-0 opacity-0 cursor-pointer"
                    />
                    Change
                  </button>
                </div>
              </div>
              <!--/ Image -->
            </FormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormField label="Product Purchase Price">
              <FormControl
                class="m-2"
                v-model="model.purchasePrice"
                type="number"
                placeholder="Purchase Price"
              />
            </FormField>

            <FormField label="Product Sales Price">
              <FormControl
                class="m-2"
                v-model="model.salesPrice"
                type="number"
                placeholder="Sales Price"
              />
            </FormField>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FormField label="Bar Code">
              <FormControl class="m-2" v-model="model.barCode" placeholder="Barcode" />
            </FormField>

            <FormField label="Generate BarCode">
              <div
                @click="getBarCode()"
                type="submit"
                class="w-[150px] cursor-pointer flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                Generate
              </div>
            </FormField>
          </div>
          <FormField label="Product Detail">
            <div class="grid grid-cols-2 sm:grid-cols-1 ssm:grid-cols-1 msm:grid-cols-1">
              <FormControl
                class="m-2"
                type="number"
                v-model="model.quantity"
                placeholder="Product Quantity"
              />
              <FormControl class="m-2" v-model="model.code" placeholder="Product Code" />
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-1 ssm:grid-cols-1 msm:grid-cols-1">
              <FormControl class="m-2" v-model="model.size" placeholder="Product Size" />
              <FormControl
                class="m-2"
                v-model="model.color"
                placeholder="Product Color"
              />
              <FormControl
                class="m-2"
                v-model="model.brand"
                placeholder="Product Brand"
              />
            </div>
          </FormField>

          <input type="hidden" v-model="model.invoice_id" />

          <!-- Status -->
          <div class="flex items-start mt-6">
            <div class="flex items-center h-5">
              <input
                id="status"
                name="status"
                type="checkbox"
                v-model="model.status"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="status" class="font-medium">Active</label>
            </div>
          </div>

          <div v-if="route.params.id" class="px-6 py-5 text-right sm:px-6">
            <button
              @click="toggleModal()"
              :disabled="loading"
              type="button"
              class="w-full flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              :class="{ 'cursor-not-allowed': loading, 'hover:bg-gray-700': loading }"
            >
              <svg
                v-if="loading"
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
              Update
            </button>
          </div>
          <div v-else class="px-6 py-5 text-right sm:px-6">
            <button
              :disabled="loading"
              type="submit"
              class="w-full flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              :class="{ 'cursor-not-allowed': loading, 'hover:bg-gray-700': loading }"
            >
              <svg
                v-if="loading"
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
              Save
            </button>
          </div>
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
