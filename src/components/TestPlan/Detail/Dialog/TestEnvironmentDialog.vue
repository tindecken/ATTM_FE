<template>
  <q-dialog ref="dialogRef" @hide="onDialogCancel" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 900px; min-height: 100px !important; min-width: 800px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Select Test Environment</div>
        <q-btn dense flat icon="close" @click="onDialogCancel">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <div class="row q-col-gutter-xs q-pa-xs">
          <div class="col">
            <q-input dense outlined v-model="testEnvFilter" label="Filter" />
          </div>
          <div class="col">
            <q-select
              dense
              outlined
              :model-value="selectedTestEnv"
              :options="testEnvs"
              label="Environments"
              option-label="Name"
              @update:model-value="onTestEnvChange($event)"
              :readonly="isReadonly"
            />
          </div>
        </div>
        <q-separator class="q-mb-sm q-mt-sm" />
        <div class="row">
          <div class="col q-pa-xs">
            <q-table
              dense
              title="Test Environment"
              :rows="selectedTestEnv?.Nodes"
              :columns="testEnvColumns"
              row-key="name"
              :filter="testEnvFilter"
              separator="cell"
              :pagination="initialPagination"
              :visible-columns="visibleColumns"
            >
              <template v-slot:top>
                <div class="col-6 q-table__title">Test Environment</div>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props" class="cursor-pointer">
                  <q-td key="no" :props="props">
                    {{ props.row.rowIndex }}
                  </q-td>
                  <q-td key="category" :props="props" @click="footerInfo = props.row.Category">
                    {{ props.row.Category }}
                  </q-td>
                  <q-td key="name" :props="props" style="white-space: normal" @click="footerInfo = props.row.Name">
                    <div>{{ props.row.Name }}</div>
                  </q-td>
                  <q-td key="value" :props="props" @click="footerInfo = props.row.Value">
                    <q-tooltip v-if="props.row.Value !== ''" style="font-size: small">
                      {{ props.row.Value }}
                    </q-tooltip>
                    {{ props.row.Value }}
                  </q-td>
                  <q-td key="description" :props="props" @click="footerInfo = props.row.Description">
                    <q-tooltip v-if="props.row.Description !== ''" style="font-size: small">
                      {{ props.row.Description }}
                    </q-tooltip>
                    {{ props.row.Description }}
                  </q-td>
                  <q-td key="use" :props="props">
                    <q-btn size="sm" outline @click="use(props.row)">Use</q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-page-container>
      <q-footer bordered class="bg-secondary text-white" style="height: 24px; width: -webkit-fill-available">
        <div class="row inline justify-between items-center">
          <span @click="copy(footerInfo)" class="q-pl-sm">{{ footerInfo }}</span>
        </div>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeMount, Ref, ref } from 'vue';
import { TestEnvInterface, TestEnvNodeInterface } from '../../../../Models/TestEnv';
import { useClipboard } from '@vueuse/core';
import { useTestEnvironmentStore } from '../../../../pinia/testEnvironmentStore';
import { useQuasar, useDialogPluginComponent } from 'quasar';
import { testEnvColumns } from '../../../../components/tableColumns';
import { useGlobalStore } from '../../../../pinia/globalStore';

const globalStore = useGlobalStore();
const testEnvironmentStore = useTestEnvironmentStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const $q = useQuasar();
const { copy } = useClipboard();
const footerInfo = ref('');
const isReadonly: Ref<boolean> = ref(false);
const visibleColumns: Ref<string[]> = ref(['no', 'category', 'name', 'value', 'description', 'use']);
const initialPagination = {
  sortBy: 'startAt',
  descending: true,
  rowsPerPage: 50,
  // page: 2,
  // rowsNumber: xx if getting data from a server
};
const testEnvFilter = ref('');
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const isDark = computed(() => globalStore.darkTheme);
const selectedTestEnv = ref<TestEnvInterface>(testEnvironmentStore.selectedTestEnv as TestEnvInterface);
const testEnvs = testEnvironmentStore.testEnvs as TestEnvInterface[];
onBeforeMount(async () => {
  try {
    await testEnvironmentStore.getTestEnvironments();
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
  void (await nextTick());
  if (selectedTestEnv.value) {
    selectedTestEnv.value.Nodes = selectedTestEnv.value?.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
      ...envNode,
      rowIndex: i + 1,
    }));
  }
});

function onTestEnvChange(newTestEnv: TestEnvInterface) {
  testEnvironmentStore.selectedTestEnv = newTestEnv;
  selectedTestEnv.value = newTestEnv;
  selectedTestEnv.value.Nodes = selectedTestEnv.value?.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
    ...envNode,
    rowIndex: i + 1,
  }));
}

// other methods that we used in our vue html template;
// these are part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}

function use(testEnvNode: TestEnvNodeInterface) {
  onDialogOK(testEnvNode);
}
</script>
<style scoped lang="scss">
:deep(.q-c-input) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
}
</style>
