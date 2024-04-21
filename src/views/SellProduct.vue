<script setup>
import { reactive, computed, onMounted, ref, watch } from "vue";
import {
  mdiBallotOutline,
  mdiPrinterOutline,
  mdiSitemap,
  mdiAccount,
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
import FormField from "@/components/FormField.vue";
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
import { v4 as uuidv4 } from "uuid";
import { cyanToBlue } from "@/colors";
import { GreenToBlue } from "@/colors";
import { PurpleToPink } from "@/colors";
import { PinkToOrange } from "@/colors";
import { TealToLime } from "@/colors";
import { RedToYellow } from "@/colors";
import axiosClient from "../axios.js";

const router = useRouter();

const route = useRoute();

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = ["info"];

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
};

const allProduct = ref(0);

const loading = ref({
  allProduct: true,
});

function updateDashboard() {
  loading.value = {
    allProduct: true,
  };
}

const id = route.params.id;

axiosClient.get(`/getproduct/${id}`).then(({ data }) => {
  allProduct.value = data;
  loading.value.allProduct = false;
});

onMounted(() => {
  updateDashboard();
});

const errors = ref({});

function saveProduct() {
  let action = "created";
  if (allProduct.value.id) {
    action = "updated";
  }
  loading.value = false;

  store
    .dispatch("saveAllProduct", { ...allProduct.value })
    .then(({ data }) => {
      loading.value = false;

      store.commit("notify", {
        type: "success",
        message: "Product was successfully " + action,
      });
      router.push({
        name: "ProductView",
        params: { id: data.data.id },
      });
      // window.location.reload(true);
      store.dispatch("getProduct");
    })
    .catch((error) => {
      loading.value = false;

      if (error.response.status === 422) {
        errors.value = error.response.data.errors;
      }
    });
}

store.dispatch("getUser");
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        v-if="route.params.id"
        :icon="mdiSitemap"
        title="Edit product"
        class="font-bold"
        main
      >
        <BaseButton
          target="_blank"
          :icon="mdiSitemap"
          label="Add product"
          color="contrast"
          rounded-full
          small
          @click="addProduct"
        />
      </SectionTitleLineWithButton>
      <SectionTitleLineWithButton
        v-else
        :icon="mdiSitemap"
        title="Add product"
        class="font-bold"
        main
      >
      </SectionTitleLineWithButton>

      <CardBox class="shadow-xl mt-8">
        <div role="status" v-if="load">
          <OverlayLayer />
        </div>

        <form @submit.prevent="saveProduct">
          <div v-for="(question, index) in allProduct.data" :key="question.id">
            <QuestionEditor
              :question="question"
              :index="index"
              @change="questionChange"
              @addQuestion="addQuestion"
              @deleteQuestion="deleteQuestion"
            />
            <div class="px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              >
                {{ route.params.id ? "Update" : "Save" }}
              </button>
            </div>
          </div>
        </form>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
