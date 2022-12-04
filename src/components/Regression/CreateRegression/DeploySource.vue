<template>
  <div>
    <q-table
      :filter="filter"
      dense
      title="Clients"
      :rows="clients"
      :columns="clientColumns"
      :visible-columns="visibleColumns"
      row-key="Id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selectedClients"
      no-data-label="No test client"
      :pagination="initialPagination"
      separator="cell"
    >
      <template v-slot:top-left>
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <q-btn class="q-mt-md q-mb-md" color="primary" @click="deployClient()" label="Deploy" />
    <q-tabs v-model="tab" dense active-color="primary" align="left" inline-label no-caps>
      <q-tab v-for="client in selectedClients" :key="client.Id" :name="client.Name" :ripple="false" :alert="client.Status">
        <div class="q-mr-xs">{{ client.Name }}</div>
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="tab" animated keep-alive>
      <q-tab-panel v-for="client in selectedClients" :key="client.Id" :name="client.Name">
        <p class="text-subtitle1 text-info">Deploy Source Code: {{ client.DeploySourceStatus }}</p>
        <q-btn v-if="client.DeploySourceStatus == 'Error'" outline class="q-mb-md" color="warning" @click="retryDeploySource(client)" label="Retry" />
        <p style="white-space: pre">{{ client.DeploySourceMessage }}</p>
        <p class="text-subtitle1 text-info">Update release in setting file: {{ client.UpdateReleaseStatus }}</p>
        <q-btn
          v-if="client.UpdateReleaseStatus == 'Error' || (client.UpdateReleaseStatus == '' && client.DeploySourceStatus == 'Error')"
          outline
          class="q-mb-md"
          color="warning"
          @click="retryUpdateReleaseSetting(client)"
          label="Retry"
        />
        <p style="white-space: pre">{{ client.UpdateReleaseMessage }}</p>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { TestClientInterface } from '../../../Models/TestClient';
import _ from 'lodash';
import { useQuasar } from 'quasar';
import { useGlobalStore } from '../../../pinia/globalStore';
import { useTestClientStore } from '../../../pinia/testClientStore';
import { useCreateRegressionStore } from '../../../pinia/createRegressionStore';
import { clientColumns } from '../../../components/tableColumns';

