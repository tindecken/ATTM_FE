<template>
  <div>
    <q-table
      :filter="filter"
      dense
      :rows="testClients"
      :columns="clientColumns"
      :visible-columns="visibleColumns"
      row-key="Id"
      no-data-label="No test client"
      :pagination="initialPagination"
      separator="cell"
      class="q-mt-sm"
    >
      <template v-slot:top>
        <q-input dense debounce="300" v-model="filter" placeholder="Search" class="q-mr-md">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn class="q-mr-sm" color="secondary" outline @click="save()">Save</q-btn>
        <q-btn color="secondary" outline @click="discard()">Discard</q-btn>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="no" :props="props"> {{ props.row.rowIndex }}</q-td>
          <q-td key="name" :props="props" @click="globalStore.infoStatus.Info = props.row.Name">
            <q-input v-model="props.row.Name" dense borderless> </q-input>
          </q-td>
          <q-td key="ipAddress" :props="props" @click="globalStore.infoStatus.Info = props.row.IPAddress">
            <q-input v-model="props.row.IPAddress" dense borderless> </q-input>
          </q-td>
          <q-td key="type" :props="props" @click="globalStore.infoStatus.Info = props.row.Type">
            <q-input v-model="props.row.Type" dense borderless> </q-input>
          </q-td>
          <q-td key="user" :props="props" @click="globalStore.infoStatus.Info = props.row.User">
            <q-input v-model="props.row.User" dense borderless> </q-input>
          </q-td>
          <q-td key="password" :props="props" @click="globalStore.infoStatus.Info = props.row.Password">
            <q-input type="password" v-model="props.row.Password" dense borderless> </q-input>
          </q-td>
          <q-td key="regressionFolder" :props="props" @click="globalStore.infoStatus.Info = props.row.RegressionFolder">
            <q-input v-model="props.row.RegressionFolder" dense borderless> </q-input>
          </q-td>
          <q-td key="developFolder" :props="props" @click="globalStore.infoStatus.Info = props.row.DevelopFolder">
            <q-input v-model="props.row.DevelopFolder" dense borderless> </q-input>
          </q-td>
          <q-td key="runnerFolder" :props="props" @click="globalStore.infoStatus.Info = props.row.RunnerFolder">
            <q-input v-model="props.row.RunnerFolder" dense borderless> </q-input>
          </q-td>
          <q-td key="description" :props="props" style="white-space: normal" @click="globalStore.infoStatus.Info = props.row.Description">
            <q-input v-model="props.row.Description" dense borderless> </q-input>
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn color="negative" size="sm" outline @click="deleteClient(props.row)">Delete</q-btn>
          </q-td>
          <q-td key="checkDeploy" :props="props">
            <q-btn color="secondary" size="sm" outline @click="checkDeploy(props.row)">Check</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="q-mt-sm">
    <q-btn color="secondary" outline @click="add()">Add</q-btn>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';
import { TestClientInterface } from '../../../Models/TestClient';
import { clientColumns } from '../../../components/tableColumns';
import { useQuasar, uid } from 'quasar';
import { useTestClientStore } from '../../../pinia/testClientStore';
import { useGlobalStore } from '../../../pinia/globalStore';
import _ from 'lodash';

const testClientStore = useTestClientStore();
const globalStore = useGlobalStore();
const filter = ref('');
const $q = useQuasar();
const initialPagination = {
  rowsPerPage: 50,
};
const testClients: Ref<TestClientInterface[]> = ref(testClientStore?.testClients);

onBeforeMount(async () => {
  try {
    await testClientStore.getTestClients();
    testClients.value = testClientStore.testClients;
    testClients.value = testClients.value.map((tc: TestClientInterface, i: number) => ({
      ...tc,
      rowIndex: i + 1,
    }));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
});
const visibleColumns = ref([
  'no',
  'name',
  'ipAddress',
  'type',
  'user',
  'password',
  'regressionFolder',
  'developFolder',
  'runnerFolder',
  'description',
  'delete',
  'checkDeploy',
]);
function deleteClient(client: TestClientInterface) {
  _.remove(testClients.value, (te: TestClientInterface) => te.Id === client.Id);
  if (testClients.value.length > 0) {
    testClients.value = testClients.value.map((tc: TestClientInterface, i: number) => ({
      ...tc,
      rowIndex: i + 1,
    }));
  }
}
function checkDeploy(client: TestClientInterface) {
  // TODO
  console.log('client', client);
}
function add() {
  // TODO
  testClients.value.push({
    Id: uid(),
    Name: '',
    Description: '',
    IPAddress: '',
    Type: '',
    User: '',
    Password: '',
    RegressionFolder: '',
    DevelopFolder: '',
    RunnerFolder: '',
    Status: '',
  });
  testClients.value = testClients.value.map((tc: TestClientInterface, i: number) => ({
    ...tc,
    rowIndex: i + 1,
  }));
}
async function discard() {
  await testClientStore.getTestClients();
  testClients.value = testClientStore.testClients;
  testClients.value = testClients.value.map((tc: TestClientInterface, i: number) => ({
    ...tc,
    rowIndex: i + 1,
  }));
}
async function save() {
  let valid = true;
  testClients.value.forEach((client: TestClientInterface & { rowIndex: number }) => {
    if (client.Name == '') {
      $q.notify({
        type: 'negative',
        message: `Row ${client.rowIndex}: Client Name is required.`,
      });
      valid = false;
      return;
    }
  });
  if (!valid) return;
  testClientStore
    .saveTestClients(testClients.value)
    .then((res) => {
      $q.notify({
        type: 'positive',
        message: `${res.message}`,
      });
    })
    .catch((err) => {
      $q.notify({
        type: 'negative',
        message: `${err}`,
      });
    });
}
</script>

<style scoped lang="scss">
:deep(td.q-td) {
  padding: 0px 2px !important;
}
:deep(input.q-field__native) {
  padding: 0px;
}
:deep(th.text-left) {
  padding-left: 8px !important;
}
</style>
