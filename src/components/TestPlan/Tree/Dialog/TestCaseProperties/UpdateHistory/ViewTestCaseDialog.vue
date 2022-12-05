<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" full-width>
    <q-layout view="hHh lpR fFf" :class="isDark ? 'bg-grey-9' : 'bg-grey-3'" container>
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">{{ TestCaseHistory.TestCase.CodeName }}: {{ TestCaseHistory.TestCase.Name }}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="items-stretch">
        <test-case-table :TestCaseHistory="TestCaseHistory"></test-case-table>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'ViewTestCaseDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { useGlobalStore } from '../../../../../../pinia/globalStore';
import { TestCaseHistoryInterface } from '../../../../../../Models/TestCaseHistory';
import TestCaseTable from './_TestCaseTable.vue';

const props = defineProps<{
  TestCaseHistory: TestCaseHistoryInterface;
}>();

const globalStore = useGlobalStore();

const isDark = computed(() => globalStore.darkTheme);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();
</script>
<style scoped lang="scss">
:deep(.scroll) {
  height: 100%;
}
</style>
