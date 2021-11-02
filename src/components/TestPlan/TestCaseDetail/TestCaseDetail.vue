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
          <q-tab v-for="testcase in openedTCs" :key="testcase.Id" :name="testcase.Id" :ripple="false" @mouseover="showByIndex = testcase.Id" @mouseout="showByIndex = ''">
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
              :class="[isDark ? 'sticky-header-dark': 'sticky-header-light']"
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
              :selected-rows-label="getSelectedString"
            >
              <template v-slot:top-left>
                <q-input borderless dense debounce="300" v-model="filterTable" placeholder="Filter">
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
                <q-tr v-show="props.row.Description" :props="props" class="tsDescription">
                  <q-td colspan="100%" style="padding: 0px;">
                    <q-input
                      :model-value="props.row.Description"
                      dense
                      borderless
                      @update:model-value="updateDescription(tc, props.row, $event)"
                      debounce="500"
                      style="font-style: oblique;"
                      class="items-center"
                    >
                      <template v-slot:before>
                        <q-icon name="notes" style="font-size: 0.9rem;" />
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
                  :class="disabledStyle(props.row)"
                  >
                  <q-td key="no" :props="props" class="q-c-input">
                    <no :TestStep="props.row" :Index="props.rowIndex + 1"
                      @insertDescription="onInsertDescription(tc, $event)"
                      @enableRows="onEnableRows()"
                      @disableRows="onDisableRows()"
                      @copyTestSteps="onCopyTestSteps(tc)"
                      @cutTestSteps="onCutTestSteps(tc)"
                      @pasteTestSteps="onPasteTestSteps(tc)"
                      @deleteTestSteps="onDeleteTestSteps()"
                      @beforeShowDialog="onBeforeShowDialog(tc, props.row)"
                      @insertTestSteps="onInsertTestSteps(tc, 1)"
                      @insertPasteTestSteps="onInsertPasteTestSteps(tc)"
                    ></no>
                  </q-td>
                  <q-td key="testAUT" :props="props" class="q-c-input">
                    <test-aut :TestStep="props.row" @changeTestAUT="changeTestAUT(tc, props.row, $event)"></test-aut>
                  </q-td>
                  <q-td key="keyword" :props="props" class="q-c-input">
                    <keyword :TestStep="props.row"
                    @changeKeyword="changeKeyword(tc, props.row, $event)"
                    @editTestStep="editTestStep(tc, props.row)" />
                  </q-td>
                  <q-td v-for="index in 20" :key="index" class="q-c-input">
                    <parameter
                      :TestStep="props.row"
                      :ParamIndex="index-1"
                      @changeParam="changeParam(tc, props.row, index-1, $event)"
                      @useTestEnv="onUseTestEnv(tc, props.row, index-1)"
                      @unUseTestEnv="onUnUseTestEnv(tc, props.row, index-1, $event)"
                      >
                    </parameter>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-btn color="primary" label="New Step" @click="addNewStep(selectedTestCaseId)"></q-btn>
            <q-btn color="primary" label="Save" @click="saveTestCase(selectedTestCaseId)"></q-btn>
            <div class="q-mt-md">
              Selected:
              <ul>
                <li v-for="value in selected" :key="value.UUID">
                  {{value.UUID}}
                </li>
              </ul>
            </div>
            <div class="q-mt-md">
              Copied:
              <ul>
                <li v-for="value in copiedTestSteps" :key="value.UUID">
                  {{value.UUID}}
                </li>
              </ul>
            </div>
            <div class="q-mt-md">
              {{rightClickIndex}}
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
import uuid from 'uuid-random'
import { TestEnvFlatNodeInterface } from 'src/Models/TestEnvFlatNode';
import { FlatKeywordInterface } from 'src/Models/FlatKeyword';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import TestAUT from './Cells/TestAUT.vue';
import Keyword from './Cells/Keyword.vue';
import Parameter from './Cells/Parameter.vue';
import No from './Cells/No.vue';
import AddDescriptionDialog from './Dialog/AddDescriptionDialog.vue';
import TestEnvironmentDialog from './Dialog/TestEnvironmentDialog.vue';
import CloseTestCaseDialog from './Dialog/CloseTestCaseDialog.vue';
import KeywordEditorDialog from './Dialog/KeywordEditorDialog.vue';

