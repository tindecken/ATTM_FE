<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          Auto Test Management v0.0.1
        </q-toolbar-title>
        <span>{{currentUser}}</span>
        <q-btn flat round icon="exit_to_app" @click="logout" />
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
import { defineComponent, ref } from '@vue/composition-api';
import config from '../config';

export default defineComponent({
  name: 'Home',
  components: { },
  setup(props, context) {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const currentUser = ref('');
    const err = ref('');
    const logout = async () => {
      try {
        await context.root.$store.dispatch('auth/logout');
        const redirectUrl = `/${context.root.$route.query.redirect || 'login'}`;
        context.root.$router.replace(redirectUrl);
      } catch (error) {
        err.value = error.message || 'Something is error !';
      }
    };

    currentUser.value = context.root.$store.getters['auth/userName'];

    return {
      leftDrawerOpen, rightDrawerOpen, err, currentUser, logout,
    };
  },
});
</script>
