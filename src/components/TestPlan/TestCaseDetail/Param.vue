<template>
  <div>
      <q-input
        :debounce="300"
        :value="TestStep.Params[ParamIndex].Value" dense borderless
        @input="onChangeParam($event)"
        :readonly="ParamIndex > TestStep.Params.length"
      />
      <!-- <detail-context-menu
        :selected.sync="selected"
        @deleteRows="onDeleteRows()">
      </detail-context-menu> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted,
} from '@vue/composition-api';

export default defineComponent({
  name: 'Param',
  props: {
    TestStep: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    ParamIndex: {
      type: Number,
      required: true,
    },
  },
  components: {},
  setup(props, context) {
    console.log('TestStep', props.TestStep);
    console.log('ParamIndex', props.ParamIndex);
    onMounted(() => {
      console.log('dddddddddddddddddddddddddddd')
    })
    function onChangeParam(newParamValue: string) {
      console.log('onChangeParam', newParamValue)
      context.emit('changeParam', newParamValue)
    }
    return {
      onChangeParam,
    }
  },
});
</script>
