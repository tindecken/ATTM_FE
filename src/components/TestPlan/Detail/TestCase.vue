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
        <q-tooltip>View generate code</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="cached" class="q-mr-sm" @click="getLastResult(TestCase)">
        <q-tooltip>Get latest result</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="play_arrow" class="q-mr-sm" @click="runTestCase(TestCase)">
        <q-tooltip>Run</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="save" class="q-mr-sm" @click="saveTestCase()">
        <q-tooltip>Save</q-tooltip>
      </q-btn>
      <q-btn color="primary" flat icon="undo" class="q-mr-sm" :disable="!canUndo" @click="undo()"> </q-btn>
      <q-btn color="primary" flat icon="redo" class="q-mr-sm" :disable="!canRedo" @click="redo()"> </q-btn>
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
            @update:model-value="
                        updateDescription(tc, props.row, $event as string)
                      "
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
            @copyTestSteps="onCopyTestSteps(tc)"
            @cutTestSteps="onCutTestSteps(tc)"
            @pasteTestSteps="onPasteTestSteps(tc)"
            @deleteTestSteps="onDeleteTestSteps()"
            @beforeShowDialog="onBeforeShowDialog(props.row)"
            @insertTestSteps="onInsertTestSteps(tc, 1)"
            @insertPasteTestSteps="onInsertPasteTestSteps(tc)"
          ></no>
        </q-td>
        <q-td key="testAUT" :props="props" class="q-c-input">
          <test-a-u-t :TestStep="props.row" @changeTestAUT="changeTestAUT(tc, props.row, $event)"></test-a-u-t>
        </q-td>
        <q-td key="keyword" :props="props" class="q-c-input">
          <keyword
            :TestStep="props.row"
            @changeKeyword="changeKeyword(tc, props.row, $event)"
            @editTestStep="editTestStep(tc, props.row)"
            @searchKeyword="searchKeyword(tc, props.row)"
          />
        </q-td>
        <q-td v-for="index in 20" :key="index" class="q-c-input">
          <parameter
            :TestStep="props.row"
            :ParamIndex="index - 1"
            @changeParam="changeParam(tc, props.row, index - 1, $event)"
            @useTestEnv="onUseTestEnv(tc, props.row, index - 1)"
            @unUseTestEnv="onUnUseTestEnv(tc, props.row, index - 1, $event)"
          >
          </parameter>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <q-separator class="q-mt-sm q-mb-sm" />
  <q-btn outline color="primary" label="New Step" @click="addNewStep(selectedTestCaseId)" icon="add"></q-btn>
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
import No from './Cells/No.vue';
import { TestCaseInterface } from '../../../Models/TestCase';
import { useGlobalStore } from '../../../pinia/globalStore';
import { TestStepInterface } from '../../../Models/TestStep';
import { testCaseColumns } from '../../../components/tableColumns';
import uuid from 'uuid-random';
import { useRefHistory } from '@vueuse/core';
import ViewGenerateCodeDialog from '../Tree/Dialog/ViewGenerateCodeDialog.vue';
import { useTestClientStore } from '../../../pinia/testClientStore';
import { UpdateTestCaseDataInterface } from '../../../Models/Entities/UpdateTestCaseData';
import SaveTestCaseDialog from './Dialog/SaveTestCaseDialog.vue';
import { useUserStore } from '../../../pinia/userStore';
import { TestCaseHistoryInterface } from '../../../Models/TestCaseHistory';
import { useTestCaseStore } from '../../../pinia/testCaseStore';
import AddDescriptionDialog from './Dialog/AddDescriptionDialog.vue';

const props = defineProps<{
  TestCaseProp: TestCaseInterface;
}>();

const TestCase = ref(props.TestCaseProp);
const { undo, redo, canUndo, canRedo } = useRefHistory(TestCase, { deep: true });
const globalStore = useGlobalStore();
const $q = useQuasar();
const isDark = computed(() => globalStore.darkTheme);
const columns = ref(testCaseColumns);
const testClientStore = useTestClientStore();
const userStore = useUserStore();
const testCaseStore = useTestCaseStore();
const selectedTestClient = computed(() => testClientStore.selectedTestClient);
const selectedTestSteps: Ref<TestStepInterface[]> = ref([]);
const rightClickIndex = ref(-1);

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
    IsComment: false,
    KWFeature: '',
    KWCategory: '',
  });
}

async function viewGenerateCode(testCase: TestCaseInterface) {
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
        };
        const result = await testCaseStore.saveTestCase(testCaseHistory);
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
:deep(.q-tab) {
  padding-right: 2px;
  padding-left: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
}
:deep(.q-tab-panel) {
  padding: 1px;
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
</style>
