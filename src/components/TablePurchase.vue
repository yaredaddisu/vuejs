<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormControl from "@/components/FormControl.vue";
import store from "../store";
import router from "@/router";
import OverSpin from "@/components/OverSpin.vue";

defineProps({
  checkable: Boolean,
});
const search = ref("");
const sortField = ref("updated_at");
const sortDirection = ref("desc");
const items = computed(() => store.state.purchase.data);
const loading = computed(() => store.state.purchase.loading);

store.dispatch("getPurchases", { search: search.value });

watch(search, (newValue, oldValue) => {
  store.dispatch("getPurchases", {
    search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
  });
});
function getPurchases(url = null) {
  store.dispatch("getPurchases", {
    url,
    search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value,
  });
}

onMounted(() => {
  getPurchases();
});

function sortItems(field) {
  if (field === sortField.value) {
    if (sortDirection.value === "desc") {
      sortDirection.value = "asc";
    } else {
      sortDirection.value = "desc";
    }
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }

  getPurchases();
}
function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getPurchases(link.url);
}
const mainStore = useMainStore();

//const items = computed(() => mainStore.clients);

const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = ref([]);

const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

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

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
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
    for (let i in items.value) {
      selected.value.push(items.value[i]);
    }
  }
}

function updateCheckall() {
  if (items.value.length == selected.value.length) {
    selectAll.value = true;
  } else {
    selectAll.value = false;
  }
}
const openPurchaseInNewWindow = (id) => {
  router
    .push({
      name: "PurchaseSlug",
      params: { id },
    })
    .then(() => {
      store.dispatch("getPurchases", id);
    });
};

function deletePurchase(checked) {
  if (checked.length) {
    if (
      confirm(
        `Are you sure you want to delete this purchase? Operation can't be undone!!`
      )
    ) {
      store.dispatch("deletePurchase", checked).then(() => {
        store.commit("notify", {
          type: "success",
          message: "purchase was successfully deleted!",
        });
        store.dispatch("getPurchases");
      });
    }
  } else {
    store.commit("notify", {
      type: "success",
      message: "No data selected to delete",
    });
  }
}
const updateMe = (id) => {
  router
    .push({
      name: "PurchaseEdit",
      params: { id },
    })
    .then(() => {
      store.dispatch("getPurchases", id);
    });
};
</script>

<template>
  <div class="border">
    <div class="grid lg:grid-cols-4 grid-cols-2 gap-4 items-center m-3">
      <select
        @change="getPurchases(null)"
        v-model="perPage"
        class="appearance-none w-full mb-2 block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <button
        @click="deletePurchase(selected)"
        type="button"
        class="w-full py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      >
        Delete
      </button>
      <div class="float-right">
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Search</label
        >
        <FormControl
          placeholder="Search (ctrl+k)"
          ctrl-k-focus
          transparent
          borderless
          v-model="search"
          type="search"
        />
      </div>
    </div>
    <span
      class="bg-blue-100 float-left mt-3 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
    >
      <svg
        aria-hidden="true"
        class="w-3 h-3 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        ></path>
      </svg>
      Total Selected {{ selected.length }}
    </span>
    <div>
      <div class="grid grid-cols-2 float-right gap-8 mt-3 mr-3">
        <div>
          <span
            class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
          >
            <svg
              aria-hidden="true"
              class="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Total Purchases {{ items.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-if="loading"><OverSpin /></div>

  <table v-else>
    <thead>
      <tr>
        <th>
          <input type="checkbox" v-model="selectAll" @click="select()" />
        </th>
        <th>Update</th>

        <th>Creator</th>
        <th>Warehouse</th>

        <th>Supplier</th>

        <th
          field="dateOfPurchase"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          @click="sortItems('dateOfPurchase')"
        >
          Purchase Date
        </th>
        <th
          field="dateOfDelivery"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          @click="sortItems('dateOfDelivery')"
        >
          Delivery Date
        </th>
        <th>Status</th>
        <th
          field="note"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          @click="sortItems('note')"
        >
          Note
        </th>
        <th
          field="created_at"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          @click="sortItems('created_at')"
        >
          Created At
        </th>
        <th
          field="Action"
          :sort-field="sortField"
          :sort-direction="sortDirection"
          @click="sortItems('Action')"
        >
          Action
        </th>

        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.id">
        <td>
          <input
            type="checkbox"
            :value="client"
            v-model="selected"
            @change="updateCheckall()"
          />
        </td>
        <td>
          <button @click="updateMe(client.id)">
            <span
              class="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-white bg-green-600 rounded-full"
              >update</span
            >
          </button>
        </td>
        <td data-label="Creator Name">
          {{ client.creator }}
        </td>
        <td data-label="Warehouse Name">
          {{ client.warehouse }}
        </td>
        <td data-label="Supplier Name">
          {{ client.supplier.fullname }}
        </td>
        <td data-label="Purchase Date">
          {{ client.dateOfPurchase }}
        </td>
        <td data-label="Delivery Date">
          {{ client.dateOfDelivery }}
        </td>
        <td data-label="Status">
          <span
            class="inline-block rounded-full px-3 py-1 text-sm font-semibold border mr-2 mb-2"
            :class="[
              client.status == 0
                ? 'text-yellow-800 border-yellow-500 '
                : 'text-blue-500 border-blue-500 ',
            ]"
            >{{ client.status != 0 ? "Received" : "padding" }}
          </span>
        </td>
        <td data-label="Note">
          {{ client.note }}
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small class="text-gray-500 dark:text-slate-400" :title="client.created_at">{{
            client.created_at
          }}</small>
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="openPurchaseInNewWindow(client.id)"
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
</template>
