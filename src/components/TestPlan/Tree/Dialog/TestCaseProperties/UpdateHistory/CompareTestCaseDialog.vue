<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" full-width>
    <q-layout view="hHh lpR fFf" :class="isDark ? 'bg-grey-9' : 'bg-grey-3'" container>
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Compare test case</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <test-case-table :TestCase="FirstCompareTestCaseHistory.TestCase"></test-case-table>
          </template>
          <template v-slot:after>
            <test-case-table :TestCase="SecondCompareTestCaseHistory.TestCase"></test-case-table>
          </template>
        </q-splitter>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'CompareTestCaseDialog',
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
  FirstCompareTestCaseHistory: TestCaseHistoryInterface;
  SecondCompareTestCaseHistory: TestCaseHistoryInterface;
}>();
const splitterModel = ref(50);
const globalStore = useGlobalStore();

const isDark = computed(() => globalStore.darkTheme);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();
</script>
