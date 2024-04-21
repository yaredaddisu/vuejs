<script setup>
import {
  mdiMonitorCellphone,
  mdiTableBorder,
  mdiTableOff,
  mdiGithub,
  mdiAccountPlus,
} from "@mdi/js";
import CardBoxMember from "@/components/CardBoxMember.vue";
import SectionMain from "@/components/SectionMain.vue";
import TableClients from "@/components/TableClients.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import { computed, ref } from "vue";
import EditMember from "./EditMember.vue";
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
          <SectionTitleLineWithButton :icon="mdiAccountPlus" title="Suppliers" main>
          </SectionTitleLineWithButton>
          <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <BaseButton
              target="_blank"
              :icon="mdiAccountPlus"
              label="Add  Supplier"
              color="contrast"
              rounded-full
              small
              @click="openModal()"
            />
          </div>
        </div>
      </nav>

      <CardBoxMember
        v-if="showModal"
        @openModal="openModal"
        title="Create Supplier "
        has-cancel
      >
        <EditMember />
      </CardBoxMember>

      <CardBox class="mb-6" has-table>
        <TableClients checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
