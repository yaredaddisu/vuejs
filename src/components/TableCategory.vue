<script setup>
import { computed, ref, watch, onMounted } from "vue";
//import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import store from "../store";
import router from "@/router";
import OverlayLayer from "@/components/OverlayLayer.vue";
import FormControl from "@/components/FormControl.vue";
import axiosClient from "../axios.js";
import CategoryOnce from "@/components/CategoryOnce.vue";

defineProps({
  checkable: Boolean,
});

//const categories = computed(()=> store.state.categories.data);

//store.dispatch('getcategories');

//const mainStore = useMainStore();

//const items = computed(() => mainStore.categories);

const search = ref("");
const sortField = ref("updated_at");
const sortDirection = ref("desc");

const categories = computed(() => store.state.category.data);
const loading = computed(() => store.state.category.loading);

store.dispatch("getCategories");

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const itemsPaginated = computed(() =>
  categories.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(categories.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((member) => {
    if (!cb(member)) {
      newArr.push(member);
    }
  });

  return newArr;
};

const checked = ref([]);
const selected = ref([]);
const selectAll = ref(false);

function select() {
  selected.value = [];
  if (!selectAll.value) {
    for (let i in categories.value) {
      selected.value.push(categories.value[i]);
    }
  }
}

function updateCheckall() {
  if (categories.value.length == selected.value.length) {
    selectAll.value = true;
  } else {
    selectAll.value = false;
  }
}

function deleteCategory(member) {
  if (
    confirm(`Are you sure you want to delete this member? Operation can't be undone!!`)
  ) {
    store.dispatch("deleteCategory", member.id).then(() => {
      store.commit("notify", {
        type: "success",
        message: "Category was successfully deleted!",
      });
      router.push("/category");
      store.dispatch("getCategories");
    });
  }
}
store.dispatch("getUser");

store.dispatch("getCategory");

const activecategories = ref(0);
const Inactivecategories = ref(0);

function addCategory() {
  store.dispatch("getCategories");
  router.push("/category/create");
}

const showOnce = ref(false);

function toggleCreateOnce() {
  showOnce.value = !showOnce.value;
}

function reload() {
  store.dispatch("getCategories");
}
</script>

<template>
  <div class="grid lg:grid-cols-3 md:grid-cols-3 w-auto gap-4 grid-cols-1 mt-3 ml-5">
    <BaseButton
      color="lightDark"
      label="Create Once "
      :icon="mdiOpenInNew"
      :small="buttonsSmall"
      :outline="buttonsOutline"
      :disabled="buttonsDisabled"
      :rounded-full="buttonsRounded"
      @click="toggleCreateOnce()"
    />

    <BaseButton
      color="lightDark"
      label="Add  Category"
      :icon="mdiOpenInNew"
      :small="buttonsSmall"
      :outline="buttonsOutline"
      :disabled="buttonsDisabled"
      :rounded-full="buttonsRounded"
      @click="addCategory()"
    />

    <BaseButton
      color="lightDark"
      label="Reload"
      :icon="mdiOpenInNew"
      :small="buttonsSmall"
      :outline="buttonsOutline"
      :disabled="buttonsDisabled"
      :rounded-full="buttonsRounded"
      class="mr-5"
      @click="reload()"
    />
  </div>
  <div class="mt-3 mr-4 border">
    <div class="overflow-x-auto w-full">
      <table>
        <thead>
          <tr>
            <th>Category Name</th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="loading || !categories.length">
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
        <tbody v-else>
          <tr v-for="member of itemsPaginated" :key="member.id">
            <td data-label="Category Name">
              {{ member.category }}
            </td>

            <td data-label="Actions">
              <BaseButtons type="justify-start lg:justify-end" no-wrap>
                <BaseButton
                  color="info"
                  :icon="mdiEye"
                  small
                  :to="{ name: 'CategoryView', params: { id: member.id } }"
                />
                <BaseButton
                  v-if="member.id"
                  color="danger"
                  :icon="mdiTrashCan"
                  small
                  type="button"
                  @click="deleteCategory(member)"
                />
              </BaseButtons>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
          <BaseButtons>
            <BaseButton
              v-for="page in pagesList"
              :key="page"
              :active="page === currentPage"
              :label="page + 1"
              :color="page === currentPage ? 'lightDark' : 'whiteDark'"
              small
              @click="currentPage = page"
            />
          </BaseButtons>
          <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
        </BaseLevel>
      </div>
    </div>

    <div
      v-if="showOnce"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
    >
      <CategoryOnce @toggleCreateOnce="toggleCreateOnce" />
    </div>
  </div>
</template>
