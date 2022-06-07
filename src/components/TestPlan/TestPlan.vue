<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <keep-alive>
          <tree></tree>
        </keep-alive>
      </template>
      <template v-slot:after>
        <detail></detail>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useTitle } from '@vueuse/core';
import Tree from './Tree/Tree.vue';
import Detail from './Detail/Detail.vue';

export default defineComponent({
  name: 'TestPlan',
  components: { Tree, Detail },
  setup() {
    const splitterModel = ref(20);
    useTitle('Test Plan');
    return {
      splitterModel,
    };
  },
});
</script>
