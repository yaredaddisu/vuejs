<script setup>
import { reactive, ref,computed } from 'vue'
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { useRouter,useRoute } from 'vue-router'
import store from "../store";
import axios from "axios";
import NotificationBar from '@/components/NotificationBar.vue'


const router = useRouter();

const route = useRoute();

// Get survey loading state, which only changes when we fetch survey from backend
const surveyLoading = computed(() => store.state.currentSurvey.loading);

// Create empty survey
let model = ref({
  fullname: "",
  email: "",
  address: "",

});


// If the current component is rendered on survey update route we make a request to fetch survey
if (route.params.id) {
  store.dispatch("showMember", route.params.id);
}

/**
 * Create or update survey
 */
function addMember() {
  let action = "created";
  if (model.value.id) {
    action = "updated";
  }
  store.dispatch("addMember", { ...model.value }).then(({ data }) => {
    store.commit("notify", {
      type: "success",
      message: "The survey was successfully " + action,
    });
    store.dispatch("getMembers");

    router.push({
      name: "members",
      params: { id: data.data.id },
    });
  });
}

</script>

<template>

  <div>
    <div class="dark:text-white">
      <!-- Modal body -->
      <div class="p-4 md:p-5">
        <form class="space-y-4" @submit.prevent="addMember">

          <div>
            <input
              v-model="model.fullname"
              type="text"
              name="fullname"
              id="fullname"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter Full Name"

            />
          </div>

          <div>
            <input
              v-model="model.email"
              type="email"
              name="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@company.com"

            />
          </div>
          <div>
            <input
              v-model="model.address"
              type="text"
              name="address"
              id="address"
              placeholder="Enter address"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"

            />
          </div>

          <div class="flex justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                />
              </div>
              <label
                for="remember"
                class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Remember me</label
              >
            </div>
          </div>
          <button
            type="submit"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Member
          </button>
          <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered?
            <a href="#" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
