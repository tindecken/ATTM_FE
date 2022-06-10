<template>
  <div>
    <div class="row">
      <div class="col">
        <q-tabs v-model="selectedTestCaseId" dense active-color="primary" align="left" inline-label @input="onTabChanging()">
          <q-tab
            no-caps
            v-for="testcase in openedTCs"
            :key="testcase.Id"
            :name="testcase.Id"
            :ripple="false"
            @mouseover="showByIndex = testcase.Id"
            @mouseout="showByIndex = ''"
          >
            <div class="q-mr-xs">{{ testcase.CodeName }}: {{ testcase.Name }}</div>
            <q-btn
              dense
              flat
              icon="close"
              size="xs"
              :style="{
                visibility: showByIndex === testcase.Id ? 'visible' : 'hidden',
              }"
              @click.stop="closeTab(testcase)"
            ></q-btn>
            <q-space />
            <q-separator vertical></q-separator>
          </q-tab>
        </q-tabs>

        <q-tab-panels v-model="selectedTestCaseId" animated keep-alive>
          <q-tab-panel v-for="tc in openedTCs" :key="tc.Id" :name="tc.Id">
            <test-case :TestCaseProp="tc"></test-case>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="row">
      <div class="col"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Detail',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { TestAUTInterface } from '../../../Models/TestAUT';
import { TestCaseInterface } from '../../../Models/TestCase';
import { TestStepInterface } from '../../../Models/TestStep';
import { TestParamInterface } from '../../../Models/TestParam';
import _ from 'lodash';
import uuid from 'uuid-random';
import { TestEnvNodeInterface } from '../../../Models/TestEnv';

import { useQuasar } from 'quasar';
import { TestCaseHistoryInterface } from '../../../Models/TestCaseHistory';
import { UpdateTestCaseDataInterface } from '../../../Models/Entities/UpdateTestCaseData';
import { useUserStore } from '../../../pinia/userStore';
import { useGlobalStore } from '../../../pinia/globalStore';
import { useCategoryStore } from '../../../pinia/categoryStore';
import { useTestCaseStore } from '../../../pinia/testCaseStore';
import { useTestStepStore } from '../../../pinia/testStepStore';
import { useTestClientStore } from '../../../pinia/testClientStore';

import TestEnvironmentDialog from './Dialog/TestEnvironmentDialog.vue';
import CloseTestCaseDialog from './Dialog/CloseTestCaseDialog.vue';

import SearchKeywordDialog from './Dialog/SearchKeywordDialog.vue';
import SaveTestCaseDialog from './Dialog/SaveTestCaseDialog.vue';
import TestCase from './TestCase.vue';
import { testCaseColumns } from '../../../components/tableColumns';

const globalStore = useGlobalStore();
const userStore = useUserStore();
const categoryStore = useCategoryStore();
const testCaseStore = useTestCaseStore();
const testStepStore = useTestStepStore();
const testClientStore = useTestClientStore();
const $q = useQuasar();
const showByIndex = ref('');
const selected: Ref<any[]> = ref([]);
const filterTable = ref('');
const isDark = computed(() => globalStore.darkTheme);
const columns = ref(testCaseColumns);

const selectedTestCaseId: Ref<string> = computed({
  get: () => testCaseStore.selectedTestCaseId,
  set: (val) => {
    testCaseStore.setSelectedTestCaseId(val);
  },
});
const selectedTestClient = computed(() => testClientStore.selectedTestClient);

const openedTCs: Ref<TestCaseInterface[]> = computed(() => testCaseStore.openedTCs);
const copiedTestSteps: Ref<TestStepInterface[]> = computed(() => testStepStore.copiedTestSteps);

