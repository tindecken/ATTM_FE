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
          <q-tab-panel v-for="tc in openedTCs" :key="`${tc.CodeName}:${tc.Name}`" :name="tc.Id">
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
import { useCategoryStore } from '../../../pinia/categoryStore';
import CloseTestCaseDialog from './Dialog/CloseTestCaseDialog.vue';
import SaveTestCaseDialog from './Dialog/SaveTestCaseDialog.vue';
import TestCase from './TestCase.vue';
import { testCaseColumns } from '../../../components/tableColumns';
import { isTestCaseModified } from './Utils/utils';

const userStore = useUserStore();
const testCaseStore = useTestCaseStore();
const categoryStore = useCategoryStore();
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

async function closeTab(testCase: TestCaseInterface) {
  const isModified = await isTestCaseModified(testCase);
  console.log('isModified', isModified);
  if (isModified) {
    $q.dialog({
      component: CloseTestCaseDialog,
    })
      .onOk(async (response: 'Save' | 'Discard') => {
        switch (response) {
          case 'Save':
            saveTestCase(testCase.Id).then(() => testCaseStore.removeOpenedTC(testcase));
            break;
          case 'Discard':
            testCaseStore.removeOpenedTC(testCase);
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
    testCaseStore.removeOpenedTC(testCase);
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
            Id: currTestCase.Id,
            TestCase: currTestCase,
            UpdateTestCaseData: updateTestCaseData,
          };
          const result = await testCaseStore.saveTestCase(testCaseHistory);
          categoryStore.updateTestCase(currTestCase);
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
