<template>
  <div>
    <q-table
      :class="[isDark ? 'sticky-header-dark' : 'sticky-header-light']"
      dense
      :rows="TestCase.TestSteps"
      :columns="columns"
      row-key="UUID"
      :hide-pagination="true"
      separator="cell"
      :wrap-cells="false"
      :rows-per-page-options="[0]"
      no-data-label="Test case has no step"
      :filter="filterTable"
      :filter-method="filterMethod"
    >
      <template v-slot:top-left>
        <q-input dense debounce="300" v-model="filterTable" placeholder="Filter" class="q-mr-sm">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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
          <q-td colspan="100%" style="padding: 0px" @click="footerInfo = props.row?.Description">
            <q-input
              :model-value="props.row.Description"
              dense
              borderless
              debounce="500"
              style="font-style: oblique; height: 20px"
              class="items-center"
              readonly
            >
              <template v-slot:before>
                <q-icon name="notes" style="font-size: 0.9rem" />
              </template>
            </q-input>
          </q-td>
        </q-tr>
        <q-tr :props="props" @mouseover="onRowHover(props.row.Params)" :class="disabledStyle(props.row)" class="testStep">
          <q-td key="no" :props="props" class="q-c-input">
            {{ props.rowIndex + 1 }}
          </q-td>
          <q-td key="testAUT" :props="props" class="q-c-input">
            {{ getTestAUT(props.row.TestAUTId) }}
          </q-td>
          <q-td key="keyword" :props="props" class="q-c-input" @click="footerInfo = props.row.Keyword?.Name">
            {{ props.row.Keyword?.Name }}
          </q-td>
          <q-td v-for="index in 20" :key="index" class="q-c-input" @click="footerInfo = $event.target.value">
            <q-input
              :class="valueStyle(props.row, index)"
              :debounce="300"
              :model-value="prValue(props.row, index)"
              dense
              borderless
              readonly
              style="height: 28px"
            >
              <template v-slot:prepend>
                <q-icon v-if="ParamErrorMessage(props.row, index) !== ''" name="error_outline" size="xs">
                  <q-tooltip style="font-size: small"> {{ ParamErrorMessage(props.row, index) }} </q-tooltip>
                </q-icon>
              </template>
              <q-tooltip
                style="font-size: small"
                v-if="
                  props.row.Params[index - 1]?.TestNodePath && props.row.Params[index - 1].TestNodePath !== '' && ParamErrorMessage(props.row, index) === ''
                "
              >
                {{ props.row.Params[index - 1].TestNodePath }}
              </q-tooltip>
            </q-input>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-footer bordered class="bg-secondary text-white" style="height: 24px; width: -webkit-fill-available">
      <div class="row inline justify-between items-center">
        <span @click="copy(footerInfo)" class="q-pl-sm">{{ footerInfo }}</span>
      </div>
    </q-footer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TestCaseTable',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { computed, Ref, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useGlobalStore } from '../../../../../../pinia/globalStore';
import { useTestEnvironmentStore } from '../../../../../../pinia/testEnvironmentStore';
import { testCaseColumns } from '../../../../../tableColumns';
import { TestCaseInterface } from '../../../../../../Models/TestCase';
import { TestAUTInterface } from '../../../../../../Models/TestAUT';
import { TestStepInterface } from '../../../../../../Models/TestStep';
import { TestParamInterface } from '../../../../../../Models/TestParam';
import { getValueType } from '../../../../../TestPlan/Detail/Utils/utils';
import { TestEnvInterface, TestEnvNodeInterface } from '../../../../../../Models/TestEnv';

const props = defineProps<{
  TestCase: TestCaseInterface;
}>();

const { copy } = useClipboard();
const globalStore = useGlobalStore();
const testEnvironmentStore = useTestEnvironmentStore();
const testAUTs: Ref<TestAUTInterface[]> = computed(() => globalStore.testAUTs as TestAUTInterface[]);
const filterTable = ref('');
const isDark = computed(() => globalStore.darkTheme);
const $q = useQuasar();
const columns = ref(testCaseColumns);
const paramErrorMessage = ref('');
const footerInfo = ref('');

function abc(event: any) {
  console.log(event.target.value);
}

