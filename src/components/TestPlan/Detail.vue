<template>
  <div>
    <div class="row">
      <div class="col">
        <q-tabs
          v-model="selectedTestCaseId"
          dense
          active-color="primary"
          align="left"
          inline-label
          @input="onTabChanging()"
        >
          <q-tab v-for="testcase in openedTCs" :key="testcase.Id" :name="testcase.Id" :ripple="false" @mouseover="showByIndex = testcase.Id" @mouseout="showByIndex = null">
            <div class="q-mr-xs">{{testcase.Name}}</div>
            <q-btn dense flat icon="close" size="xs" :style="{visibility: showByIndex === testcase.Id ? 'visible' : 'hidden'}" @click.stop="closeTab(testcase)"></q-btn>
          </q-tab>
        </q-tabs>

        <q-tab-panels
          v-model="selectedTestCaseId"
          animated
          keep-alive
          >
          <q-tab-panel v-for="tc in openedTCs" :key="tc.Id" :name="tc.Id">
            <q-table
              dense
              :rows="tc.TestSteps"
              :columns="columns"
              row-key="UUID"
              :hide-pagination="true"
              separator="cell"
              :wrap-cells="false"
              selection="multiple"
              v-model:selected="selected"
              :rows-per-page-options="[0]"
              no-data-label="Test case has no step"
              :filter="filterTable"
              :filter-method="filterMethod"
            >
              <template v-slot:top-left>
                <q-input borderless dense debounce="200" v-model="filterTable" placeholder="Filter">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
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
                <q-tr v-show="props.row.Description" :props="props">
                  <q-td colspan="100%">
                    <q-input
                      :model-value="props.row.Description"
                      dense
                      borderless
                      @update:model-value="updateDescription(tc, props.row, $event)"
                      debounce="500"
                    >
                      <template v-slot:before>
                        <q-icon name="notes"  style="font-size: 0.9rem;" />
                      </template>
                    </q-input>
                  </q-td>
                </q-tr>
                <q-tr
                  :props="props"
                  @mouseover="onRowHover(props.row.Params)"
                  @click.ctrl="toggleSelectedRow(props.row)"
                  @click.exact="toggleSingleRow(props.row)"
                  @click.shift="toggleRowGroup(props.row)"
                  >
                  <detail-context-menu
                    @deleteRows="onDeleteRows()"
                    @insertDescription="onInsertDescription(tc, props.row)">
                  </detail-context-menu>
                  <q-td key="no" :props="props" class="q-c-input">
                    <no :TestStep="props.row" :Index="props.rowIndex + 1"></no>
                  </q-td>
                  <q-td key="testAUT" :props="props" class="q-c-input">
                    <test-aut :TestStep="props.row" @changeTestAUT="changeTestAUT(tc, props.row, $event)"></test-aut>
                  </q-td>
                  <q-td key="keyword" :props="props" class="q-c-input">
                    <keyword :TestStep="props.row" @changeKeyword="changeKeyword(tc, props.row, $event)" />
                  </q-td>
                  <q-td v-for="index in 20" :key="index" class="q-c-input">
                    <parameter
                      :TestStep="props.row"
                      :ParamIndex="index-1"
                      @changeParam="changeParam(tc, props.row, index-1, $event)"
                      @useTestEnv="useTestEnv(tc, props.row, index-1, $event)"
                      >
                    </parameter>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-btn color="primary" label="New Step" @click="addNewStep(selectedTestCaseId)"></q-btn>
            <q-btn color="primary" label="Save" @click="saveTestCase(selectedTestCaseId)"></q-btn>
            <div class="q-mt-md">
              Selected: {{ JSON.stringify(selected) }}
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="row">
      <div class="col">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, Ref, ref,
} from 'vue'
import { TestAUTInterface } from 'src/Models/TestAUT';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestStepInterface } from 'src/Models/TestStep';
import { TestParamInterface } from 'src/Models/TestParam';
import _ from 'lodash'
import { TestEnvFlatNodeInterface } from 'src/Models/TestEnvFlatNode';
import { FlatKeywordInterface } from 'src/Models/FlatKeyword';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import DetailContextMenu from './ContextMenu/DetailContextMenu.vue'
import TestAUT from './TestCaseDetail/TestAUT.vue';
import Keyword from './TestCaseDetail/Keyword.vue';
import Parameter from './TestCaseDetail/Parameter.vue';
import No from './TestCaseDetail/No.vue';
import AddDescriptionDialog from './Dialog/AddDescriptionDialog.vue';

