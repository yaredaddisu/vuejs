<script setup>
import { reactive, computed, ref ,watch} from "vue";
import { mdiArrowLeft,mdiTrashCanOutline
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormField from "@/components/FormField.vue";
 import NotificationBar from "@/components/NotificationBar.vue";
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
import UpdateBoxModal from "@/components/UpdateBoxModal.vue";
import Notification from "@/components/Notification.vue";
import { v4 as uuidv4 } from "uuid";


const route = useRoute();
const router = useRouter();

const load = computed(() => store.state.currentUser.loading);
const user = computed(() => store.state.user.data);

store.dispatch('getUser');

const isModalActive = ref(false);


let model = ref({
  id:'',
  name:"",
  status: false,
  email: null,
  image_url: null,
  phone: "",
    organization:"",
  radio: ''
});



 watch(
  () => store.state.currentUser.data,
  (newVal, oldVal) => {
    model.value = {
      ...JSON.parse(JSON.stringify(newVal)),
      status: !!newVal.status,
    };
  }
);





 if (route.params.id) {
  store.dispatch("getUserManagment", route.params.id);
}



function onImageChoose(ev) {
  const file = ev.target.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    // The field to send on backend and apply validations
    model.value.image = reader.result;

    // The field to display here
    model.value.image_url = reader.result;
    ev.target.value = "";
  };
  reader.readAsDataURL(file);
}



 let errors = ref('');
 const loading = ref(false);

function createUser() {
  model.value.plan.forEach((item, _) => {

    const equities = [{value: parseInt( item.price)}, {value: parseInt(0)}];

item.price  = equities.reduce((sum, equity) => {
return sum + equity.value;


}, 0)
console.log(item.price)
  })


 let action = "created";

  if (model.value.id) {
    action = "updated";
  }


loading.value = true;


  store.dispatch("createUser", { ...model.value }).then(({ data }) => {

   loading.value = false;

    store.commit("notify", {
      type: "success",
      message: "User was successfully " + action,
    });




}).catch((error) => {
   loading.value = false;
   if (error.response.status === 422) {
     errors.value = error.response.data.errors;
   }

 });

}

const isCheckAll = ref(true);
const checked = ref([ ]);

function checkAll(){

 isCheckAll.value = !isCheckAll.value;
checked.value = [];
if(isCheckAll.value){ // Check all
  for (var key in  model.value.plan) {
    checked.value.push( model.value.plan[key]);
  }
}
};
function updateCheckall(){
if(checked.value.length ==  model.value.plan.length){
    isCheckAll.value = true;
}else{
   isCheckAll.value = false;
}
};

function deleteUserPayment(checked){
 if(checked.length){
  if(confirm(`Are you sure you want to delete this payment? Operation can't be undone!!`
))
{
store.dispatch('deleteUserPayment', checked)
.then(()=>{
  store.commit('notify', {
    type: 'success',
    message: 'Payment was successfully deleted!'
  })
  store.dispatch('getUser');

})
}
 }else{
  store.commit('notify', {
    type: 'success',
    message: 'No data selected to delete'
  })
 }

}

const formStatusWithHeader = ref(true);

const formStatusCurrent = ref(0);

const formStatusOptions = ["info" ];

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
};
function Back(){
store.dispatch("getUsers")
router.push('/users');

}




store.dispatch("getUser");

</script>

<template>

  <SectionMain>

    <SectionTitleLineWithButton
  >





    <BaseButton

    target="_blank"
   :icon="mdiArrowLeft"
   label="Back"
   color="contrast"
   rounded-full
   small
   @click="Back()"

  />



  </SectionTitleLineWithButton>





   <CardBox  >
    <div role="status" v-if="load">
      <OverlayLayer />
   </div>
      <div  class="lg:flex lg:flex-col-4 grid grid-cols-2 mb-20 items-center   bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">

      <img class="object-cover w-192 rounded-t-lg h-[200px] md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" :src="model.image_url" alt="">

      <div class="flex flex-col justify-between p-4 leading-normal">
           <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Full name: {{ model.name }}</h5>

      <p class="mb-3 font-bold font-serif text-gray-700 dark:text-gray-400">Phone number:  {{ model.phone }}</p>
      <p class="mb-3 font-bold font-serif text-gray-700 dark:text-gray-400">Email:  {{ model.email }}</p>
            <p class="mb-3 font-bold font-serif text-gray-700 dark:text-gray-400">Organization:  {{ model.organization }}</p>

      <p class="mb-3 font-bold font-serif text-gray-700 dark:text-gray-400" :class="[
        model.status != 0
          ? 'text-green-600'
          : 'text-red-600',

      ]">Status:
          {{ model.status != 0 ? "Active" : "In Active"}}

      </p>

      </div>
  </div>

  <form  @submit.prevent="createUser" autocomplete="off">


    <Date />

<div class="grid cols-span-6">

     <!-- Expire Date -->
     <FormField label="Expire Date" class="mt-5 "  >
      <FormControl
        type="date"
        name="day_left"
        id="day_left"
        v-model="model.day_left"
        class="mt-1 focus:ring-indigo-500   focus:border-indigo-500 block w-full shadow-sm sm:text-sm   rounded-md"
      />
    </FormField>
    <!--/ Expire Date -->

  </div>
