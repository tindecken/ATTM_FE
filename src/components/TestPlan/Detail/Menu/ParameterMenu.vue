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
    <template #default>
      <q-item clickable v-close-popup @click="emit('useTestEnv')">
        <q-item-section avatar>
          <q-icon color="primary" name="create" />
        </q-item-section>
        <q-item-section>Use TestEnv</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="emit('unUseTestEnv')">
        <q-item-section avatar>
          <q-icon color="primary" name="create" />
        </q-item-section>
        <q-item-section>UnUse TestEnv</q-item-section>
      </q-item>
    </template>
  </base-menu>
</template>

<script setup lang="ts">
import BaseMenu from '../Menu/BaseMenu.vue';
import { TestStepInterface } from '../../../../Models/TestStep';

const props = defineProps<{
  TestStep: TestStepInterface;
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
}>();
</script>
