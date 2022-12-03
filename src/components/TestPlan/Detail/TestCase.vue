<template>
  <q-table
    :class="[isDark ? 'sticky-header-dark' : 'sticky-header-light']"
    dense
    :rows="TestCase.TestSteps"
    :columns="columns"
    row-key="UUID"
    :hide-pagination="true"
    separator="cell"
    :wrap-cells="false"
    selection="multiple"
    v-model:selected="selectedTestSteps"
    :rows-per-page-options="[0]"
    no-data-label="Test case has no step"
    :filter="filterTable"
    :filter-method="filterMethod"
    :selected-rows-label="getSelectedString"
  >
    <template v-slot:top-left>
      <q-input dense debounce="300" v-model="filterTable" placeholder="Filter" class="q-mr-sm">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn color="primary" flat icon="code" class="q-mr-sm" @click="viewGenerateCode(TestCase)">
        <q-tooltip style="font-size: small">View generate code</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="cached" class="q-mr-sm" @click="getLastResult(TestCase)">
        <q-tooltip style="font-size: small">Get latest result</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="play_arrow" class="q-mr-sm" @click="runTestCase(TestCase)">
        <q-tooltip style="font-size: small">Run</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="save" class="q-mr-sm" @click="saveTestCase()">
        <q-tooltip style="font-size: small">Save</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="undo" class="q-mr-sm" :disable="!canUndo" @click="undo()"> </q-btn>
      <q-btn color="primary" flat icon="redo" class="q-mr-sm" :disable="!canRedo" @click="redo()"> </q-btn>
      <q-btn color="primary" flat icon="run_circle" class="q-mr-sm" @click="viewDevRunning(TestCase.Id)">
        <q-tooltip style="font-size: small">View Last Dev Running</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="directions_run" class="q-mr-sm" @click="viewRegressionRunning()">
        <q-tooltip style="font-size: small">View Last Regression Running</q-tooltip>
      </q-btn>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-bold text-primary">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr v-show="props.row.Description" :props="props" class="tsDescription">
        <q-td colspan="100%" style="padding: 0px">
          <q-input
            :model-value="props.row.Description"
            dense
            borderless
            @update:model-value="updateDescription(props.row, $event as string)"
            debounce="500"
            style="font-style: oblique"
            class="items-center"
          >
            <template v-slot:before>
              <q-icon name="notes" style="font-size: 0.9rem" />
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
          <no
            :TestStep="props.row"
            :Index="props.rowIndex + 1"
            @insertDescription="onInsertDescription($event)"
            @enableRows="onEnableRows()"
            @disableRows="onDisableRows()"
            @copyTestSteps="onCopyTestSteps()"
            @cutTestSteps="onCutTestSteps()"
            @pasteTestSteps="onPasteTestSteps()"
            @deleteTestSteps="onDeleteTestSteps()"
            @beforeShowDialog="onBeforeShowDialog(props.row)"
            @insertTestSteps="onInsertTestSteps(1)"
            @insertPasteTestSteps="onInsertPasteTestSteps()"
            @editTestStep="editTestStep(props.row)"
            @searchKeyword="searchKeyword(props.row)"
          ></no>
        </q-td>
        <q-td key="testAUT" :props="props" class="q-c-input">
          <test-a-u-t
            :TestStep="props.row"
            @changeTestAUT="changeTestAUT(props.row, $event)"
            @insertDescription="onInsertDescription($event)"
            @enableRows="onEnableRows()"
            @disableRows="onDisableRows()"
            @copyTestSteps="onCopyTestSteps()"
            @cutTestSteps="onCutTestSteps()"
            @pasteTestSteps="onPasteTestSteps()"
            @deleteTestSteps="onDeleteTestSteps()"
            @beforeShowDialog="onBeforeShowDialog(props.row)"
            @insertTestSteps="onInsertTestSteps(1)"
            @insertPasteTestSteps="onInsertPasteTestSteps()"
            @editTestStep="editTestStep(props.row)"
            @searchKeyword="searchKeyword(props.row)"
          >
          </test-a-u-t>
        </q-td>
        <q-td key="keyword" :props="props" class="q-c-input">
          <keyword
            :TestStep="props.row"
            @changeKeyword="changeKeyword(props.row, $event)"
            @insertDescription="onInsertDescription($event)"
            @enableRows="onEnableRows()"
            @disableRows="onDisableRows()"
            @copyTestSteps="onCopyTestSteps()"
            @cutTestSteps="onCutTestSteps()"
            @pasteTestSteps="onPasteTestSteps()"
            @deleteTestSteps="onDeleteTestSteps()"
            @beforeShowDialog="onBeforeShowDialog(props.row)"
            @insertTestSteps="onInsertTestSteps(1)"
            @insertPasteTestSteps="onInsertPasteTestSteps()"
            @editTestStep="editTestStep(props.row)"
            @searchKeyword="searchKeyword(props.row)"
          />
        </q-td>
        <q-td v-for="index in 20" :key="index" class="q-c-input">
          <parameter
            :TestStep="props.row"
            :ParamIndex="index - 1"
            @changeParam="changeParam(props.row, index - 1, $event)"
            @useTestEnv="onUseTestEnv(props.row, index - 1)"
            @unUseTestEnv="onUnUseTestEnv(props.row, index - 1, $event)"
            @insertDescription="onInsertDescription($event)"
            @enableRows="onEnableRows()"
            @disableRows="onDisableRows()"
            @copyTestSteps="onCopyTestSteps()"
            @cutTestSteps="onCutTestSteps()"
            @pasteTestSteps="onPasteTestSteps()"
            @deleteTestSteps="onDeleteTestSteps()"
            @beforeShowDialog="onBeforeShowDialog(props.row)"
            @insertTestSteps="onInsertTestSteps(1)"
            @insertPasteTestSteps="onInsertPasteTestSteps()"
            @editTestStep="editTestStep(props.row)"
            @searchKeyword="searchKeyword(props.row)"
          >
          </parameter>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <q-separator class="q-mt-sm q-mb-sm" />
  <q-btn outline color="primary" label="New Step" @click="addNewStep()" icon="add"></q-btn>
