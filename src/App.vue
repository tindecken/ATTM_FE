<template>
    <router-view />
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, onBeforeMount } from 'vue';
import { Dark } from 'quasar';

export default defineComponent({
  name: 'App',
  setup() {
    const $store = useStore()
    onBeforeMount(() => {
      const theme = $store.getters['global/darkTheme'];
      Dark.set(theme);
    });
  },
});
</script>
