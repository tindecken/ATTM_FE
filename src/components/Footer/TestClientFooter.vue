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
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'TestClientFooter',
  components: {},
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const selectedTestClient = computed(() => $store.getters['testclient/selectedTestClient'] as TestClientInterface)
    const testClients = computed(() => $store.getters['testclient/testClients'] as TestClientInterface[])
    onBeforeMount(async () => {
      try {
        await $store.dispatch('testclient/getTestClients');
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })
    function onSelectTestClient(testClient: TestClientInterface) {
      $store.commit('testclient/setSelectedTestClient', testClient)
    }
    return {
      onSelectTestClient,
      selectedTestClient,
      testClients,
    };
  },
});
</script>