</template>

<script lang="ts">
export default {
  name: 'TestCase',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, ref, defineProps, Ref } from 'vue';
import { useQuasar } from 'quasar';
import TestAUT from './Cells/TestAUT.vue';
import Keyword from './Cells/Keyword.vue';
import Parameter from './Cells/Parameter.vue';
import { FlatKeywordInterface } from '../../../Models/FlatKeyword';
import No from './Cells/No.vue';
import { TestCaseInterface } from '../../../Models/TestCase';
import { useGlobalStore } from '../../../pinia/globalStore';
import { TestStepInterface } from '../../../Models/TestStep';
import { testCaseColumns } from '../../../components/tableColumns';
import uuid from 'uuid-random';
import _ from 'lodash';
import { useRefHistory } from '@vueuse/core';
import ViewGenerateCodeDialog from '../Tree/Dialog/ViewGenerateCodeDialog.vue';
import { useTestClientStore } from '../../../pinia/testClientStore';
import { UpdateTestCaseDataInterface } from '../../../Models/Entities/UpdateTestCaseData';
import SaveTestCaseDialog from './Dialog/SaveTestCaseDialog.vue';
import TestEnvironmentDialog from './Dialog/TestEnvironmentDialog.vue';
import { useUserStore } from '../../../pinia/userStore';
import { TestCaseHistoryInterface } from '../../../Models/TestCaseHistory';
import { useTestCaseStore } from '../../../pinia/testCaseStore';
import AddDescriptionDialog from './Dialog/AddDescriptionDialog.vue';
import { useTestStepStore } from '../../../pinia/testStepStore';
import { TestParamInterface } from '../../../Models/TestParam';
import KeywordEditorDialog from './Dialog/KeywordEditorDialog.vue';
import SearchKeywordDialog from './Dialog/SearchKeywordDialog.vue';
import { TestEnvNodeInterface } from '../../../Models/TestEnv';
import { TestAUTInterface } from '../../../Models/TestAUT';
import { useCategoryStore } from '../../../pinia/categoryStore';
import { TestStatus } from '../../../Models/TestStatus';
import DevLogDialog from '../../DevMonitoring/Dialog/DevLogDialog.vue';
import { DevRunRecordInterface } from '../../../Models/DevRunRecord';
import { useDevMonitoringStore } from '../../../pinia/devMonitoringStore';

