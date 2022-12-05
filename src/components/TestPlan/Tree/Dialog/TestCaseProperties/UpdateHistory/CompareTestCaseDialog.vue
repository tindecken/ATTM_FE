<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" full-width>
    <q-layout view="hHh lpR fFf" :class="isDark ? 'bg-grey-9' : 'bg-grey-3'" container>
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Compare test case</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <q-scroll-area visible :style="`width: ${qScrollWidth}px; height: ${qScrollHeight}px`" ref="firstRef" @scroll="onScrollFirst">
              <test-case-table :width="`${qScrollWidth}px`" :height="`${qScrollHeight}px`" :TestCaseHistory="FirstCompareTestCaseHistory"></test-case-table>
            </q-scroll-area>
          </template>

          <template v-slot:after>
            <q-scroll-area visible :style="`width: ${qScrollWidth}px; height: ${qScrollHeight}px`" class="row" ref="secondRef" @scroll="onScrollSecond">
              <test-case-table :width="`${qScrollWidth}px`" :height="`${qScrollHeight}px`" :TestCaseHistory="SecondCompareTestCaseHistory"></test-case-table>
            </q-scroll-area>
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
import { computed, onMounted, Ref, ref } from 'vue';
import { QLayout, useDialogPluginComponent, useQuasar } from 'quasar';
import { useGlobalStore } from '../../../../../../pinia/globalStore';
import { TestCaseHistoryInterface } from '../../../../../../Models/TestCaseHistory';
import TestCaseTable from './_TestCaseTable.vue';
import { dom } from 'quasar';
const { height, width } = dom;

const props = defineProps<{
  FirstCompareTestCaseHistory: TestCaseHistoryInterface;
  SecondCompareTestCaseHistory: TestCaseHistoryInterface;
}>();
const splitterModel = ref(50);
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.darkTheme);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const qScrollWidth = computed(() => width(dialogRef.value.$el) / 2 - 25);
const qScrollHeight = computed(() => height(dialogRef.value.$el) - 100);

const $q = useQuasar();
const firstRef = ref(null);
const secondRef = ref(null);

let ignoreSource;
function scroll(source, position) {
  // if we previously just updated
  // the scroll position, then ignore
  // this update as otherwise we'll flicker
  // the position from one scroll area to
  // the other in an infinite loop
  if (ignoreSource === source) {
    ignoreSource = null;
    return;
  }

  // we'll now update the other scroll area,
  // which will also trigger a @scroll event...
  // and we need to ignore that one
  ignoreSource = source === 'first' ? 'second' : 'first';

  const areaRef = source === 'first' ? secondRef : firstRef;

  areaRef.value.setScrollPosition('vertical', position);
  areaRef.value.setScrollPosition('horizontal', position);
}

function onScrollFirst({ verticalPosition, horizontalPosition }) {
  scroll('first', verticalPosition);
  scroll('first', horizontalPosition);
}

function onScrollSecond({ verticalPosition, horizontalPosition }) {
  scroll('second', verticalPosition);
  scroll('second', verticalPosition);
}
</script>
