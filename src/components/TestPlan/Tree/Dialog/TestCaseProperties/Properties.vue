<template>
  <div>
    {{ TestCase.Name }}
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
} from 'vue';

import { TestCaseInterface } from 'src/Models/TestCase'

export default defineComponent({
  name: 'Properties',
  props: {
    TestCase: {
      type: Object as PropType<TestCaseInterface>,
      required: true,
    },
  },
  components: { },
  setup() {
    return {
    }
  },
});
</script>
