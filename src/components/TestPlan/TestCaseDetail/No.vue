<template>
  <no-menu
    @enableRows="enableRows()"
    @disableRows="disableRows()"
    @insertDescription="insertDescription()"
    @copyTestSteps="copyTestSteps()"
    @cutTestSteps="cutTestSteps()"
    @deleteTestSteps="deleteTestSteps()"
  ></no-menu>
  <div>
    {{Index}}
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
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
  emits: ['insertDescription', 'enableRows', 'disableRows', 'copyTestSteps', 'cutTestSteps', 'deleteTestSteps'],
  components: { NoMenu },
  setup(props, { emit }) {
    function enableRows() {
      emit('enableRows')
    }

    function disableRows() {
      emit('disableRows')
    }
    function insertDescription() {
      emit('insertDescription', props.TestStep)
    }
    function copyTestSteps() {
      emit('copyTestSteps')
    }
    function cutTestSteps() {
      emit('cutTestSteps')
    }
    function deleteTestSteps() {
      emit('deleteTestSteps')
    }
    return {
      insertDescription,
      enableRows,
      disableRows,
      copyTestSteps,
      cutTestSteps,
      deleteTestSteps,
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
