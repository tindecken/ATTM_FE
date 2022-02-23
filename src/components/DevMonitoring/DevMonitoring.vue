<template>
  <div>
    <dev-queue class="q-mb-md"></dev-queue>
    <q-table
      title="Monitoring"
      :class="[isDark ? 'sticky-header-dark': 'sticky-header-light']"
      dense
      :rows="devRunRecords"
      :columns="columns"
      row-key="Id"
      :hide-pagination="true"
      separator="cell"
      :wrap-cells="false"
      selection="multiple"
      v-model:selected="selected"
      :rows-per-page-options="[0]"
      no-data-label="No dev run record found"
      :filter="filterTable"
      :selected-rows-label="getSelectedString"
      :visible-columns="visibleColumns"
      :pagination="initialPagination"
    >
      <template v-slot:top-left>
        <div>
          <span class="text-h5">Monitoring</span>
          <q-input borderless dense debounce="300" v-model="filterTable" placeholder="Filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
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
            {{ props.row.Category }}
          </q-td>
          <q-td key="testSuite" :props="props" class="q-c-input">
            {{ props.row.TestSuite }}
          </q-td>
          <q-td key="testGroup" :props="props" class="q-c-input">
            {{ props.row.TestGroup }}
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
          <q-td key="status" :props="props" class="q-c-input">
            {{ props.row.Status }}
          </q-td>
          <q-td key="team" :props="props" class="q-c-input">
            {{ props.row.Team }}
          </q-td>
          <q-td key="errorMessage" :props="props" class="q-c-input">
            <div class="row no-wrap">
              <div class="col-11 ellipsis" @click="showErrorMessageDialog(props.row)">
                <q-tooltip :delay="300" max-width="1200px">
                  <div style="white-space: pre-wrap; font-size: medium;">
                    {{ props.row.ErrorMessage }}
                  </div>
                </q-tooltip>
                {{ props.row.ErrorMessage }}
              </div>
              <div class="col-1" v-if="props.row.ErrorMessage">
                <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.ErrorMessage)" class="order-last"></q-btn>
              </div>
            </div>
          </q-td>
          <q-td key="log" :props="props" class="q-c-input">
            <div class="row no-wrap">
              <div class="col-11">
                <dev-log :DevRunRecord="props.row" class="ellipsis"></dev-log>
              </div>
              <div class="col-1">
                <q-btn flat round icon="content_copy" size="xs" primary @click="copy(props.row.Log)" class="order-last"></q-btn>
              </div>
            </div>
          </q-td>
          <q-td key="errorScreenShot" :props="props" class="q-c-input">
            <error-screenshot :DevRunRecord="props.row"></error-screenshot>
          </q-td>
          <q-td key="startAt" :props="props" class="q-c-input">
            <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.StartAt">
              {{ timeAgo }}
            </UseTimeAgo>
          </q-td>
          <q-td key="endAt" :props="props" class="q-c-input">
            <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.EndAt">
              {{ timeAgo }}
            </UseTimeAgo>
          </q-td>
          <q-td key="executeTime" :props="props" class="q-c-input">
            {{ props.row.ExecuteTime }}
          </q-td>
          <q-td key="workItem" :props="props" class="q-c-input">
            {{ props.row.WorkItem }}
          </q-td>
          <q-td key="runMachine" :props="props" class="q-c-input">
            {{ props.row.RunMachine }}
          </q-td>
          <q-td key="buffers" :props="props" class="q-c-input">
            {{ props.row.Buffers }}
          </q-td>
          <q-td key="errorTearDownScreenshot" :props="props" class="q-c-input">
            {{ props.row.ErrorTearDownScreenshot }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, ref, Ref, onBeforeMount,
} from 'vue'
import { useQuasar } from 'quasar'
import { DevRunRecordInterface } from 'src/Models/DevRunRecord';
import { UseTimeAgo } from '@vueuse/components'
import { useClipboard, useTitle } from '@vueuse/core'
import { useGlobalStore } from 'src/pinia/globalStore';
import { useDevMonitoringStore } from 'src/pinia/devMonitoringStore';
import DevLog from './DevRunning/DevLog.vue'
import ErrorScreenshot from './DevRunning/ErrorScreenshot.vue'
import DevQueue from './DevQueue/DevQueue.vue'
import DevErrorMessageDialog from './Dialog/DevErrorMessageDialog.vue';

