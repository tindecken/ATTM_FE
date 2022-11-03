<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-tabs
          v-model="selectedTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          inline-label
          separator="cell"
          narrow-indicator
        >
          <q-tab class="text-primary" name="importBlock" label="Import Block"> </q-tab>
          <q-tab class="text-primary" name="testClients" label="Test Clients"> </q-tab>
          <q-tab class="text-primary" name="testEnvironments" label="Test Environments"> </q-tab>
          <q-tab class="text-primary" name="appSettings" label="App Settings"> </q-tab>
        </q-tabs>
        <q-tab-panels v-model="selectedTab" animated keep-alive>
          <q-tab-panel name="importBlock">
            <import-block :importBlock="settingStore.importBlock"></import-block>
          </q-tab-panel>
          <q-tab-panel name="testClients">
            <test-clients></test-clients>
          </q-tab-panel>
          <q-tab-panel name="testEnvironments">
            <test-environments></test-environments>
          </q-tab-panel>
          <q-tab-panel name="appSettings">
            <app-settings></app-settings>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useTitle } from '@vueuse/core';
import { useSettingStore } from '../../pinia/settingStore';
import ImportBlock from './ImportBlock/ImportBlock.vue';
import TestEnvironments from './TestEnvironments/TestEnvironments.vue';
import TestClients from './TestClients/TestClients.vue';
import AppSettings from './AppSettings/AppSettings.vue';

useTitle('Settings');
const settingStore = useSettingStore();
const $q = useQuasar();
const selectedTab = ref('appSettings');
onBeforeMount(async () => {
  try {
    await settingStore.getSettings();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
});
</script>
