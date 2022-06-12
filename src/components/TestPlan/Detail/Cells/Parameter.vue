<template>
  <parameter-menu
    @useTestEnv="emit('useTestEnv')"
    @unUseTestEnv="emit('unUseTestEnv')"
    @enableRows="emit('enableRows')"
    @disableRows="emit('disableRows')"
    @insertDescription="emit('insertDescription', TestStep)"
    @copyTestSteps="emit('copyTestSteps')"
    @cutTestSteps="emit('cutTestSteps')"
    @pasteTestSteps="emit('pasteTestSteps')"
    @deleteTestSteps="emit('deleteTestSteps')"
    @before-show="emit('beforeShowDialog')"
    @insertTestSteps="emit('insertTestSteps')"
    @insertPasteTestSteps="emit('insertPasteTestSteps')"
    @editTestStep="emit('editTestStep')"
    @searchKeyword="emit('searchKeyword')"
  >
  </parameter-menu>
  <q-input :class="valueStyle" :debounce="300" :model-value="prValue" dense borderless @update:model-value="emit('changeParam', $event)" :readonly="readonly">
    <template v-slot:prepend>
      <q-icon v-if="isParamError" name="error">
        <q-tooltip>
          {{ paramErrorMessage }}
        </q-tooltip>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { TestStepInterface } from '../../../../Models/TestStep';
import { TestEnvInterface, TestEnvNodeInterface } from '../../../../Models/TestEnv';
import { useTestEnvironmentStore } from '../../../../pinia/testEnvironmentStore';
import ParameterMenu from '../Menu/ParameterMenu.vue';
import { getValueType } from '../Utils/utils';

const props = defineProps<{
  TestStep: TestStepInterface;
  ParamIndex: number;
}>();

const emit = defineEmits<{
  (e: 'insertDescription', TestStep: TestStepInterface): void;
  (e: 'enableRows'): void;
  (e: 'disableRows'): void;
  (e: 'copyTestSteps'): void;
  (e: 'cutTestSteps'): void;
  (e: 'deleteTestSteps'): void;
  (e: 'beforeShowDialog'): void;
  (e: 'pasteTestSteps'): void;
  (e: 'insertTestSteps'): void;
  (e: 'insertPasteTestSteps'): void;
  (e: 'editTestStep'): void;
  (e: 'searchKeyword'): void;
  (e: 'useTestEnv'): void;
  (e: 'unUseTestEnv'): void;
  (e: 'changeParam', newParam: string): void;
}>();

const testEnvironmentStore = useTestEnvironmentStore();
const isParamError: Ref<boolean> = ref(false);
const paramErrorMessage = ref('');
const readonly = computed(() => {
  const numberOfParam: number = props.TestStep.Params.length;
  const testEnvPath = props.TestStep.Params[props.ParamIndex]?.TestNodePath;
  if (props.TestStep.IsDisabled) return true;
  if (testEnvPath && testEnvPath !== '') {
    return true;
  }
  if (props.ParamIndex >= numberOfParam) {
    return true;
  }
  return false;
});

function setNoError() {
  isParamError.value = false;
  paramErrorMessage.value = '';
}
function setError(message: string) {
  isParamError.value = true;
  paramErrorMessage.value = message;
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
        setNoError();
      } else {
        setError(`There's no node: ${nodeEnv} in environment: ${selectedTestEnv.Name}`);
        value = ts.Params[prIndex].Value;
      }
    } else {
      setError(`There's no category: ${catEnv} in environment: ${selectedTestEnv.Name}`);
      value = ts.Params[prIndex].Value;
    }
  } else {
    setError('No Test Environment is selected, get last value');
    value = ts.Params[prIndex].Value;
  }

  return value;
}

const prValue = computed(() => {
  const ts: TestStepInterface = props.TestStep;
  const prIndex: number = props.ParamIndex;
  if (ts.Params[prIndex]) {
    if (ts.Params[prIndex].TestNodePath !== '') {
      return getValueFromTestEnv(ts, prIndex);
    }
    setNoError();
    return ts.Params[prIndex].Value;
  }
  return '';
});

// CSS value of a parameter
const valueStyle = computed(() => {
  if (props.TestStep.Params[props.ParamIndex]) return getValueType(props.TestStep.Params[props.ParamIndex]);
  return '';
});
</script>
