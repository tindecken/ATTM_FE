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
  computed, defineComponent, onMounted, ref, Ref,
} from '@vue/composition-api';

import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
import { KeywordFeatureInterface } from 'src/Models/KeywordFeature';

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
    onMounted(() => {
      console.log('eeeeeeeeeeeeeeeee')
    })
    console.log('keyword testStep', props.TestStep);
    const filteredKeywords: Ref<KeywordInterface[]> = ref([])
    const keywords: Ref<KeywordInterface[]> = computed(() => context.root.$store.getters['keyword/keywords'] as KeywordInterface[]);
    const keywordCategories: Ref<KeywordCategoryInterface[]> = computed(() => context.root.$store.getters['keyword/keywordCategories'] as KeywordCategoryInterface[]);
    const allKeyword: Ref<KeywordInterface[]> = ref([])
    keywordCategories.value.forEach((kwCategory: KeywordCategoryInterface) => {
      if (kwCategory.Features) {
        kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
          if (kwFeature.Keywords) {
            kwFeature.Keywords.forEach((kw: KeywordInterface) => {
              allKeyword.value.push(kw);
            })
          }
        })
      }
    })
    console.log('keywordCategories', keywordCategories);
    function filterKeywordFn(val: any, update: any, abort: any) {
      update(() => {
        const needle = val.toLowerCase()
        filteredKeywords.value = allKeyword.value.filter((kw: KeywordInterface) => kw.Name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function onChangeKeyword(newKeyword: KeywordInterface) {
      console.log('onChangeKeyword', newKeyword)
      context.emit('changeKeyword', newKeyword)
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
