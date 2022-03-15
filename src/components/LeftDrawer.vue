<template>
  <q-list>
    <q-item
      clickable
      v-ripple
      class="cursor-pointer"
      router-link
      to="/testplan"
    >
      <q-item-section avatar>
        <q-avatar
          rounded
          color="primary"
          text-color="white"
          icon="swap_horiz"
        />
      </q-item-section>
      <q-item-section>Test Plan</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      class="cursor-pointer"
      router-link
      to="/devmonitoring"
    >
      <q-item-section avatar>
        <q-avatar
          rounded
          color="primary"
          text-color="white"
          icon="swap_horiz"
        />
      </q-item-section>
      <q-item-section>Dev Monitoring</q-item-section>
    </q-item>
    <q-separator />
    <q-item
      clickable
      v-ripple
      class="cursor-pointer"
      router-link
      to="/regression"
    >
      <q-item-section avatar>
        <q-avatar
          rounded
          color="primary"
          text-color="white"
          icon="swap_horiz"
        />
      </q-item-section>
      <q-item-section>Regression</q-item-section>
    </q-item>
    <q-item
      clickable
      v-ripple
      class="cursor-pointer"
      router-link
      to="/createregression"
    >
      <q-item-section avatar>
        <q-avatar
          rounded
          color="primary"
          text-color="white"
          icon="swap_horiz"
        />
      </q-item-section>
      <q-item-section>Create Regression</q-item-section>
    </q-item>
    <q-separator />
    <q-item
      clickable
      v-ripple
      class="cursor-pointer"
      router-link
      to="/settings"
    >
      <q-item-section avatar>
        <q-avatar
          rounded
          color="primary"
          text-color="white"
          icon="swap_horiz"
        />
      </q-item-section>
      <q-item-section>Settings</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="switchTheme()" class="cursor-pointer">
      <q-item-section avatar>
        <q-avatar
          rounded
          color="primary"
          text-color="white"
          icon="swap_horiz"
        />
      </q-item-section>
      <q-item-section>Switch Theme</q-item-section>
    </q-item>
  </q-list>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Dark } from 'quasar';
import { useGlobalStore } from '../pinia/globalStore';

export default defineComponent({
  name: 'LeftDrawer',
  props: {},
  setup() {
    const globalStore = useGlobalStore();
    function switchTheme() {
      globalStore.switchDarkTheme();
      Dark.set(globalStore.darkTheme);
    }
    return { switchTheme };
  },
});
</script>
