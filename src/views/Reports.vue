<script>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
  mdiSitemap,
  mdiArrowExpandUp,
  mdiArrowRightBold,
  mdiEye
 } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableProducts from "@/components/TableProducts.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
 
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import router from "@/router";
import store from "@/store";
import FormField from "@/components/FormField.vue";

import OverlayLayer from "@/components/OverlayLayer.vue";
import SvgIcon from '@jamescoyle/vue-icon';
import { excelParser } from "../excel-parser";
import { sampleData } from "../sample-data";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
const isModalActive = ref(false);


 

import axios from "../axios.js";

export default {

components: { 
  excelParser,
  Menu,
 MenuButton,
MenuItem,
MenuItems,
sampleData,
    OverlayLayer,
CardBoxModal,
SvgIcon,
mdiEye,
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
BaseButtons,
BaseButtons,
 
 
   },

        data() {

          
            return {
                 keyword: null,
                 sums:' ',
              products: [ ],
            loading: false,
              category:[ ],
              checked: [],
              date:null,
              getStocked:'',
              getStockInSum:'',

    selectAll: false,
    selectDate:[
      { id:"1", name:"Today " , value:"today",},
    { id:"2", name:" Yesterday" , value:"yesterday"},
     { id:"3", name:"This Week " , value:"this_week",},
    { id:"4", name:" Last Week" , value:"last_week"},
    { id:"5", name:" This Month" , value:"this_month",},
    { id:"6", name:" Last Month" , value:"last_month"},
     { id:"7", name:"This Year " , value:"this_year",},
   ],



             }
        },
       
             
 computed:{
 

},

        methods: {
          stockOut: function(){
      this.$router.push('/stock-out')
  },
  stockIn: function(){
      this.$router.push('/stock-in')
  },
  exportCSV() {
      excelParser().exportDataFromCsv(this.checked, null, null);
    },
    exportExcel() {
      excelParser().exportDataFromExcel(this.checked, null, null);
    },
     async deleteAll(checked){
                    this.load = true;
                    if( this.checked.length){
  if(confirm(`Are you sure you want to delete this History? Operation can't be undone!!`
))

            await  axios.post('/deleteAll-history', {data: this.checked}).then(response=>{
                      this.load = false;

              this.$store.commit("notify", {
      type: "success",
      message: "History was successfully Deleted ",
    });
    this.getByDate();


       }).catch(error=>{
        this.load = false;

                console.log(error)
            })

            } 
        },

        getSum(){
            this.loading = true;

axios.get('/getSum', { params: { keyword: this.keyword }   })
    .then((res )=>{
      this.loading = false;

 this.sums = res.data

})
.catch(error => {
  this.loading = false;

});
},
getStockedSum(){
            this.loading = true;

axios.get('/get-stocked-sum', { params: { keyword: this.keyword }   })
    .then((res )=>{
      this.loading = false;

 this.getStocked = res.data

})
.catch(error => {
  this.loading = false;

});
},
StockInSum(){
            this.loading = true;

axios.get('/get-stockin-sum', { params: { keyword: this.keyword }   })
    .then((res )=>{
      this.loading = false;

 this.getStockInSum = res.data

})
.catch(error => {
  this.loading = false;

});
},

           getByDate(){
            this.loading = true;

axios.get('/getCount', {  prams: this.products    })
    .then((res )=>{
      this.loading = false;

 this.products = res.data

})
.catch(error => {
  this.loading = false;

});
},
            
           
            select() {
            this.checked = [];
            if (!this.selectAll) {
                for (let i in this.products) {
                    this.checked.push(this.products[i]);
                }
            }
        },

        updateCheckall: function(){
              if(this.products.length == this.checked.length){
                 this.selectAll = true;
              }else{
                 this.selectAll = false;
              }
        },

        
        getDateTime: function () {
                axios.get('/getCount')
                    .then((response) => {
                      this.date = response.data;
                      //console.log(response.data.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },

   
        ///
getData: function(){
  this.getSum();
  this.getStockedSum();
  this.StockInSum();

},
 
        },
        created() {
          this.getByDate();
          this.getDateTime();
          this.getSum();
          this.getStockedSum();
          this.StockInSum();
    
        },
        watch: {
        keyword(after, before) {
            this.getByDate();
            this.getDateTime();
           this.getSum();
           this.getStockedSum();
          this.StockInSum();
    
        },
        
    },

        
    }



 
</script>

<template>
   


  <CardBoxModal v-model="isModalActive"     has-cancel
   >
  
    </CardBoxModal>
  <LayoutAuthenticated>
    
    <SectionMain>
     
      <SectionTitleLineWithButton :icon="mdiArrowExpandUp" title="Product Report" main>
        
         
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
     
       <CardBox class="mb-6 bg-gray-20" has-table>
        <div class="lg:w-[200px] md:lg:w-[200px] w-full  lg:ml-7 md:ml-7" >

          <select id="countries" v-model="keyword" class="bg-gray-50 py-2.5 px-5 mr-2 mb-4 mt-4  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option class="text-xl font-semibold" selected  >All</option>

          <option class="text-xl font-semibold"  @click="getData()"  v-for="sel in selectDate" :key="sel.id" :value="sel.value">{{ sel.name }}</option>
         
         </select>
         </div> 
        <hr>
 
                   <div  class="grid grid-cols-3 sm:grid-cols-1  ssm:grid-cols-1   msm:grid-cols-1 gap-4">
       
                    <div class="m-5 ml-0  dark:bg-slate-900    w-full    overflow-hidden rounded-lg border  border-gray-700 bg-gray-100 shadow-lg">
                      
                        <div class="mt-4 px-5 mb-3 pb-5 w-full">
                          <div >
                            <h5 class="text-xl tracking-tight dark:text-white text-gray-700">Total Quantity</h5>
                          </div>
                          <hr>
                          <div class="m-2  gap-4  grid grid-cols-1 items-center justify-between">
                           
                            <div> 
                            <button href="#" class="flex w-full items-center justify-center rounded-md bg-gray-500 px-5 py-2.5 text-center text-sm font-medium dark:bg-gray-700 text-white  focus:outline-none focus:ring-4 focus:ring-blue-300">
                             
                              <svg xmlns="http://www.w3.org/2000/svg" class="mt-2 mr-2 h-8 w-8 dark:text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                         <span class="text-xl">      {{ products.todayCount }}</span>
                             
                         
</button
                            >
                          </div>

                            <div>

                          
                          </div>
                        </div>
                        </div>
                      </div>
                      <div class="m-5 ml-0  dark:bg-slate-900    w-full    overflow-hidden rounded-lg border  border-gray-700 bg-gray-100 shadow-lg">
                      
                        <div class="mt-4 px-5 mb-3 pb-5 w-full">
           
                          <div >
                            <h5 class="text-xl tracking-tight dark:text-white text-gray-700">  Sold Price</h5>
                          </div>
                          <hr>
                          <div class="m-2  gap-4  grid grid-cols-1 items-center justify-between">
              
                            <div> 
                            <button href="#" class="flex w-full items-center justify-center rounded-md bg-gray-500 px-5 py-2.5 text-center text-sm font-medium dark:bg-gray-700 text-white  focus:outline-none focus:ring-4 focus:ring-blue-300">
                             
                              <svg xmlns="http://www.w3.org/2000/svg" class="mt-2 mr-2 h-8 w-8 dark:text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                         <span class="text-xl">      {{$filters.currencyUSD(sums )}}</span>
                             
                         
</button
                            >
                          </div>

                            <div>

                          
                          </div>
                        </div>
                        </div>
                      </div>
                      <div class="m-5 ml-0  dark:bg-slate-900    w-full    overflow-hidden rounded-lg border border-gray-700 bg-gray-100 shadow-lg">
                      

                        <div class="mt-4 px-5 pb-5  mb-3 w-full">
                          <div  >
                            <h5 class="text-xl tracking-tight dark:text-white text-gray-700"> Stocked </h5>
                          </div>
                        <hr>
                          <div class="m-2  gap-4  grid grid-cols-1 items-center justify-between">
                           
                            <div> 
                            <button href="#" class="  w-full items-center justify-start rounded-md bg-gray-500 dark:bg-gray-700 px-5 py-2.5 text-center text-sm font-medium text-white   focus:outline-none focus:ring-4 focus:ring-blue-300">
                             
                           
                   <div class="grid grid-cols-1">
                    <div class="inline-flex">
                      <svg xmlns="http://www.w3.org/2000/svg" class="mt-2 mr-2 h-8 w-8 dark:text-sky-500  " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p class="text-xl mr-3"> Out</p> <span class="text-xl text-red-500">    
                        {{getStocked}}</span>
                   
                     </div>
<hr class="m-3">  
                      <div class="inline-flex">

                        <svg xmlns="http://www.w3.org/2000/svg" class="mt-2 mr-2 h-8 w-8 dark:text-sky-500  " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p class="text-xl mr-3"> In</p> <span class="text-xl text-green-500">    
                          {{getStockInSum}}</span>

                     </div>
                   </div>
</button
                            >
                          </div>

                            <div>

                          
                          </div>
                        </div>
                        </div>
                      </div>
                      

 
            </div>
         

 


 
 
       </CardBox>


     

      
    </SectionMain>
  </LayoutAuthenticated>
</template>
