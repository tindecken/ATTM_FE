<template>
  <div class="q-pa-md">
    <q-btn class="q-mb-md" color="primary" @click="createDB" label="Create DB" />
    <q-splitter v-model="splitterModel" style="height: 250px">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical no-caps>
          <q-tab name="createRegression" label="Create Regression" />
          <q-tab name="createRegressionTest" label="Create Regression Tests" />
          <q-tab name="generateRegCode" label="Generate Regression Code" />
          <q-tab name="buildProject" label="Build Project" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="createRegression">
            <div class="text-h6 q-mb-md">
              Status: {{ createRegressionStatus }}
              <q-btn
                flat
                round
                icon="content_copy"
                size="md"
                primary
                @click="copy(createRegressionMessage || '')"
                class="q-mr-sm"
                v-if="createRegressionStatus"
              ></q-btn>
            </div>
            <p style="white-space: pre-wrap">{{ createRegressionMessage }}</p>
          </q-tab-panel>

          <q-tab-panel name="createRegressionTest">
            <div class="text-h6 q-mb-md">
              Status: {{ createRegressionTestStatus }}
              <q-btn
                flat
                round
                icon="content_copy"
                size="md"
                primary
                @click="copy(createRegressionTestMessage || '')"
                class="q-mr-sm"
                v-if="createRegressionTestStatus"
              ></q-btn>
            </div>
            <p style="white-space: pre-wrap">
              {{ createRegressionTestMessage }}
            </p>
          </q-tab-panel>

          <q-tab-panel name="generateRegCode">
            <div class="text-h6 q-mb-md">
              Status: {{ generateRegCodeStatus }}
              <q-btn
                flat
                round
                icon="content_copy"
                size="md"
                primary
                @click="copy(generateRegCodeMessage || '')"
                class="q-mr-sm"
                v-if="generateRegCodeStatus"
              ></q-btn>
            </div>
            <p style="white-space: pre-wrap">{{ generateRegCodeMessage }}</p>
          </q-tab-panel>

          <q-tab-panel name="buildProject">
            <div class="text-h6 q-mb-md">
              Status: {{ buildProjectStatus }}
              <q-btn
                flat
                round
                icon="content_copy"
                size="md"
                primary
                @click="copy(buildProjectMessage || '')"
                class="q-mr-sm"
                v-if="buildProjectStatus"
              ></q-btn>
            </div>
            <p style="white-space: pre-wrap">{{ buildProjectMessage }}</p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DefineRegressionInterface } from '../../../Models/DefineRegression';
import { TestCaseDetailInterface } from '../../../Models/TestCaseDetail';
import { useGlobalStore } from '../../../pinia/globalStore';
import { useCreateRegressionStore } from '../../../pinia/createRegressionStore';
import { useQuasar } from 'quasar';
import { useClipboard } from '@vueuse/core';
import { RegressionTestInterface } from '../../../Models/RegressionTest';

