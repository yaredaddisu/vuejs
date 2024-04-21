<script setup>
import { computed, onMounted,ref} from "vue";
import { mdiClose,  mdiHelpCircle 
 } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";

import axiosClient from "../axios.js";

 
 
const social = ref(0);

const loading = ref({
 
 
  social: true,

});

 

function updateDashboard(){

   loading.value = {
   
    social: true,

  }
  };


  axiosClient.get(`/get-help`, { }).then(({data}) => {
    social.value = data
    loading.value.social = false;
  })

  
onMounted(() => {
 
  updateDashboard();
})
 
 
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  button: {
    type: String,
    default: "info",
  },
  buttonLabel: {
    type: String,
    default: "Done",
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};

const confirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("cancel");

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && value.value) {
    cancel();
  }
});
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="cancel">
    <CardBox
      v-show="value"
      class="overflow-auto bg shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-100 z-40"
      is-modal
    >
      <CardBoxComponentTitle :title="title">
        <BaseButton
          v-if="hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
       
      </CardBoxComponentTitle>
      <hr>
      <div class="space-y-3 mt-6 " v-for="data in social.data" :key="data.id">
        <p class="text-semibold text-xl">{{ data.help}}</p>
        <slot />
      </div>

      <template #footer>
        <BaseButtons>
          <BaseButton :label="buttonLabel" :color="button" @click="confirm" />
        
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
