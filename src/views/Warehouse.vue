<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiHome,
} from "@mdi/js";
import CardBoxHouse from "@/components/CardBoxHouse.vue";
import SectionMain from "@/components/SectionMain.vue";
import TableHouse from "@/components/TableHouse.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import { computed, ref } from "vue";
import WareHouseView from "@/views/WareHouseView.vue";
import store from "../store";

const props = defineProps({
  isModalDangerActive: Boolean,
});

const isModalDangerActive = ref(false);

let showModal = ref(false);

function openModal() {
  showModal.value = !showModal.value;
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <nav class=" ">
        <div class="flex flex-wrap items-center justify-between">
          <SectionTitleLineWithButton :icon="mdiHome" title="Warehouse" main>
          </SectionTitleLineWithButton>
          <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <BaseButton
              target="_blank"
              :icon="mdiHome"
              label="Add  Warehouse"
              color="contrast"
              rounded-full
              small
              @click="openModal()"
            />
          </div>
        </div>
      </nav>

      <CardBoxHouse
        v-if="showModal"
        @openModal="openModal"
        title="Create Warehouse "
        has-cancel
      >
        <WareHouseView />
      </CardBoxHouse>

      <CardBox class="mb-6" has-table>
        <TableHouse checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
