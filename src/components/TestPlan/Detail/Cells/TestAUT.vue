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
import { computed, defineComponent, ref, Ref, PropType } from 'vue';
import { TestAUTInterface } from '../../../../Models/TestAUT';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { TestStepInterface } from '../../../../Models/TestStep';
import TestAUTMenu from '../Menu/TestAUTMenu.vue';

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
    const globalStore = useGlobalStore();
    const filteredTestAUTs: Ref<TestAUTInterface[]> = ref([]);
    const testAUTs: Ref<TestAUTInterface[]> = computed(
      () => globalStore.testAUTs as TestAUTInterface[]
    );
    const readonly = computed(() => {
      if (props.TestStep.IsDisabled) return true;
      return false;
    });

    const testAUT = computed(() =>
      testAUTs.value.find(
        (aut: TestAUTInterface) => aut.Id === props.TestStep.TestAUTId
      )
    );
    function filterTestAUTFn(val: string, update: any) {
      update(() => {
        const needle = val.toLowerCase();
        filteredTestAUTs.value = testAUTs.value.filter(
          (v: TestAUTInterface) => v.Name.toLowerCase().indexOf(needle) > -1
        );
      });
    }

    function onChangeTestAUT(newTestAUT: TestAUTInterface) {
      context.emit('changeTestAUT', newTestAUT);
    }
    return {
      filterTestAUTFn,
      filteredTestAUTs,
      testAUTs,
      onChangeTestAUT,
      testAUT,
      readonly,
    };
  },
});
</script>
