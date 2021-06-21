<template>
  <div>
      <keyword-menu></keyword-menu>
      <q-select
      dense
      :model-value="TestStep.Keyword"
      :options="filteredKeywords"
      option-label="Name"
      @update:model-value="onChangeKeyword($event)"
      @filter="filterKeywordFn"
      input-debounce="0"
      use-input
      fill-input
      hide-selected
      options-dense
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref, Ref, PropType,
} from 'vue';

import { KeywordInterface } from 'src/Models/Keyword'
import { FlatKeywordInterface } from 'src/Models/FlatKeyword'
import { useStore } from 'vuex'
import { TestStepInterface } from 'src/Models/TestStep'
import KeywordMenu from '../ContextMenu/DetailMenu/KeywordMenu.vue'

export default defineComponent({
  name: 'Keyword',
  props: {
    TestStep: {
      type: Object as PropType<TestStepInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { KeywordMenu },
  setup(props, context) {
    const $store = useStore()
    const filteredKeywords: Ref<FlatKeywordInterface[]> = ref([])
    const keywords: Ref<FlatKeywordInterface[]> = computed(() => $store.getters['keyword/keywords'] as FlatKeywordInterface[]);
    onMounted(() => {
      filteredKeywords.value = keywords.value;
    })
    function filterKeywordFn(val: string, update: any) {
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
