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
      :model-value="TestStep.Keyword"
      :options="filteredKeywords"
      option-label="Name"
      @update:model-value="emit('changeKeyword', $event)"
      @filter="filterKeywordFn"
      input-debounce="0"
      use-input
      fill-input
      hide-selected
      options-dense
      :readonly="readonly"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue';

import { KeywordInterface } from '../../../../Models/Keyword';
import { FlatKeywordInterface } from '../../../../Models/FlatKeyword';
import { useKeywordStore } from '../../../../pinia/keywordStore';
import { TestStepInterface } from '../../../../Models/TestStep';
import BaseMenu from '../Menu/BaseMenu.vue';

const props = defineProps<{
  TestStep: TestStepInterface;
}>();

const emit = defineEmits<{
  (e: 'changeKeyword', newKeyword: FlatKeywordInterface): void;
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

const keywordStore = useKeywordStore();
const filteredKeywords: Ref<FlatKeywordInterface[]> = ref([]);
const keywords: Ref<FlatKeywordInterface[]> = computed(() => keywordStore.keywords as FlatKeywordInterface[]);
onMounted(() => {
  filteredKeywords.value = keywords.value;
});
const readonly = computed(() => {
  if (props.TestStep.IsDisabled) return true;
  return false;
});
function filterKeywordFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    filteredKeywords.value = keywords.value.filter((kw: KeywordInterface) => kw.Name.toLowerCase().indexOf(needle) > -1);
  });
}
</script>
