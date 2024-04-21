<script setup>
import { reactive, computed,onMounted, ref ,watch} from "vue";
import { mdiBallotOutline, mdiPrinterOutline, mdiAccount,mdiTrashCanOutline , mdiMail, mdiGithub ,mdiAccountPlus,  mdiAccountMultiple
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
 import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";
 import store from '../store';
 import { useRoute, useRouter } from "vue-router";
 import Alert from "@/components/Alert.vue";
 import Date from "@/components/Date.vue";
 import { PurpleToBlue } from "@/colors";
import OverlayLayer from "@/components/OverlayLayer.vue";
import QuestionViewer from "@/components/QuestionViewer.vue";
import FormField from "@/components/FormField.vue";
 import { v4 as uuidv4 } from "uuid";
import JustboilLogo from "@/components/JustboilLogo.vue";
import QrcodeVue from 'qrcode.vue'

const route = useRoute();
const router = useRouter();


 const size = ref(200);

const loading = computed(() => store.state.currentMember.loading);

 const user = computed(() => store.state.user.data );
const payment = computed(() => store.state.payment.data );

store.dispatch("getPayment");

 
 function printDoc(){
 window.print();
 
}



</script>

<template>
  
 


 

 

    <SectionMain>

 
        <CardBox class="shadow-xl" >
    
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
    
                <BaseButton
                  color="info"
                  :icon="mdiPrinterOutline"
                  small
                  @click="printDoc(client)"
                  />  
                  </BaseButtons>

         

    

         <div v-for="q in payment.data" :key="q.id">


   
      <div v-if="route.params.id == q.id">
        
                <div class="flex-shrink max-w-full px-4 w-full mb-6">
                    <div class="p-6 ">
                      <div class="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-3">
                        <div class="flex flex-col">
                          <div class="text-3xl font-bold mb-1">
                            <JustboilLogo />       
                        </div>
                          <p class="text-sm">Given by# {{ user.name }}</p>
                        </div>
                        <div class="text-4xl uppercase font-bold">Invoice</div>
                      </div>
                      <div  class="flex flex-row font-serif justify-between py-3">
                  
                        <div class="flex-1">
                          <p><strong>Bill to:</strong><br>
                        Name:  {{q.firstname}} {{q.lastname}}<br>
                        Address:  {{q.address}}<br>
                        Email:  {{ q.email }}<br>
                        Phone:  {{ q.phone }}</p>
                        </div>
                        <div class="flex-1">
                          <div class="flex justify-between mb-2">
                            <div class="flex-1 font-semibold">Invoice ID#:</div><div class="flex-1 ltr:text-right  font-serifrtl:text-left">{{ q.invoice_id }}</div>
                          </div>
                          <div class="flex justify-between mb-2">
                            <div class="flex-1 font-semibold">Invoice date:</div><div class="flex-1 ltr:text-right font-serif rtl:text-left">{{ q.created_at }}</div>
                          </div>
                          <div class="flex justify-between mb-2">
                            <div class="flex-1 font-semibold">Due date:</div><div class="flex-1 ltr:text-right  font-serifrtl:text-left">{{ q.created_at }}</div>
                          </div>
                          <div class="flex justify-between mb-2">
                            <div class="flex-1 font-semibold">Status #:</div><div class="flex-1 ltr:text-right font-serif rtl:text-left">Paid</div>
                          </div>
                          <div class="flex justify-between mb-2">
                            <div class="flex-1 font-semibold">Payment #:</div><div class="flex-1 ltr:text-right font-serif rtl:text-left">{{ q.payment_type }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="py-4">
 
                        <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                          <thead class="border-b dark:border-gray-700">
                            <tr class="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                              <th  >Previous payment</th>
                              <th  class="text-center">Current payment</th>
                              <th   class="text-center">Total payment</th>
                              
                            </tr>
                          </thead>
                          <tbody>
                           
                            <tr class="border-b dark:border-gray-700">
                              <td data-label="Previous payment"   class=" font-serif font-bold">
                              {{ $filters.currencyUSD( q.pricePayment )  }}
                               
                              </td>
                              <td  data-label="Current payment" class="text-center font-serif font-bold"> {{$filters.currencyUSD( q.priceUpdate) }}
                               </td>
                              <td data-label="Total  payment" class="text-center font-serif font-bold"> {{ $filters.currencyUSD(q.total) }} </td>
                             </tr>
                          </tbody>
                         
                        </table>
<div class="flex items-center mt-5  float-right ">
  <qrcode-vue :value="q.firstname +q.lastname + q.invoice_id" :size="size" level="H" />

</div>

                      </div>
                    </div>
                  </div>
            </div>


        </div>
    
   
  
</CardBox>
</SectionMain>
 </template>

 <style>
@media print{
  *{background-color: white;
  }
}
</style>
 
