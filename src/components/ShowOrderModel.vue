<template>
  <div>
    <button
      class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-4 py-0.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      @click="toggleModal()"
    >
      Detail
    </button>

    <div
      v-if="showModal"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
    >
      <div class="relative w-auto my-6 mx-auto max-w-3xl">
        <!--content-->
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          <!--header-->
          <div
            class="flex items-start justify-between dark:bg-gray-700 p-5 border-b border-solid border-slate-200 rounded-t"
          >
            <h3 class="text-2xl text-red-500 font-semibold">Stock Out</h3>
            <Menu as="div" class="relative text-left">
              <div>
                <MenuButton
                  class="inline-flex w-full dark:bg-gray-700 dark:text-gray-400 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  More
                  <ChevronDownIcon
                    class="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition   ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute dark:bg-gray-700 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }" @click="MoreDetail(detail)">
                      <a
                        :class="[
                          active
                            ? 'courser-pointer bg-gray-100  text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                            : 'text-gray-700 dark:text-white ',
                          'block px-4 py-2 text-sm',
                        ]"
                        >Invoice</a
                      >
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
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

          <div
            class="relative p-6 flex-auto dark:bg-gray-700"
            ref="document"
            id="element-to-convert"
          >
            <div class="overflow-x-hidden w-full">
              <div class="mt-4">
                <div class="text-left"></div>
                <div class="text-md text-center mb-5">
                  <p class=" ">
                    Invoice No: <b class="ml-2 justify-start">{{ detail.Reference }}</b>
                  </p>
                  <p class=" ">
                    Date: <b class="ml-2 justify-start">{{ detail.created_at }}</b>
                  </p>
                </div>
              </div>

              <div class="w-full">
                <div class="p-7 pb-12 pt-12 rounded-5xl">
                  <div class="overflow-x-auto mt-5">
                    <h2 class="xl:pl-24 text-3xl font-heading font-medium mb-4">
                      Detail Information
                    </h2>

                    <div class="inline-block min-w-full overflow-hidden">
                      <div class="border mb-5 border-gray-700">
                        <table class="mb-2 w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>E-mail</th>

                              <th>Updated Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td data-label="Name">
                                {{ detail.name }}
                              </td>
                              <td data-label="Email">
                                {{ detail.email }}
                              </td>
                              <td data-label="Updated Date">
                                {{ detail.updated_at }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table class="w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th>Reference</th>

                              <th>Address</th>
                              <th>Phone</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td data-label="Reference">
                                {{ detail.Reference }}
                              </td>
                              <td data-label="Address">
                                {{ detail.address }}
                              </td>
                              <td data-label="Phone">
                                {{ detail.phone }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div class="border border-gray-700">
                        <table class="mb-2 w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th>ProductName</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr
                              v-for="q in detail.questions"
                              :key="q.id"
                              class="dark:text-white text-black"
                            >
                              <td data-label="ProductName">
                                {{ q.productName }}
                              </td>
                              <td data-label="Sales Price">
                                {{ $filters.currencyUSD(Math.abs(q.salesPrice)) }}
                              </td>
                              <td data-label="Quantity">
                                {{ q.quantity * -1 }}
                              </td>
                              <td data-label="Total Price">
                                {{ $filters.currencyUSD(Math.abs(q.totalStockOutPrice)) }}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table class="mb-2 w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th>Sub Total</th>
                              <th>Tax</th>
                              <th>Shipping</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td data-label="Sub Total">
                                {{ $filters.currencyUSD(Math.abs(detail.amount)) }}
                              </td>
                              <td data-label="Tax">
                                ({{ detail.tax }}% )
                                {{
                                  $filters.currencyUSD(
                                    Math.abs(detail.amount * (detail.tax / 100))
                                  )
                                }}
                              </td>
                              <td data-label="Shipping">
                                {{ $filters.currencyUSD(Math.abs(detail.shipping)) }}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table class="w-full border border-gray-300">
                          <thead>
                            <tr>
                              <th>Grand Total</th>
                              <th>Payed Amount</th>
                              <th>Due</th>
                              <th>Payment Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td data-label="Grand Total">
                                {{
                                  $filters.currencyUSD(
                                    Math.abs(
                                      parseInt(detail.amount) +
                                        parseInt(detail.shipping) +
                                        parseInt(detail.amount) * (detail.tax / 100)
                                    )
                                  )
                                }}
                              </td>
                              <td data-label="Payed Amount">
                                {{ $filters.currencyUSD(Math.abs(detail.PayedAmount)) }}
                              </td>
                              <td data-label="Due">
                                {{ $filters.currencyUSD(Math.abs(detail.Due)) }}
                              </td>

                              <td data-label="Payment Status">
                                <div>
                                  <span
                                    :class="[
                                      detail.Due == 0
                                        ? 'text-green-700 bg-green-200 '
                                        : 'text-orange-700 bg-orange-200',
                                    ]"
                                    class="py-1 px-3 text-sm font-heading font-medium rounded-full"
                                    >{{ detail.Due == 0 ? "Paid" : "Partial" }}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full">
                <!--Card 1-->
                <div class="w-full overflow-auto">
                  <div class="px-6 pt-4 pb-2" v-if="detail.Note">
                    <div>
                      <label
                        for="message"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Note</label
                      >
                      <textarea
                        id="message"
                        disabled
                        :value="detail.Note"
                        rows="3"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write Note"
                      >
                      </textarea>
                    </div>
                  </div>
                </div>

                <div class="w-full sm:hidden msm:hidden ssm:hidden mt-2 ml-5">
                  Total Products
                  <strong class="text-md font-bold">{{ detail.TotalProduct }} </strong>
                </div>

                <div class="w-full ml-5 sm:hidden msm:hidden ssm:hidden">
                  Total Quantity
                  <strong class="text-red-500">- {{ detail.TotalQuantity }} </strong>
                </div>
              </div>
            </div>
          </div>
          <div class="text-2xl dark:bg-gray-700 text-black"></div>
          <!--footer-->

          <div
            class="flex dark:bg-gray-700 items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"
          >
            <button
              class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              v-on:click="toggleDetail()"
            >
              Complete Payment
            </button>
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

    <div
      v-if="showDetail"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
    >
      <div class="w-auto my-6 mx-auto max-w-md absolute inset-y-0 right-10">
        <!--content-->
        <div
          class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
        >
          <!--header-->
          <div
            class="flex items-start justify-between dark:bg-gray-700 p-5 border-b border-solid border-slate-200 rounded-t"
          >
            <h3 class="text-2xl text-green-500 font-semibold">Update Payment</h3>

            <button
              v-on:click="toggleDetail()"
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

          <div
            class="w-full max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
          >
            <form class="space-y-6" @submit.prevent="updateDue(detail)">
              <div
                v-if="errorMsg"
                class="overflow-auto items-center justify-between py-6 px-5 bg-red-500 text-white rounded"
              >
                {{ errorMsg }}
                <span
                  @click="errorMsg = ''"
                  class="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:bg-[rgba(0,0,0,0.2)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
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
                </span>
              </div>

              <div>
                <label
                  for="due"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Update Your Due</label
                >
                <input
                  v-model="model.due"
                  type="due"
                  name="due"
                  id="due"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  for="message"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Update Your Note</label
                >
                <textarea
                  id="message"
                  @input="handleInput"
                  :value="detail.Note"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write Note"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
                Update Payment
              </button>
            </form>
          </div>

          <!--footer-->
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { excelParser } from "../excel-parser";
import { sampleData } from "../sample-data";
import axios from "../axios.js";

import html2pdf from "html2pdf.js";
import store from "../store";

const user = computed(() => store.state.user.data);

store.dispatch("getUser");

const router = useRouter();

const route = useRoute();

const props = defineProps({
  modelValue: Boolean,

  detail: {
    required: true,
    type: Object,
  },
});

let model = ref({
  due: 0,
});

let Note = ref(" ");
function handleInput(event) {
  Note.value = event.target.value;
  console.log(Note.value);
}

let loading = ref(false);

let errorMsg = ref("");
function updateDue(detail) {
  loading.value = true;

  axios
    .patch(
      `details/${detail.id}`,

      {
        id: detail.id,
        PayedAmount: detail.PayedAmount,
        Due: detail.Due,
        //Note:detail.Note,
        Paid: model.value.due,
        Note: Note.value,
      }
    )
    .then((res) => {
      loading.value = false;
      store.dispatch("getDetails");

      if (res) {
        store.commit("notify", {
          type: "success",
          message: "Payment  was successfully Updated ",
        });
        showDetail.value = false;
      }
    })

    .catch(({ response }) => {
      loading.value = false;
      errorMsg.value = response.data.error;
    });
}

function exportToPDF() {
  html2pdf(document.getElementById("element-to-convert"), {
    margin: 1,
    filename: "details.pdf",
  });
}

function MoreDetail(detail) {
  //alert(detail.id)
  const route = router.resolve({
    name: "invoice",
    params: { id: detail.id },
  });

  window.open(route.href, "", "height=600,width=600");
}

const showDetail = ref(false);

function toggleDetail() {
  showDetail.value = !showDetail.value;
}
const showModal = ref(false);

function toggleModal() {
  showModal.value = !showModal.value;
}
</script>

<style>
.checkbox:checked + .check-icon {
  display: flex;
}
</style>
