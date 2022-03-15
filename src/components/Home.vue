<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar style="height: 24px">
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          Auto Test Management {{ $q.version }}
        </q-toolbar-title>
        <span>{{ currentUser }}</span>
        <q-btn flat round icon="exit_to_app" @click="logout" />
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="180">
      <left-drawer></left-drawer>
    </q-drawer>
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      bordered
      :width="850"
    >
      <right-drawer></right-drawer>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer
      reveal
      bordered
      class="text-white row inline justify-between"
      style="height: 24px"
    >
      <information-footer></information-footer>
      <div class="row inline">
        <test-client-footer></test-client-footer>
        <q-separator vertical class="q-mr-sm" />
        <env-footer></env-footer>
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { defineComponent, ref, onMounted } from 'vue';
import * as signalR from '@microsoft/signalr';
import { DevRunRecordInterface } from '../Models/DevRunRecord';
import { useDevMonitoringStore } from '../pinia/devMonitoringStore';
import LeftDrawer from './LeftDrawer.vue';
import RightDrawer from './RightDrawer.vue';
import EnvFooter from './Footer/EnvFooter.vue';
import TestClientFooter from './Footer/TestClientFooter.vue';
import InformationFooter from './Footer/InformationFooter.vue';
import config from '../config';
import { useUserStore } from '../pinia/userStore';

export default defineComponent({
  name: 'Home',
  components: {
    LeftDrawer,
    RightDrawer,
    EnvFooter,
    TestClientFooter,
    InformationFooter,
  },
  setup() {
    const userStore = useUserStore();
    const devMonitoringStore = useDevMonitoringStore();
    const $route = useRoute();
    const $router = useRouter();
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const currentUser = ref('');
    const logout = () => {
      userStore.$reset();
      const redirectUrl = `/${$route.query.redirect || 'login'}`;
      void $router.replace(redirectUrl);
    };
    currentUser.value = userStore.Username;
    onMounted(() => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${config.socketServer}`)
        .build();

      connection.on('DevRunningInfo', (devRunRecord: DevRunRecordInterface) => {
        devMonitoringStore.updateDevRunRecords(devRunRecord);
      });

      connection.on('DevRunningFail', (devRunRecord: DevRunRecordInterface) => {
        devMonitoringStore.updateDevRunRecords(devRunRecord);
      });
      connection.on('DevRunningPass', (devRunRecord: DevRunRecordInterface) => {
        devMonitoringStore.updateDevRunRecords(devRunRecord);
      });
      connection.on('TakeDevQueue', (devQueue: any) => {
        devMonitoringStore.updateInDevRunRecords(devQueue);
      });

      void connection.start();
    });
    return {
      leftDrawerOpen,
      rightDrawerOpen,
      currentUser,
      logout,
    };
  },
});
</script>
