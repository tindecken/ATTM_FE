<template>
  <div>
      <q-select
      dense
      :value="TestStep.Keyword"
      :options="filteredKeywords"
      option-label="Name"
      @input="onChangeKeyword($event)"
      @filter="filterKeywordFn"
      input-debounce="0"
      use-input
      fill-input
      hide-selected
      options-dense
  />
    <!-- <detail-context-menu
      :selected.sync="selected"
      @deleteRows="onDeleteRows()">
    </detail-context-menu> -->
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, Ref,
} from '@vue/composition-api';
import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';

export default defineComponent({
  name: 'Keyword',
  props: {
    TestStep: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  components: {},
  setup(props, context) {
    console.log('keyword testStep', props.TestStep);
    const filteredKeywords: Ref<KeywordInterface[]> = ref([])
    const keywords: Ref<KeywordInterface[]> = computed(() => context.root.$store.getters['keyword/keywords'] as KeywordInterface[]);
    const keywordCategories: Ref<KeywordCategoryInterface[]> = computed(() => context.root.$store.getters['keyword/keywords'] as KeywordCategoryInterface[]);
    console.log('keywordCategories', keywordCategories);
    function filterKeywordFn(val: any, update: any, abort: any) {
      update(() => {
        const needle = val.toLowerCase()
        filteredKeywords.value = keywords.value.filter((kw: KeywordInterface) => kw.Name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function onChangeKeyword(newKeyword: KeywordInterface) {
      context.emit('ChangeKeyword', newKeyword)
    }
    return {
      filterKeywordFn,
      filteredKeywords,
      keywords,
      onChangeKeyword,
    }
  },
});
</script>