const props = defineProps<{
  TestCaseProp: TestCaseInterface;
}>();

const TestCase = ref(props.TestCaseProp);
const filterTable = ref('');
const { undo, redo, canUndo, canRedo } = useRefHistory(TestCase, { deep: true });
const globalStore = useGlobalStore();
const devMonitoringStore = useDevMonitoringStore();
const $q = useQuasar();
const isDark = computed(() => globalStore.darkTheme);
const columns = ref(testCaseColumns);
const testClientStore = useTestClientStore();
const userStore = useUserStore();
const testCaseStore = useTestCaseStore();
const testStepStore = useTestStepStore();
const selectedTestClient = computed(() => testClientStore.selectedTestClient);
const selectedTestSteps: Ref<TestStepInterface[]> = ref([]);
const copiedTestSteps: Ref<TestStepInterface[]> = computed(() => testStepStore.copiedTestSteps);
const rightClickIndex = ref(-1);
const categoryStore = useCategoryStore();

function disabledStyle(row: TestStepInterface) {
  if (row.IsDisabled) {
    if (isDark.value) return 'disabledDark';
    return 'disabledLight';
  }
  return '';
}
function onRowHover(params: any) {
  columns.value.forEach((col: any, index: number) => {
    if (index >= 3) {
      if (params.length > index - 3) {
        columns.value[index].label = params[index - 3].Name;
      } else {
        columns.value[index].label = '';
      }
    }
  });
}

function addNewStep() {
  let lastTestAUTId = '';
  if (TestCase.value.TestSteps.length > 0) {
    // incase there's no testSteps
    lastTestAUTId = TestCase.value.TestSteps[TestCase.value.TestSteps.length - 1].TestAUTId;
  }
  TestCase.value.TestSteps.push({
    UUID: uuid(),
    TestAUTId: lastTestAUTId,
    Description: '',
    Params: [],
    IsDisabled: false,
    KWFeature: '',
    KWCategory: '',
    Log: '',
    Status: TestStatus.NotRun,
    Keyword: {
      Name: '',
      Description: '',
      Owner: '',
      Params: null,
    },
    ErrorScreenshotId: '',
    ScreenshotIds: [],
  });
}

async function viewGenerateCode(testCase: TestCaseInterface) {
  console.log('viewGeneraeCode testCase', testCase);
  $q.dialog({
    component: ViewGenerateCodeDialog,
    componentProps: {
      TestCase: TestCase.value,
    },
  })
    .onOk(() => {
      // TODO
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}

async function runTestCase(TestCase: TestCaseInterface) {
  // check client is selected or not
  if (selectedTestClient.value === undefined) {
    $q.notify({
      type: 'negative',
      message: 'No test client is selected',
    });
    return;
  }
  // generate code
  console.log('generate code');
  try {
  } catch (error) {}
  const generateDevCodeResult: Promise<any> = globalStore.generateDevCode([TestCase]);
  generateDevCodeResult
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Generate code successfully',
      });
      const buildResult: Promise<any> = globalStore.buildProject();
      buildResult
        .then(() => {
          $q.notify({
            type: 'positive',
            message: 'Build project successfully',
          });
          const deployCodeResult: Promise<any> = globalStore.copydevcodetoclient(selectedTestClient.value);
          deployCodeResult
            .then(() => {
              $q.notify({
                type: 'positive',
                message: `Deploy Code to ${selectedTestClient.value.Name} successfully`,
              });
              const createDevQueueResult: Promise<any> = globalStore.createDevQueue({
                testcases: [TestCase],
                testClient: selectedTestClient.value,
              });
              createDevQueueResult
                .then(() => {
                  $q.notify({
                    type: 'positive',
                    message: 'Create Dev Queue successfully',
                  });
                })
                .catch((error) => {
                  $q.notify({
                    type: 'negative',
                    message: `Create Dev Queue failed: ${error}`,
                  });
                  return;
                });
            })
            .catch((error) => {
              $q.notify({
                type: 'negative',
                message: `Deploy Code failed: ${error}`,
              });
              return;
            });
        })
        .catch((error) => {
          $q.notify({
            type: 'negative',
            message: `Build project failed ${error}`,
          });
          return;
        });
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: `Generate code failed ${error}`,
      });
      return;
    });
}

