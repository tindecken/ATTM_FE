<template>
  <div>Regression History</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { TestCaseInterface } from '../../../../../Models/TestCase';

export default defineComponent({
  name: 'RegressionHistory',
  props: {
    TestCase: {
      type: Object as PropType<TestCaseInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: {},
  setup() {
    return {};
  },
});
</script>
