<template>
    <div>
        <test-aut-menu></test-aut-menu>
        <q-select
        dense
        :model-value="testAUT"
        :options="filteredTestAUTs"
        option-label="Name"
        @update:model-value="onChangeTestAUT($event)"
        @filter="filterTestAUTFn"
        input-debounce="0"
        use-input
        fill-input
        hide-selected
        options-dense
        :readonly="readonly"
        >
      </q-select>
    </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, Ref, PropType,
} from 'vue';
import { TestAUTInterface } from 'src/Models/TestAUT'
import { useStore } from 'vuex'
import { TestStepInterface } from 'src/Models/TestStep'
import TestAUTMenu from '../ContextMenu/DetailMenu/TestAUTMenu.vue'

export default defineComponent({
  name: 'TestAUT',
  props: {
    TestStep: {
      type: Object as PropType<TestStepInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { 'test-aut-menu': TestAUTMenu },
  setup(props, context) {
    const $store = useStore()
    const filteredTestAUTs: Ref<TestAUTInterface[]> = ref([])
    const testAUTs: Ref<TestAUTInterface[]> = computed(() => $store.getters['global/testAuTs'] as TestAUTInterface[]);
    const testAUT: Ref<TestAUTInterface | undefined> = ref(undefined);
    const readonly = computed(() => {
      if (props.TestStep.IsDisabled) return true
      return false
    })
    testAUT.value = testAUTs.value.find((aut: TestAUTInterface) => aut.Id === props.TestStep.TestAUTId)
    function filterTestAUTFn(val: string, update: any) {
      update(() => {
        const needle = val.toLowerCase()
        filteredTestAUTs.value = testAUTs.value.filter((v: TestAUTInterface) => v.Name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function onChangeTestAUT(newTestAUT: TestAUTInterface) {
      testAUT.value = newTestAUT
      context.emit('changeTestAUT', newTestAUT)
    }
    return {
      filterTestAUTFn,
      filteredTestAUTs,
      testAUTs,
      onChangeTestAUT,
      testAUT,
      readonly,
    }
  },
});
</script>
