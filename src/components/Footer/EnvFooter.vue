<template>
  <div>
    <q-menu>
          <q-list dense class="rounded-borders">
            <q-item clickable v-close-popup  v-for="testEnv in testEnvs" :key="testEnv.Name" class="q-my-sm" v-ripple @click="onSelectTestEnv(testEnv)">
              <q-item-section>{{testEnv.Name}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <div v-if="!selectedEnv" class="q-pr-sm">No Environment is selected</div>
        <div v-else class="q-pr-sm">{{selectedEnv.Name}}</div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { computed, defineComponent, onBeforeMount } from 'vue';
import { TestEnvInterface } from 'src/Models/TestEnv';
import { useTestEnvironmentStore } from 'src/pinia/testEnvironmentStore';

export default defineComponent({
  name: 'EnvFooter',
  components: {},
  setup() {
    const testEnvironmentStore = useTestEnvironmentStore()
    const $q = useQuasar()
    const selectedEnv = computed(() => testEnvironmentStore.selectedTestEnv)
    const testEnvs = computed(() => testEnvironmentStore.testEnvs);
    onBeforeMount(async () => {
      try {
        await testEnvironmentStore.getTestEnvironments()
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    function onSelectTestEnv(testEnv: TestEnvInterface) {
      testEnvironmentStore.selectedTestEnv = testEnv
    }
    return {
      selectedEnv,
      onSelectTestEnv,
      testEnvs,
    };
  },
});
</script>
