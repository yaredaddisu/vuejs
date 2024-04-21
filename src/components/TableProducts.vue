<script setup>
import { computed,onMounted, ref,watch } from "vue";
import store from "@/store";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
 import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";


import router from "@/router";
import axiosClient from "../axios";
import { PurpleToBlue } from "@/colors";
import { cyanToBlue } from "@/colors";
import { GreenToBlue } from "@/colors";
import { PurpleToPink } from "@/colors";
import { PinkToOrange } from "@/colors";
import { TealToLime } from "@/colors";
import { RedToYellow } from "@/colors";
defineProps({
  checkable: Boolean,
});

 
const totalPrice = ref(0);
const totalSold = ref(0);
const totalProfit = ref(0);

  
const search = ref('');
 const sortField = ref('updated_at');
const sortDirection = ref('desc')


const items = computed(() => store.state.products.data);
store.dispatch("getProducts", { search: search.value});

const loading = computed(() => store.state.products.loading);

 

  watch(search, ( newValue, oldValue ) => {
    store.dispatch("getProducts", {
      search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value
  });


})
function getProducts(url = null) {
  store.dispatch("getProducts", {
    url,
    search: search.value,
    sort_field: sortField.value,
    sort_direction: sortDirection.value
  });
}


onMounted(() => {
  getProducts();
})

function createProduct(){
router.push('/products/create')
store.dispatch("getProducts");

}

function sortProducts(field) {
  if (field === sortField.value) {
    if (sortDirection.value === 'desc') {
      sortDirection.value = 'asc'
    } else {
      sortDirection.value = 'desc'
    }
  } else {
    sortField.value = field;
    sortDirection.value = 'asc'
  }

  getProducts()
}
function getForPage(ev, link) {
  ev.preventDefault();
  if (!link.url || link.active) {
    return;
  }

  getProducts(link.url)
}


function deleteProduct(product){

if(confirm(`Are you sure you want to delete this product? Operation can't be undone!!`
))
{
store.dispatch('deleteProduct', product.id)
.then(()=>{
  store.commit('notify', {
    type: 'success',
    message: 'Product was successfully deleted!'
  })
store.dispatch('getProducts');
})

}
}
const isModalActive = ref(false);

const isModalDangerActive = ref(false);

const perPage = ref(9);

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

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === client.id
    );
  }
};


const activeProducts = ref(0);
const InactiveProducts = ref(0);

 

 

function updateDashboard(){
   loading.value = {
    activeProducts: true,
    InactiveProducts: true,


  }
  };

   

  axiosClient.get(`/activeProducts`, { }).then(({data}) => {
    activeProducts.value = data
   })
 axiosClient.get(`/InactiveProducts`, { }).then(({data}) => {
    InactiveProducts.value = data
   })
  onMounted(() => {
   updateDashboard();
  });
</script>

<template>
 
   <div class="border">

  <div class="flex items-center float-left mt-3 ml-3">
    <select @change="getProducts(null)" v-model="perPage"
           class="appearance-none relative block w-24 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
     <option selected value="9">9</option>
     <option value="18">18</option>
     <option value="36">36</option>
     <option value="72">72</option>
     <option value="144">144</option>
   </select>
<div > 
<button
   @click="createProduct()"
    type="button" class="ml-6 py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Create Product</button>

   
</div>
<div field="title" :sort-field="sortField" :sort-direction="sortDirection"
@click="sortProducts('title')" class=" ml-3">
Sort by title
</div><div field="status" :sort-field="sortField" :sort-direction="sortDirection"
@click="sortProducts('status')" class=" ml-3">
Sort by status
</div>

