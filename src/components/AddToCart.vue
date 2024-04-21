<script>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
  mdiSitemap,
  mdiArrowExpandUp
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableProducts from "@/components/TableProducts.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
 import store from "@/store";
import FormField from "@/components/FormField.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
 const router = useRouter();

const isModalActive = ref(false);


function createProduct(){
router.push('/products/create')
 

}

import axiosClient from "../axios.js";

export default {

components: { 
  Menu,
MenuButton,
MenuItem,
MenuItems,
ChevronDownIcon,
    OverlayLayer,
CardBoxModal,
SectionMain,
NotificationBar,
TableProducts ,
CardBox,
LayoutAuthenticated,
SectionTitleLineWithButton,
BaseButton,
CardBoxComponentEmpty,
router,
store,
FormField,
 
 
   },

        data() {
            return {
              products: [ ],
              keyword: null,
              loading: false,
              quantity: 1,
              total: 0,
              totalQuantity: 0,
              totalPrice:0,
              cartCount: 0,
              load: false,
              category:[],
             selectedcategory: ' ',


             }
        },
        
             
 computed:{
 


   
},

        methods: {
 

            async create(){
                    this.load = true;

            await  axiosClient.patch('/product-cart',{
              products: this.products
            }).then(response=>{
                      this.load = false;

              this.$store.commit("notify", {
      type: "success",
      message: "Product was successfully Stockd Out ",
    });
    router.push({
      name: "StockOut",
     });         
       }).catch(error=>{
        this.load = false;

                console.log(error)
            })
        },

            getProduct(){
                axiosClient.get('/survey')
                     .then((response)=>{
                       this.products = response.data.data
                     })
            },
          
            getResults() {
                this.loading = true;

            axiosClient.get('/livesearch', { params: { keyword: this.keyword }   })
                .then((res )=>{
        this.loading = false;
        this.products = res.data
       
       })
     .catch(error => {
      this.loading = false;

     });
        },

     addToCart: function(product) {
        
        let quantity =  this.quantity;
        let totalPrice =  this.totalPrice;


 

product.quantity--;

  
  },

 
  

  selectedCat: function(section){
            
             this.selectedcategory = section.id;
          },
 

 

    
    
        },
        created() {
            this.getProduct()
         },
        watch: {
        keyword(after, before) {
            this.getResults();
        }
    },

        
    }



 
</script>

<template>
   


  <CardBoxModal v-model="isModalActive"     has-cancel
   >
  
    </CardBoxModal>
  <LayoutAuthenticated>
    
    <SectionMain>
     
      <SectionTitleLineWithButton :icon="mdiArrowExpandUp" title="Stock Out" main>
        
         
        <BaseButton
        target="_blank"
       :icon="mdiArrowExpandUp"
       label="Add Product"
       color="contrast"
       rounded-full
       small
       @click="createProduct"

     />
 
        
      </SectionTitleLineWithButton>
     
 
      <CardBox class="mb-6 bg-gray-20" has-table>
         <hr>
        <div class="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1    rounded-lg ">

    <div class="relative p-6 overflow-x-auto">
                 <div class="text-xl font-bold">       
                             Select Product

                             <span class="bg-green-500 h-6 w-6 p-6   text-center rounded-full  ">  
                            </span>
       </div>
       
                <hr class="m-4">
 
    <div class="flex mb-3">
 <!-- Select Option -->

 <div class="grid grid-cols-2 gap-3">
   
        <div class=" ml-10 w-full">
            <input type="search" v-model="keyword" id="search-dropdown" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
             placeholder="Search Products, Name, BarCode, Category..."  >
            
        </div>

      </div>
    </div>
    <pre>{{ products }}</pre>
    <form @submit.prevent="create">

    <div  class="overflow-x-auto w-full">
         <tbody v-if="loading || !products.length">
            <tr>
              <td colspan="12">
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
        <table>
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                BarCode
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Quantity
                            </th>
                        </tr>
                    </thead>

                          
                      <tbody >
                       
                        <tr @click="addToCart(product)" v-for="(product, index) in products" :key="index" class="cursor-pointer bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    
                          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{ product.productName }}
                            </th>
                            <td class="px-6 py-4">
                                {{ product.barCode }}
                            </td>
                            <td class="px-6 py-4">
                             </td>
                            <td class="px-6 py-4">
                                {{ product.quantity }}
                            </td>
                          </tr>
                        
                    </tbody>
                   
                      
                </table>
            </div>

            <button   type="submit" class="w-auto mt-10 flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"

             >
            
          Stcak Out
           </button>  
          </form>
        </div>
           

            <div class=" ml-3 w-auto   p-6  border-l-4 border-gray-100   dark:bg-gray-800 dark:border-gray-700">
                <div class="text-xl font-bold">       
                    Stock Out
            </div>
            <hr class="m-4">
            
 
  
 
</div>

</div>



<hr class="mt-10">

       </CardBox>


     

      
    </SectionMain>
  </LayoutAuthenticated>
</template>
