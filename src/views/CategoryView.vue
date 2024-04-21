<script setup>
import { reactive, computed, onMounted, ref, watch } from "vue";
import {
  mdiBallotOutline,
  mdiMapMarker,
  mdiShapePlus,
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
import OverlayLayer from "@/components/OverlayLayer.vue";
import FormField from "@/components/FormField.vue";
import TableCategory from "@/components/TableCategory.vue";

import { v4 as uuidv4 } from "uuid";

const route = useRoute();
const router = useRouter();

const load = computed(() => store.state.category.loading);

const isModalActive = ref(false);

const loading = ref(false);

let model = ref({
  id: "",
  category: "",
});

if (route.params.id) {
  store.dispatch("getCategory", route.params.id);
}

watch(
  () => store.state.currentCategory.data,
  (newVal, oldVal) => {
    model.value = {
      ...JSON.parse(JSON.stringify(newVal)),
      status: !!newVal.status,
    };
  }
);

let errors = ref("");

function saveCategory() {
  let action = "created";
  if (model.value.id) {
    action = "updated";
  }
  loading.value = true;

  store
    .dispatch("saveCategory", { ...model.value })
    .then(({ data }) => {
      loading.value = false;

      store.commit("notify", {
        type: "success",
        message: "Category was successfully " + action,
      });
      router.push("/category");
    })
    .catch((error) => {
      loading.value = false;

      if (error.response.status === 422) {
        errors.value = error.response.data.errors;
      }
    });
}

function addNewMember() {
  router.push("/members/create").then(() => {
    window.location.reload(true);
  });
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

const showCategory = ref(false);

function toggleModal() {
  showCategory.value = !showCategory.value;
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiShapePlus" title="Categories" main>
      </SectionTitleLineWithButton>

      <CardBox class="shadow-xl">
        <div role="status" v-if="load">
          <OverlayLayer />
        </div>
        <form v-else @submit.prevent="saveCategory">
          <NotificationBarInCard
            :color="formStatusOptions[formStatusCurrent]"
            :is-placed-with-header="formStatusWithHeader"
          >
            <div class="block">
              <span>
                <h1 class="text-xl font-bold mt-4 ml-3 text-white float-left">
                  {{ route.params.id ? "Edit Category" : "Add Category" }}
                </h1>
              </span>
              <div class="block float-right msm:float-left sm:float-left ssm:float-left">
                <button
                  class="bg-gray-500 text-white active:bg-gray-600 font-bold text-sm px-6 mt-6 ml-2 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  @click="Goto()"
                >
                  Add Category
                </button>

                <button
                  class="bg-gray-500 text-white active:bg-gray-600 font-bold text-sm px-6 mt-6 ml-2 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  @click="toggleModal()"
                >
                  Categories
                </button>
              </div>
            </div>
          </NotificationBarInCard>
          <Alert v-if="Object.keys(errors).length" class="flex-col items-stretch text-sm">
            <div v-for="(field, i) of Object.keys(errors)" :key="i">
              <div v-for="(error, ind) of errors[field] || []" :key="ind">
                * {{ error }}
              </div>
            </div>
          </Alert>
          <FormField label="Category Name">
            <FormControl
              v-model="model.category"
              :icon="mdiShapePlus"
              placeholder="Add Category"
            />
          </FormField>

          <div class="px-6 py-5 text-right sm:px-6">
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
              {{ route.params.id ? "Update" : "Save" }}
            </button>
          </div>
        </form>
      </CardBox>

      <div>
        <div
          v-if="showCategory"
          class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
        >
          <div class="relative w-full my-6 mx-auto max-w-3xl dark:bg-gray-700">
            <!--content-->
            <div
              class="border-0 rounded-lg shadow-lg dark:bg-gray-700 relative flex flex-col w-full bg-white outline-none focus:outline-none"
            >
              <!--header-->
              <div
                class="flex items-start justify-between dark:bg-gray-700 dark:text-gray-300 text-black p-5 border-b border-solid border-slate-200 rounded-t"
              >
                <h3 class="text-2xl font-semibold">Categories</h3>
                <button
                  v-on:click="toggleModal()"
                  type="button"
                  class="bg-white rounded-md dark:bg-gray-600 p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
              <!--body-->
              <TableCategory checkable class="dark:bg-gray-700" />

              <!--footer-->
              <div
                class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"
              >
                <button
                  class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  v-on:click="toggleModal()"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="showCategory" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
