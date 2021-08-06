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
          <q-tab class="text-primary" name="importBlock" label="Import Block">
          </q-tab>
          <q-tab class="text-primary" name="testClients" label="Test Clients">
          </q-tab>
          <q-tab class="text-primary" name="testEnvironments" label="Test Environments">
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="selectedTab" animated keep-alive>
          <q-tab-panel name="importBlock">
            <import-block :settings="settings"></import-block>
          </q-tab-panel>
          <q-tab-panel name="testClients">
            Test Clients
          </q-tab-panel>
          <q-tab-panel name="testEnvironments">
            Test Environments
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onBeforeMount, Ref, computed,
} from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import ImportBlock from './Childs/ImportBlock.vue'
import { SettingInterface } from '../../Models/Setting'

export default defineComponent({
  name: 'Settings',
  components: { ImportBlock },
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const selectedTab = ref('importBlock')
    const settings: Ref<SettingInterface[]> = computed(() => $store.getters['setting/settings'] as SettingInterface[])
    onBeforeMount(async () => {
      try {
        await $store.dispatch('setting/getSettings');
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    return {
      settings,
      selectedTab,
    };
  },
});
</script>
