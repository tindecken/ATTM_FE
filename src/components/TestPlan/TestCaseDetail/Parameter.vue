<template>
  <div>
    <q-input
      :class="valueStyle"
      :debounce="300"
      :value="TestStep.Params[ParamIndex] ? TestStep.Params[ParamIndex].Value : ''" dense borderless
      @input="onChangeParam($event)"
      :readonly="Readonly"
    ></q-input>
    <!-- <detail-context-menu
      :selected.sync="selected"
      @deleteRows="onDeleteRows()">
    </detail-context-menu> -->
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, onMounted,
} from '@vue/composition-api';

export default defineComponent({
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
    Readonly: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, context) {
    const isDark = computed(() => context.root.$store.getters['global/darkTheme'] as boolean);
    function getValueType(value: string): string {
      if (value && value.charAt(0) === '$' && value.charAt(value.length - 1) === '$') {
        console.log('isDark', isDark);
        if (isDark.value) return 'testBedDark'
        return 'testBed'
      } if (value && value.charAt(0) === '@' && value.charAt(value.length - 1) === '@') {
        console.log('isDark', isDark);
        if (isDark.value) return 'testBufferDark'
        return 'testBuffer'
      }
      return ''
    }
    const valueStylee = 'testBed'
    // eslint-disable-next-line consistent-return
    const valueStyle = computed(() => {
      if (props.TestStep.Params[props.ParamIndex]) return getValueType(props.TestStep.Params[props.ParamIndex].Value)
    })
    onMounted(() => {
      // console.log('props.TestStep', props.TestStep);
      // console.log('props.ParamIndex', props.ParamIndex);
    })

    function onChangeParam(newParamValue: string) {
      console.log('onChangeParam', newParamValue)
      context.emit('changeParam', newParamValue)
    }
    return {
      onChangeParam,
      valueStyle,
      valueStylee,
      getValueType,
      isDark,
    }
  },
});
</script>

<style scoped lang="scss">
::v-deep .testBed {
  background-color: $teal-2;
  background-clip: content-box;
}
::v-deep .testBuffer {
  background-color: $green-2;
  background-clip: content-box;
}
::v-deep .testBedDark {
  background-color: $teal-10;
  background-clip: content-box;
}
::v-deep .testBufferDark {
  background-color: $green-10;
  background-clip: content-box;
}
</style>
