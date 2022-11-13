<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" fullHeight>
    <q-layout view="hHh lpR fFf" :class="isDark ? 'bg-grey-9' : 'bg-grey-3'" style="max-width: 1200px; min-height: 400px !important" container>
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">{{ DevRunRecord.TestCaseCodeName }}: {{ DevRunRecord.TestCaseName }}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="q-pa-sm">
        <q-splitter v-model="splitterModel" style="height: 400px">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical no-caps dense>
              <q-tab name="all" label="All" class="bg-primary text-left q-mb-xs" />
              <q-tab
                v-for="testStep in DevRunRecord.TestSteps"
                :key="testStep.UUID"
                :name="testStep.UUID"
                :label="testStep.Keyword.Name"
                class="text-left q-mb-xs"
                :class="bg_status(testStep.Status)"
              />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels v-model="tab" animated swipeable vertical>
              <q-tab-panel name="all">
                <div style="white-space: pre-wrap">
                  {{ DevRunRecord.Log }}
                </div>
              </q-tab-panel>
              <q-tab-panel v-for="testStep in DevRunRecord.TestSteps" :key="testStep.UUID" :name="testStep.UUID">
                <div class="container">
                  <div class="horizontally-scrolled-items">
                    <q-input
                      v-for="param in testStep.Params"
                      :key="param.Name"
                      v-model="param.Value"
                      :label="param.Name"
                      dense
                      readonly
                      class="item q-mr-xs"
                      outlined
                    ></q-input>
                  </div>
                </div>
                <q-separator color="primary" inset class="q-mt-xs q-mb-xs q-mr-none q-ml-none" />
                <div class="row" v-if="testStep.Log">
                  <q-space></q-space>
                  <q-btn flat color="primary" icon="content_copy" label="Copy" @click="copy(testStep.Log)" size="sm" />
                </div>
                <div class="row" style="white-space: pre-wrap">
                  {{ testStep.Log }}
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-page-container>
      <q-footer bordered class="bg-secondary text-white" style="height: 24px; width: -webkit-fill-available">
        <div class="row justify-between items-center">
          <div @click="copy(footerInfo)" class="q-pl-sm">
            {{ footerInfo }}
          </div>
          <div class="q-pr-sm">{{ footerInfo }}</div>
        </div>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { DevRunRecordInterface } from '../../../Models/DevRunRecord';
import { computed, ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useGlobalStore } from '../../../pinia/globalStore';
import { TestStatus } from '../../../Models/TestStatus';

const props = defineProps<{
  DevRunRecord: DevRunRecordInterface;
}>();
const emit = defineEmits([...useDialogPluginComponent.emits]);

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.darkTheme);
// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const { copy } = useClipboard();

const footerInfo = ref('');
const splitterModel = ref(15);
const tab = ref('all');

function bg_status(status: TestStatus) {
  switch (status) {
    case TestStatus.Passed:
      return 'bg-green-6';
    case TestStatus.Failed:
      return 'bg-red-12';
    case TestStatus.Running:
      return 'bg-grey-6';
    default:
      return '';
  }
}
</script>

<style lang="scss" scoped>
.text-left {
  justify-content: left;
}
.container {
  display: flex;
}
.horizontally-scrolled-items {
  display: flex;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
}
.item {
  min-width: 100px;
}
</style>
