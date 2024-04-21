<script>
import { mdiArrowExpandUp } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import axios from "../axios.js";
import { Chart, registerables } from "chart.js/auto";
Chart.register(...registerables);
import OverlayLayer from "@/components/OverlayLayer.vue";

export default {
  components: {
    CardBoxModal,
    SectionMain,
    LayoutAuthenticated,
    SectionTitleLineWithButton,
    BaseButton,
    OverlayLayer,
  },
  data() {
    return {
      salesData: [],
      stockedOut: [],
      salesKeyword: null,
      stockedKeyword: null,
      monthsKeyword: null,
      stockedMonthKeyword: null,
      salesChart: null,
      loading: false,
      stockedChart: null,
      totalSoldPrice: null,
      totalSalesPrice: null, // Add totalSalesPrice here
      selectedOption: null,
      option1: "option1",
      option2: "option2",
      option3: "option3",
      option4: "option4",
      selectDate: [
        { id: "1", name: "Today ", value: "today" },
        { id: "2", name: " Yesterday", value: "yesterday" },
        { id: "3", name: "This Week ", value: "this_week" },
        { id: "4", name: " Last Week", value: "last_week" },
        { id: "5", name: " This Month", value: "this_month" },
        { id: "6", name: " Last Month", value: "last_month" },
        { id: "7", name: "This Year ", value: "this_year" },
        { id: "8", name: " Last Year", value: "last_year" },
      ],
      months: [
        {
          id: 1,
          name: "January",
          value: "january",
        },
        {
          id: 2,
          name: "February",
          value: "february",
        },
        {
          id: 3,
          name: "March",
          value: "march",
        },
        {
          id: 4,
          name: "April",
          value: "april",
        },
        {
          id: 5,
          name: "May",
          value: "may",
        },
        {
          id: 6,
          name: "June",
          value: "june",
        },
        {
          id: 7,
          name: "July",
          value: "july",
        },
        {
          id: 8,
          name: "August",
          value: "august",
        },
        {
          id: 9,
          name: "September",
          value: "september",
        },
        {
          id: 10,
          name: "October",
          value: "october",
        },
        {
          id: 11,
          name: "November",
          value: "november",
        },
        {
          id: 12,
          name: "December",
          value: "december",
        },
      ],
    };
  },
  mounted() {
    this.fetchSalesData();
    this.fetchStockedData();
  },
  watch: {
    salesKeyword(after, before) {
      if (this.selectedOption === this.option1) {
        this.monthsKeyword = null;
        this.fetchSalesData();
      }
    },
    monthsKeyword(after, before) {
      if (this.selectedOption === this.option2) {
        this.salesKeyword = null;

        this.fetchSalesData();
      }
    },
    stockedKeyword(after, before) {
      if (this.selectedOption === this.option3) {
        this.stockedMonthKeyword = null;
        this.fetchStockedData();
      }
    },
    stockedMonthKeyword(after, before) {
      if (this.selectedOption === this.option4) {
        this.stockedKeyword = null;
        this.fetchStockedData();
      }
    },
  },

  methods: {
    getSelectedOption() {
      alert("Selected Option: " + this.selectedOption);
    },
    getData() {
      this.fetchSalesData();
      this.fetchStockedData();
    },
    fetchSalesData() {
      this.loading = true;
      let url = "/sales";

      if (this.monthsKeyword) {
        url = "/sales-month";
      }

      axios
        .get(url, {
          params: {
            keyword: this.salesKeyword,
            month: this.monthsKeyword,
          },
        })
        .then((response) => {
          this.salesData = response.data;
          this.calculateTotalSalesPrice(); // Call the method to calculate total sales price
          this.loading = false;

          this.renderSalesChart();
        })
        .catch((error) => {
          this.loading = false;

          console.error("Error fetching sales data:", error);
        });
    },
    calculateTotalSalesPrice() {
      let totalSalesPrice = 0;
      this.salesData.forEach((product) => {
        product.stock_out.forEach((stockOut) => {
          totalSalesPrice += parseFloat(stockOut.salesPrice * -stockOut.quantity);
        });
      });
      this.totalSalesPrice = totalSalesPrice.toFixed(2); // Assign the total sales price to a data property
    },
    renderSalesChart() {
      const categorySalesData = {};

      this.salesData.forEach((product) => {
        const categoryName = product.category.category;
        if (!categorySalesData[categoryName]) {
          categorySalesData[categoryName] = {
            totalSales: 0,
            totalStockedOut: 0, // New property for total stocked out quantity
            products: {},
          };
        }
        product.stock_out.forEach((stockOut) => {
          const salesValue = parseInt(stockOut.quantity) * parseInt(-stockOut.salesPrice);
          categorySalesData[categoryName].totalSales += salesValue;
          categorySalesData[categoryName].totalStockedOut += Math.abs(
            parseInt(stockOut.quantity)
          ); // Accumulate stocked out quantity
          if (!categorySalesData[categoryName].products[product.productName]) {
            categorySalesData[categoryName].products[product.productName] = {
              sales: 0,
              stockOutQuantity: 0,
            };
          }
          categorySalesData[categoryName].products[
            product.productName
          ].sales += salesValue;
          categorySalesData[categoryName].products[
            product.productName
          ].stockOutQuantity += Math.abs(parseInt(stockOut.quantity));
        });
      });

      if (this.salesChart) {
        this.salesChart.destroy();
      }

      const ctx = document.getElementById("salesChart").getContext("2d");
      this.salesChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(categorySalesData),
          datasets: [
            {
              label: "Total Sales",
              data: Object.values(categorySalesData).map(
                (category) => category.totalSales
              ),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Total Stocked Out Quantity", // New dataset for stocked out quantity
              data: Object.values(categorySalesData).map(
                (category) => category.totalStockedOut
              ),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Total Sales (ETB)/Quantity",
              },
            },
            x: {
              title: {
                display: true,
                text: "Category",
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  if (context.dataset.label === "Total Stocked Out Quantity") {
                    return ` Total Quantity ${context.formattedValue}`; // Return the quantity as it is
                  } else {
                    return `ETB ${context.formattedValue}`; // Return sales value with ETB sign
                  }
                },
              },
            },
          },
          onClick: (event, elements) => {
            if (elements.length) {
              const clickedCategory = Object.keys(categorySalesData)[elements[0].index];
              const products = Object.entries(
                categorySalesData[clickedCategory].products
              );
              const productLabels = products.map(([productName]) => productName);
              const productSales = products.map(([, data]) => data.sales);
              const stockOutQuantities = products.map(
                ([, data]) => data.stockOutQuantity
              );

              if (this.salesChart) {
                this.salesChart.destroy();
              }

              const ctx = document.getElementById("salesChart").getContext("2d");
              this.salesChart = new Chart(ctx, {
                type: "bar",
                data: {
                  labels: productLabels,
                  datasets: [
                    {
                      label: "Product Sales",
                      data: productSales,
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                      borderColor: "rgba(75, 192, 192, 1)",
                      borderWidth: 1,
                    },
                    {
                      label: "Stocked Out Quantity",
                      data: stockOutQuantities,
                      backgroundColor: "rgba(255, 99, 132, 0.2)",
                      borderColor: "rgba(255, 99, 132, 1)",
                      borderWidth: 1,
                    },
                  ],
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Total Quantity",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Product",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `$${context.formattedValue}`;
                        },
                      },
                    },
                  },
                },
              });
            }
          },
        },
      });
    },

    fetchStockedData() {
      this.loading = true;
      let url = "/stockedData";

      if (this.stockedMonthKeyword) {
        url = "/stockedData-month";
      }
      axios
        .get(url, {
          params: { keyword: this.stockedKeyword, month: this.stockedMonthKeyword },
        })
        .then((response) => {
          this.stockedOut = response.data;
          this.calculateTotalSoldPrice();
          this.renderStockedChart();

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;

          console.error("Error fetching stocked data:", error);
        });
    },
    calculateTotalSoldPrice() {
      // Calculate the total sold price
      let totalSoldPrice = 0; // Initialize totalSoldPrice
      this.stockedOut.forEach((item) => {
        totalSoldPrice += parseFloat(item.totalStockOutPrice);
      });
      this.totalSoldPrice = totalSoldPrice.toFixed(2); // Assign the total sold price to a data property
      console.log(totalSoldPrice);
    },
    renderStockedChart() {
      if (this.stockedChart) {
        this.stockedChart.destroy();
      }

      const chartData = this.stockedOut.reduce((acc, item) => {
        if (!acc[item.productName]) {
          acc[item.productName] = {
            totalSales: 0,
            totalQuantity: 0,
          };
        }
        acc[item.productName].totalSales += parseFloat(item.totalStockOutPrice);
        acc[item.productName].totalQuantity += Math.abs(parseFloat(item.quantity));
        return acc;
      }, {});

      const ctx = document.getElementById("stockedChart").getContext("2d");

      this.stockedChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(chartData),
          datasets: [
            {
              label: "Total Sales (ETB)",
              data: Object.values(chartData).map((item) => item.totalSales),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Total Quantity",
              data: Object.values(chartData).map((item) => item.totalQuantity),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Total Sales (ETB)/Quantity",
              },
            },
            x: {
              title: {
                display: true,
                text: "Product Name",
              },
            },
          },
        },
      });
    },
  },
};
</script>

