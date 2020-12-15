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
    <q-footer reveal bordered class="text-white" style="height: 24px">
      Tindecken
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api';
import LeftDrawer from './LeftDrawer.vue';
import RightDrawer from './RightDrawer.vue';

export default defineComponent({
  name: 'Home',
  components: { LeftDrawer, RightDrawer },
  setup(props, context) {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const currentUser = ref('');
    const err = ref('');
    onMounted(async () => {
      try {
        await context.root.$store.dispatch('keyword/getKeywords');
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    });
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
