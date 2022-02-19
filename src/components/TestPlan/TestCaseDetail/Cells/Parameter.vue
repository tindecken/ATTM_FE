<template>
  <div>
    <parameter-menu
      @useTestEnv="useTestEnv"
      @unUseTestEnv="unUseTestEnv"
    ></parameter-menu>
    <q-input
      :class="valueStyle"
      :debounce="300"
      :model-value="prValue"
      dense
      borderless
      @update:model-value="onChangeParam($event)"
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
  PropType,
} from 'vue';
import { TestStepInterface } from 'src/Models/TestStep';
import { TestEnvInterface, TestEnvNodeInterface } from 'src/Models/TestEnv';
import { useStore } from 'vuex'
import { useGlobalStore } from 'src/pinia/globalStore';
import ParameterMenu from '../Menu/ParameterMenu.vue'
import { getValueType } from '../Utils/utils'

export default defineComponent({
  props: {
    TestStep: {
      type: Object as PropType<TestStepInterface>,
      required: true,
      default: () => ({}),
    },
    ParamIndex: {
      type: Number,
      required: true,
    },
  },
  components: {
    ParameterMenu,
  },
  setup(props, context) {
    const globalStore = useGlobalStore()
    const $store = useStore()
    const isParamError: Ref<boolean> = ref(false)
    const paramErrorMessage = ref('')
    const isDark = computed(() => globalStore.darkTheme);
    const readonly = computed(() => {
      const numberOfParam: number = props.TestStep.Params.length;
      const testEnvPath = props.TestStep.Params[props.ParamIndex]?.TestNodePath
      if (props.TestStep.IsDisabled) return true
      if (testEnvPath && testEnvPath !== '') {
        return true
      }
      if (props.ParamIndex >= numberOfParam) {
        return true
      }
      return false
    })

    function setNoError() {
      isParamError.value = false
      paramErrorMessage.value = ''
    }
    function setError(message: string) {
      isParamError.value = true
      paramErrorMessage.value = message
    }
    function getValueFromTestEnv(ts: TestStepInterface, prIndex: number): string {
      let value = ''
      const selectedTestEnv = $store.getters['testenvironment/selectedTestEnv'] as TestEnvInterface
      const catEnv = ts.Params[prIndex].TestNodePath.split('/')[0]
      const nodeEnv = ts.Params[prIndex].TestNodePath.split('/')[1]

      if (selectedTestEnv) {
        const cat = selectedTestEnv.Nodes.find((envNode: TestEnvNodeInterface) => envNode.Category === catEnv)
        if (cat) {
          const node = selectedTestEnv.Nodes.find((n: TestEnvNodeInterface) => n.Name === nodeEnv && n.Category === catEnv)
          if (node) {
            value = node.Value
            setNoError()
          } else {
            setError(`There's no node: ${nodeEnv} in environment: ${selectedTestEnv.Name}`)
            value = ts.Params[prIndex].Value
          }
        } else {
          setError(`There's no category: ${catEnv} in environment: ${selectedTestEnv.Name}`)
          value = ts.Params[prIndex].Value
        }
      } else {
        setError('No Test Environment is selected, get last value')
        value = ts.Params[prIndex].Value
      }

      return value
    }
    const prValue = computed(() => {
      const ts: TestStepInterface = props.TestStep;
      const prIndex: number = props.ParamIndex
      if (ts.Params[prIndex]) {
        if (ts.Params[prIndex].TestNodePath !== '') {
          return getValueFromTestEnv(ts, prIndex)
        }
        setNoError()
        return ts.Params[prIndex].Value
      } return ''
    })
    // eslint-disable-next-line consistent-return
    const valueStyle = computed(() => {
      if (props.TestStep.Params[props.ParamIndex]) return getValueType(props.TestStep.Params[props.ParamIndex])
      return ''
    })

    function onChangeParam(newParamValue: string) {
      console.log('onChangeParam', newParamValue)
      context.emit('changeParam', newParamValue)
    }

    function useTestEnv(testEnvNode: TestEnvNodeInterface) {
      context.emit('useTestEnv', testEnvNode)
    }

    function unUseTestEnv() {
      context.emit('unUseTestEnv', prValue.value)
    }

    return {
      onChangeParam,
      valueStyle,
      getValueType,
      isDark,
      readonly,
      prValue,
      isParamError,
      paramErrorMessage,
      useTestEnv,
      unUseTestEnv,
    }
  },
});
</script>

<style scoped lang="scss">
:deep(.testBed) {
  background-color: $teal-2;
  background-clip: content-box;
}
:deep(.testBuffer) {
  background-color: $green-2;
  background-clip: content-box;
}
:deep(.testBedDark) {
  background-color: $teal-10;
  background-clip: content-box;
}
:deep(.testBufferDark) {
  background-color: $green-10;
  background-clip: content-box;
}
</style>