<template>
  <CardBoxModal v-model="isModalActive" has-cancel> </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiArrowExpandUp" title="Chart View" main>
        <BaseButton
          target="_blank"
          :icon="mdiArrowExpandUp"
          label="Stock Out"
          color="contrast"
          rounded-full
          small
          @click="stockOut"
        />
        <BaseButton
          target="_blank"
          :icon="mdiArrowExpandUp"
          label="Stock In"
          color="contrast"
          rounded-full
          small
          @click="stockIn"
        />
      </SectionTitleLineWithButton>
      <CardBox>
        <div v-if="loading">
          <OverlayLayer />
        </div>

        <div class="flex lg:flex-row flex-col">
          <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <!-- Total Sold Price -->
            <div class="flex justify-end px-6">
              <div class="flex items-center">
                <span class="text-sm font-medium mr-2">Total Sold :</span>
                <span class="text-lg font-semibold text-green-600">
                  {{ $filters.currencyUSD(totalSalesPrice) }}
                </span>
              </div>
              <div class="w-auto ml-5">
                <input
                  type="radio"
                  id="option1"
                  value="option1"
                  v-model="selectedOption"
                />

                <label
                  for="salesDateFilter"
                  class="text-sm font-medium w-10 text-gray-900 dark:text-white"
                >
                  Sales By Date</label
                >
                <select
                  v-if="selectedOption === this.option1"
                  id="select1"
                  v-model="salesKeyword"
                  class="bg-gray-50 py-0.5 px-1 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option class="text-xl font-semibold" selected>All Products</option>
                  <option
                    class="text-xl font-semibold"
                    v-for="sel in selectDate"
                    :key="sel.id"
                    :value="sel.value"
                  >
                    {{ sel.name }}
                  </option>
                </select>
              </div>
              <div class="w-auto ml-5">
                <input
                  type="radio"
                  id="option2"
                  value="option2"
                  v-model="selectedOption"
                />

                <label
                  for="salesDateFilter"
                  class="text-sm font-medium w-10 text-gray-900 dark:text-white"
                >
                  Sales By Month</label
                >
                <select
                  v-if="selectedOption === this.option2"
                  id="select2"
                  v-model="monthsKeyword"
                  class="bg-gray-50 py-0.5 px-1 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option class="text-xl font-semibold" selected>All Products</option>
                  <option
                    class="text-xl font-semibold"
                    v-for="sel in months"
                    :key="sel.id"
                    :value="sel.value"
                  >
                    {{ sel.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex flex-grow m-2">
              <canvas id="salesChart" width="400" height="200"></canvas>
            </div>
          </div>

          <div
            class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <!-- Total Sold Price -->
            <div class="flex justify-end px-6">
              <div class="flex items-center">
                <span class="text-sm font-medium mr-2">Total Sold :</span>
                <span class="text-lg font-semibold text-green-600">
                  {{ $filters.currencyUSD(totalSoldPrice) }}
                </span>
              </div>
              <div class="w-auto ml-5">
                <input
                  type="radio"
                  id="option3"
                  value="option3"
                  v-model="selectedOption"
                />

                <label
                  for="stockedDateFilter"
                  class="text-sm font-medium w-10 text-gray-900 dark:text-white"
                >
                  Sales By Date</label
                >
                <select
                  v-if="selectedOption === this.option3"
                  id="stockedDateFilter"
                  v-model="stockedKeyword"
                  class="bg-gray-50 py-0.5 px-1 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option class="text-xl font-semibold" selected>All Products</option>
                  <option
                    class="text-xl font-semibold"
                    v-for="sel in selectDate"
                    :key="sel.id"
                    :value="sel.value"
                  >
                    {{ sel.name }}
                  </option>
                </select>
              </div>
              <div class="w-auto ml-5">
                <input
                  type="radio"
                  id="option4"
                  value="option4"
                  v-model="selectedOption"
                />

                <label
                  for="stockedDateFilter"
                  class="text-sm font-medium w-10 text-gray-900 dark:text-white"
                >
                  Sales By Month</label
                >
                <select
                  v-if="selectedOption === this.option4"
                  id="stockedDateFilter"
                  v-model="stockedMonthKeyword"
                  class="bg-gray-50 py-0.5 px-1 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option class="text-xl font-semibold" selected>All Products</option>
                  <option
                    class="text-xl font-semibold"
                    v-for="sel in months"
                    :key="sel.id"
                    :value="sel.value"
                  >
                    {{ sel.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex flex-grow m-2">
              <canvas id="stockedChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