export default defineComponent({
  name: 'DevMonitoring',
  components: {
    UseTimeAgo, DevLog, ErrorScreenshot, DevQueue,
  },
  setup() {
    const globalStore = useGlobalStore()
    const devMonitoringStore = useDevMonitoringStore()
    useTitle('Dev Monitoring')
    const $q = useQuasar()
    const { copy } = useClipboard()
    const columns = ref(
      [
        {
          name: 'testCaseFullName',
          align: 'left',
          label: 'Test Case',
          field: 'TestCaseFullName',
          sortable: true,
          style: 'min-width: 80px; max-width: 300px',
          headerStyle: 'min-width: 80px; max-width: 300px',
          classes: 'ellipsis',
        },
        {
          name: 'category',
          label: 'Category',
          field: 'Category',
          sortable: true,
          align: 'left',
          style: 'min-width: 100px;',
          headerStyle: 'min-width: 100px',
          classes: 'ellipsis',
        },
        {
          name: 'testSuite',
          label: 'Test Suite',
          field: 'TestSuite',
          sortable: true,
          align: 'left',
          style: 'min-width: 120px;',
          headerStyle: 'min-width: 120px',
          classes: 'ellipsis',
        },
        {
          name: 'testGroup',
          label: 'Test Group',
          field: 'test',
          sortable: true,
          align: 'left',
          style: 'min-width: 120px;',
          headerStyle: 'min-width: 120px',
          classes: 'ellipsis',
        },
        {
          name: 'description',
          label: 'Description',
          field: 'Description',
          sortable: true,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
          classes: 'ellipsis',
        },
        {
          name: 'testCaseType',
          label: 'Type',
          field: 'TestCaseType',
          sortable: true,
          align: 'left',
          style: 'min-width: 90px;',
          headerStyle: 'min-width: 90px',
          classes: 'ellipsis',
        },
        {
          name: 'status',
          label: 'Status',
          field: 'Status',
          sortable: true,
          align: 'left',
          style: 'min-width: 70px; max-width: 90px;',
          headerStyle: 'min-width: 70px; max-width: 90px;',
          classes: 'ellipsis',
        },
        {
          name: 'team',
          label: 'Team',
          field: 'Team',
          sortable: true,
          align: 'left',
          style: 'min-width: 90; max-width: 110px;',
          headerStyle: 'min-width: 90px; min-width: 110px;',
          classes: 'ellipsis',
        },
        {
          name: 'errorMessage',
          label: 'Error Message',
          field: 'ErrorMessage',
          sortable: true,
          align: 'left',
          style: 'min-width: 135px; max-width: 200px',
          headerStyle: 'max-width: 200px',
          classes: 'ellipsis',
        },
        {
          name: 'log',
          label: 'Running Log',
          field: 'Log',
          sortable: true,
          align: 'left',
          style: 'min-width: 135px; max-width: 200px',
          headerStyle: 'max-width: 200px',
          classes: 'ellipsis',
        },
        {
          name: 'errorScreenShot',
          label: 'Error ScreenShot',
          field: 'ErrorScreenshot',
          sortable: false,
          align: 'left',
          style: 'min-width: 100px; max-width: 110px;',
          headerStyle: 'min-width: 100px; max-width: 110px;',
        },
        {
          name: 'startAt',
          label: 'Start At',
          field: 'StartAt',
          sortable: true,
          align: 'left',
          style: 'min-width: 100px; max-width: 120px;',
          headerStyle: 'min-width: 100px max-width: 120px;',
          classes: 'ellipsis',
        },
        {
          name: 'endAt',
          label: 'End At',
          field: 'EndAt',
          sortable: true,
          align: 'left',
          style: 'min-width: 100px; max-width: 120px;',
          headerStyle: 'min-width: 100px max-width: 120px;',
          classes: 'ellipsis',
        },
        {
          name: 'executeTime',
          label: 'Execute Time',
          field: 'Execute Time',
          sortable: true,
          align: 'left',
          style: 'min-width: 80px;',
          headerStyle: 'min-width: 80px',
          classes: 'ellipsis',
        },
        {
          name: 'workItem',
          label: 'Work Item',
          field: 'WorkItem',
          sortable: true,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
          classes: 'ellipsis',
        },
        {
          name: 'runMachine',
          label: 'Run Machine',
          field: 'RunMachine',
          sortable: false,
          align: 'left',
          style: 'min-width: 100px;; max-width: 150px;',
          headerStyle: 'min-width: 100px; max-width: 150px;',
          classes: 'ellipsis',
        },
        {
          name: 'buffers',
          label: 'Buffers',
          field: 'Buffers',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
          classes: 'ellipsis',
        },
      ],
    )
    const isDark = computed(() => globalStore.darkTheme)
    const selected: Ref<any[]> = ref([])
    const devRunRecords: Ref<DevRunRecordInterface[]> = computed(() => devMonitoringStore.devRunRecords)
    const initialPagination = {
      sortBy: 'startAt',
      descending: true,
      // page: 2,
      // rowsPerPage: 3,
      // rowsNumber: xx if getting data from a server
    }
    onBeforeMount(async () => {
      try {
        await devMonitoringStore.getDevRunRecords()
        await devMonitoringStore.getInQueueDevRunRecords()
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
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
    function getSelectedString() {
      return selected.value.length === 0 ? '' : `${selected.value.length} step${selected.value.length > 1 ? 's' : ''} selected.`
    }
    function showErrorMessageDialog(devRunRecord: DevRunRecordInterface) {
      $q.dialog({
        component: DevErrorMessageDialog,
        componentProps: {
          DevRunRecord: devRunRecord,
        },
      }).onOk(() => {
        // TODO: handle ok
        console.log('OK')
      }).onCancel(() => {
        // TODO
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Dismiss')
      })
    }
    return {
      columns,
      isDark,
      filterTable: ref(''),
      getSelectedString,
      selected,
      devRunRecords,
      visibleColumns: ref(['testCaseFullName', 'category', 'testSuite', 'testGroup', 'status', 'errorMessage', 'log', 'errorScreenShot', 'startAt', 'endAt', 'executeTime', 'runMachine']),
      initialPagination,
      styleStatus,
      copy,
      showErrorMessageDialog,
    }
  },
});
</script>