<div>
  <div class="mt-6 grid grid-cols-4 mb-12"  >

    <!-- Status -->
    <div class="flex items-start" v-for="pl in model.plan" :key="pl.id">


      <div  v-if="pl.status == 0">

        <h1>Payment Avaliable</h1>


      <div class="flex items-center h-5">
        <input
          id="status"
          name="status"
          type="checkbox"
          v-model="pl.status"
          class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
      </div>
      <div class="ml-3 text-sm ">
        <label for="status" class="font-medium text-blue-700"
          >
          <NotificationBar
          color="danger"
          :icon="mdiCheckCircle"
          :outline="notificationsOutline"
        >
          <b>Need Approval</b>

        </NotificationBar>
          </label
        >

      </div>

    </div>
    <div v-else>
      <div class="flex items-center h-5">
        <input
          id="status"
          name="status"
          type="checkbox"
          v-model="pl.status"
          class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
      </div>
      <div class="ml-3 text-sm">
        <label for="status" class="font-medium text-green-700"
          >

        <NotificationBar
        color="success"
        :icon="mdiCheckCircle"
        :outline="notificationsOutline"
      >
        <b>  Approved</b>

      </NotificationBar>

          </label
        >

      </div>
      <div class="grid   gap-4      ">





        <FormField label="Enter price" class="mt-5 " help="Enter payment price ">
          <FormControl
             type="text"
             v-model="pl.price"

             placeholder="Enter price"
           />

        </FormField>



        </div>
    </div>
    </div>
  </div>

    <!--/ Status -->
    <div class="px-6 py-5  text-right mb-6 sm:px-6">


      <button :disabled="loading" type="submit" class="w-full flex justify-center py-2 px-3 border border-transparent rounded-md text-white font-medium bg-gray-700 shadow-sm sm:text-sm mb-10 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"

      :class="{'cursor-not-allowed': loading,'hover:bg-gray-700': loading,}"
      >
      <svg

             v-if="loading"
           class="animate-spin -ml-1 mr-3 h-5 w-5 text-white "
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

Submit Approval             </button>
    </div>

  </div>
  </form>

  <hr class="mb-5">


                <NotificationBarInCard
    :color="formStatusOptions[formStatusCurrent]"
    :is-placed-with-header="formStatusWithHeader"
    class=""
  >
  <div class="block ">
    <span
    >
     <h1  class="text-xl font-bold text-white float-left">

      User payment detail
    </h1>


     </span
  >

  <BaseButton
  :label=" model.plans"
  class="w-12 h-10 ml-6 rounded-full mr-6"

  />
  <BaseButton

   class="w-[200px] float-left sm:ssm:msm:mt-3 md:float-right lg:float-right"
   :icon="  mdiTrashCanOutline "
  label="Delete selected"
  color="contrast"
  rounded-full
  small
  @click="deleteUserPayment(checked)"

 />



   </div>

  </NotificationBarInCard>

  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">

    <table v-if="model.plan.length" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">

        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="p-4">
                    <div class="flex items-center">

               <input type='checkbox' @click='checkAll()' v-model='isCheckAll'>


                        <label for="checkbox-all-search" class="sr-only">checkbox</label>
                    </div>
                </th>
                <th scope="col" class="px-6 py-3">
                    Receipt  Image
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
                <div>

                <th scope="col" class="px-6 py-3">
                  Price
              </th>

                </div>
                <th scope="col" class="px-6 py-3">
                  Created At
              </th>
              <th scope="col" class="px-6 py-3">
               Updated At
            </th>
          </tr>
        </thead>


         <tbody   >
            <tr class="bg-white border-b dark:bg-gray-800   hover:bg-gray-50 dark:hover:bg-gray-600"
            v-for="item in model.plan" :key="item.id">

                <td class="w-4 p-4">
                    <div class="flex items-center">
              <input type='checkbox' :value='item' v-model='checked' @change='updateCheckall()'>

                        <label for="checkbox-table-search-1" class="sr-only">checkbox</label>


                    </div>
                </td>
                <td class="border-b-0 lg:w-6 before:hidden">
                  <div class="relative w-12 h-12 transition-all  rounded-md transform hover:scale-125">


                    <a
                    :href="item.image_url"
                    target="_blank"
                   >
                  <img class="shadow-lg rounded-full max-w-full h-auto align-middle border-none"  :src="item.image_url" alt="user image" />

                  </a>
                  </div>
                </td>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <td data-label="Status"  class="m-2"
                  :class="[
                    item.status != 0
                      ? 'text-green-600'
                      : 'text-red-600',

                  ]"
                  >
                  {{ item.status != 0 ? "Approved" : "Need Approval"}}
                </td>
                </th>


                <td class="px-6 py-4">
                    {{ item.price }}
                </td>


              <td class="px-6 py-4">
                {{ item.created_at }}
            </td>
            <td class="px-6 py-4">
              {{ item.updated_at }}
          </td>
            </tr>

        </tbody>
    </table>
    <div v-else class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
      <div class="flex">
        <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
        <div>
          <p class="font-bold">Ooops Their is Something Error</p>
          <p class="text-sm">Their is no data found here.</p>
        </div>
      </div>
    </div>

</div>
</CardBox>
</SectionMain>

</template>
