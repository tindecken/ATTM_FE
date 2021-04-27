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
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api';
import { TestEnvInterface } from 'src/Models/TestEnv';

export default defineComponent({
  name: 'EnvFooter',
  components: {},
  setup(props, context) {
    const selectedEnv = computed(() => context.root.$store.getters['testenvironment/selectedTestEnv'] as TestEnvInterface);
    const testEnvs = computed(() => context.root.$store.getters['testenvironment/testEnvs'] as TestEnvInterface[]);
    onBeforeMount(async () => {
      try {
        await context.root.$store.dispatch('testenvironment/getTestEnvironments');
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    function onSelectTestEnv(testEnv: TestEnvInterface) {
      context.root.$store.commit('testenvironment/setSelectedTestEnv', testEnv)
    }
    return {
      selectedEnv,
      onSelectTestEnv,
      testEnvs,
    };
  },
});
</script>
