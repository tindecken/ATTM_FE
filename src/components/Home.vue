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
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, ref, onMounted } from 'vue';
import * as signalR from '@microsoft/signalr';
import { DevRunRecordInterface } from 'src/Models/DevRunRecord';
import LeftDrawer from './LeftDrawer.vue';
import RightDrawer from './RightDrawer.vue';
import EnvFooter from './Footer/EnvFooter.vue';
import TestClientFooter from './Footer/TestClientFooter.vue';
import config from '../config'

export default defineComponent({
  name: 'Home',
  components: {
    LeftDrawer,
    RightDrawer,
    EnvFooter,
    TestClientFooter,
  },
  setup() {
    const $store = useStore()
    const $route = useRoute()
    const $router = useRouter()
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const currentUser = ref('');
    const err = ref('');
    const logout = async () => {
      try {
        await $store.dispatch('auth/logout');
        const redirectUrl = `/${$route.query.redirect || 'login'}`;
        void $router.replace(redirectUrl);
      } catch (error) {
        err.value = error.message || 'Something is error !';
      }
    };
    currentUser.value = $store.getters['auth/userName'];
    onMounted(() => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${config.socketServer}`)
        .build()

      connection.on('DevRunningInfo', (devRunRecord: DevRunRecordInterface) => {
        $store.commit('devmonitoring/updateDevRunRecords', devRunRecord)
      });

      connection.on('DevRunningFail', (devRunRecord: DevRunRecordInterface) => {
        $store.commit('devmonitoring/updateDevRunRecords', devRunRecord)
      });
      connection.on('DevRunningPass', (devRunRecord: DevRunRecordInterface) => {
        $store.commit('devmonitoring/updateDevRunRecords', devRunRecord)
      });
      connection.on('TakeDevQueue', (devQueue: any) => {
        console.log('TakeDevQueue', devQueue)
      });

      void connection.start()

      // void connection.start()
      //   .then(() => connection.invoke('SendMessage', 'Hello'));
    });
    return {
      leftDrawerOpen, rightDrawerOpen, err, currentUser, logout,
    };
  },
});
</script>