export default defineComponent({
  name: 'Detail',
  components: {
    DetailContextMenu,
    'test-aut': TestAUT,
    Keyword,
    Parameter,
    No,
  },
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const showByIndex = ref(null)
    const selectedKeyword = ref('')
    const selected: Ref<any[]> = ref([])
    const columns = ref(
      [
        {
          name: 'no',
          required: true,
          label: 'No',
          align: 'left',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          field: 'rowIndex',
          sortable: false,
          style: 'max-width: 40px',
          headerStyle: 'max-width: 40px',
        },
        {
          name: 'testAUT',
          align: 'center',
          label: 'TestAUT',
          field: 'TestAUT',
          sortable: false,
          style: 'min-width: 80px; max-width: 100px',
          headerStyle: 'min-width: 80px; max-width: 100px',
        },
        {
          name: 'keyword',
          label: 'Keyword',
          field: 'Keyword',
          sortable: false,
          align: 'left',
          style: 'min-width: 150px;',
          headerStyle: 'min-width: 150px',
        },
        {
          name: 'param1',
          label: 'Param 1',
          field: 'Param1',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param2',
          label: 'Param 2',
          field: 'Param2',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param3',
          label: 'Param 3',
          field: 'Param3',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param4',
          label: 'Param 4',
          field: 'Param4',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param5',
          label: 'Param 5',
          field: 'Param5',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param6',
          label: 'Param 6',
          field: 'Param6',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param7',
          label: 'Param 7',
          field: 'Param7',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param8',
          label: 'Param 8',
          field: 'Param8',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param9',
          label: 'Param 9',
          field: 'Param9',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param10',
          label: 'Param 10',
          field: 'Param10',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param11',
          label: 'Param 11',
          field: 'Param11',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param12',
          label: 'Param 12',
          field: 'Param12',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param13',
          label: 'Param 13',
          field: 'Param13',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param14',
          label: 'Param 14',
          field: 'Param14',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param15',
          label: 'Param 15',
          field: 'Param15',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param16',
          label: 'Param 16',
          field: 'Param16',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param17',
          label: 'Param 17',
          field: 'Param17',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param18',
          label: 'Param 18',
          field: 'Param18',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param19',
          label: 'Param 19',
          field: 'Param19',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param20',
          label: 'Param 20',
          field: 'Param20',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
      ],
    )
    const selectedTestCaseId: Ref<string> = computed({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      get: () => $store.getters['testcase/selectedTestCaseId'],
      set: (val) => {
        $store.commit('testcase/setSelectedTestCaseId', val);
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const openedTCs: Ref<TestCaseInterface[]> = computed(() => $store.getters['testcase/openedTCs'])
    function closeTab(testcase: TestCaseInterface) {
      $store.commit('testcase/removeOpenedTC', testcase)
    }
    function changeKeyword(testCase: TestCaseInterface, testStep: TestStepInterface, newKeyword: FlatKeywordInterface) {
      // find edited testStep
      const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      tempTC.TestSteps[stepIndex].Params = []
      tempTC.TestSteps[stepIndex].Keyword = newKeyword;
      tempTC.TestSteps[stepIndex].KWFeature = newKeyword.Feature;
      tempTC.TestSteps[stepIndex].KWCategory = newKeyword.Category;
      // add default Params to testCase based on number of params of Keyword
      newKeyword.Params.forEach((pr: TestParamInterface) => {
        const prClone = _.cloneDeep(pr)
        prClone.TestNodePath = ''
        tempTC.TestSteps[stepIndex].Params.push(prClone);
      })
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }

    function changeTestAUT(testCase: TestCaseInterface, testStep: TestStepInterface, newTestAUT: TestAUTInterface) {
      // find edited testStep
      const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      tempTC.TestSteps[stepIndex].TestAUTId = newTestAUT.Id;
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }

    function changeParam(testCase: TestCaseInterface, testStep: TestStepInterface, paramIndex: number, newValue: string) {
      const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      tempTC.TestSteps[stepIndex].Params[paramIndex].Value = newValue;
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }

    function useTestEnv(testCase: TestCaseInterface, testStep: TestStepInterface, paramIndex: number, testEnvNode: TestEnvFlatNodeInterface) {
      const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      tempTC.TestSteps[stepIndex].Params[paramIndex].TestNodePath = `${testEnvNode.Category}/${testEnvNode.Name}`
      tempTC.TestSteps[stepIndex].Params[paramIndex].Value = testEnvNode.Value;
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }

    function onRowHover(params: any) {
      columns.value.forEach((col: any, index: number) => {
        if (index >= 3) {
          if (params.length > index - 3) {
            columns.value[index].label = params[index - 3].Name
          } else {
            columns.value[index].label = ''
          }
        }
      })
    }

    function toggleSelectedRow(row: any) {
      if (selected.value.length > 0) { // We can add another row
        // But if clicking one already selected, we'll remove it instead
        let i = 0
        const matched = selected.value.find((item: any, index: number) => {
          i = index
          return item.UUID === row.UUID
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
    function getRowIndexByUUID(currentTest: TestCaseInterface, uuid: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const index: number = currentTest.TestSteps.findIndex((step: TestStepInterface) => step.UUID === uuid)
      if (index === -1) return 0
      return index
    }

    // With Shift pressed, select contiguous group
    function toggleRowGroup(row: any) {
      if (selected.value.length === 1) { // There is a previous selection
        // Select contiguous block from previous selection to this one
        // But if clicked one already selected, remove any selected since then
        const matched = selected.value.find((item: any) => item.UUID === row.UUID)
        if (matched) { // Had already selected this one --> do nothing
        } else { // New selection - add it and any between
          // find selected testcase
          const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === selectedTestCaseId.value) as TestCaseInterface

          // find previous selected teststep
          const previousSelectedStep = currTestCase.TestSteps.find((step: TestStepInterface) => step.UUID === selected.value[0].UUID) as TestStepInterface

          // get index for previousSelectedStep and currentSelectedStep
          const previousIndex = getRowIndexByUUID(currTestCase, previousSelectedStep.UUID)
          const currentIndex = getRowIndexByUUID(currTestCase, row.UUID)

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
            selected.value.push(currTestCase.TestSteps[index])
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

    // With no key pressed - single selection
    function toggleSingleRow(row: any) {
      console.log('row', row)
      selected.value = []
      selected.value.push(row)
    }

    function onTabChanging() {
      columns.value.forEach((col: any, index: number) => {
        if (index >= 3) {
          columns.value[index].label = `Param ${index - 2}`
        }
      })
    }

    function addNewStep(testCaseId: string) {
      $store.commit('testcase/addNewStep', testCaseId);
    }

    function onDeleteRows() {
      const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === selectedTestCaseId.value) as TestCaseInterface
      selected.value.forEach((selectedRow: any) => {
        currTestCase.TestSteps.forEach((testStep: TestStepInterface) => {
          if (testStep.UUID === selectedRow.UUID) {
            $store.commit('testcase/deleteStep', { testCaseId: selectedTestCaseId.value, stepUUID: selectedRow.UUID });
          }
        })
      })
    }

    function onInsertDescription(testCase: TestCaseInterface, testStep: TestStepInterface) {
      // open new AddDescriptionDialog dialog
      $q.dialog({
        component: AddDescriptionDialog,
      }).onOk((newDescription: string) => {
        // TODO: handle ok
        if (newDescription) {
          const stepIndex: number = testCase.TestSteps.indexOf(testStep);
          const tempTC: TestCaseInterface = _.cloneDeep(testCase)
          tempTC.TestSteps[stepIndex].Description = newDescription;
          $store.commit('testcase/updateOpenedTCs', tempTC)
          $store.commit('category/updateTestCase', tempTC)
        }
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }

    async function saveTestCase(testCaseId: string) {
      try {
        const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === testCaseId) as TestCaseInterface
        const result = await $store.dispatch('testcase/saveTestCase', currTestCase)
        $q.notify({
          type: 'positive',
          message: result.message,
        });
      } catch (error) {
        $q.notify({
          type: 'warning',
          message: error.error,
        });
      }
    }

    function updateDescription(testCase: TestCaseInterface, testStep: TestStepInterface, newTSDescription: string) {
      const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      tempTC.TestSteps[stepIndex].Description = newTSDescription;
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }
    function filterMethod(rows: TestStepInterface[], filter: string): TestStepInterface[] {
      let filtered: TestStepInterface[] = []
      console.log('rows', rows)
      console.log('filter', filter)
      filtered = rows.filter((row: TestStepInterface) => {
        if (!row.Keyword?.Name.toLowerCase().includes(filter.toLowerCase())
          && !row.Params.some((pr: TestParamInterface) => pr.Value?.toLowerCase().includes(filter.toLowerCase()))) return false
        return true
      })
      return filtered
    }

    return {
      filterMethod,
      onInsertDescription,
      updateDescription,
      showByIndex,
      columns,
      openedTCs,
      closeTab,
      changeParam,
      changeKeyword,
      onRowHover,
      selected,
      toggleSelectedRow,
      toggleRowGroup,
      toggleSingleRow,
      onTabChanging,
      addNewStep,
      selectedKeyword,
      onDeleteRows,
      saveTestCase,
      changeTestAUT,
      selectedTestCaseId,
      useTestEnv,
      filterTable: ref(''),
    };
  },
});
</script>

<style scoped lang="scss">
:deep .q-tab {
  padding-right: 2px;
  padding-left: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
}
:deep .q-tab-panel {
  padding: 1px;
}

:deep td.q-c-input {
  padding-right: 1px;
  padding-left: 1px;
  padding-top: 0px;
  padding-bottom: 0px;
}

:deep td.q-c-input .q-field__native {
  padding-right: 0px;
  padding-left: 0px;
  padding-top: 1px;
  padding-bottom: 1px;
}
</style>
