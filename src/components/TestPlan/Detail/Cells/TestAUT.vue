<template>
  <div>
    <base-menu
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
      <template #default> </template>
    </base-menu>
    <q-select
      dense
      :model-value="testAUT"
      :options="filteredTestAUTs"
      option-label="Name"
      @update:model-value="emit('changeTestAUT', $event)"
      @filter="filterTestAUTFn"
      input-debounce="0"
      use-input
      fill-input
      hide-selected
      options-dense
      :readonly="readonly"
    >
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { TestAUTInterface } from '../../../../Models/TestAUT';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { TestStepInterface } from '../../../../Models/TestStep';
import BaseMenu from '../Menu/BaseMenu.vue';

const props = defineProps<{
  TestStep: TestStepInterface;
}>();

const emit = defineEmits<{
  (e: 'changeTestAUT', newTestAUT: TestAUTInterface): void;
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
}>();

const globalStore = useGlobalStore();
const filteredTestAUTs: Ref<TestAUTInterface[]> = ref([]);
const testAUTs: Ref<TestAUTInterface[]> = computed(() => globalStore.testAUTs as TestAUTInterface[]);
const readonly = computed(() => {
  if (props.TestStep.IsDisabled) return true;
  return false;
});

const testAUT = computed(() => testAUTs.value.find((aut: TestAUTInterface) => aut.Id === props.TestStep.TestAUTId));
function filterTestAUTFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    filteredTestAUTs.value = testAUTs.value.filter((v: TestAUTInterface) => v.Name.toLowerCase().indexOf(needle) > -1);
  });
}
</script>
