<template>
  <div>
    <q-table
      :filter="filter"
      dense
      title="Clients"
      :data="clients"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="Id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
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
    <q-splitter
      v-model="splitterModel"
      style="height: 250px"
    >

      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          no-caps
        >
          <q-tab name="deploySource" label="Deploy Source" />
          <q-tab name="updateClient" label="Update Clients" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="deploySource">
            <div class="text-h6 q-mb-md">Status: {{deploySourceStatus}}</div>
            <p style="white-space: pre;">{{deploySourceMessage}}</p>
          </q-tab-panel>

          <q-tab-panel name="updateClient">
            <div class="text-h6 q-mb-md">Status: {{updateClientStatus}}</div>
            <p style="white-space: pre;">{{updateClientMessage}}</p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, Ref, watch,
} from '@vue/composition-api';
import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { TestClientInterface } from 'src/Models/TestClient';

export default defineComponent({
  name: 'DeploySource',
  components: {},
  setup(props, context) {
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
        required: true,
        label: 'Status',
        align: 'left',
        field: 'Status',
        format: (val: any) => `${val}`,
        sortable: true,
      },
    ]
    const tab = ref('deploySource')
    const deploySourceStatus = ref('')
    const deploySourceMessage = ref('')
    const updateClientStatus = ref('')
    const updateClientMessage = ref('')
    const filter = ref('')
    const initialPagination = {
      rowsPerPage: 50,
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const clients: Ref<TestClientInterface[]> = computed(() => context.root.$store.getters['testclient/testClients'])
    const selected: Ref<TestClientInterface[]> = ref([])
    const visibleColumns = ref(['Name', 'Description', 'IPAddress', 'Type', 'User', 'RegressionFolder', 'DevelopFolder', 'RunnerFolder', 'Status'])
    const defineRegression = computed(() => context.root.$store.getters['createregression/defineRegression'] as DefineRegressionInterface);
    function getSelectedString() {
      return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${clients.value.length}`
    }
    watch(
      () => selected.value,
      () => {
        context.root.$store.commit('createregression/setSelectedTestClients', selected.value)
        if (selected.value.length === 0) {
          context.emit('validateForm', false)
        } else {
          context.emit('validateForm', true)
        }
      },
    )
    function clearStatusAndMessage() {
      deploySourceStatus.value = ''
      deploySourceMessage.value = ''
      updateClientStatus.value = ''
      updateClientMessage.value = ''
      tab.value = 'deploySource'
    }
    function deployClient() {
      clearStatusAndMessage()
      console.log('deployClient')
      if (selected.value.length === 0) {
        context.root.$q.notify({
          type: 'negative',
          message: 'No test client is selected',
        });
      } else {
        selected.value.forEach((tc: TestClientInterface) => {
          const copyResult: Promise<any> = context.root.$store.dispatch('global/copycodetoclient', tc);
          copyResult.then((r) => {
            if (!deploySourceStatus.value.includes('Error') && deploySourceStatus.value !== '') deploySourceStatus.value = 'Success'
            deploySourceMessage.value += r.message.replace('\r\n\r\n', '\r\n')
            console.log('r', r)
            context.root.$q.notify({
              type: 'positive',
              message: `Deploy to client ${tc.Name} success !`,
            });
            const payload = {
              testClient: tc,
              regressionName: defineRegression.value.Name,
            }
            const updateReleaseResult: Promise<any> = context.root.$store.dispatch('global/updatereleaseforclient', payload);
            updateReleaseResult.then((u) => {
              tab.value = 'updateClient'
              updateClientStatus.value = ''
              if (!updateClientStatus.value.includes('Error') && updateClientStatus.value !== '') updateClientStatus.value = 'Success'
              updateClientMessage.value += `${u.message}\r\n`
              context.root.$q.notify({
                type: 'positive',
                message: `Update Regression for client ${tc.Name} success !`,
              });
              deploySourceStatus.value = 'Success'
              deploySourceMessage.value = r.message.replace('\r\n\r\n', '\r\n')
            }).catch((e) => {
              tab.value = 'updateClient'
              updateClientStatus.value = 'Error'
              updateClientMessage.value += e.message
              context.root.$q.notify({
                type: 'negative',
                message: `Update Regression for client ${tc.Name} error !`,
              });
            })
          }).catch((e) => {
            deploySourceStatus.value = 'Error'
            deploySourceMessage.value += e.message
            console.log('e', e)
            context.root.$q.notify({
              type: 'negative',
              message: `Deploy to client ${tc.Name} unsuccess !`,
            });
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
      selected,
      initialPagination,
      deployClient,
      tab,
      deploySourceStatus,
      deploySourceMessage,
      updateClientStatus,
      updateClientMessage,
    }
  },
});
</script>
