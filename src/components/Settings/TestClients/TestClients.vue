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
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
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
}
</script>

<script setup lang="ts">
import {
  ref, Ref, computed,
} from 'vue';
import { useStore } from 'vuex'
import { TestClientInterface } from 'src/Models/TestClient';
import { clientColumns } from 'src/components/tableColumns';

const $store = useStore()
const filter = ref('')
const initialPagination = {
  rowsPerPage: 50,
}
const clients: Ref<TestClientInterface[]> = computed(() => $store.getters['testclient/testClients'])
</script>
