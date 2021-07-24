<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col">
        <q-select
          dense
          v-model="selectedRegression"
          :options="filteredRegressions"
          option-label="Name"
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
          <q-tab name="all" label="All"/>
          <q-tab name="failed" label="Failed" />
          <q-tab name="passed" label="Passed" />
          <q-tab name="inQueue" label="In Queue" />
          <q-tab name="running" label="Running" />
          <q-tab name="analyseFailed" label="Analyse Failed" />
          <q-tab name="analysePassed" label="Analyse Passed" />
          <q-tab name="inCompatible" label="InCompatible" />
        </q-tabs>
        <q-tab-panels v-model="selectedTab" animated keep-alive>
          <q-tab-panel name="all">
            <all-test-table></all-test-table>
          </q-tab-panel>
          <q-tab-panel name="failed">
            <failed-table></failed-table>
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
import { RegressionInterface } from 'src/Models/Regression'
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
    const $store = useStore()
    const $q = useQuasar()
    const regressions = computed(() => $store.getters['regression/regressions'] as RegressionInterface[])
    const selectedRegression = ref(null)
    const filteredRegressions: Ref<RegressionInterface[]> = ref([])
    const selectedTab = ref('all')
    onBeforeMount(async () => {
      try {
        await $store.dispatch('regression/getRegressions');
        selectedRegression.value = $store.getters['regression/selectedRegression']
        console.log('selectedRegression.value', selectedRegression.value)
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    onMounted(() => {
      filteredRegressions.value = regressions.value
    })
    function onChangeRegression(regression: RegressionInterface) {
      console.log('event', regression)
      $store.commit('regression/setSelectedRegression', regression)
    }
    function filterRegressionFn(val: string, update: any) {
      update(() => {
        const needle = val.toLowerCase()
        filteredRegressions.value = regressions.value.filter((reg: RegressionInterface) => reg.Name.toLowerCase().indexOf(needle) > -1)
      })
    }
    return {
      selectedTab,
      filteredRegressions,
      filterRegressionFn,
      selectedRegression,
      regressions,
      onChangeRegression,
    }
  },
});
</script>
