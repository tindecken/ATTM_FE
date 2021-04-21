<template>
  <div>
    <detail-context-menu
      @useTestEnv="onUseTestEnv()"
    ></detail-context-menu>
    <q-input
      :class="valueStyle"
      :debounce="300"
      :value="prValue"
      dense
      borderless
      @input="onChangeParam($event)"
      :readonly="readonly"
    >
      <template v-slot:prepend>
          <q-icon v-if="isParamError" name="error">
            <q-tooltip>
              {{paramErrorMessage}}
            </q-tooltip>
          </q-icon>
        </template>
    </q-input>
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
import { TestStepInterface } from 'src/Models/TestStep';
import { TestEnvInterface } from 'src/Models/TestEnv';
import { TestEnvCategoryInterface } from 'src/Models/TestEnvCategory';
import { TestEnvNodeInterface } from 'src/Models/TestEnvNode';
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
    const isParamError: Ref<boolean> = ref(false)
    const paramErrorMessage = ref('')
    const isDark = computed(() => context.root.$store.getters['global/darkTheme'] as boolean);
    const readonly = computed(() => {
      const numberOfParam: number = props.TestStep.Params.length;
      const testEnvPath = props.TestStep.Params[props.ParamIndex]?.TestNodePath
      if (testEnvPath && testEnvPath !== '') {
        return true
      }
      if (props.ParamIndex >= numberOfParam) {
        return true
      }
      return false
    })

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
    function getValueFromTestEnv(ts: TestStepInterface, prIndex: number): string {
      let value = ''
      paramErrorMessage.value = ''
      isParamError.value = false
      const selectedTestEnv = context.root.$store.getters['testenvironment/selectedTestEnv'] as TestEnvInterface
      const catEnv = ts.Params[prIndex].TestNodePath.split('/')[0]
      const nodeEnv = ts.Params[prIndex].TestNodePath.split('/')[1]

      if (selectedTestEnv.Categories) {
        const cat = selectedTestEnv.Categories.find((c: TestEnvCategoryInterface) => c.Name === catEnv)
        if (cat) {
          const node = cat.Nodes.find((n: TestEnvNodeInterface) => n.Name === nodeEnv)
          if (node) {
            value = node.Value
          } else {
            isParamError.value = true
            paramErrorMessage.value = `There's no node: ${nodeEnv} in environment: ${selectedTestEnv.Name}`
            value = ts.Params[prIndex].Value
          }
        } else {
          isParamError.value = true
          paramErrorMessage.value = `There's no category: ${catEnv} in environment: ${selectedTestEnv.Name}`
          value = ts.Params[prIndex].Value
        }
      } else {
        value = ts.Params[prIndex].Value
      }

      return value
    }
    const prValue = computed(() => {
      const ts: TestStepInterface = props.TestStep as TestStepInterface;
      const prIndex: number = props.ParamIndex
      if (ts.Params[prIndex]) {
        if (ts.Params[prIndex].TestNodePath !== '') {
          return getValueFromTestEnv(ts, prIndex)
        }
        return ts.Params[prIndex].Value
      } return ''
    })
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
      prValue,
      isParamError,
      paramErrorMessage,
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
