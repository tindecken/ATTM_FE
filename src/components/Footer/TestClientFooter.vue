<template>
  <div>
    <q-menu>
          <q-list dense class="rounded-borders">
            <q-item clickable v-close-popup  v-for="testClient in testClients" :key="testClient.Id" class="q-my-sm" v-ripple @click="onSelectTestClient(testClient)">
              <q-item-section>{{testClient.Name}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
        <div v-if="!selectedTestClient" class="q-pr-sm">No Test Client is selected</div>
        <div v-else class="q-pr-sm">{{selectedTestClient.Name}}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api';
import { TestClientInterface } from 'src/Models/TestClient';

export default defineComponent({
  name: 'TestClientFooter',
  components: {},
  setup(props, context) {
    const selectedTestClient = computed(() => context.root.$store.getters['testclient/selectedTestClient'] as TestClientInterface);
    const testClients = computed(() => context.root.$store.getters['testclient/testClients'] as TestClientInterface[]);
    onBeforeMount(async () => {
      try {
        await context.root.$store.dispatch('testclient/getTestClients');
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    function onSelectTestClient(testClient: TestClientInterface) {
      context.root.$store.commit('testclient/setSelectedTestClient', testClient)
    }
    return {
      onSelectTestClient,
      selectedTestClient,
      testClients,
    };
  },
});
</script>