</div>
  </div>



     <label for="default-search" class=" mb-2  text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
     <div class="relative float-right  mt-3 mr-3 ">
         

         <FormControl
         placeholder="Search (ctrl+k)"
         ctrl-k-focus
         transparent
         borderless
         v-model="search" 
            type="search"
       />
     </div>
     <div class="float-left mt-3 ml-3 mb-3 ">
      <BaseButton
      color="lightDark"
     label="Active products "  
     :icon="mdiOpenInNew"
     :small="buttonsSmall"
     :outline="buttonsOutline"
     :disabled="buttonsDisabled"
     :rounded-full="buttonsRounded"
    
    />
     <BaseButton
    color="success"
    :label="activeProducts"
    :icon="mdiOpenInNew"
    :small="buttonsSmall"
    :outline="buttonsOutline"
    :disabled="buttonsDisabled"
    :rounded-full="buttonsRounded"
    class="w-12 h-10 rounded-full mr-6"
    
    />
    <BaseButton
      color="lightDark"
     label="In active products "  
     :icon="mdiOpenInNew"
     :small="buttonsSmall"
     :outline="buttonsOutline"
     :disabled="buttonsDisabled"
     :rounded-full="buttonsRounded"
    
    />
     <BaseButton
    color="danger"
    :label="InactiveProducts"
    :icon="mdiOpenInNew"
    :small="buttonsSmall"
    :outline="buttonsOutline"
    :disabled="buttonsDisabled"
    :rounded-full="buttonsRounded"
    class="w-12 h-10 rounded-full"
    />
     </div>
 
      <tbody v-if="loading || !items.length">
      <tr>
        <td   class="w-full">
          <div v-if="loading">

            <OverlayLayer />
          </div>
          <div v-else class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
              <div class="py-1">
                <svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                <p class="font-bold">Ooops Their is Something Error</p>
                <p class="text-sm">Their is no data found here.</p>
              </div>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
     <div> 
     <table class="mt-[100px]">

  <div class="grid grid-cols-3  gap-5 msm:grid-cols-1 ssm:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 ">
    <div
  class="flex flex-col py-4 shadow-xl border px-6  ml-4 bg-white dark:hover:bg-gray-700 rounded-md dark:bg-gray-800 hover:bg-gray-50  h-auto"
  v-for="product in itemsPaginated" :key="product.id"
>
<div class="flex justify-between">
  <BaseButton
  color="info"
  :label="product.totalQuantity "
 :icon="mdiOpenInNew"
 :small="buttonsSmall"
 :outline="buttonsOutline"
 :disabled="buttonsDisabled"
 :rounded-full="buttonsRounded"
 class="w-12 h-10 mb-2 rounded-full float-left"
/>
<p class="font-serif fornt-semibold"  v-if="product.totalQuantity == product.soldCount"
>Product finished</p>
<p class="font-serif fornt-semibold" v-else-if="product.totalQuantity !== product.soldCount">{{product.totalQuantity - product.soldCount}} Products left</p>
 
 <BaseButton
 color="warning"
 :label="product.soldCount "
 :icon="mdiOpenInNew"
 :small="buttonsSmall"
 :outline="buttonsOutline"
 :disabled="buttonsDisabled"
 :rounded-full="buttonsRounded"
 class="w-12 h-10 mb-2 rounded-full float-right"
/>
</div>
  <img
    :src="
      product.image_url ||
      'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'
    "
    :alt="product.title"
    class="w-full h-48 object-cover transition-all  rounded-md transform hover:scale-125"
  />
  <h4 class="mt-4 text-lg font-bold dark:text-white">{{ product.title }}</h4>

 
  <span  :class="[
    product.status != 0
      ? 'text-green-500'
      : 'text-red-500',

  ]">
      
   Status: {{ product.status != 0 ? "Active" : "In Active"}}

  </span>

 
  
  

 
   
   <div class="block mt-3 ">
    <label class="w-auto text-xs font-bold">Total invested prcie</label>

    <button
    title="  Total price
    "
      :class="cyanToBlue"
     class="  w-full  text-sm  mb-3"
      @click="onClickPrice"
     >
       {{$filters.currencyUSD(product.totalPrice)}}
    </button> 
    <label class="w-auto text-xs font-bold"> Total sold price</label>

    <button
    title="  Total sold
    "
      :class="TealToLime"
     class=" w-full text-sm  mb-3"
      @click="onClickPrice"
     >
     {{$filters.currencyUSD(product.totalSold)}}
    </button> 
    <label class="w-auto text-xs font-bold"> Total profit</label>

    <button
    title="  Total profit
    "
      :class="cyanToBlue"
     class=" w-full text-sm mb-3"
      @click="onClickPrice"
     >
        {{$filters.currencyUSD(product.profit)}}
    </button> 
   </div>
   <div class="grid grid-cols-2 mt-3 ">
   

    <router-link
      :to="{ name: 'ProductView', params: { id: product.id } }"
      :class="cyanToBlue"
      >
     Update
     </router-link>
    
      <button
        v-if="product.id"
        type="button"
        @click="deleteProduct(product)"
        class="  w-full"
        :class="RedToYellow"
        >
      
        Delete

      </button>


      
    
  </div>
</div>
</div>

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

   

</template>
