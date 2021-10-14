<template>
  <div>
    <q-splitter
      v-model="splitterModel"
    >
      <template v-slot:before>
          <tree></tree>
      </template>
      <template v-slot:after>
        <test-case-detail></test-case-detail>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Tree from './Tree/Tree.vue';
import TestCaseDetail from './TestCaseDetail/TestCaseDetail.vue'

export default defineComponent({
  name: 'TestPlan',
  components: { Tree, TestCaseDetail },
  setup() {
    const splitterModel = ref(20);
    return {
      splitterModel,
    };
  },
});
</script>
