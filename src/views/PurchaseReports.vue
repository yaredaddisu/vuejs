<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountBoxMultiple,
  mdiCameraImage,
  mdiPlus,
  mdiCartArrowDown,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TablePurchaseReports from "@/components/TablePurchaseReports.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import store from "../store";
import OverlayLayer from "@/components/OverlayLayer.vue";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();

const router = useRouter();

//store.dispatch("getLogos");

function Purchase() {
  //store.dispatch("getLogos");
  router.push("/user-buy-reports/${route.params.id}");
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiCartArrowDown"
        title="Purchases Reports
      "
        main
      >
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TablePurchaseReports checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