const globalStore = useGlobalStore();
const createRegressionStore = useCreateRegressionStore();
const $q = useQuasar();
const { copy } = useClipboard();
const splitterModel = ref(10);
const tab = ref('createRegression');
const createRegressionStatus = ref('');
const createRegressionMessage = ref('');
const createRegressionTestStatus = ref('');
const createRegressionTestMessage = ref('');
const generateRegCodeStatus = ref('');
const generateRegCodeMessage = ref('');
const buildProjectStatus = ref('');
const buildProjectMessage = ref('');
const selectedTestCasesDetail = computed(() => createRegressionStore.selectedTestCasesDetail);
const selectedTestCases = computed(() => createRegressionStore.selectedTestCases);
const defineRegression = computed(() => createRegressionStore.defineRegression);
console.log('selectedTestCasesDetail', selectedTestCasesDetail);
console.log('selectedTestCases', selectedTestCases);
console.log('defineRegression', defineRegression);
function clearStatusAndMessage() {
  createRegressionStatus.value = '';
  createRegressionMessage.value = '';
  createRegressionTestStatus.value = '';
  createRegressionTestMessage.value = '';
  generateRegCodeStatus.value = '';
  generateRegCodeMessage.value = '';
  buildProjectStatus.value = '';
  buildProjectMessage.value = '';
  tab.value = 'createRegression';
}
function createDB() {
  clearStatusAndMessage();
  const createRegression: Promise<any> = createRegressionStore.createRegression(defineRegression.value as DefineRegressionInterface);
  createRegression
    .then((r) => {
      tab.value = 'createRegression';
      createRegressionStatus.value = 'Success';
      createRegressionMessage.value += `RegressionId: ${r.data.Id}\r\n`;
      createRegressionMessage.value += `Name: ${r.data.Name}\r\n`;
      createRegressionMessage.value += `Build: ${r.data.Build}\r\n`;
      createRegressionMessage.value += `This is an official regression: ${r.data.IsOfficial}\r\n`;
      createRegressionMessage.value += `Description: ${r.data.Description}\r\n`;
      createRegressionMessage.value += `Start Date: ${r.data.StartDate}\r\n`;
      createRegressionMessage.value += `End Date: ${r.data.EndDate}\r\n`;
      $q.notify({
        type: 'positive',
        message: `Created regression: ${r.data.Name}`,
      });
      const Ids: string[] = [];
      selectedTestCasesDetail.value.forEach((c: TestCaseDetailInterface) => {
        Ids.push(c.Id);
      });
      const createRegressionTest: Promise<any> = createRegressionStore.createRegressionTests({
        regressionId: r.data.Id,
        selectedTestCasesDetailIds: Ids,
      });
      createRegressionTest
        .then((t) => {
          tab.value = 'createRegressionTest';
          createRegressionTestStatus.value = 'Success';
          console.log('t', t);
          t.data.data.forEach((i: RegressionTestInterface) => {
            createRegressionTestMessage.value += `${i.TestCaseFullCodeName}\r\n`;
          });
          $q.notify({
            type: 'positive',
            message: `Created regression Tests: ${t.data.message}`,
          });
          const generateRegCodeResult: Promise<any> = globalStore.generateRegCode(t.data.data);
          generateRegCodeResult
            .then((g) => {
              tab.value = 'generateRegCode';
              generateRegCodeStatus.value = 'Success';
              g.message.forEach((m: any) => {
                generateRegCodeMessage.value += `Test Case: ${m.testCase}\r\n\r\n`;
                generateRegCodeMessage.value += `${m.generatedCode}\r\n`;
                generateRegCodeMessage.value += '------------------\r\n';
              });
              $q.notify({
                type: 'positive',
                message: `Generate Regression Code Successful for ${g.count} test case(s) !`,
              });
              const buildResult: Promise<any> = globalStore.buildProject();
              buildResult
                .then((b) => {
                  console.log('b', b);
                  tab.value = 'buildProject';
                  buildProjectStatus.value = 'Success';
                  buildProjectMessage.value = b.buildMessage;
                  $q.notify({
                    type: 'positive',
                    message: 'Build Project Success !',
                  });
                })
                .catch((e) => {
                  $q.notify({
                    type: 'negative',
                    message: 'Build Project Error',
                  });
                  buildProjectStatus.value = 'Error';
                  buildProjectMessage.value = e.buildMessage;
                });
            })
            .catch((e) => {
              $q.notify({
                type: 'negative',
                message: `Generate Regression Code Unsuccessful: ${e}`,
              });
              generateRegCodeStatus.value = 'Error';
              generateRegCodeMessage.value = e;
            });
        })
        .catch((e) => {
          $q.notify({
            type: 'negative',
            message: `Error while creating RegressionTest: ${e}`,
          });
          createRegressionTestStatus.value = 'Error';
          createRegressionTestMessage.value = e;
        });
    })
    .catch((e) => {
      console.log('e', e);
      $q.notify({
        type: 'negative',
        message: `Error while creating regression: ${e}`,
      });
      createRegressionStatus.value = 'Error';
      createRegressionMessage.value = e;
    });
}
</script>
