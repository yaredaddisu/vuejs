<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
  mdiChartBarStacked
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableOrderDetail from "@/components/TableOrderDetail.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import FormField from "@/components/FormField.vue";

const isModalActive = ref(false);
 import store from "../store";


function Reload(){
  store.dispatch('getDetails' );

}
</script>

<template>
   


  <CardBoxModal v-model="isModalActive"     has-cancel
   >
  
    </CardBoxModal>
  <LayoutAuthenticated>
    
    <SectionMain>
    
      <SectionTitleLineWithButton :icon="mdiChartBarStacked" title="  Sales Report
      " main>
        
      <BaseButton
      color="lightDark"
     label="Reload "  
     :icon="mdiOpenInNew"
     :small="buttonsSmall"
     :outline="buttonsOutline"
     :disabled="buttonsDisabled"
     :rounded-full="buttonsRounded"
    @click="Reload()"
    />
     
        
      </SectionTitleLineWithButton>
    

      <CardBox class="mb-6" has-table>
        <TableOrderDetail checkable />
      </CardBox>

 
     

      
    </SectionMain>
  </LayoutAuthenticated>
</template>
