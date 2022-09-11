<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div>
        <q-select
          dense
          :model-value="selectedRegression"
          :options="filteredRegressions"
          option-label="Name"
          label="Regression"
          outlined
          @update:model-value="onChangeRegression($event)"
          @filter="filterRegressionFn"
          input-debounce="0"
          use-input
          fill-input
          hide-selected
          options-dense
        />
      </div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <div class="row q-gutter-xs">
          <!-- <q-select
            dense
            clearable
            clear-icon="close"
            outlined
            name="Category"
            style="min-width: 150px"
            label="Category"
            v-model="selectedCategory"
            :options="categorySelections"
            @update:model-value="onCategoryValueChange($event)"
            fill-input
            options-dense
          />
          <q-select
            dense
            clearable
            clear-icon="close"
            outlined
            name="TestSuite"
            v-model="selectedTestSuite"
            :options="testSuiteSelections"
            @input="val => { onTestSuiteValueChange($event) }"
            color="primary"
            label="Test Suite"
            style="min-width: 150px"
          />
          <q-select
            dense
            clearable
            clear-icon="close"
            outlined
            name="TestGroup"
            v-model="selectedTestGroup"
            :options="testGroupSelections"
            @input="val => { onTestGroupValueChange($event) }"
            color="primary"
            label="Test Group"
            style="min-width: 150px"
          />
          <q-select
            dense
            clearable
            clear-icon="close"
            outlined
            name="Client"
            v-model="selectedTestClient"
            :options="testClientSelections"
            @input="val => { onTestClientValueChange($event) }"
            color="primary"
            label="Client"
            style="min-width: 150px"
          /> -->
          <q-input
            dense
            clearable
            clear-icon="close"
            outlined
            v-model="testCaseFilterText"
            label="Test Case"
            style="min-width: 300px"
            @keyup.enter="testCaseFilterFunc()"
            @keyup.esc="clearFilter()"
          />
          <q-btn outline color="primary" label="Filter" style="min-width: 100px" @click="testCaseFilterFunc()" />
          <q-btn outline color="secondary" label="Clear Filter" @click="clearFilter()" />
        </div>
      </div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <q-tabs
          v-model="selectedTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          inline-label
          separator="cell"
          narrow-indicator
        >
          <q-tab class="text-primary" name="all" label="All">
            <q-badge outline color="primary" floating>{{ allCount }}</q-badge>
          </q-tab>
          <q-tab class="text-negative" name="failed" label="Failed">
            <q-badge outline color="negative" floating>{{ failedCount }}</q-badge>
          </q-tab>
          <q-tab class="text-positive" name="passed" label="Passed">
            <q-badge outline color="positive" floating>{{ passedCount }}</q-badge>
          </q-tab>
          <q-tab class="text-info" name="inQueue" label="In Queue">
            <q-badge outline color="info" floating>{{ inQueueCount }}</q-badge>
          </q-tab>
          <q-tab class="text-secondary" name="running" label="Running">
            <q-badge outline color="secondary" floating>{{ runningCount }}</q-badge>
          </q-tab>
          <q-tab class="text-negative" name="analyseFailed" label="Analyse Failed">
            <q-badge outline color="negative" floating>{{ analyseFailedCount }}</q-badge>
          </q-tab>
          <q-tab class="text-positive" name="analysePassed" label="Analyse Passed">
            <q-badge outline color="positive" floating>{{ analysePassedCount }}</q-badge>
          </q-tab>
          <q-tab class="text-info" name="inCompatible" label="InCompatible">
            <q-badge outline color="info" floating>{{ inCompatibleCount }}</q-badge>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="selectedTab" animated keep-alive>
          <q-tab-panel name="all">
            <all-table filterTestCase=""></all-table>
          </q-tab-panel>
          <q-tab-panel name="failed"> </q-tab-panel>
          <q-tab-panel name="passed"> </q-tab-panel>
          <q-tab-panel name="inQueue"> </q-tab-panel>
          <q-tab-panel name="running"> </q-tab-panel>
          <q-tab-panel name="analyseFailed">
            <analyse-failed-table filterTestCase=""></analyse-failed-table>
          </q-tab-panel>
          <q-tab-panel name="analysePassed"> </q-tab-panel>
          <q-tab-panel name="inCompatible"> </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, Ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useTitle } from '@vueuse/core';
