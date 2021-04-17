<template>
    <div>
        <q-select
        dense
        :value="testAUT"
        :options="filteredTestAUTs"
        option-label="Name"
        @input="onChangeTestAUT($event)"
        @filter="filterTestAUTFn"
        input-debounce="0"
        use-input
        fill-input
        hide-selected
        options-dense
    />
    <!-- <detail-context-menu
        :selected.sync="selected"
        @deleteRows="onDeleteRows()">
    </detail-context-menu> -->
    </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, Ref,
} from '@vue/composition-api';
import { TestAUTInterface } from 'src/Models/TestAUT';

export default defineComponent({
  name: 'TestAUT',
  props: {
    TestStep: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  components: {},
  setup(props, context) {
    const filteredTestAUTs: Ref<TestAUTInterface[]> = ref([])
    console.log('props.TestStep', props.TestStep);
    const testAUTs: Ref<TestAUTInterface[]> = computed(() => context.root.$store.getters['global/testAuTs'] as TestAUTInterface[]);
    const testAUT: Ref<TestAUTInterface | undefined> = ref(undefined);
    testAUT.value = testAUTs.value.find((aut: TestAUTInterface) => aut.Id === props.TestStep.TestAUTId)
    console.log('testAUTs', testAUTs)
    console.log('testAUT', testAUT)
    function filterTestAUTFn(val: any, update: any) {
      update(() => {
        const needle = val.toLowerCase()
        filteredTestAUTs.value = testAUTs.value.filter((v: TestAUTInterface) => v.Name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function onChangeTestAUT(newTestAUT: TestAUTInterface) {
      testAUT.value = newTestAUT
      console.log('onChangeTestAUT, testAUT', testAUT.value)
      console.log('onChangeTestAUT', newTestAUT)
      context.emit('changeTestAUT', newTestAUT)
    }
    return {
      filterTestAUTFn,
      filteredTestAUTs,
      testAUTs,
      onChangeTestAUT,
      testAUT,
    }
  },
});
</script>
