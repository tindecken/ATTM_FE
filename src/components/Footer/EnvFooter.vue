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
import { useStore } from 'vuex'

export default defineComponent({
  name: 'EnvFooter',
  components: {},
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const selectedEnv = computed(() => $store.getters['testenvironment/selectedTestEnv'] as TestEnvInterface);
    const testEnvs = computed(() => $store.getters['testenvironment/testEnvs'] as TestEnvInterface[]);
    onBeforeMount(async () => {
      try {
        await $store.dispatch('testenvironment/getTestEnvironments');
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    function onSelectTestEnv(testEnv: TestEnvInterface) {
      $store.commit('testenvironment/setSelectedTestEnv', testEnv)
    }
    return {
      selectedEnv,
      onSelectTestEnv,
      testEnvs,
    };
  },
});
</script>