function saveTestCase() {
  $q.dialog({
    component: SaveTestCaseDialog,
    componentProps: {
      TestCase: TestCase.value,
    },
  })
    .onOk(async (saveMessage: string) => {
      try {
        const updateTestCaseData: UpdateTestCaseDataInterface = {
          UpdateBy: userStore.Username,
          UpdateMessage: saveMessage,
          UpdateType: 'Change TestStep',
        };
        const testCaseHistory: TestCaseHistoryInterface = {
          TestCase: TestCase.value,
          UpdateTestCaseData: updateTestCaseData,
          Id: '',
        };
        const result = await testCaseStore.saveTestCase(testCaseHistory);
        console.log('TestCase.value', TestCase.value);
        categoryStore.updateTestCase(TestCase.value);
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
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}

async function getLastResult(testCase: TestCaseInterface) {
  // TODO: get last result
}

function toggleSelectedRow(row: TestStepInterface) {
  if (selectedTestSteps.value.length > 0) {
    // We can add another row
    // But if clicking one already selected, we'll remove it instead
    let i = 0;
    const matched = selectedTestSteps.value.find((item: any, index: number) => {
      i = index;
      return item.UUID === row.UUID;
    });
    if (matched) {
      // This row was already selected, so remove it
      selectedTestSteps.value.splice(i, 1);
    } else {
      // Add to selection
      selectedTestSteps.value.push(row);
    }
  } else {
    // First selection - add it
    selectedTestSteps.value.push(row);
  }
}

// With no key pressed - single selection
function toggleSingleRow(row: TestStepInterface) {
  selectedTestSteps.value = [];
  selectedTestSteps.value.push(row);
}

function getRowIndexByUUID(uuid: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const index: number = TestCase.value.TestSteps.findIndex((step: TestStepInterface) => step.UUID === uuid);
  if (index === -1) return 0;
  return index;
}

// With Shift pressed, select contiguous group
function toggleRowGroup(row: TestStepInterface) {
  if (selectedTestSteps.value.length === 1) {
    // There is a previous selection
    // Select contiguous block from previous selection to this one
    // But if clicked one already selected, remove any selected since then
    const matched = selectedTestSteps.value.find((item: TestStepInterface) => item.UUID === row.UUID);
    if (matched) {
      // Had already selected this one --> do nothing
    } else {
      // New selection - add it and any between
      // find previous selected teststep
      const previousSelectedStep = TestCase.value.TestSteps.find(
        (step: TestStepInterface) => step.UUID === selectedTestSteps.value[0].UUID
      ) as TestStepInterface;

      // get index for previousSelectedStep and currentSelectedStep
      const previousIndex = getRowIndexByUUID(previousSelectedStep.UUID);
      const currentIndex = getRowIndexByUUID(row.UUID);

      let first: number;
      let last: number;

      if (previousIndex < currentIndex) {
        first = previousIndex;
        last = currentIndex;
      } else {
        first = currentIndex;
        last = previousIndex;
      }

      // row Index need to push
      // eslint-disable-next-line no-plusplus
      for (let index = first + 1; index < last; index++) {
        selectedTestSteps.value.push(TestCase.value.TestSteps[index]);
      }

      selectedTestSteps.value.push(row);
    }
  } else if (selectedTestSteps.value.length > 1) {
    // there're multiple row previous selection
    selectedTestSteps.value = [];
    selectedTestSteps.value.push(row);
  } else {
    // No previous selection - just select this one
    selectedTestSteps.value = [];
    selectedTestSteps.value.push(row);
  }
}

function onBeforeShowDialog(testStep: TestStepInterface) {
  if (selectedTestSteps.value.length > 1) return;
  if (!selectedTestSteps.value.some((ts: TestStepInterface) => ts.UUID === testStep.UUID)) {
    selectedTestSteps.value = [];
    selectedTestSteps.value.push(testStep);
  }
  rightClickIndex.value = TestCase.value.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStep.UUID);
  console.log('rightClickIndex', rightClickIndex);
}

function onDisableRows() {
  selectedTestSteps.value.forEach((selectedRow: TestStepInterface) => {
    TestCase.value.TestSteps.forEach((testStep: TestStepInterface) => {
      if (testStep.UUID === selectedRow.UUID) {
        if (TestCase.value.TestSteps.length > 0) {
          // incase there's no test steps
          const indexTestStep: number = TestCase.value.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStep.UUID);
          if (indexTestStep !== -1) TestCase.value.TestSteps[indexTestStep].IsDisabled = true;
        }
      }
    });
  });
}

function onEnableRows() {
  selectedTestSteps.value.forEach((selectedRow: TestStepInterface) => {
    TestCase.value.TestSteps.forEach((testStep: TestStepInterface) => {
      if (testStep.UUID === selectedRow.UUID) {
        if (TestCase.value.TestSteps.length > 0) {
          // incase there's no test steps
          const indexTestStep: number = TestCase.value.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStep.UUID);
          if (indexTestStep !== -1) TestCase.value.TestSteps[indexTestStep].IsDisabled = false;
        }
      }
    });
  });
}

