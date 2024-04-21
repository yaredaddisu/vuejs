<template>
     
   
  
  <div class="py-5 ">

    <OverlayLayer v-if="loading" />
     <form  v-else class="  mx-auto w-full">

      <div class="grid grid-cols-3 sm:grid-cols-1 ssm:grid-cols-1 sms:grid-cols-1 md:grid-cols-1 msm:grid-cols-1 items-center">
    
        <div class="  ml-6 w-[150px]  ">
          <img :src="product.image_url" alt="" />
        </div>
        <div class="  ">
          <h1 class="text-3xl mb-3 ml-3   float-left">Product category <strong> {{ product.title }}</strong></h1>
          <p class="text-gray-500 text-sm" v-html="product.description"></p>
        </div>
        
              <FormField  >
       
             <button
             title="  Print This Page
             "
             onclick="window.print()" 

               :class="PurpleToPink"
              class="  h-auto ml-3 w-auto text-lg "
               >
               Print This Page
             </button> 
                 </FormField>
      </div>

      <div class="grid grid-cols-2 gap-4  m-6    sm:grid-cols-1  ssm:grid-cols-1   msm:grid-cols-1   md:grid-cols-2">
        <FormField label="Total invested prcie">
       
              <button
             title="  Total price
             "
               :class="cyanToBlue"
              class="  h-auto w-auto  text-lg"
               >
                {{$filters.currencyUSD(product.totalPrice)}}
             </button> 
           
           </FormField>
       
        
              <FormField label="Total sold price">
       
             <button
             title="  Total sold price
             "
               :class="TealToLime"
              class="  h-auto w-auto text-lg "
               >
              {{$filters.currencyUSD(product.totalSold)}}
             </button> 
                 </FormField>
       
        
                    <FormField label=" Total profit">
       
             <button
             title="  Total profit
             "
               :class="cyanToBlue"
              class="  h-auto w-auto  text-lg"
               >
                 {{$filters.currencyUSD(product.profit)}}
             </button> 
                       </FormField>
       
                       <FormField label="Total quantity">
       
                         <button
                        title="  Total quantity
                        "
                          :class="PurpleToPink"
                         class="  h-auto w-auto  text-lg"
                          >
                           {{ product.totalQuantity}}
                        </button> 
                      
                      </FormField>
                  
                   
                         <FormField label="Total sold out">
                  
                        <button
                        title="  Total sold out
                        "
                          :class="GreenToBlue"
                         class="  h-auto w-auto text-lg "
                          >
                         {{ product.soldCount}}
                        </button> 
                            </FormField>
                  
                   
                               <FormField label=" Remaining products
                               ">
                  
                        <button
                        title="  Remaining Products
                        "
                          :class="RedToYellow"
                         class="  h-auto w-auto  text-lg"
                          >
                            {{ product.totalQuantity - product.soldCount}}
                        </button> 
                                  </FormField>
       
            </div>

      <div class="py-8 px-6 bg-white-500 text-black w-full  mx-auto">
      
      <!-- component -->

        <hr class="my-3">
        <div v-for="(question, ind) of product.questions" :key="question.id">
          <Viewer
            v-model="answers[question.id]"
            :question="question"
            :index="ind"
          />
        </div>

         
      </div>
    </form>
   </div>
 </template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Viewer from "@/components/Viewer.vue";
import { cyanToBlue } from "@/colors";
import { GreenToBlue } from "@/colors";
import { PurpleToPink } from "@/colors";
import { PinkToOrange } from "@/colors";
import { TealToLime } from "@/colors";
import { RedToYellow } from "@/colors";
import OverlayLayer from "@/components/OverlayLayer.vue";
import FormControl from "@/components/FormControl.vue";
import FormField from "@/components/FormField.vue";
const route = useRoute();
const store = useStore();

const loading = computed(() => store.state.currentProduct.loading);
const product = computed(() => store.state.currentProduct.data);

const productFinished = ref(false);

const answers = ref({});

store.dispatch("getProductBySlug", route.params.slug);

  
</script>

<style></style>
