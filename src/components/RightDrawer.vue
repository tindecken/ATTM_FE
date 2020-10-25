<template>
  <q-list>
      <q-separator />
      <q-item clickable v-ripple @click="switchTheme()">
        <q-item-section avatar>
          <q-avatar rounded color="primary" text-color="white" icon="swap_horiz" />
        </q-item-section>
        <q-item-section>Switch Theme</q-item-section>
      </q-item>
    </q-list>
</template>
<script lang="ts">

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defineComponent } from '@vue/composition-api';
import { Dark } from 'quasar';

export default defineComponent({
  name: 'RightDrawer',
  props: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, context) {
    function switchTheme() {
      context.root.$store.dispatch('global/switchDarkTheme');
      Dark.set(context.root.$store.getters['global/darkTheme']);
    }
    return { switchTheme };
  },
});
</script>
