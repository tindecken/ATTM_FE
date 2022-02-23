<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col">
        <q-select
          dense
          v-model="selectedRegression"
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
      <div class="col"></div>
      <div class="col"></div>
      <div class="col"></div>
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
          <q-input dense clearable clear-icon="close" outlined v-model="testCaseFilterText" label="Test Case" style="min-width: 300px" @keyup.enter="testCaseFilterFunc()" @keyup.esc="clearFilter()"/>
          <q-btn outline color="primary" label="Filter" style="min-width: 100px" @click="testCaseFilterFunc()"/>
          <q-btn outline color="secondary" label="Clear Filter" @click="clearFilter()"/>
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
            <q-badge outline color="primary" floating>{{allCount}}</q-badge>
          </q-tab>
          <q-tab class="text-negative" name="failed" label="Failed">
            <q-badge outline color="negative" floating>{{failedCount}}</q-badge>
          </q-tab>
          <q-tab class="text-positive" name="passed" label="Passed">
            <q-badge outline color="positive" floating>{{passedCount}}</q-badge>
          </q-tab>
          <q-tab class="text-info" name="inQueue" label="In Queue">
            <q-badge outline color="info" floating>{{inQueueCount}}</q-badge>
          </q-tab>
          <q-tab class="text-secondary" name="running" label="Running">
            <q-badge outline color="secondary" floating>{{runningCount}}</q-badge>
          </q-tab>
          <q-tab class="text-negative" name="analyseFailed" label="Analyse Failed">
            <q-badge outline color="negative" floating>{{analyseFailedCount}}</q-badge>
          </q-tab>
          <q-tab class="text-positive" name="analysePassed" label="Analyse Passed">
            <q-badge outline color="positive" floating>{{analysePassedCount}}</q-badge>
          </q-tab>
          <q-tab class="text-info" name="inCompatible" label="InCompatible">
            <q-badge outline color="info" floating>{{inCompatibleCount}}</q-badge>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="selectedTab" animated keep-alive>
          <q-tab-panel name="all">
            <all-test-table :selectedRegression="selectedRegression"></all-test-table>
          </q-tab-panel>
          <q-tab-panel name="failed">
            <failed-table :selectedRegression="selectedRegression"></failed-table>
          </q-tab-panel>
          <q-tab-panel name="passed">
            <passed-table></passed-table>
          </q-tab-panel>
          <q-tab-panel name="inQueue">
            <in-queue-table></in-queue-table>
          </q-tab-panel>
           <q-tab-panel name="running">
            <running-table></running-table>
          </q-tab-panel>
           <q-tab-panel name="analyseFailed">
            <analyse-failed-table></analyse-failed-table>
          </q-tab-panel>
           <q-tab-panel name="analysePassed">
            <analyse-passed-table></analyse-passed-table>
          </q-tab-panel>
           <q-tab-panel name="inCompatible">
            <in-compatible-table></in-compatible-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeMount, ref, Ref, onMounted,
} from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useTitle } from '@vueuse/core'
import { useRegressionStore } from 'src/pinia/regressionStore'
import { RegressionInterface } from 'src/Models/Regression'
import { RegressionTestInterface } from 'src/Models/RegressionTest'
import { useRegMonitoringStore } from 'src/pinia/regMonitoring'
import AllTestTable from './AllTestTable.vue'
import FailedTable from './FailedTable.vue'
import PassedTable from './PassedTable.vue'
import AnalyseFailedTable from './AnalyseFailedTable.vue'
import AnalysePassedTable from './AnalysePassedTable.vue'
import InCompatibleTable from './InCompatibleTable.vue'
import InQueueTable from './InQueueTable.vue'
import RunningTable from './RunningTable.vue'

