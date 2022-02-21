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
import { computed, defineComponent, onBeforeMount } from 'vue';
import { TestClientInterface } from 'src/Models/TestClient';
import { useTestClientStore } from 'src/pinia/testClientStore';
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'TestClientFooter',
  components: {},
  setup() {
    const testClientStore = useTestClientStore()
    const $q = useQuasar()
    const selectedTestClient = computed(() => testClientStore.selectedTestClient)
    const testClients = computed(() => testClientStore.testClients)
    onBeforeMount(async () => {
      try {
        await testClientStore.getTestClients()
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    function onSelectTestClient(testClient: TestClientInterface) {
      testClientStore.selectedTestClient = testClient
    }
    return {
      onSelectTestClient,
      selectedTestClient,
      testClients,
    };
  },
});
</script>