export default defineComponent({
  name: 'TestCaseDetail',
  components: {
    'test-aut': TestAUT,
    Keyword,
    Parameter,
    No,
  },
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const showByIndex = ref('')
    const selectedKeyword = ref('')
    const selected: Ref<any[]> = ref([])
    const isDark = computed(() => $store.getters['global/darkTheme']);
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
    const rightClickIndex = ref(-1)
    const selectedTestCaseId: Ref<string> = computed({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      get: () => $store.getters['testcase/selectedTestCaseId'],
      set: (val) => {
        $store.commit('testcase/setSelectedTestCaseId', val);
      },
    })

    function disabledStyle(row: TestStepInterface) {
      if (row.IsDisabled) {
        if (isDark.value) return 'disabledDark'
        return 'disabledLight'
      } return ''
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const openedTCs: Ref<TestCaseInterface[]> = computed(() => $store.getters['testcase/openedTCs'])
    const copiedTestSteps: Ref<TestStepInterface[]> = computed(() => $store.getters['teststep/copiedTestSteps'])
    async function saveTestCase(testCaseId: string) {
      try {
        const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === testCaseId) as TestCaseInterface
        const result = await $store.dispatch('testcase/saveTestCase', currTestCase)
        $q.notify({
          type: 'positive',
          message: result.message,
        });
      } catch (error: any) {
        $q.notify({
          type: 'warning',
          message: error.error,
        });
      }
    }
    async function closeTab(testcase: TestCaseInterface) {
      // check if testcase is modified or not
      let isModified = false
      // get testcase from database then verify with current one
      const originalTestCase = await $store.dispatch('testcase/getTestCaseById', testcase.Id) as TestCaseInterface;
      console.log('originalTestCase', originalTestCase.TestSteps)
      console.log('testCase', testcase.TestSteps)
      if (originalTestCase.TestSteps.length !== testcase.TestSteps.length) {
        isModified = true
      } else {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < originalTestCase.TestSteps.length; i++) {
          if (originalTestCase.TestSteps[i].UUID !== testcase.TestSteps[i].UUID) {
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].TestAUTId !== testcase.TestSteps[i].TestAUTId) {
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].Keyword?.Name !== testcase.TestSteps[i].Keyword?.Name) {
            console.log('0')
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].Description !== testcase.TestSteps[i].Description) {
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].IsDisabled !== testcase.TestSteps[i].IsDisabled) {
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].IsComment !== testcase.TestSteps[i].IsComment) {
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].KWFeature !== testcase.TestSteps[i].KWFeature) {
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].KWCategory !== testcase.TestSteps[i].KWCategory) {
            isModified = true
            break
          }
          if (originalTestCase.TestSteps[i].Params.length !== testcase.TestSteps[i].Params.length) {
            isModified = true
            break
          }
          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < originalTestCase.TestSteps[i].Params.length; j++) {
            if (originalTestCase.TestSteps[i].Params[j].Name !== testcase.TestSteps[i].Params[j].Name) {
              isModified = true
              break
            }
            if (originalTestCase.TestSteps[i].Params[j].TestNodePath !== testcase.TestSteps[i].Params[j].TestNodePath) {
              console.log('1')
              isModified = true
              break
            }
            if (originalTestCase.TestSteps[i].Params[j].TestNodePath === '' && originalTestCase.TestSteps[i].Params[j].Value !== testcase.TestSteps[i].Params[j].Value) {
              console.log('2')
              isModified = true
              break
            }
          }
        }
      }
      // if (originalTestCase) {
      //   if (_.isEqual(originalTestCase.TestSteps, testcase.TestSteps)) isModified = false
      //   else isModified = true
      // }

      if (isModified) {
        $q.dialog({
          component: CloseTestCaseDialog,
        }).onOk((response: 'Save' | 'Discard') => {
          switch (response) {
            case 'Save':
              console.log('Save')
              void saveTestCase(testcase.Id)
              $store.commit('testcase/removeOpenedTC', testcase)
              break;
            case 'Discard':
              console.log('Discard')
              $store.commit('testcase/removeOpenedTC', testcase)
              break;
            default:
              break;
          }
        }).onCancel(() => {
          // TODO
        }).onDismiss(() => {
          // TODO
        })
      } else {
        $store.commit('testcase/removeOpenedTC', testcase)
      }
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

    function editTestStep(testCase: TestCaseInterface, testStep: TestStepInterface) {
      console.log('editTestStep', testCase, testStep)
      // find edited testStep
      // const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      // const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      $q.dialog({
        component: KeywordEditorDialog,
        componentProps: {
          TestCase: testCase,
          TestStep: testStep,
        },
      }).onOk((testStepUpdated: TestStepInterface) => {
        console.log('testStep updated', testStepUpdated)
        const stepIndex = testCase.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStepUpdated.UUID)
        if (stepIndex === -1) return
        const tempTC = _.cloneDeep(testCase)
        tempTC.TestSteps[stepIndex] = testStepUpdated;
        $store.commit('testcase/updateOpenedTCs', tempTC)
        $store.commit('category/updateTestCase', tempTC)
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
      // $store.commit('testcase/updateOpenedTCs', tempTC)
      // $store.commit('category/updateTestCase', tempTC)
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

    function updateTestEnvValue(testCase: TestCaseInterface, testStep: TestStepInterface, paramIndex: number, testEnvNode: TestEnvFlatNodeInterface) {
      const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      tempTC.TestSteps[stepIndex].Params[paramIndex].TestNodePath = `${testEnvNode.Category}/${testEnvNode.Name}`
      tempTC.TestSteps[stepIndex].Params[paramIndex].Value = testEnvNode.Value;
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }

    function onUnUseTestEnv(testCase: TestCaseInterface, testStep: TestStepInterface, paramIndex: number, currentValue: string) {
      const stepIndex: number = testCase.TestSteps.indexOf(testStep);
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      tempTC.TestSteps[stepIndex].Params[paramIndex].TestNodePath = ''
      tempTC.TestSteps[stepIndex].Params[paramIndex].Value = currentValue
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
    function getRowIndexByUUID(currentTest: TestCaseInterface, uid: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const index: number = currentTest.TestSteps.findIndex((step: TestStepInterface) => step.UUID === uid)
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

    function onDeleteTestSteps() {
      const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === selectedTestCaseId.value) as TestCaseInterface
      selected.value.forEach((selectedTestStep: TestStepInterface) => {
        currTestCase.TestSteps.forEach((testStep: TestStepInterface) => {
          if (testStep.UUID === selectedTestStep.UUID) {
            $store.commit('testcase/deleteStep', { testCaseId: selectedTestCaseId.value, stepUUID: selectedTestStep.UUID });
          }
        })
      })
      selected.value = []
    }

    function onEnableRows() {
      const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === selectedTestCaseId.value) as TestCaseInterface
      selected.value.forEach((selectedRow: any) => {
        currTestCase.TestSteps.forEach((testStep: TestStepInterface) => {
          if (testStep.UUID === selectedRow.UUID) {
            $store.commit('testcase/enableStep', { testCaseId: selectedTestCaseId.value, stepUUID: selectedRow.UUID });
          }
        })
      })
    }

    function onDisableRows() {
      const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === selectedTestCaseId.value) as TestCaseInterface
      selected.value.forEach((selectedRow: any) => {
        currTestCase.TestSteps.forEach((testStep: TestStepInterface) => {
          if (testStep.UUID === selectedRow.UUID) {
            $store.commit('testcase/disableStep', { testCaseId: selectedTestCaseId.value, stepUUID: selectedRow.UUID });
          }
        })
      })
    }

    function onCopyTestSteps(testCase: TestCaseInterface) {
      selected.value.sort((a, b) => testCase.TestSteps.indexOf(a) - testCase.TestSteps.indexOf(b));
      if (selected.value.length > 0) {
        $store.commit('teststep/setCopiedTestSteps', selected.value);
      }
    }
    function onCutTestSteps(testCase: TestCaseInterface) {
      onCopyTestSteps(testCase)
      onDeleteTestSteps()
    }

    function onInsertTestSteps(testCase: TestCaseInterface, number: number) {
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      let lastTestAUTId = '';
      if (tempTC.TestSteps.length > 0) { // incase there's no testSteps
        lastTestAUTId = tempTC.TestSteps[rightClickIndex.value].TestAUTId
      }
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < number; index++) {
        tempTC.TestSteps.splice(rightClickIndex.value, 0, {
          UUID: uuid(),
          TestAUTId: lastTestAUTId,
          Description: '',
          Params: [],
          IsDisabled: false,
          IsComment: false,
          KWFeature: '',
          KWCategory: '',
        })
      }
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }

    function onPasteTestSteps(testCase: TestCaseInterface) {
      if (copiedTestSteps.value.length === 0) return
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      copiedTestSteps.value.forEach((copyTS: TestStepInterface) => {
        console.log('before', rightClickIndex.value)
        tempTC.TestSteps[rightClickIndex.value] = copyTS
        rightClickIndex.value += 1
        console.log('after', rightClickIndex.value)
      })
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
    }

    function onInsertPasteTestSteps(testCase: TestCaseInterface) {
      const tempTC: TestCaseInterface = _.cloneDeep(testCase)
      if (copiedTestSteps.value.length === 0) return
      // insert blank test step
      let lastTestAUTId = '';
      if (tempTC.TestSteps.length > 0) { // incase there's no testSteps
        lastTestAUTId = tempTC.TestSteps[rightClickIndex.value].TestAUTId
      }
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < copiedTestSteps.value.length; index++) {
        tempTC.TestSteps.splice(rightClickIndex.value, 0, {
          UUID: uuid(),
          TestAUTId: lastTestAUTId,
          Description: '',
          Params: [],
          IsDisabled: false,
          IsComment: false,
          KWFeature: '',
          KWCategory: '',
        })
      }
      // paste copiedTestSteps
      copiedTestSteps.value.forEach((copyTS: TestStepInterface) => {
        console.log('before', rightClickIndex.value)
        tempTC.TestSteps[rightClickIndex.value] = copyTS
        rightClickIndex.value += 1
        console.log('after', rightClickIndex.value)
      })
      $store.commit('testcase/updateOpenedTCs', tempTC)
      $store.commit('category/updateTestCase', tempTC)
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

    function onBeforeShowDialog(testCase: TestCaseInterface, testStep: TestStepInterface) {
      if (selected.value.length > 1) return
      if (!selected.value.some((ts: TestStepInterface) => ts.UUID === testStep.UUID)) {
        selected.value = []
        selected.value.push(testStep)
      }
      rightClickIndex.value = testCase.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStep.UUID)
      console.log('rightClickIndex', rightClickIndex)
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

    function onUseTestEnv(testCase: TestCaseInterface, testStep: TestStepInterface, index: number) {
      // open new testEnv dialog
      $q.dialog({
        component: TestEnvironmentDialog,
      }).onOk((node: TestEnvFlatNodeInterface) => {
        // TODO: handle ok
        console.log('node', node)
        if (node) {
          updateTestEnvValue(testCase, testStep, index, node)
        }
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }

    function getSelectedString() {
      return selected.value.length === 0 ? '' : `${selected.value.length} step${selected.value.length > 1 ? 's' : ''} selected.`
    }

    return {
      editTestStep,
      onUseTestEnv,
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
      onDeleteTestSteps,
      onEnableRows,
      onDisableRows,
      onBeforeShowDialog,
      saveTestCase,
      changeTestAUT,
      selectedTestCaseId,
      updateTestEnvValue,
      filterTable: ref(''),
      onUnUseTestEnv,
      disabledStyle,
      isDark,
      getSelectedString,
      onCopyTestSteps,
      onCutTestSteps,
      onPasteTestSteps,
      copiedTestSteps,
      rightClickIndex,
      onInsertTestSteps,
      onInsertPasteTestSteps,
    };
  },
});
</script>

<style scoped lang="scss">
:deep input.q-field__native {
  padding: 0px;
}
:deep tr.tsDescription label {
  height: -webkit-fill-available;
}
:deep tr.tsDescription label .q-field__marginal{
  height: -webkit-fill-available;
}
:deep tr.tsDescription label .q-field__control{
  height: -webkit-fill-available;
}
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
:deep(.disabledDark) {
  background-color: $blue-grey-14;
  font-style: italic;
}
:deep(.disabledLight) {
  background-color: $grey-6;
  font-style: italic;
}
.sticky-header-dark {  /* height or max-height is important */
  max-height: 790px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {    /* bg color is important for th; just specify one */
    background-color: $dark;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {    /* height of all previous header rows */
    top: 48px;
  }
}
.sticky-header-light {  /* height or max-height is important */
  max-height: 790px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {    /* bg color is important for th; just specify one */
    background-color: $light-green-1;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {    /* height of all previous header rows */
    top: 48px;
  }
}
</style>
