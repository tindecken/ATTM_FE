<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar style="height: 24px">
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          Auto Test Management v0.0.1
        </q-toolbar-title>
        <span>{{currentUser}}</span>
        <q-btn flat round icon="exit_to_app" @click="logout" />
        <q-btn dense flat round icon="menu" @click="rightDrawerOpen = !rightDrawerOpen"/>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="180">
      <left-drawer></left-drawer>
    </q-drawer>
    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered :width="850">
      <right-drawer></right-drawer>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="text-white row inline justify-between" style="height: 24px">
      <div>Tindecken @ 2021</div>
      <div class="row inline">
        <test-client-footer></test-client-footer>
        <q-separator vertical class="q-mr-sm" />
        <env-footer></env-footer>
      </div>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import LeftDrawer from './LeftDrawer.vue';
import RightDrawer from './RightDrawer.vue';
import EnvFooter from './Footer/EnvFooter.vue';
import TestClientFooter from './Footer/TestClientFooter.vue';

export default defineComponent({
  name: 'Home',
  components: {
    LeftDrawer,
    RightDrawer,
    EnvFooter,
    TestClientFooter,
  },
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
