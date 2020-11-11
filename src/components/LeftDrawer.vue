<template>
  <q-list>
      <q-item clickable v-ripple class="cursor-pointer">
        <q-item-section avatar>
          <q-avatar rounded color="primary" text-color="white" icon="swap_horiz" />
        </q-item-section>
        <q-item-section>Test Plan</q-item-section>
      </q-item>
      <q-item clickable v-ripple class="cursor-pointer">
        <q-item-section avatar>
          <q-avatar rounded color="primary" text-color="white" icon="swap_horiz" />
        </q-item-section>
        <q-item-section>Debug</q-item-section>
      </q-item>
      <q-item clickable v-ripple class="cursor-pointer">
        <q-item-section avatar>
          <q-avatar rounded color="primary" text-color="white" icon="swap_horiz" />
        </q-item-section>
        <q-item-section>Regression</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple @click="switchTheme()" class="cursor-pointer">
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
  name: 'LeftDrawer',
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
