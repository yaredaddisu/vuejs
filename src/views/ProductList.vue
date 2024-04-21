<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
  mdiShapePlus,
  mdiStoreMarkerOutline,
} from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableProductList from "@/components/TableProductList.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const isModalActive = ref(false);

function addProduct() {
  router.push("/product-list/create");
}
</script>

<template>
  <CardBoxModal v-model="isModalActive" has-cancel> </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiStoreMarkerOutline"
        title="Product List
      "
        main
      >
        <BaseButton
          target="_blank"
          :icon="mdiShapePlus"
          label="Add  Product"
          color="contrast"
          rounded-full
          small
          @click="addProduct()"
        />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6" has-table>
        <TableProductList checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