async function closeTab(testcase: TestCaseInterface) {
  // check if testcase is modified or not
  let isModified = false;
  // get testcase from database then verify with current one
  const originalTestCase = await testCaseStore.getTestCaseById(testcase.Id);
  console.log('originalTestCase', originalTestCase.TestSteps);
  console.log('testCase', testcase.TestSteps);
  if (originalTestCase.TestSteps.length !== testcase.TestSteps.length) {
    isModified = true;
  } else {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < originalTestCase.TestSteps.length; i++) {
      if (originalTestCase.TestSteps[i].UUID !== testcase.TestSteps[i].UUID) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].TestAUTId !== testcase.TestSteps[i].TestAUTId) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].Keyword?.Name !== testcase.TestSteps[i].Keyword?.Name) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].Description !== testcase.TestSteps[i].Description) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].IsDisabled !== testcase.TestSteps[i].IsDisabled) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].IsComment !== testcase.TestSteps[i].IsComment) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].KWFeature !== testcase.TestSteps[i].KWFeature) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].KWCategory !== testcase.TestSteps[i].KWCategory) {
        isModified = true;
        break;
      }
      if (originalTestCase.TestSteps[i].Params.length !== testcase.TestSteps[i].Params.length) {
        isModified = true;
        break;
      }
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < originalTestCase.TestSteps[i].Params.length; j++) {
        if (originalTestCase.TestSteps[i].Params[j].Name !== testcase.TestSteps[i].Params[j].Name) {
          isModified = true;
          break;
        }
        if (originalTestCase.TestSteps[i].Params[j].TestNodePath !== testcase.TestSteps[i].Params[j].TestNodePath) {
          isModified = true;
          break;
        }
        if (
          originalTestCase.TestSteps[i].Params[j].TestNodePath === '' &&
          testcase.TestSteps[i].Params[j].Value &&
          originalTestCase.TestSteps[i].Params[j].Value !== testcase.TestSteps[i].Params[j].Value
        ) {
          isModified = true;
          break;
        }
      }
    }
  }

  if (isModified) {
    $q.dialog({
      component: CloseTestCaseDialog,
    })
      .onOk(async (response: 'Save' | 'Discard') => {
        switch (response) {
          case 'Save':
            saveTestCase(testcase.Id).then(() => testCaseStore.removeOpenedTC(testcase));
            break;
          case 'Discard':
            testCaseStore.removeOpenedTC(testcase);
            break;
          default:
            break;
        }
      })
      .onCancel(() => {
        // TODO
      })
      .onDismiss(() => {
        // TODO
      });
  } else {
    testCaseStore.removeOpenedTC(testcase);
  }
}

const saveTestCase = (testCaseId: string) =>
  new Promise<void>(function (resolve, reject) {
    const currTestCase = openedTCs.value.find((tc: TestCaseInterface) => tc.Id === testCaseId) as TestCaseInterface;
    $q.dialog({
      component: SaveTestCaseDialog,
      componentProps: {
        TestCase: currTestCase,
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
            TestCase: currTestCase,
            UpdateTestCaseData: updateTestCaseData,
          };
          const result = await testCaseStore.saveTestCase(testCaseHistory);
          $q.notify({
            type: 'positive',
            message: result.message,
          });
          resolve();
        } catch (error: any) {
          $q.notify({
            type: 'warning',
            message: error.error,
          });
          reject();
        }
      })
      .onCancel(() => {
        //TODO
      })
      .onDismiss(() => {
        //TODO
      });
  });

