<template>
  <no-menu
    @enableRows="enableRows()"
    @disableRows="disableRows()"
    @insertDescription="insertDescription()"
  ></no-menu>
  <div>
    {{Index}}
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, computed,
} from 'vue';

import { TestStepInterface } from 'src/Models/TestStep'
import NoMenu from '../ContextMenu/DetailMenu/NoMenu.vue'

export default defineComponent({
  name: 'No',
  props: {
    TestStep: {
      type: Object as PropType<TestStepInterface>,
      required: true,
      default: () => ({}),
    },
    Index: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  emits: ['insertDescription', 'enableRows', 'disableRows'],
  components: { NoMenu },
  setup(props, { emit }) {
    const valueStyle = computed(() => 'disabled')
    function enableRows() {
      emit('enableRows')
    }

    function disableRows() {
      emit('disableRows')
    }
    function insertDescription() {
      emit('insertDescription', props.TestStep)
    }
    return {
      insertDescription,
      enableRows,
      disableRows,
      valueStyle,
    }
  },
});
</script>

<style scoped lang="scss">
:deep(.disabledStyle) {
  background-color: $teal-5;
  background-clip: content-box;
}
</style>