const globalStore = useGlobalStore();
const testClientStore = useTestClientStore();
const createRegressionStore = useCreateRegressionStore();
const $q = useQuasar();
const tab = ref('');
const deploySourceStatus = ref('');
const deploySourceMessage = ref('');
const updateClientStatus = ref('');
const updateClientMessage = ref('');
const filter = ref('');
const initialPagination = {
  rowsPerPage: 50,
};
const clients: Ref<TestClientInterface[]> = computed(() => testClientStore.testClients);
const selectedClients: Ref<TestClientInterface[]> = ref([]);
const visibleColumns = ref(['name', 'ipAddress', 'type', 'user', 'regressionFolder', 'developFolder', 'runnerFolder', 'description']);
const defineRegression = computed(() => createRegressionStore.defineRegression);
function retryDeploySource(client: TestClientInterface) {
  const index: number = selectedClients.value.findIndex((c: TestClientInterface) => c.Id === client.Id);
  client.DeploySourceStatus = '';
  client.DeploySourceMessage = '';
  selectedClients.value[index] = client;
  const copyResult: Promise<any> = globalStore.copyregcodetoclient(client);
  copyResult
    .then((r: any) => {
      client.DeploySourceStatus = 'Success';
      if (client.UpdateReleaseStatus === 'Success') client.Status = 'green';
      client.DeploySourceMessage = r.message;
      selectedClients.value[index] = client;
      $q.notify({
        type: 'positive',
        message: `Deploy to client ${client.Name} success !`,
      });
    })
    .catch((e) => {
      $q.notify({
        type: 'negative',
        message: `Deploy to client ${client.Name} unsuccess !`,
      });
      client.Status = 'red';
      client.DeploySourceStatus = 'Error';
      client.DeploySourceMessage = e.message;
      selectedClients.value[index] = client;
    });
}
function retryUpdateReleaseSetting(client: TestClientInterface) {
  const index: number = selectedClients.value.findIndex((c: TestClientInterface) => c.Id === client.Id);
  client.UpdateReleaseStatus = '';
  client.UpdateReleaseMessage = '';
  selectedClients.value[index] = client;
  const payload = {
    testClient: client,
    regressionName: defineRegression.value?.Name,
  };
  const updateReleaseResult: Promise<any> = globalStore.updatereleaseforclient(payload);
  updateReleaseResult
    .then((r: any) => {
      client.UpdateReleaseStatus = 'Success';
      if (client.DeploySourceStatus === 'Success') client.Status = 'green';
      client.UpdateReleaseMessage = r.message;
      selectedClients.value[index] = client;
      $q.notify({
        type: 'positive',
        message: `Update Regression for client ${client.Name} success !`,
      });
    })
    .catch((e) => {
      $q.notify({
        type: 'negative',
        message: `Update Regression for client ${client.Name} unsuccess !`,
      });
      client.Status = 'red';
      client.UpdateReleaseStatus = 'Error';
      client.UpdateReleaseMessage = e.message;
      selectedClients.value[index] = client;
    });
}
function getSelectedString() {
  return selectedClients.value.length === 0
    ? ''
    : `${selectedClients.value.length} record${selectedClients.value.length > 1 ? 's' : ''} selected of ${clients.value.length}`;
}
function deployClient() {
  if (selectedClients.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'No test client is selected',
    });
    return;
  }
  tab.value = selectedClients.value[0].Name;
  selectedClients.value.forEach((testClient: TestClientInterface, index: number) => {
    const cloneClient = _.cloneDeep(testClient);
    cloneClient.DeploySourceStatus = '';
    cloneClient.DeploySourceMessage = '';
    cloneClient.UpdateReleaseStatus = '';
    cloneClient.UpdateReleaseMessage = '';
    const copyResult: Promise<any> = globalStore.copyregcodetoclient(cloneClient);
    copyResult
      .then((r) => {
        cloneClient.DeploySourceStatus = 'Success';
        cloneClient.DeploySourceMessage = r.message.replace('\r\n\r\n', '\r\n');
        selectedClients.value[index] = cloneClient;
        $q.notify({
          type: 'positive',
          message: `Deploy to client ${testClient.Name} success !`,
        });
        const payload = {
          testClient,
          regressionName: defineRegression.value?.Name,
        };
        const updateReleaseResult: Promise<any> = globalStore.updatereleaseforclient(payload);
        updateReleaseResult
          .then((u) => {
            cloneClient.UpdateReleaseStatus = 'Success';
            cloneClient.UpdateReleaseMessage = u.message.replace('\r\n\r\n', '\r\n');
            cloneClient.Status = 'green';
            selectedClients.value[index] = cloneClient;
            $q.notify({
              type: 'positive',
              message: `Update Regression for client ${testClient.Name} success !`,
            });
          })
          .catch((e) => {
            $q.notify({
              type: 'negative',
              message: `Update Regression for client ${testClient.Name} error !`,
            });
            cloneClient.UpdateReleaseStatus = 'Error';
            cloneClient.UpdateReleaseMessage = e.message;
            cloneClient.Status = 'red';
            selectedClients.value[index] = cloneClient;
          });
      })
      .catch((e) => {
        $q.notify({
          type: 'negative',
          message: `Deploy to client ${testClient.Name} unsuccess !`,
        });
        cloneClient.Status = 'red';
        cloneClient.DeploySourceStatus = 'Error';
        cloneClient.DeploySourceMessage = e.message;
        selectedClients.value[index] = cloneClient;
      });
  });
}
</script>
