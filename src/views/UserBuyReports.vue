<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
  mdiArrowBottomLeft,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import TableUserBuyReports from "@/components/TableUserBuyReports.vue";
import FormField from "@/components/FormField.vue";
import router from "@/router";
import store from "../store";

const isModalActive = ref(false);

const use = computed(() => store.state.user.data);

function addUser() {
  router.go(-1);
}
</script>

<template>
  <CardBoxModal v-model="isModalActive" has-cancel> </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAccountPlus"
        title="User Purchase Reports"
        main
      >
        <BaseButton
          target="_blank"
          :icon="mdiArrowBottomLeft"
          label="Back"
          color="contrast"
          rounded-full
          small
          @click="addUser()"
        />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TableUserBuyReports checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