function onInsertDescription(testStep: TestStepInterface) {
  // open new AddDescriptionDialog dialog
  console.log('testStep', testStep);
  $q.dialog({
    component: AddDescriptionDialog,
  })
    .onOk((newDescription: string) => {
      // TODO: handle ok
      if (newDescription) {
        const stepIndex: number = TestCase.value.TestSteps.indexOf(testStep);
        TestCase.value.TestSteps[stepIndex].Description = newDescription;
      }
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}

function onCopyTestSteps() {
  selectedTestSteps.value.sort((a, b) => TestCase.value.TestSteps.indexOf(a) - TestCase.value.TestSteps.indexOf(b));
  if (selectedTestSteps.value.length > 0) {
    testStepStore.setCopiedTestSteps(selectedTestSteps.value);
  }
}

function onDeleteTestSteps() {
  selectedTestSteps.value.forEach((selectedTestStep: TestStepInterface) => {
    TestCase.value.TestSteps.forEach((testStep: TestStepInterface) => {
      if (testStep.UUID === selectedTestStep.UUID) {
        const index: number = TestCase.value.TestSteps.indexOf(testStep);
        TestCase.value.TestSteps.splice(index, 1);
      }
    });
  });
  selectedTestSteps.value = [];
}

function onCutTestSteps() {
  onCopyTestSteps();
  onDeleteTestSteps();
}

function onPasteTestSteps() {
  if (copiedTestSteps.value.length === 0) return;
  copiedTestSteps.value.forEach((copyTS: TestStepInterface) => {
    console.log('before', rightClickIndex.value);
    TestCase.value.TestSteps[rightClickIndex.value] = copyTS;
    rightClickIndex.value += 1;
    console.log('after', rightClickIndex.value);
  });
}

function onInsertTestSteps(number: number) {
  let lastTestAUTId = '';
  if (TestCase.value.TestSteps.length > 0) {
    // incase there's no testSteps
    lastTestAUTId = TestCase.value.TestSteps[rightClickIndex.value].TestAUTId;
  }
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < number; index++) {
    TestCase.value.TestSteps.splice(rightClickIndex.value, 0, {
      UUID: uuid(),
      TestAUTId: lastTestAUTId,
      Description: '',
      Params: [],
      IsDisabled: false,
      Log: '',
      KWFeature: '',
      KWCategory: '',
      ErrorScreenshotId: '',
      ScreenshotIds: [],
    });
  }
}

function onInsertPasteTestSteps() {
  if (copiedTestSteps.value.length === 0) return;
  // insert blank test step
  let lastTestAUTId = '';
  if (TestCase.value.TestSteps.length > 0) {
    // incase there's no testSteps
    lastTestAUTId = TestCase.value.TestSteps[rightClickIndex.value].TestAUTId;
  }
  for (let index = 0; index < copiedTestSteps.value.length; index++) {
    TestCase.value.TestSteps.splice(rightClickIndex.value, 0, {
      UUID: uuid(),
      TestAUTId: lastTestAUTId,
      Description: '',
      Params: [],
      IsDisabled: false,
      Log: '',
      KWFeature: '',
      KWCategory: '',
      ErrorScreenshotId: '',
      ScreenshotIds: [],
    });
  }
  // paste copiedTestSteps
  copiedTestSteps.value.forEach((copyTS: TestStepInterface) => {
    TestCase.value.TestSteps[rightClickIndex.value] = copyTS;
    rightClickIndex.value += 1;
  });
}

function changeKeyword(testStep: TestStepInterface, newKeyword: FlatKeywordInterface) {
  // find edited testStep
  const stepIndex: number = TestCase.value.TestSteps.indexOf(testStep);
  TestCase.value.TestSteps[stepIndex].Params = [];
  TestCase.value.TestSteps[stepIndex].Keyword = newKeyword;
  TestCase.value.TestSteps[stepIndex].KWFeature = newKeyword.Feature;
  TestCase.value.TestSteps[stepIndex].KWCategory = newKeyword.Category;
  // add default Params to testCase based on number of params of Keyword
  newKeyword.Params.forEach((pr: TestParamInterface) => {
    const prClone = _.cloneDeep(pr);
    prClone.TestNodePath = '';
    TestCase.value.TestSteps[stepIndex].Params.push(prClone);
  });
}

function editTestStep(testStep: TestStepInterface) {
  console.log('editTestStep', TestCase.value, testStep);
  $q.dialog({
    component: KeywordEditorDialog,
    componentProps: {
      TestCase: TestCase.value,
      TestStep: testStep,
    },
  })
    .onOk((testStepUpdated: TestStepInterface) => {
      console.log('testStep updated', testStepUpdated);
      const stepIndex = TestCase.value.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStepUpdated.UUID);
      if (stepIndex === -1) return;
      TestCase.value.TestSteps[stepIndex] = testStepUpdated;
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}

function searchKeyword(testStep: TestStepInterface) {
  $q.dialog({
    component: SearchKeywordDialog,
    componentProps: {
      TestCase: TestCase.value,
      TestStep: testStep,
    },
  })
    .onOk((testStepUpdated: TestStepInterface) => {
      console.log('testStep updated', testStepUpdated);
      const stepIndex = TestCase.value.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStepUpdated.UUID);
      if (stepIndex === -1) return;
      TestCase.value.TestSteps[stepIndex].Params = [];
      TestCase.value.TestSteps[stepIndex].Keyword = testStepUpdated.Keyword;
      TestCase.value.TestSteps[stepIndex].KWFeature = testStepUpdated.KWFeature;
      TestCase.value.TestSteps[stepIndex].KWCategory = testStepUpdated.KWCategory;
      // add default Params to testCase based on number of params of Keyword
      testStepUpdated.Params.forEach((pr: TestParamInterface) => {
        const prClone = _.cloneDeep(pr);
        prClone.TestNodePath = '';
        TestCase.value.TestSteps[stepIndex].Params.push(prClone);
      });
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function changeParam(testStep: TestStepInterface, paramIndex: number, newValue: string) {
  const stepIndex: number = TestCase.value.TestSteps.indexOf(testStep);
  TestCase.value.TestSteps[stepIndex].Params[paramIndex].Value = newValue;
}
function updateTestEnvValue(testStep: TestStepInterface, paramIndex: number, testEnvNode: TestEnvNodeInterface) {
  const stepIndex: number = TestCase.value.TestSteps.indexOf(testStep);
  if (paramIndex >= TestCase.value.TestSteps[stepIndex].Params.length) {
    $q.notify({
      message: "Can't set to invalid param",
      color: 'ongoing',
    });
    return;
  }
  TestCase.value.TestSteps[stepIndex].Params[paramIndex].TestNodePath = `${testEnvNode.Category}/${testEnvNode.Name}`;
  TestCase.value.TestSteps[stepIndex].Params[paramIndex].Value = testEnvNode.Value;
}
function onUseTestEnv(testStep: TestStepInterface, index: number) {
  console.log('testStep', testStep);
  console.log('index', index);
  $q.dialog({
    component: TestEnvironmentDialog,
  })
    .onOk((node: TestEnvNodeInterface) => {
      if (node) {
        updateTestEnvValue(testStep, index, node);
      }
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function onUnUseTestEnv(testStep: TestStepInterface, paramIndex: number, currentValue: string) {
  const stepIndex: number = TestCase.value.TestSteps.indexOf(testStep);
  if (paramIndex >= TestCase.value.TestSteps[stepIndex].Params.length) return;
  TestCase.value.TestSteps[stepIndex].Params[paramIndex].TestNodePath = '';
  TestCase.value.TestSteps[stepIndex].Params[paramIndex].Value = currentValue;
}

function changeTestAUT(testStep: TestStepInterface, newTestAUT: TestAUTInterface) {
  // find edited testStep
  const stepIndex: number = TestCase.value.TestSteps.indexOf(testStep);
  TestCase.value.TestSteps[stepIndex].TestAUTId = newTestAUT.Id;
}

function updateDescription(testStep: TestStepInterface, newTSDescription: string) {
  const stepIndex: number = TestCase.value.TestSteps.indexOf(testStep);
  TestCase.value.TestSteps[stepIndex].Description = newTSDescription;
}
function filterMethod(rows: TestStepInterface[], filter: string): TestStepInterface[] {
  let filtered: TestStepInterface[] = [];
  filtered = rows.filter((row: TestStepInterface) => {
    if (
      !row.Keyword?.Name.toLowerCase().includes(filter.toLowerCase()) &&
      !row.Params.some((pr: TestParamInterface) => pr.Value?.toLowerCase().includes(filter.toLowerCase()))
    )
      return false;
    return true;
  });
  return filtered;
}
function getSelectedString() {
  return selectedTestSteps.value.length === 0 ? '' : `${selectedTestSteps.value.length} step${selectedTestSteps.value.length > 1 ? 's' : ''} selected.`;
}

function viewDevRunning(testCaseId: string) {
  // Get last dev running record for testCase
  devMonitoringStore
    .getLastDevRunRecordOfTestCase(testCaseId)
    .then((res) => {
      console.log('res', res);
      if (res.data == null) {
        $q.notify({
          message: 'No dev running record found.',
          color: 'info',
          icon: 'info',
        });
        return;
      }
      const devRunRecord: DevRunRecordInterface = res.data;
      $q.dialog({
        component: DevLogDialog,
        componentProps: {
          DevRunRecordProp: devRunRecord,
        },
      })
        .onOk(() => {
          // TODO
        })
        .onCancel(() => {
          // TODO
          console.log('Cancel');
        })
        .onDismiss(() => {
          // TODO
        });
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.message ? error.message : error.error,
      });
    });
}
function viewRegressionRunning() {
  $q.notify({
    message: 'Not implemented yet',
    color: 'warning',
  });
}
</script>
<style scoped lang="scss">
:deep(.q-table-control) {
  display: flex;
}
:deep(input.q-field__native) {
  padding: 0px;
}
:deep(tr.tsDescription label) {
  height: -webkit-fill-available;
}
:deep(tr.tsDescription label .q-field__marginal) {
  height: -webkit-fill-available;
}
:deep(tr.tsDescription label .q-field__control) {
  height: -webkit-fill-available;
}

:deep(td.q-c-input) {
  padding-right: 1px;
  padding-left: 1px;
  padding-top: 0px;
  padding-bottom: 0px;
}

:deep(td.q-c-input .q-field__native) {
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
.sticky-header-dark {
  /* height or max-height is important */
  max-height: 790px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
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
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
.sticky-header-light {
  /* height or max-height is important */
  max-height: 790px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
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
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
:deep(.testBed) {
  background-color: $teal-2;
  background-clip: content-box;
}
:deep(.testBuffer) {
  background-color: $green-2;
  background-clip: content-box;
}
:deep(.testBedDark) {
  background-color: $teal-10;
  background-clip: content-box;
}
:deep(.testBufferDark) {
  background-color: $green-10;
  background-clip: content-box;
}
</style>
