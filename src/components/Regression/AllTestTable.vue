<template>
  <q-table
      :class="[isDark ? 'sticky-header-dark': 'sticky-header-light']"
      dense
      virtual-scroll
      virtual-scroll-sticky-size-start="48"
      :rows="regRunRecords"
      :columns="columns"
      row-key="Id"
      :hide-pagination="true"
      separator="cell"
      :wrap-cells="false"
      selection="multiple"
      v-model:selected="selected"
      :rows-per-page-options="[0]"
      no-data-label="No dev run record found"
      :selected-rows-label="getSelectedString"
      :visible-columns="visibleColumns"
      :pagination="initialPagination"
    >
      <template v-slot:top-right>
        <q-select
          v-model="visibleColumns"
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
        />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold text-primary"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="styleStatus(props.row.Status)"
          >
          <q-td key="testCaseFullName" :props="props" class="q-c-input">
            {{ props.row.TestCaseCodeName }}: {{ props.row.TestCaseName }}
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
          <q-td key="description" :props="props" class="q-c-input">
            <div class="row no-wrap">
              <div class="col-11 ellipsis">
                {{ props.row.Description }}
              </div>
              <div class="col-1" v-if="props.row.Description">
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
            <div class="row no-wrap">
              <div class="col-11 ellipsis" @click="showErrorMessageDialog(props.row)">
                <q-tooltip :delay="300" max-width="1200px">
                  <div style="white-space: pre-wrap; font-size: medium;">
                    {{ props.row.LastRegressionRunRecord?.ErrorMessage }}
                  </div>
                </q-tooltip>
                {{ props.row.LastRegressionRunRecord?.ErrorMessage }}
              </div>
              <div class="col-1" v-if="props.row.LastRegressionRunRecord?.ErrorMessage">
                <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.LastRegressionRunRecord?.ErrorMessage)" class="order-last"></q-btn>
              </div>
            </div>
          </q-td>
          <q-td key="log" :props="props" class="q-c-input">
            <div class="row no-wrap">
              <div class="col-11">
                <reg-log :RegRunRecord="props.row.LastRegressionRunRecord" class="ellipsis"></reg-log>
              </div>
              <div class="col-1" v-if="props.row.LastRegressionRunRecord?.Log">
                <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.LastRegressionRunRecord.Log)" class="order-last"></q-btn>
              </div>
            </div>
          </q-td>
          <q-td key="errorScreenShot" :props="props" class="q-c-input">
            <error-screenshot :RegRunRecord="props.row.LastRegressionRunRecord"></error-screenshot>
          </q-td>
          <q-td key="startAt" :props="props" class="q-c-input">
            <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.LastRegressionRunRecord?.StartAt">
              {{ timeAgo }}
            </UseTimeAgo>
          </q-td>
          <q-td key="endAt" :props="props" class="q-c-input">
            <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.LastRegressionRunRecord?.EndAt">
              {{ timeAgo }}
            </UseTimeAgo>
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
          <q-td key="isHighPriority" :props="props" class="q-c-input">
            {{ props.row.IsHighPriority }}
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
          <q-td key="comment" :props="props" class="q-c-input">
            {{ props.row.Comment }}
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
import {
  computed, defineComponent, ref, Ref, PropType,
} from 'vue';
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'
import { RegressionRunRecordInterface } from 'src/Models/RegressionRunRecord';
import { UseTimeAgo } from '@vueuse/components'
import { RegressionInterface } from 'src/Models/Regression';
import { allColumns } from './columnDefinitions'
import RegLog from './Cells/RegLog.vue'
import ErrorScreenshot from './Cells/ErrorScreenshot.vue'

export default defineComponent({
  name: 'AllTestTable',
  props: {
    selectedRegression: {
      type: Object as PropType<RegressionInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { UseTimeAgo, RegLog, ErrorScreenshot },
  setup() {
    const $store = useStore()
    const isDark = computed(() => $store.getters['global/darkTheme'])
    const selected: Ref<any[]> = ref([])
    const columns = allColumns
    const { copy } = useClipboard()
    const regRunRecords: Ref<RegressionRunRecordInterface[]> = computed(() => $store.getters['regmonitoring/regRunRecords'])
    const initialPagination = {
      sortBy: 'startAt',
      descending: true,
      // page: 2,
      // rowsPerPage: 3,
      // rowsNumber: xx if getting data from a server
    }
    function styleStatus(status: string) {
      switch (status) {
        case 'Passed':
          if (isDark.value) {
            return 'bg-light-green-10'
          }
          return 'bg-light-green-2'
        case 'Failed':
          if (isDark.value) {
            return 'bg-deep-orange-7'
          }
          return 'bg-red-2'
        default:
          return ''
      }
    }
    function showErrorMessageDialog(regressionRunRecord: RegressionRunRecordInterface) {
      // TODO
      console.log('regressionRunRecord', regressionRunRecord)
      // $q.dialog({
      //   component: DevErrorMessageDialog,
      //   componentProps: {
      //     DevRunRecord: devRunRecord,
      //   },
      // }).onOk(() => {
      //   // TODO: handle ok
      //   console.log('OK')
      // }).onCancel(() => {
      //   // TODO
      //   console.log('Cancel')
      // }).onDismiss(() => {
      //   console.log('Dismiss')
      // })
    }
    function getSelectedString() {
      return selected.value.length === 0 ? '' : `${selected.value.length} step${selected.value.length > 1 ? 's' : ''} selected.`
    }
    return {
      initialPagination,
      regRunRecords,
      selected,
      getSelectedString,
      showErrorMessageDialog,
      copy,
      styleStatus,
      isDark,
      columns,
      visibleColumns: ref(['testCaseFullName', 'category', 'testSuite', 'testGroup', 'status', 'description', 'testCaseType', 'team', 'errorMessage', 'log', 'errorScreenShot', 'startAt', 'endAt', 'executeTime', 'workItem', 'queue', 'isHighPriority', 'owner', 'analyseBy', 'issue', 'comment', 'runMachine', 'buffers']),
    };
  },
});
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
