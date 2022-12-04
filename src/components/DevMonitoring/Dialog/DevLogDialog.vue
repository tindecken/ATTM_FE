<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" fullHeight :maximized="maximizedToggle">
    <q-layout view="hHh lpR fFf" :class="isDark ? 'bg-grey-9' : 'bg-grey-3'" style="min-width: 1200px; min-height: 400px !important" container>
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">{{ DevRunRecord.TestCaseCodeName }}: {{ DevRunRecord.TestCaseName }}</div>
        <q-btn flat icon="refresh" label="Refresh" @click="refresh()" />
        <div>
          <q-btn class="self-center" dense flat icon="maximize" @click="maximizedToggle = !maximizedToggle">
            <q-tooltip style="font-size: small">Maximized/Restore</q-tooltip>
          </q-btn>
          <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
            <q-tooltip style="font-size: small">Close</q-tooltip>
          </q-btn>
        </div>
      </q-header>
      <q-page-container class="q-pa-sm">
        <q-splitter v-model="splitterModel" class="q-mt-xs">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical no-caps dense>
              <q-tab name="all" class="bg-primary text-left q-mb-xs qtab">
                <div class="row justify-between" style="width: 100%">
                  <div>All Steps</div>
                  <q-icon v-if="DevRunRecord.ErrorScreenshotId" name="image" class="self-center" />
                </div>
              </q-tab>
              <q-tab name="buffer" label="Buffers" class="bg-primary text-left q-mb-xs" />
              <template v-for="testStep in DevRunRecord.TestSteps" :key="testStep.UUID">
                <q-tab v-if="testStep.Keyword.Name" :name="testStep.UUID" class="q-mb-xs qtab" :class="bg_status(testStep.Status)">
                  <div class="row justify-between" style="width: 100%">
                    <div>{{ testStep.Keyword.Name }}</div>
                    <q-icon v-if="testStep.ErrorScreenshotId || testStep.ScreenshotIds.length > 0" name="image" class="self-center" />
                  </div>
                </q-tab>
              </template>
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels v-model="tab" animated vertical>
              <q-tab-panel name="all">
                <div class="row" v-if="DevRunRecord.Log">
                  <q-space></q-space>
                  <q-btn flat color="primary" icon="content_copy" label="Copy" @click="copy(DevRunRecord.Log)" size="sm" />
                </div>
                <div class="row" style="white-space: pre-wrap">
                  {{ DevRunRecord.Log }}
                </div>
                <template v-if="DevRunRecord.ErrorScreenshotId">
                  <div>Error Screenshot:</div>
                  <show-screenshot :screenshotId="DevRunRecord.ErrorScreenshotId" class="q-mt-sm q-mb-sm"></show-screenshot>
                </template>
              </q-tab-panel>
              <q-tab-panel name="buffer">
                <q-table :rows="getBuffers(DevRunRecord.Buffers)" :columns="bufferColumns" row-key="name" dense separator="cell" />
              </q-tab-panel>
              <q-tab-panel v-for="testStep in DevRunRecord.TestSteps" :key="testStep.UUID" :name="testStep.UUID">
                <div class="container">
                  <div class="horizontally-scrolled-items">
                    <template v-for="param in testStep.Params" :key="param.Name">
                      <q-input dense readonly class="item q-mr-xs" outlined v-if="param.Value" :label="param.Name" v-model="param.Value"></q-input>
                    </template>
                  </div>
                </div>
                <q-separator color="primary" inset class="q-mt-xs q-mb-xs q-mr-none q-ml-none" />
                <div class="row q-mb-sm" v-if="testStep.Log">
                  <q-space></q-space>
                  <span class="self-center">Execute Time: {{ testStep.ExecuteTime }} seconds</span>
                  <q-btn flat color="primary" icon="content_copy" label="Copy" @click="copy(testStep.Log)" class="q-ml-sm" size="sm" />
                </div>
                <div class="row q-mb-sm">
                  <div style="white-space: pre-wrap">{{ testStep.Log }}</div>
                </div>
                <template v-if="testStep.ErrorScreenshotId">
                  <div>Error Screenshot:</div>
                  <show-screenshot :screenshotId="testStep.ErrorScreenshotId" class="q-mt-sm q-mb-sm"></show-screenshot>
                </template>

                <template v-if="testStep.ScreenshotIds.length > 0">
                  <div>{{ testStep.ScreenshotIds.length }} screenshot(s):</div>
                  <show-screenshot
                    v-for="screenShotId in testStep.ScreenshotIds"
                    :key="screenShotId"
                    :screenshotId="screenShotId"
                    class="q-mt-sm q-mb-sm"
                  ></show-screenshot>
                </template>
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
import { useDialogPluginComponent, date } from 'quasar';
import { DevRunRecordInterface } from '../../../Models/DevRunRecord';
import { computed, ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useGlobalStore } from '../../../pinia/globalStore';
import { TestStatus } from '../../../Models/TestStatus';
import { useDevMonitoringStore } from '../../../pinia/devMonitoringStore';
import { useQuasar } from 'quasar';
import { getScreenshot } from '../Utils/utils';
import ShowScreenshot from './ShowScreenshot.vue';

const bufferColumns = [
  {
    name: 'key',
    required: true,
    label: 'Key',
    align: 'left',
    field: 'key',
    format: (val) => `${val}`,
    sortable: true,
    style: 'max-width: 100px',
    headerStyle: 'max-width: 100px',
  },
  { name: 'value', align: 'left', label: 'Value', field: 'value', sortable: true },
];

const maximizedToggle = ref(false);
const props = defineProps<{
  DevRunRecordProp: DevRunRecordInterface;
}>();
const emit = defineEmits([...useDialogPluginComponent.emits]);

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.darkTheme);
const devMonitoringStore = useDevMonitoringStore();
const $q = useQuasar();
// REQUIRED; must be called inside of setup()
const { dialogRef, onDialogHide } = useDialogPluginComponent();
const { copy } = useClipboard();

const splitterModel = ref(15);
const tab = ref('all');
const DevRunRecord = ref<DevRunRecordInterface>(props.DevRunRecordProp);
const footerInfo = computed(() => {
  return `Staus: ${TestStatus[DevRunRecord.value.Status]} - Start At: ${date.formatDate(
    DevRunRecord.value.StartAt,
    'YYYY-MM-DD HH:mm:ss'
  )} - End At: ${date.formatDate(DevRunRecord.value.EndAt, 'YYYY-MM-DD HH:mm:ss')} - Duration: ${DevRunRecord.value.ExecuteTime} seconds`;
});

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
function refresh() {
  devMonitoringStore
    .getLastDevRunRecordOfTestCase(DevRunRecord.value.TestCaseId)
    .then((res: any) => {
      DevRunRecord.value = res.data;
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.message ? error.message : error.error,
      });
    });
}
function getBuffers(buffers: any) {
  const result: any[] = [];
  for (const key in buffers) {
    result.push({ key: key, value: buffers[key] });
  }
  return result;
}

async function getScreenshotUrl(screenshotId: string) {
  let url: any;
  getScreenshot(screenshotId)
    .then((blob: any) => {
      url = URL.createObjectURL(blob);
      return url;
    })
    .catch((error: any) => {
      $q.notify({
        type: 'negative',
        message: error.message ? error.message : error.error,
      });
    });
}
</script>

<style scoped>
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
.qtab::v-deep .q-tab__content {
  width: 100%;
  align-items: flex-start;
}
</style>
