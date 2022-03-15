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
      selection="multiple"
      no-data-label="No test client"
      :pagination="initialPagination"
      separator="cell"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import { TestClientInterface } from '../../../Models/TestClient';
import { clientColumns } from '../../../components/tableColumns';
import { useTestClientStore } from '../../../pinia/testClientStore';

const testClientStore = useTestClientStore();
const filter = ref('');
const initialPagination = {
  rowsPerPage: 50,
};
await testClientStore.getTestClients();
const testClients: Ref<TestClientInterface[]> = computed(
  () => testClientStore.testClients
);
const visibleColumns = ref([
  'FullName',
  'Category',
  'TestSuite',
  'TestGroup',
  'Owner',
  'Type',
  'IsPrimary',
  'Queue',
  'CreatedDate',
  'LastModifiedDate',
]);
</script>
