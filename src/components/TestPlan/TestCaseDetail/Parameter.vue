<template>
  <div>
    <detail-context-menu
      @useTestEnv="onUseTestEnv()"
    ></detail-context-menu>
    <q-input
      :class="valueStyle"
      :debounce="300"
      :value="TestStep.Params[ParamIndex] ? TestStep.Params[ParamIndex].Value : ''" dense borderless
      @input="onChangeParam($event)"
      :readonly="readonly"
    ></q-input>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  Ref,
  ref,
} from '@vue/composition-api';
import { TestParamInterface } from 'src/Models/TestParam';
import { TestEnvFlatNodeInterface } from 'src/Models/TestEnvFlatNode';
import TestEnvironmentDialog from '../Dialog/TestEnvironmentDialog.vue'
import DetailContextMenu from '../ContextMenu/DetailContextMenu.vue'

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
  },
  components: {
    TestEnvironmentDialog,
    DetailContextMenu,
  },
  setup(props, context) {
    const readonly: Ref<boolean> = ref(false)
    const isDark = computed(() => context.root.$store.getters['global/darkTheme'] as boolean);
    function getValueType(testParam: TestParamInterface): string {
      if (testParam.TestNodePath) {
        if (isDark.value) {
          return 'testBedDark'
        }
        return 'testBed'
      }
      if (testParam.Value && testParam.Value.charAt(0) === '@' && testParam.Value.charAt(testParam.Value.length - 1) === '@') {
        if (isDark.value) {
          return 'testBufferDark'
        }
        return 'testBuffer'
      }
      return ''
    }
    // eslint-disable-next-line consistent-return
    const valueStyle = computed(() => {
      if (props.TestStep.Params[props.ParamIndex]) return getValueType(props.TestStep.Params[props.ParamIndex])
    })

    function onChangeParam(newParamValue: string) {
      console.log('onChangeParam', newParamValue)
      context.emit('changeParam', newParamValue)
    }

    function useTestEnv(flatNode: TestEnvFlatNodeInterface) {
      context.emit('useTestEnv', flatNode)
    }

    function onUseTestEnv() {
      console.log('onUseTestEnv')
      // open new testEnv dialog
      context.root.$q.dialog({
        component: TestEnvironmentDialog,
        parent: context.root,
      }).onOk((node: TestEnvFlatNodeInterface) => {
        // TODO: handle ok
        if (node) {
          console.log('OK from TestEnvironmentDialog', node)
          useTestEnv(node)
        }
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    }

    return {
      onChangeParam,
      valueStyle,
      getValueType,
      isDark,
      onUseTestEnv,
      readonly,
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
