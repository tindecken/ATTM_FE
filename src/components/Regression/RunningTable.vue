<template>
  <q-table
      :class="[isDark ? 'sticky-header-dark': 'sticky-header-light']"
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
      :visible-columns="visibleColumns"
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
          selection="multiple"
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
          @click.ctrl="toggleSelectedRow(props.row)"
          @click.exact="toggleSingleRow(props.row)"
          @click.shift="toggleRowGroup(props.row)"
          @click.right="toogleRightClick(props.row)"
          :class="styleStatus(props.row.Status)"
          >
          <reg-menu
            @update="onUpdate()"
          ></reg-menu>
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
          <q-td key="clientName" :props="props" class="q-c-input">
            {{ props.row.ClientName }}
          </q-td>
          <q-td key="isHighPriority" :props="props" class="q-c-input">
            {{ props.row.IsHighPriority }}
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
                <reg-log :RegressionTest="props.row" class="ellipsis"></reg-log>
              </div>
              <div class="col-1" v-if="props.row.LastRegressionRunRecord?.Log">
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
              <div style="white-space: pre-wrap; font-size: medium;">
                {{ date.formatDate(props.row.LastRegressionRunRecord?.StartAt, 'YYYY-MM-DD HH:mm:ss Z')}}
              </div>
            </q-tooltip>
          </q-td>
          <q-td key="endAt" :props="props" class="q-c-input">
            <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.LastRegressionRunRecord?.EndAt">
              {{ timeAgo }}
            </UseTimeAgo>
             <q-tooltip :delay="300" max-width="1200px">
              <div style="white-space: pre-wrap; font-size: medium;">
                {{ date.formatDate(props.row.LastRegressionRunRecord?.EndAt, 'YYYY-MM-DD HH:mm:ss Z')}}
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
            {{ props.row.Comments }}
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
    <div class="q-mt-md">
      Selected:
      <ul>
        <li v-for="value in selected" :key="value.Id">
          {{value.Id}}
        </li>
      </ul>
    </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, Ref, PropType,
} from 'vue';
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'
import { UseTimeAgo } from '@vueuse/components'
import { RegressionInterface } from 'src/Models/Regression'
import { RegressionTestInterface } from 'src/Models/RegressionTest'
import { useQuasar, date } from 'quasar'
import { useGlobalStore } from 'src/pinia/globalStore';
import RegMenu from './ContextMenu/RegMenu.vue'
import { allColumns } from './columnDefinitions'
import RegLog from './Cells/RegLog.vue'
import ErrorScreenshot from './Cells/ErrorScreenshot.vue'
import UpdateDialog from './Dialogs/UpdateDialog.vue'

export default defineComponent({
  name: 'RunningTable',
  props: {
    selectedRegression: {
      type: Object as PropType<RegressionInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: {
    UseTimeAgo, RegLog, ErrorScreenshot, RegMenu,
  },
  setup() {
    const globalStore = useGlobalStore()
    const $q = useQuasar()
    const $store = useStore()
    const isDark = computed(() => globalStore.darkTheme)
    const selected: Ref<RegressionTestInterface[]> = ref([])
    const columns = allColumns
    const { copy } = useClipboard()
    const regTests: Ref<RegressionTestInterface[]> = computed(() => $store.getters['regmonitoring/runningRegTests'])
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
        case 'AnalysePassed':
          if (isDark.value) {
            return 'bg-light-green-10'
          }
          return 'bg-light-green-2'
        case 'Failed':
        case 'AnalyseFailed':
          if (isDark.value) {
            return 'bg-deep-orange-7'
          }
          return 'bg-red-2'
        default:
          return ''
      }
    }
    function showErrorMessageDialog(regTest: RegressionTestInterface) {
      // TODO
      console.log('regTest', regTest)
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
      return selected.value.length === 0 ? '' : `${selected.value.length} regresion test${selected.value.length > 1 ? 's' : ''} selected.`
    }
    function toggleSelectedRow(row: any) {
      if (selected.value.length > 0) { // We can add another row
        // But if clicking one already selected, we'll remove it instead
        let i = 0
        const matched = selected.value.find((item: any, index: number) => {
          i = index
          return item.Id === row.Id
        })
        if (matched) { // This row was already selected, so remove it
          selected.value.splice(i, 1)
        } else { // Add to selection
          selected.value.push(row)
        }
      } else { // First selection - add it
        selected.value.push(row)
      }
    }
    function toggleSingleRow(row: any) {
      selected.value = []
      selected.value.push(row)
    }
    function toogleRightClick(row: any) {
      if (selected.value.length <= 1) {
        selected.value = []
        selected.value.push(row)
      }
    }
    function getRowIndexById(Id: string) {
      const index: number = regTests.value.findIndex((regTest: RegressionTestInterface) => regTest.Id === Id)
      if (index === -1) return 0
      return index
    }

    // With Shift pressed, select contiguous group
    function toggleRowGroup(row: any) {
      if (selected.value.length === 1) { // There is a previous selection
        // Select contiguous block from previous selection to this one
        // But if clicked one already selected, remove any selected since then
        const matched = selected.value.find((item: any) => item.Id === row.Id)
        if (matched) { // Had already selected this one --> do nothing
        } else { // New selection - add it and any between
          // find previous selected teststep
          const previousSelectedRegressionTest = regTests.value.find((regTest: RegressionTestInterface) => regTest.Id === selected.value[0].Id) as RegressionTestInterface

          // get index for previousRegressionTest and currentSelectedRegressionTest
          const previousIndex = getRowIndexById(previousSelectedRegressionTest.Id)
          const currentIndex = getRowIndexById(row.Id)

          let first: number
          let last: number

          if (previousIndex < currentIndex) {
            first = previousIndex
            last = currentIndex
          } else {
            first = currentIndex
            last = previousIndex
          }

          // row Index need to push
          // eslint-disable-next-line no-plusplus
          for (let index = first + 1; index < last; index++) {
            selected.value.push(regTests.value[index])
          }

          selected.value.push(row)
        }
      } else if (selected.value.length > 1) { // there're multiple row previous selection
        selected.value = []
        selected.value.push(row)
      } else { // No previous selection - just select this one
        selected.value = []
        selected.value.push(row)
      }
    }
    function onUpdate() {
      console.log('oneUpdate')
      $q.dialog({
        component: UpdateDialog,
        componentProps: {
          RegressionTests: selected.value,
        },
      }).onOk(async () => {
        // TODO: handle ok
        const selectedRegression = $store.getters['regression/selectedRegression']
        await $store.dispatch('regmonitoring/getRegressionDetail', selectedRegression.Id)
        console.log('OK')
      }).onCancel(async () => {
        // TODO
        const selectedRegression = $store.getters['regression/selectedRegression']
        await $store.dispatch('regmonitoring/getRegressionDetail', selectedRegression.Id)
      }).onDismiss(() => {
        console.log('Dismiss')
      })
    }

    return {
      onUpdate,
      toggleSelectedRow,
      toggleSingleRow,
      toggleRowGroup,
      toogleRightClick,
      date,
      initialPagination,
      regTests,
      selected,
      getSelectedString,
      showErrorMessageDialog,
      copy,
      styleStatus,
      isDark,
      columns,
      filterTable: ref(''),
      visibleColumns: ref(['testCaseFullName', 'category', 'testSuite', 'testGroup', 'status', 'clientName', 'isHighPriority', 'description', 'testCaseType', 'team', 'errorMessage', 'log', 'errorScreenShot', 'startAt', 'endAt', 'executeTime', 'workItem', 'queue', 'owner', 'analyseBy', 'issue', 'comments', 'runMachine', 'buffers']),
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
