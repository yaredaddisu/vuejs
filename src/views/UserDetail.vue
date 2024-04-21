<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import UserDetailTable from "@/components/UserDetailTable.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
 
const isModalActive = ref(false);



</script>

<template>
   


  <CardBoxModal v-model="isModalActive"     has-cancel
   >
  
    </CardBoxModal>
  <LayoutAuthenticated>
    
    <SectionMain>
    
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="User Payment Detail" main>
        
        
        
        
      </SectionTitleLineWithButton>
 
      <CardBox class="mb-6" has-table>
        <UserDetailTable  checkable />
      </CardBox>

 
     

      
    </SectionMain>
  </LayoutAuthenticated>
</template>