import { useRegressionStore } from '../../../pinia/regressionStore';
import { RegressionInterface } from '../../../Models/Regression';
import { RegressionTestInterface } from '../../../Models/RegressionTest';
import { useRegMonitoringStore } from '../../../pinia/regMonitoring';
import AnalyseFailedTable from './DataTables/AnalyseFailedTable.vue';
import AllTable from './DataTables/AllTable.vue';
import { FindRegressionTestDataInterface } from '../../../Models/Entities/FindRegressionTestData';

useTitle('Regression Monitoring');
const regressionStore = useRegressionStore();
const regMonitoringStore = useRegMonitoringStore();
const $q = useQuasar();
const regressions = computed(() => regressionStore.regressions);
const selectedRegression = computed(() => regressionStore.selectedRegression);
const regTests = computed(() => regMonitoringStore.regTests);
const allCount = computed(() => regMonitoringStore.regTests?.length);
const failedCount = computed(() => {
  const all = regMonitoringStore.regTests;
  return all.filter((r: RegressionTestInterface) => r.Status === 'Failed').length;
});
const passedCount = computed(() => {
  const all = regMonitoringStore.regTests;
  return all.filter((r: RegressionTestInterface) => r.Status === 'Passed').length;
});
const inQueueCount = computed(() => {
  const all = regMonitoringStore.regTests;
  return all.filter((r: RegressionTestInterface) => r.Status === 'InQueue').length;
});
const runningCount = computed(() => {
  const all = regMonitoringStore.regTests;
  return all.filter((r: RegressionTestInterface) => r.Status === 'Running' || r.Status === 'Inconclusive').length;
});
const analyseFailedCount = computed(() => {
  const all = regMonitoringStore.regTests;
  return all.filter((r: RegressionTestInterface) => r.Status === 'AnalyseFailed').length;
});
const analysePassedCount = computed(() => {
  const all = regMonitoringStore.regTests;
  return all.filter((r: RegressionTestInterface) => r.Status === 'AnalysePassed').length;
});
const inCompatibleCount = computed(() => {
  const all = regMonitoringStore.regTests;
  return all.filter((r: RegressionTestInterface) => r.Status === 'InCompatible').length;
});
const filteredRegressions: Ref<RegressionInterface[]> = ref([]);
const selectedTab = ref('all');
const testCaseFilterText = ref('');
onBeforeMount(async () => {
  try {
    await regressionStore.getRegressions();
    if (selectedRegression.value) {
      await regMonitoringStore.getRegressionDetail(selectedRegression.value.Id);
    }
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
});
onMounted(() => {
  filteredRegressions.value = regressions.value;
});
async function onChangeRegression(regression: RegressionInterface) {
  regressionStore.selectedRegression = regression;
  await regMonitoringStore.getRegressionDetail(regression.Id);
}
function filterRegressionFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    filteredRegressions.value = regressions.value.filter((reg: RegressionInterface) => reg.Name.toLowerCase().indexOf(needle) > -1);
  });
}
async function clearFilter() {
  testCaseFilterText.value = '';
  if (selectedRegression.value) {
    await regMonitoringStore.getRegressionDetail(selectedRegression.value.Id);
  }
}
function testCaseFilterFunc() {
  // TODO
  if (testCaseFilterText.value === '' || testCaseFilterText.value === null) {
    void clearFilter();
  } else {
    const payload: FindRegressionTestDataInterface = {
      RegressionId: selectedRegression.value.Id,
      Name: testCaseFilterText.value,
    };
    regMonitoringStore.findRegressionTest(payload).catch((error) => {
      console.log('error', error);
      $q.notify({
        type: 'negative',
        message: error.message ? error.message : error.error,
      });
    });
  }
}
</script>

<style scoped lang="scss">
:deep(.q-tab__label) {
  padding-right: 15px;
}
</style>
