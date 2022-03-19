<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import { Dark } from 'quasar';
import { useUserStore } from './pinia/userStore';
import { useTestClientStore } from './pinia/testClientStore';
import { useGlobalStore } from './pinia/globalStore';
import { useSettingStore } from './pinia/settingStore';
import { useTestCaseStore } from './pinia/testCaseStore';
import { useTestEnvironmentStore } from './pinia/testEnvironmentStore';

export default defineComponent({
  name: 'App',
  setup() {
    const globalStore = useGlobalStore();
    const userStore = useUserStore();
    const testClientStore = useTestClientStore();
    const settingStore = useSettingStore();
    const testCaseStore = useTestCaseStore();
    const testEnvironmentStore = useTestEnvironmentStore();
    userStore.$subscribe(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          Id: userStore.Id,
          Token: userStore.Token,
          Username: userStore.Username,
          Role: userStore.Role,
          Email: userStore.Email,
          DidAutoLogout: userStore.DidAutoLogout,
        })
      );
    });
    testClientStore.$subscribe(() => {
      localStorage.setItem(
        'testClient',
        JSON.stringify({
          testClients: testClientStore.testClients,
          selectedTestClient: testClientStore.selectedTestClient,
        })
      );
    });
    globalStore.$subscribe(() => {
      localStorage.setItem(
        'global',
        JSON.stringify({
          darkTheme: globalStore.darkTheme,
        })
      );
      Dark.set(globalStore.darkTheme);
    });
    settingStore.$subscribe(() => {
      localStorage.setItem(
        'setting',
        JSON.stringify({
          setting: settingStore.settings,
        })
      );
    });
    testCaseStore.$subscribe(() => {
      localStorage.setItem(
        'testCase',
        JSON.stringify({
          openedTCs: testCaseStore.openedTCs,
          selectedTestCaseId: testCaseStore.selectedTestCaseId,
        })
      );
    });
    testEnvironmentStore.$subscribe(() => {
      localStorage.setItem(
        'testEnvironment',
        JSON.stringify({
          testEnvs: testEnvironmentStore.testEnvs,
          selectedTestEnv: testEnvironmentStore.selectedTestEnv,
        })
      );
    });

    onBeforeMount(() => {
      const user = localStorage.getItem('user');
      if (user) {
        userStore.Id = JSON.parse(user).Id;
        userStore.Token = JSON.parse(user).Token;
        userStore.Username = JSON.parse(user).Username;
        userStore.Role = JSON.parse(user).Role;
        userStore.Email = JSON.parse(user).Email;
        userStore.DidAutoLogout = JSON.parse(user).DidAutoLogout;
      }
      const globalStorage = localStorage.getItem('global');
      if (globalStorage) {
        globalStore.darkTheme = JSON.parse(globalStorage).darkTheme;
      }
      const testCase = localStorage.getItem('testCase');
      if (testCase) {
        testCaseStore.openedTCs = JSON.parse(testCase).openedTCs;
        testCaseStore.selectedTestCaseId = JSON.parse(testCase).selectedTestCaseId;
      }
      const testClient = localStorage.getItem('testClient');
      if (testClient) {
        testClientStore.testClients = JSON.parse(testClient).testClients;
        testClientStore.selectedTestClient = JSON.parse(testClient).selectedTestClient;
      }
      const testEnvironment = localStorage.getItem('testEnvironment');
      if (testEnvironment) {
        testEnvironmentStore.testEnvs = JSON.parse(testEnvironment).testEnvs;
        testEnvironmentStore.selectedTestEnv = JSON.parse(testEnvironment).selectedTestEnv;
      }
    });
  },
});
</script>
