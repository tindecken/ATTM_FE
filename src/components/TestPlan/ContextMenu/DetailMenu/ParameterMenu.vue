<template>
  <base-menu>
    <template #default>
      <q-item clickable v-close-popup @click="useTestEnv()">
        <q-item-section avatar>
          <q-icon color="primary" name="create" />
        </q-item-section>
        <q-item-section>Use TestEnv</q-item-section>
      </q-item>
    </template>
  </base-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseMenu from './BaseMenu.vue'

export default defineComponent({
  name: 'parameter-menu',
  components: { BaseMenu },
  setup(props, { emit }) {
    function useTestEnv() {
      emit('useTestEnv')
    }
    return {
      useTestEnv,
    };
  },
})
</script>