function getTestAUT(testAUTId: string) {
  const testAut = testAUTs.value.find((aut: TestAUTInterface) => aut.Id === testAUTId);
  return testAut.Name;
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

function disabledStyle(row: TestStepInterface) {
  if (row.IsDisabled) {
    if (isDark.value) return 'disabledDark';
    return 'disabledLight';
  }
  return '';
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
function getValueFromTestEnv(ts: TestStepInterface, prIndex: number): string {
  let value = '';
  const selectedTestEnv = testEnvironmentStore.selectedTestEnv as TestEnvInterface;
  const catEnv = ts.Params[prIndex].TestNodePath.split('/')[0];
  const nodeEnv = ts.Params[prIndex].TestNodePath.split('/')[1];

  if (selectedTestEnv) {
    const cat = selectedTestEnv.Nodes.find((envNode: TestEnvNodeInterface) => envNode.Category === catEnv);
    if (cat) {
      const node = selectedTestEnv.Nodes.find((n: TestEnvNodeInterface) => n.Name === nodeEnv && n.Category === catEnv);
      if (node) {
        value = node.Value;
        paramErrorMessage.value = '';
      } else {
        paramErrorMessage.value = `There's no node: ${nodeEnv} in environment: ${selectedTestEnv.Name}`;
        value = ts.Params[prIndex].Value;
      }
    } else {
      paramErrorMessage.value = `There's no category: ${catEnv} in environment: ${selectedTestEnv.Name}`;
      value = ts.Params[prIndex].Value;
    }
  } else {
    paramErrorMessage.value = 'No Test Environment is selected, get last value';
    value = ts.Params[prIndex].Value;
  }

  return value;
}

function prValue(testStep: TestStepInterface, index: number) {
  if (testStep.Params[index - 1]) {
    if (testStep.Params[index - 1].TestNodePath !== '') {
      return getValueFromTestEnv(testStep, index - 1);
    }
    return testStep.Params[index - 1].Value;
  }
  return '';
}
function ParamErrorMessage(ts: TestStepInterface, prIndex: number) {
  if (ts.Params[prIndex - 1]) {
    if (ts.Params[prIndex - 1].TestNodePath !== '') {
      const selectedTestEnv = testEnvironmentStore.selectedTestEnv as TestEnvInterface;
      const catEnv = ts.Params[prIndex - 1].TestNodePath.split('/')[0];
      const nodeEnv = ts.Params[prIndex - 1].TestNodePath.split('/')[1];

      if (selectedTestEnv) {
        const cat = selectedTestEnv.Nodes.find((envNode: TestEnvNodeInterface) => envNode.Category === catEnv);
        if (cat) {
          const node = selectedTestEnv.Nodes.find((n: TestEnvNodeInterface) => n.Name === nodeEnv && n.Category === catEnv);
          if (node) {
            return '';
          } else {
            return `There's no node: ${nodeEnv} in environment: ${selectedTestEnv.Name}`;
          }
        } else {
          return `There's no category: ${catEnv} in environment: ${selectedTestEnv.Name}`;
        }
      } else {
        return '';
      }
    }
    return '';
  }
  return '';
}

function valueStyle(testStep: TestStepInterface, index: number) {
  if (testStep) {
    const testStepIndex = props.TestCase.TestSteps.findIndex((ts: TestStepInterface) => ts.UUID === testStep.UUID);
    if (testStepIndex != -1)
      if (props.TestCase.TestSteps[testStepIndex].Params[index - 1]) return getValueType(props.TestCase.TestSteps[testStepIndex].Params[index - 1]);
  }
  return '';
}
</script>
<style scoped lang="scss">
:deep(.disabledDark) {
  background-color: $blue-grey-14;
  font-style: italic;
}
:deep(.disabledLight) {
  background-color: $grey-6;
  font-style: italic;
}
td .testBed {
  background-color: $teal-2;
  background-clip: content-box;
}
td .testBuffer {
  background-color: $green-2;
  background-clip: content-box;
}
td .testBedDark {
  background-color: $teal-10;
  background-clip: content-box;
}
td .testBufferDark {
  background-color: $green-10;
  background-clip: content-box;
}
.q-c-input {
  padding-right: 1px !important;
  padding-left: 1px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 28px;
}
.tsDescription :deep(.q-field__control) {
  height: -webkit-fill-available;
}
.testStep :deep(.q-field__control) {
  height: -webkit-fill-available;
}
.testStep :deep(.q-field__prepend) {
  height: -webkit-fill-available;
}
</style>
