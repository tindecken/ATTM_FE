<template>
  <div>
    <q-splitter
      v-model="splitterModel"
    >
      <template v-slot:before>
        <tree></tree>
      </template>
      <template v-slot:after>
        <detail></detail>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import Tree from './Tree.vue';
import Detail from './Detail.vue'

export default defineComponent({
  name: 'TestPlan',
  components: { Tree, Detail },
  setup() {
    const splitterModel = ref(20);
    return {
      splitterModel,
    };
  },
});
</script>
