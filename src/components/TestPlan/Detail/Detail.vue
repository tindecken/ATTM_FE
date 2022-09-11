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
import { TestCaseInterface } from '../../../Models/TestCase';
import _ from 'lodash';
import { useQuasar } from 'quasar';
import { TestCaseHistoryInterface } from '../../../Models/TestCaseHistory';
import { UpdateTestCaseDataInterface } from '../../../Models/Entities/UpdateTestCaseData';
import { useUserStore } from '../../../pinia/userStore';
import { useTestCaseStore } from '../../../pinia/testCaseStore';
import CloseTestCaseDialog from './Dialog/CloseTestCaseDialog.vue';
import SaveTestCaseDialog from './Dialog/SaveTestCaseDialog.vue';
import TestCase from './TestCase.vue';
import { testCaseColumns } from '../../../components/tableColumns';

const userStore = useUserStore();
const testCaseStore = useTestCaseStore();
const $q = useQuasar();
const showByIndex = ref('');
const columns = ref(testCaseColumns);

const selectedTestCaseId: Ref<string> = computed({
  get: () => testCaseStore.selectedTestCaseId,
  set: (val) => {
    testCaseStore.setSelectedTestCaseId(val);
  },
});

const openedTCs: Ref<TestCaseInterface[]> = computed(() => testCaseStore.openedTCs);

async function closeTab(testcase: TestCaseInterface) {
  // check if testcase is modified or not
  let isModified = false;
  // get testcase from database then verify with current one
  const originalTestCase = await testCaseStore.getTestCaseById(testcase.Id);
  console.log('originalTestCase', originalTestCase.TestSteps);
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

function onTabChanging() {
  columns.value.forEach((col: any, index: number) => {
    if (index >= 3) {
      columns.value[index].label = `Param ${index - 2}`;
    }
  });
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
