<template>
  <q-table
    :class="[isDark ? 'sticky-header-dark' : 'sticky-header-light']"
    dense
    virtual-scroll
    virtual-scroll-sticky-size-start="48"
    :rows="regTests"
    :columns="columns"
    row-key="Id"
    :hide-pagination="true"
    separator="cell"
    :wrap-cells="false"
    selection="multiple"
    v-model:selected="selected"
    :rows-per-page-options="[0]"
    no-data-label="No regression test record found"
    :selected-rows-label="getSelectedString"
    :visible-columns="visibleCols"
    :pagination="initialPagination"
    :filter="filterTable.trim()"
  >
    <template v-slot:top-left>
      <div>
        <q-input borderless dense debounce="300" v-model="filterTable" placeholder="Filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-slot:top-right>
      <q-select
        v-model="visibleCols"
        multiple
        borderless
        dense
        options-dense
        :display-value="$q.lang.table.columns"
        emit-value
        map-options
        :options="columns"
        option-value="name"
        style="min-width: 150px"
        selection="multiple"
      />
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-bold text-primary">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr
        :props="props"
        @click.ctrl="toggleSelectedRow(props.row)"
        @click.exact="toggleSingleRow(props.row)"
        @click.right="toogleRightClick(props.row)"
        :class="styleStatus(props.row.Status)"
      >
        <reg-menu @update="onUpdate()"></reg-menu>
        <q-td key="testCaseFullName" :props="props" class="q-c-input">
          <div class="row no-wrap justify-between items-center">
            <div class="ellipsis">{{ props.row.TestCaseCodeName }}: {{ props.row.TestCaseName }}</div>
            <div>
              <q-btn
                flat
                round
                icon="content_copy"
                size="xs"
                primary
                @click="copy(`${props.row.TestCaseCodeName}: ${props.row.TestCaseName}`)"
                class="order-last"
              ></q-btn>
            </div>
          </div>
        </q-td>
        <q-td key="category" :props="props" class="q-c-input">
          {{ props.row.CategoryName }}
        </q-td>
        <q-td key="testSuite" :props="props" class="q-c-input">
          {{ props.row.TestSuiteFullName }}
        </q-td>
        <q-td key="testGroup" :props="props" class="q-c-input">
          {{ props.row.TestGroupFullName }}
        </q-td>
        <q-td key="status" :props="props" class="q-c-input">
          {{ props.row.Status }}
        </q-td>
        <q-td key="clientName" :props="props" class="q-c-input">
          {{ props.row.ClientName }}
        </q-td>
        <q-td key="isHighPriority" :props="props" class="q-c-input">
          {{ props.row.IsHighPriority }}
        </q-td>
        <q-td key="description" :props="props" class="q-c-input">
          <div class="row no-wrap justify-between items-center">
            <div class="ellipsis">
              {{ props.row.Description }}
            </div>
            <div v-if="props.row.Description">
              <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.Description)" class="order-last"></q-btn>
            </div>
          </div>
        </q-td>
        <q-td key="testCaseType" :props="props" class="q-c-input">
          {{ props.row.TestCaseType }}
        </q-td>
        <q-td key="team" :props="props" class="q-c-input">
          {{ props.row.Team }}
        </q-td>
        <q-td key="errorMessage" :props="props" class="q-c-input">
          <div class="row no-wrap items-center justify-between">
            <div class="ellipsis" @click="showErrorMessageDialog(props.row)">
              <q-tooltip :delay="300" max-width="1200px">
                <div style="white-space: pre-wrap; font-size: small">
                  {{ props.row.LastRegressionRunRecord?.ErrorMessage }}
                </div>
              </q-tooltip>
              {{ props.row.LastRegressionRunRecord?.ErrorMessage }}
            </div>
            <div v-if="props.row.LastRegressionRunRecord?.ErrorMessage">
              <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.LastRegressionRunRecord?.ErrorMessage)" class="order-last"></q-btn>
            </div>
          </div>
        </q-td>
        <q-td key="log" :props="props" class="q-c-input">
          <div class="row no-wrap items-center justify-between">
            <div>
              <reg-log :RegressionTest="props.row" class="ellipsis"></reg-log>
            </div>
            <div v-if="props.row.LastRegressionRunRecord?.Log">
              <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.LastRegressionRunRecord.Log)" class="order-last"></q-btn>
            </div>
          </div>
        </q-td>
        <q-td key="errorScreenShot" :props="props" class="q-c-input">
          <error-screenshot :RegTest="props.row"></error-screenshot>
        </q-td>
        <q-td key="startAt" :props="props" class="q-c-input">
          <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.LastRegressionRunRecord?.StartAt">
            {{ timeAgo }}
          </UseTimeAgo>
          <q-tooltip :delay="300" max-width="1200px">
            <div style="white-space: pre-wrap; font-size: small">
              {{ date.formatDate(props.row.LastRegressionRunRecord?.StartAt, 'YYYY-MM-DD HH:mm:ss Z') }}
            </div>
          </q-tooltip>
        </q-td>
        <q-td key="endAt" :props="props" class="q-c-input">
          <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.LastRegressionRunRecord?.EndAt">
            {{ timeAgo }}
          </UseTimeAgo>
          <q-tooltip :delay="300" max-width="1200px">
            <div style="white-space: pre-wrap; font-size: small">
              {{ date.formatDate(props.row.LastRegressionRunRecord?.EndAt, 'YYYY-MM-DD HH:mm:ss Z') }}
            </div>
          </q-tooltip>
        </q-td>
        <q-td key="executeTime" :props="props" class="q-c-input">
          {{ props.row.LastRegressionRunRecord?.ExecuteTime }}
        </q-td>
        <q-td key="workItem" :props="props" class="q-c-input">
          {{ props.row.WorkItem }}
        </q-td>
        <q-td key="queue" :props="props" class="q-c-input">
          {{ props.row.Queue }}
        </q-td>
        <q-td key="owner" :props="props" class="q-c-input">
          {{ props.row.Owner }}
        </q-td>
        <q-td key="analyseBy" :props="props" class="q-c-input">
          {{ props.row.AnalyseBy }}
        </q-td>
        <q-td key="issue" :props="props" class="q-c-input">
          {{ props.row.Issue }}
        </q-td>
        <q-td key="comments" :props="props" class="q-c-input">
          <div class="row no-wrap items-center justify-between">
            <div class="ellipsis">
              <q-tooltip :delay="300" max-width="1200px">
                <div style="white-space: pre-wrap; font-size: small">
                  {{ props.row.Comments }}
                </div>
              </q-tooltip>
              {{ props.row.Comments }}
            </div>
            <div v-if="props.row.Comments">
              <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.Comments)" class="order-last"></q-btn>
            </div>
          </div>
        </q-td>
        <q-td key="runMachine" :props="props" class="q-c-input">
          {{ props.row.LastRegressionRunRecord?.RunMachine }}
        </q-td>
        <q-td key="buffers" :props="props" class="q-c-input">
          {{ props.row.LastRegressionRunRecord?.Buffers }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
export default {
  name: 'CommonTable',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, ref, Ref, defineProps, PropType } from 'vue';
import { useClipboard } from '@vueuse/core';
import { UseTimeAgo } from '@vueuse/components';
import { RegressionTestInterface } from '../../../../Models/RegressionTest';
import { useQuasar, date } from 'quasar';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { useRegressionStore } from '../../../../pinia/regressionStore';
import { useRegMonitoringStore } from '../../../../pinia/regMonitoring';
import RegMenu from '../ContextMenu/RegMenu.vue';
import { allColumns } from '../columnDefinitions';
import RegLog from '../Cells/RegLog.vue';
import ErrorScreenshot from '../Cells/ErrorScreenshot.vue';
import UpdateDialog from '../Dialogs/UpdateDialog.vue';

const props = defineProps({
  filterTestCase: { type: Object as PropType<string>, required: true },
  testCases: {
    type: Object as PropType<RegressionTestInterface[]>,
    required: true,
  },
  visibleColumns: { type: Object as PropType<string[]>, required: true },
});
const visibleCols: Ref<string[]> = ref(props.visibleColumns);

const globalStore = useGlobalStore();
const regressionStore = useRegressionStore();
const regMonitoringStore = useRegMonitoringStore();
const $q = useQuasar();
const isDark = computed(() => globalStore.darkTheme);
const selected: Ref<RegressionTestInterface[]> = ref([]);
const columns = allColumns;
const { copy } = useClipboard();
const regTests: Ref<RegressionTestInterface[]> = computed(() => props.testCases);
const initialPagination = {
  sortBy: 'startAt',
  descending: true,
  // page: 2,
  // rowsPerPage: 3,
  // rowsNumber: xx if getting data from a server
};
const filterTable = ref('');
function styleStatus(status: string) {
  switch (status) {
    case 'Passed':
    case 'AnalysePassed':
      if (isDark.value) {
        return 'bg-light-green-10';
      }
      return 'bg-light-green-2';
    case 'Failed':
    case 'AnalyseFailed':
      if (isDark.value) {
        return 'bg-deep-orange-7';
      }
      return 'bg-red-2';
    default:
      return '';
  }
}
function showErrorMessageDialog(regTest: RegressionTestInterface) {
  // TODO
  console.log('regTest', regTest);
}
function getSelectedString() {
  return selected.value.length === 0 ? '' : `${selected.value.length} regresion test${selected.value.length > 1 ? 's' : ''} selected.`;
}
function toggleSelectedRow(row: any) {
  if (selected.value.length > 0) {
    // We can add another row
    // But if clicking one already selected, we'll remove it instead
    let i = 0;
    const matched = selected.value.find((item: any, index: number) => {
      i = index;
      return item.Id === row.Id;
    });
    if (matched) {
      // This row was already selected, so remove it
      selected.value.splice(i, 1);
    } else {
      // Add to selection
      selected.value.push(row);
    }
  } else {
    // First selection - add it
    selected.value.push(row);
  }
}
function toggleSingleRow(row: any) {
  selected.value = [];
  selected.value.push(row);
}
function toogleRightClick(row: any) {
  if (selected.value.length <= 1) {
    selected.value = [];
    selected.value.push(row);
  }
}
function onUpdate() {
  console.log('oneUpdate');
  $q.dialog({
    component: UpdateDialog,
    componentProps: {
      RegressionTests: selected.value,
    },
  })
    .onOk(async () => {
      // TODO: handle ok
      const { selectedRegression } = regressionStore;
      await regMonitoringStore.getRegressionDetail(selectedRegression?.Id as string);
      console.log('OK');
    })
    .onCancel(async () => {
      // TODO
      const { selectedRegression } = regressionStore;
      await regMonitoringStore.getRegressionDetail(selectedRegression?.Id as string);
    })
    .onDismiss(() => {
      console.log('Dismiss');
    });
}
</script>

<style lang="sass" scoped>
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 675px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #A3CD39

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
