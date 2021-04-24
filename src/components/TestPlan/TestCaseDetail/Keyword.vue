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
import { FlatKeywordInterface } from 'src/Models/FlatKeyword';

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
    const filteredKeywords: Ref<FlatKeywordInterface[]> = ref([])
    const keywords: Ref<FlatKeywordInterface[]> = computed(() => context.root.$store.getters['keyword/keywords'] as FlatKeywordInterface[]);
    onMounted(() => {
      filteredKeywords.value = keywords.value;
    })
    function filterKeywordFn(val: any, update: any) {
      update(() => {
        const needle = val.toLowerCase()
        filteredKeywords.value = keywords.value.filter((kw: KeywordInterface) => kw.Name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function onChangeKeyword(newKeyword: FlatKeywordInterface) {
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
