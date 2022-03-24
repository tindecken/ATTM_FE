<template>
  <div>
    <q-table
      :filter="filter"
      dense
      title="Clients"
      :rows="testClients"
      :columns="clientColumns"
      :visible-columns="visibleColumns"
      row-key="Id"
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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="no" :props="props"> {{ props.row.rowIndex }}</q-td>
          <q-td key="name" :props="props">
            <q-input v-model="props.row.Name" dense borderless> </q-input>
          </q-td>
          <q-td key="description" :props="props" style="white-space: normal">
            <q-input v-model="props.row.Description" dense borderless class="pa0"> </q-input>
          </q-td>
          <q-td key="ipAddress" :props="props">
            <q-input v-model="props.row.IPAddress" dense borderless> </q-input>
          </q-td>
          <q-td key="type" :props="props">
            <q-input v-model="props.row.Type" dense borderless> </q-input>
          </q-td>
          <q-td key="user" :props="props">
            <q-input v-model="props.row.User" dense borderless> </q-input>
          </q-td>
          <q-td key="password" :props="props">
            <q-input type="password" v-model="props.row.Password" dense borderless> </q-input>
          </q-td>
          <q-td key="regressionFolder" :props="props">
            <q-input v-model="props.row.RegressionFolder" dense borderless> </q-input>
          </q-td>
          <q-td key="developFolder" :props="props">
            <q-input v-model="props.row.DevelopFolder" dense borderless> </q-input>
          </q-td>
          <q-td key="runnerFolder" :props="props">
            <q-input v-model="props.row.RunnerFolder" dense borderless> </q-input>
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn size="sm" outline @click="delete props.row">Delete</q-btn>
          </q-td>
          <q-td key="checkDeploy" :props="props">
            <q-btn size="sm" outline @click="checkDeploy(props.row)">Check</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="q-mt-sm">
    <q-btn color="primary" outline @click="add()">Add</q-btn>
    <q-btn color="primary" outline @click="discard()">Discard</q-btn>
    <q-btn color="primary" outline @click="save()">Save</q-btn>
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
import { useQuasar } from 'quasar';
import { useTestClientStore } from '../../../pinia/testClientStore';

const testClientStore = useTestClientStore();
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
  'description',
  'ipAddress',
  'type',
  'user',
  'password',
  'regressionFolder',
  'developFolder',
  'runnerFolder',
  'delete',
  'checkDeploy',
]);
function checkDeploy(client: TestClientInterface) {
  // TODO
  console.log('client', client);
}
function add() {
  // TODO
  console.log('add');
}
function discard() {
  // TODO
  console.log('discard');
}
function save() {
  // TODO
  console.log('save');
}
</script>

<style scoped lang="scss">
:deep(td.q-td) {
  padding: 0px 2px;
  height: 15px;
}
:deep(input.q-field__native) {
  padding: 0px;
}
</style>
