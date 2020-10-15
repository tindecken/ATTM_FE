<template>
  <q-layout view="hHh LpR fFf">

    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          Auto Test Management v0.0.1
        </q-toolbar-title>
        <q-btn dense flat round icon="menu" @click="rightDrawerOpen = !rightDrawerOpen"/>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, ref } from '@vue/composition-api';
import config from '../config';

export default defineComponent({
  name: 'Home',
  components: { },
  async setup(props, context) {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const err = ref('');
    try {
      const users = await context.root.$axios.get(`${config.baseURL}/users`, {
        headers: { Authorization: `Bearer ${context.root.$store.getters['auth/token']}` },
      });
    } catch (error) {
      err.value = error.message || 'Failed to authenticate, try later.';
    }
    return { leftDrawerOpen, rightDrawerOpen, err };
  },
});
</script>
