<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount } from '@vue/composition-api';
import { Dark } from 'quasar';

export default defineComponent({
  name: 'App',
  setup(props, context) {
    onBeforeMount(() => {
      const theme = context.root.$store.getters['global/darkTheme'];
      Dark.set(theme);
    });
  },
});
</script>