function searchKeyword(testCase: TestCaseInterface, testStep: TestStepInterface) {
  console.log('searchKeyword', testCase, testStep);
  $q.dialog({
    component: SearchKeywordDialog,
    componentProps: {
      TestCase: testCase,
      TestStep: testStep,
    },
  })
    .onOk((testStepUpdated: TestStepInterface) => {
      console.log('testStep updated', testStepUpdated);
      const stepIndex = testCase.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStepUpdated.UUID);
      if (stepIndex === -1) return;
      const tempTC = _.cloneDeep(testCase);
      tempTC.TestSteps[stepIndex].Params = [];
      tempTC.TestSteps[stepIndex].Keyword = testStepUpdated.Keyword;
      tempTC.TestSteps[stepIndex].KWFeature = testStepUpdated.KWFeature;
      tempTC.TestSteps[stepIndex].KWCategory = testStepUpdated.KWCategory;
      // add default Params to testCase based on number of params of Keyword
      testStepUpdated.Params.forEach((pr: TestParamInterface) => {
        const prClone = _.cloneDeep(pr);
        prClone.TestNodePath = '';
        tempTC.TestSteps[stepIndex].Params.push(prClone);
      });
      testCaseStore.updateOpenedTCs(tempTC);
      categoryStore.updateTestCase(tempTC);
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}

function changeTestAUT(testCase: TestCaseInterface, testStep: TestStepInterface, newTestAUT: TestAUTInterface) {
  // find edited testStep
  const stepIndex: number = testCase.TestSteps.indexOf(testStep);
  const tempTC: TestCaseInterface = _.cloneDeep(testCase);
  tempTC.TestSteps[stepIndex].TestAUTId = newTestAUT.Id;
  testCaseStore.updateOpenedTCs(tempTC);
  categoryStore.updateTestCase(tempTC);
}

function changeParam(testCase: TestCaseInterface, testStep: TestStepInterface, paramIndex: number, newValue: string) {
  const stepIndex: number = testCase.TestSteps.indexOf(testStep);
  const tempTC: TestCaseInterface = _.cloneDeep(testCase);
  tempTC.TestSteps[stepIndex].Params[paramIndex].Value = newValue;
  testCaseStore.updateOpenedTCs(tempTC);
  categoryStore.updateTestCase(tempTC);
}

function updateTestEnvValue(testCase: TestCaseInterface, testStep: TestStepInterface, paramIndex: number, testEnvNode: TestEnvNodeInterface) {
  const stepIndex: number = testCase.TestSteps.indexOf(testStep);
  const tempTC: TestCaseInterface = _.cloneDeep(testCase);
  tempTC.TestSteps[stepIndex].Params[paramIndex].TestNodePath = `${testEnvNode.Category}/${testEnvNode.Name}`;
  tempTC.TestSteps[stepIndex].Params[paramIndex].Value = testEnvNode.Value;
  testCaseStore.updateOpenedTCs(tempTC);
  categoryStore.updateTestCase(tempTC);
}

function onUnUseTestEnv(testCase: TestCaseInterface, testStep: TestStepInterface, paramIndex: number, currentValue: string) {
  const stepIndex: number = testCase.TestSteps.indexOf(testStep);
  const tempTC: TestCaseInterface = _.cloneDeep(testCase);
  tempTC.TestSteps[stepIndex].Params[paramIndex].TestNodePath = '';
  tempTC.TestSteps[stepIndex].Params[paramIndex].Value = currentValue;
  testCaseStore.updateOpenedTCs(tempTC);
  categoryStore.updateTestCase(tempTC);
}

function onTabChanging() {
  columns.value.forEach((col: any, index: number) => {
    if (index >= 3) {
      columns.value[index].label = `Param ${index - 2}`;
    }
  });
}

function updateDescription(testCase: TestCaseInterface, testStep: TestStepInterface, newTSDescription: string) {
  const stepIndex: number = testCase.TestSteps.indexOf(testStep);
  const tempTC: TestCaseInterface = _.cloneDeep(testCase);
  tempTC.TestSteps[stepIndex].Description = newTSDescription;
  testCaseStore.updateOpenedTCs(tempTC);
  categoryStore.updateTestCase(tempTC);
}
function filterMethod(rows: TestStepInterface[], filter: string): TestStepInterface[] {
  let filtered: TestStepInterface[] = [];
  console.log('rows', rows);
  console.log('filter', filter);
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

function onUseTestEnv(testCase: TestCaseInterface, testStep: TestStepInterface, index: number) {
  // open new testEnv dialog
  $q.dialog({
    component: TestEnvironmentDialog,
  })
    .onOk((node: TestEnvNodeInterface) => {
      // TODO: handle ok
      console.log('node', node);
      if (node) {
        updateTestEnvValue(testCase, testStep, index, node);
      }
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}

function getSelectedString() {
  return selected.value.length === 0 ? '' : `${selected.value.length} step${selected.value.length > 1 ? 's' : ''} selected.`;
}
</script>
<style scoped lang="scss">
:deep(.q-tab) {
  padding-right: 0px;
  padding-left: 8px;
  padding-top: 0px;
  padding-bottom: 0px;
}
:deep(.q-tab-panel) {
  padding: 1px;
}
</style>
