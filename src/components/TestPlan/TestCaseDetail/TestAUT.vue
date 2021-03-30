<template>
    <div>
        <q-select
        dense
        :value="TestStep.TestAUT"
        :options="optionTestAUTDatas"
        option-label="Name"
        @input="changeTestAUT({testcase: tc, stepIndex: props.rowIndex, property: 'TestAUT'}, $event)"
        @filter="filterTestAUTFn"
        input-debounce="0"
        use-input
        fill-input
        hide-selected
        options-dense
    />
    <detail-context-menu
        :selected.sync="selected"
        @deleteRows="onDeleteRows()">
    </detail-context-menu>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

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
  setup(props) {
    console.log('dsfsad', props.TestStep);
    function filterTestAUTFn(val: any, update: any, abort: any) {
      update(() => {
        const needle = val.toLowerCase()
        optionTestAUTDatas.value = testAUTDatas.value.filter((v) => v.Name.toLowerCase().indexOf(needle) > -1)
      })
    }
    return {
      filterTestAUTFn,
      optionTestAUTDatas,
    }
  },
});
</script>
