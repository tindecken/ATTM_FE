<template>
  <div>
    <q-table
      :filter="filter"
      dense
      title="Clients"
      :rows="clients"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="Id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selectedClients"
      no-data-label="No test client"
      :pagination="initialPagination"
      separator="cell"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <q-btn
      class="q-mt-md q-mb-md"
      color="primary"
      @click="deployClient"
      label="Deploy"
    />
    <q-tabs
      v-model="tab"
      dense
      active-color="primary"
      align="left"
      inline-label
      no-caps
    >
      <q-tab v-for="client in selectedClients" :key="client.Id" :name="client.Name" :ripple="false" :alert="client.Status">
        <div class="q-mr-xs">{{client.Name}}</div>
      </q-tab>
    </q-tabs>
    <q-tab-panels
          v-model="tab"
          animated
          keep-alive
          >
          <q-tab-panel v-for="client in selectedClients" :key="client.Id" :name="client.Name">
            <p class="text-subtitle1 text-info">Deploy Source Code: {{client.DeploySourceStatus}}</p>
            <q-btn
              outline
              class="q-mb-md"
              color="warning"
              @click="retryDeploySource(client)"
              label="Retry"
              v-if="client.DeploySourceStatus == 'Error'"
            />
            <p style="white-space: pre;">{{client.DeploySourceMessage}}</p>
            <p class="text-subtitle1 text-info">Update release in setting file: {{client.UpdateReleaseStatus}}</p>
            <q-btn
              outline
              class="q-mb-md"
              color="warning"
              @click="retryUpdateReleaseSetting(client)"
              label="Retry"
              v-if="client.UpdateReleaseStatus == 'Error' || (client.UpdateReleaseStatus == '' && client.DeploySourceStatus == 'Error')"
            />
            <p style="white-space: pre;">{{client.UpdateReleaseMessage}}</p>
          </q-tab-panel>
        </q-tab-panels>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, Ref,
} from 'vue';
import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { TestClientInterface } from 'src/Models/TestClient';
import _ from 'lodash'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'DeploySource',
  components: {},
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const columns = [
      {
        name: 'Id',
        required: false,
        label: 'Id',
        align: 'left',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        field: (row: any) => row.Id,
        format: (val: any) => `${val}`,
        sortable: false,
      },
      {
        name: 'Name',
        required: false,
        label: 'Name',
        align: 'left',
        field: 'Name',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Description',
        required: false,
        label: 'Description',
        align: 'left',
        field: 'Description',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'IPAddress',
        required: true,
        label: 'IP Address',
        align: 'left',
        field: 'IPAddress',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Type',
        required: false,
        label: 'Type',
        align: 'left',
        field: 'Type',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'User',
        required: false,
        label: 'User',
        align: 'left',
        field: 'User',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Password',
        required: false,
        label: 'Password',
        align: 'left',
        field: 'Password',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'RegressionFolder',
        required: false,
        label: 'Regression Folder',
        align: 'left',
        field: 'RegressionFolder',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'DevelopFolder',
        required: false,
        label: 'Develop Folder',
        align: 'left',
        field: 'DevelopFolder',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'RunnerFolder',
        required: false,
        label: 'Runner Folder',
        align: 'left',
        field: 'RunnerFolder',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Status',
        required: false,
        label: 'Status',
        align: 'left',
        field: 'Status',
        format: (val: any) => `${val}`,
        sortable: true,
      },
    ]
    const tab = ref('')
    const deploySourceStatus = ref('')
    const deploySourceMessage = ref('')
    const updateClientStatus = ref('')
    const updateClientMessage = ref('')
    const filter = ref('')
    const initialPagination = {
      rowsPerPage: 50,
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const clients: Ref<TestClientInterface[]> = computed(() => $store.getters['testclient/testClients'])
    const selectedClients: Ref<TestClientInterface[]> = ref([])
    const visibleColumns = ref(['Name', 'Description', 'IPAddress', 'Type', 'User', 'RegressionFolder', 'DevelopFolder', 'RunnerFolder'])
    const defineRegression = computed(() => $store.getters['createregression/defineRegression'] as DefineRegressionInterface);
    function retryDeploySource(client: TestClientInterface) {
      const index: number = selectedClients.value.findIndex((c: TestClientInterface) => c.Id === client.Id);
      client.DeploySourceStatus = ''
      client.DeploySourceMessage = ''
      selectedClients.value[index] = client
      const copyResult: Promise<any> = $store.dispatch('global/copycodetoclient', client)
      copyResult.then((r: any) => {
        client.DeploySourceStatus = 'Success'
        if (client.UpdateReleaseStatus === 'Success') client.Status = 'green'
        client.DeploySourceMessage = r.message
        selectedClients.value[index] = client
        $q.notify({
          type: 'positive',
          message: `Deploy to client ${client.Name} success !`,
        });
      }).catch((e) => {
        console.log('e', e)
        $q.notify({
          type: 'negative',
          message: `Deploy to client ${client.Name} unsuccess !`,
        });
        client.Status = 'red'
        client.DeploySourceStatus = 'Error'
        client.DeploySourceMessage = e.message
        selectedClients.value[index] = client
      })
    }
    function retryUpdateReleaseSetting(client: TestClientInterface) {
      const index: number = selectedClients.value.findIndex((c: TestClientInterface) => c.Id === client.Id);
      client.UpdateReleaseStatus = ''
      client.UpdateReleaseMessage = ''
      selectedClients.value[index] = client
      const payload = {
        testClient: client,
        regressionName: defineRegression.value.Name,
      }
      const updateReleaseResult: Promise<any> = $store.dispatch('global/updatereleaseforclient', payload);
      updateReleaseResult.then((r: any) => {
        client.UpdateReleaseStatus = 'Success'
        if (client.DeploySourceStatus === 'Success') client.Status = 'green'
        client.UpdateReleaseMessage = r.message
        selectedClients.value[index] = client
        $q.notify({
          type: 'positive',
          message: `Update Regression for client ${client.Name} success !`,
        });
      }).catch((e) => {
        console.log('e', e)
        $q.notify({
          type: 'negative',
          message: `Update Regression for client ${client.Name} unsuccess !`,
        });
        client.Status = 'red'
        client.UpdateReleaseStatus = 'Error'
        client.UpdateReleaseMessage = e.message
        selectedClients.value[index] = client
      })
    }
    function getSelectedString() {
      return selectedClients.value.length === 0 ? '' : `${selectedClients.value.length} record${selectedClients.value.length > 1 ? 's' : ''} selected of ${clients.value.length}`
    }
    function deployClient() {
      console.log('deployClient')
      if (selectedClients.value.length === 0) {
        $q.notify({
          type: 'negative',
          message: 'No test client is selected',
        });
      } else {
        tab.value = selectedClients.value[0].Name;
        selectedClients.value.forEach((tc: TestClientInterface, index: number) => {
          const cloneClient = _.cloneDeep(tc)
          cloneClient.DeploySourceStatus = ''
          cloneClient.DeploySourceMessage = ''
          cloneClient.UpdateReleaseStatus = ''
          cloneClient.UpdateReleaseMessage = ''
          selectedClients.value[index] = cloneClient
          const copyResult: Promise<any> = $store.dispatch('global/copycodetoclient', cloneClient);
          copyResult.then((r) => {
            cloneClient.DeploySourceStatus = 'Success'
            cloneClient.DeploySourceMessage = r.message.replace('\r\n\r\n', '\r\n')
            selectedClients.value[index] = cloneClient
            $q.notify({
              type: 'positive',
              message: `Deploy to client ${tc.Name} success !`,
            });
            const payload = {
              testClient: tc,
              regressionName: defineRegression.value.Name,
            }
            const updateReleaseResult: Promise<any> = $store.dispatch('global/updatereleaseforclient', payload);
            updateReleaseResult.then((u) => {
              cloneClient.UpdateReleaseStatus = 'Success'
              cloneClient.UpdateReleaseMessage = u.message.replace('\r\n\r\n', '\r\n')
              cloneClient.Status = 'green'
              selectedClients.value[index] = cloneClient
              $q.notify({
                type: 'positive',
                message: `Update Regression for client ${tc.Name} success !`,
              });
            }).catch((e) => {
              $q.notify({
                type: 'negative',
                message: `Update Regression for client ${tc.Name} error !`,
              });
              cloneClient.UpdateReleaseStatus = 'Error'
              cloneClient.UpdateReleaseMessage = e.message
              cloneClient.Status = 'red'
              selectedClients.value[index] = cloneClient
            })
          }).catch((e) => {
            console.log('e', e)
            $q.notify({
              type: 'negative',
              message: `Deploy to client ${tc.Name} unsuccess !`,
            });
            cloneClient.Status = 'red'
            cloneClient.DeploySourceStatus = 'Error'
            cloneClient.DeploySourceMessage = e.message
            selectedClients.value[index] = cloneClient
          })
        })
      }
    }
    return {
      visibleColumns,
      columns,
      getSelectedString,
      clients,
      filter,
      selectedClients,
      initialPagination,
      deployClient,
      tab,
      deploySourceStatus,
      deploySourceMessage,
      updateClientStatus,
      updateClientMessage,
      retryDeploySource,
      retryUpdateReleaseSetting,
    }
  },
});
</script>