export default defineComponent({
  name: 'Regression',
  components: {
    AllTestTable, FailedTable, PassedTable, AnalyseFailedTable, AnalysePassedTable, InCompatibleTable, InQueueTable, RunningTable,
  },
  setup() {
    useTitle('Regression')
    const $store = useStore()
    const regressionStore = useRegressionStore()
    const regMonitoringStore = useRegMonitoringStore()
    const $q = useQuasar()
    const regressions = computed(() => regressionStore.regressions)
    const selectedRegression = computed(() => regressionStore.selectedRegression)
    const categorySelections = computed(() => regMonitoringStore.categorySelections)
    const testSuiteSelections = computed(() => regMonitoringStore.testSuiteSelections)
    const testGroupSelections = computed(() => regMonitoringStore.testGroupSelections)
    const testClientSelections = computed(() => regMonitoringStore.testClientSelections)
    const regTests = computed(() => regMonitoringStore.regTests)
    const allCount = computed(() => regMonitoringStore.regTests.length)
    const failedCount = computed(() => {
      const all = regMonitoringStore.regTests
      return all.filter((r: RegressionTestInterface) => r.Status === 'Failed').length
    })
    const passedCount = computed(() => {
      const all = regMonitoringStore.regTests
      return all.filter((r: RegressionTestInterface) => r.Status === 'Passed').length
    })
    const inQueueCount = computed(() => {
      const all = regMonitoringStore.regTests
      return all.filter((r: RegressionTestInterface) => r.Status === 'InQueue').length
    })
    const runningCount = computed(() => {
      const all = regMonitoringStore.regTests
      return all.filter((r: RegressionTestInterface) => r.Status === 'Running' || r.Status === 'Inconclusive').length
    })
    const analyseFailedCount = computed(() => {
      const all = regMonitoringStore.regTests
      return all.filter((r: RegressionTestInterface) => r.Status === 'AnalyseFailed').length
    })
    const analysePassedCount = computed(() => {
      const all = regMonitoringStore.regTests
      return all.filter((r: RegressionTestInterface) => r.Status === 'AnalysePassed').length
    })
    const inCompatibleCount = computed(() => {
      const all = regMonitoringStore.regTests
      return all.filter((r: RegressionTestInterface) => r.Status === 'InCompatible').length
    })
    const filteredRegressions: Ref<RegressionInterface[]> = ref([])
    const selectedTab = ref('all')
    const selectedCategory = ref('')
    const selectedTestSuite = ref('')
    const selectedTestGroup = ref('')
    const selectedTestClient = ref('')
    const testCaseFilterText = ref('')
    onBeforeMount(async () => {
      try {
        await regressionStore.getRegressions()
        if (selectedRegression.value) {
          await regMonitoringStore.getRegressionDetail(selectedRegression.value.Id)
        }
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    onMounted(() => {
      filteredRegressions.value = regressions.value
    })
    async function onChangeRegression(regression: RegressionInterface) {
      regressionStore.selectedRegression = regression
      await regMonitoringStore.getRegressionDetail(regression.Id)
    }
    function filterRegressionFn(val: string, update: any) {
      update(() => {
        const needle = val.toLowerCase()
        filteredRegressions.value = regressions.value.filter((reg: RegressionInterface) => reg.Name.toLowerCase().indexOf(needle) > -1)
      })
    }
    function onCategoryValueChange(event: any) {
      // TODO
      console.log('onCategoryValueChange', event)
    }
    function onTestSuiteValueChange(event: any) {
      // TODO
      console.log('onTestGroupValueChange', event)
    }
    function onTestGroupValueChange(event: any) {
      // TODO
      console.log('onTestGroupValueChange', event)
    }
    function onTestClientValueChange(event: any) {
      // TODO
      console.log('onTestClientValueChange', event)
    }
    async function clearFilter() {
      testCaseFilterText.value = ''
      if (selectedRegression.value) {
        await regMonitoringStore.getRegressionDetail(selectedRegression.value.Id)
      }
    }
    function testCaseFilterFunc() {
      // TODO
      console.log('testCaseFilterFunc')
      if (testCaseFilterText.value === '') {
        void clearFilter()
      } else {
        const filteredRegTests: RegressionTestInterface[] = regTests.value.filter((rt: RegressionTestInterface) => rt.TestCaseCodeName.toLowerCase().includes(testCaseFilterText.value.toLowerCase().trim()) || rt.TestCaseName.toLowerCase().includes(testCaseFilterText.value.toLowerCase().trim()))
        if (filteredRegTests.length > 0) {
          regMonitoringStore.regTests = filteredRegTests
        } else {
          $q.notify({
            type: 'info',
            message: 'Not found',
          })
        }
      }
    }
    return {
      selectedTestClient,
      onTestClientValueChange,
      testClientSelections,
      regTests,
      clearFilter,
      testCaseFilterFunc,
      testCaseFilterText,
      allCount,
      passedCount,
      failedCount,
      inQueueCount,
      runningCount,
      analyseFailedCount,
      analysePassedCount,
      inCompatibleCount,
      selectedTab,
      filteredRegressions,
      filterRegressionFn,
      selectedRegression,
      regressions,
      onChangeRegression,
      selectedCategory,
      selectedTestSuite,
      selectedTestGroup,
      categorySelections,
      testSuiteSelections,
      testGroupSelections,
      onCategoryValueChange,
      onTestSuiteValueChange,
      onTestGroupValueChange,
    }
  },
});
</script>

<style scoped lang="scss">
:deep(.q-tab__label) {
  padding-right: 15px;
}
</style>
