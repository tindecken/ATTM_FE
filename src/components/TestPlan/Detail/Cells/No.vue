<template>
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
  <div>
    {{ Index }}
  </div>
</template>

<script setup lang="ts">
import BaseMenu from '../Menu/BaseMenu.vue';
import { TestStepInterface } from '../../../../Models/TestStep';

const props = defineProps<{
  TestStep: TestStepInterface;
  Index: number;
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
}>();
</script>

<style scoped lang="scss">
:deep(.disabledStyle) {
  background-color: $teal-5;
  background-clip: content-box;
}
</style>
