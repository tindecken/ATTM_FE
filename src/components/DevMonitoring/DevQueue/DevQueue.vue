<template>
  <div>
    <q-table
      :class="[isDark ? 'sticky-header-dark': 'sticky-header-light']"
      dense
      :rows="inQueueDevRunRecords"
      :columns="columns"
      row-key="Id"
      :hide-pagination="true"
      separator="cell"
      :wrap-cells="false"
      :rows-per-page-options="[0]"
      no-data-label="No test is in queue"
      :filter="filter"
      :pagination="initialPagination"
    >
      <template v-slot:top-left>
        <span class="text-h5">Queues</span>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold text-primary"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          >
          <q-td key="id" :props="props" class="q-c-input">
            {{ props.row.Id }}
          </q-td>
          <q-td key="testCase" :props="props" class="q-c-input">
            {{ props.row.TestCaseFullName }}
          </q-td>
          <q-td key="queueStatus" :props="props" class="q-c-input">
            {{ props.row.QueueStatus }}
          </q-td>
          <q-td key="queueType" :props="props" class="q-c-input">
            {{ props.row.QueueType }}
          </q-td>
          <q-td key="createdAt" :props="props" class="q-c-input">
            <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.CreateAt">
              {{ timeAgo }}
            </UseTimeAgo>
          </q-td>
          <q-td key="clientName" :props="props" class="q-c-input">
            {{ props.row.ClientName }}
          </q-td>
          <q-td key="isHighPriority" :props="props" class="q-c-input">
            {{ props.row.IsHightPriority }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref, computed, Ref,
} from 'vue';

import { DevRunRecordInterface } from 'src/Models/DevRunRecord';
import { useStore } from 'vuex'
import { UseTimeAgo } from '@vueuse/components'
import { useGlobalStore } from 'src/pinia/globalStore';

export default defineComponent({
  name: 'DevQueue',
  props: {
    DevRunRecord: {
      type: Object as PropType<DevRunRecordInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { UseTimeAgo },
  setup() {
    const globalStore = useGlobalStore()
    const $store = useStore()
    const columns = ref(
      [
        {
          name: 'id',
          align: 'left',
          label: 'Id',
          field: 'Id',
          sortable: true,
          style: 'min-width: 80px; max-width: 300px',
          headerStyle: 'min-width: 80px; max-width: 300px',
          classes: 'ellipsis',
        },
        {
          name: 'testCase',
          label: 'Test Case',
          field: 'TestCaseFullName',
          sortable: true,
          align: 'left',
          style: 'min-width: 100px;',
          headerStyle: 'min-width: 100px',
          classes: 'ellipsis',
        },
        {
          name: 'queueStatus',
          label: 'Queue Status',
          field: 'Queue Status',
          sortable: true,
          align: 'left',
          style: 'min-width: 120px;',
          headerStyle: 'min-width: 120px',
          classes: 'ellipsis',
        },
        {
          name: 'queueType',
          label: 'Queue Type',
          field: 'QueueType',
          sortable: true,
          align: 'left',
          style: 'min-width: 120px;',
          headerStyle: 'min-width: 120px',
          classes: 'ellipsis',
        },
        {
          name: 'createdAt',
          label: 'Created At',
          field: 'CreateAt',
          sortable: true,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
          classes: 'ellipsis',
        },
        {
          name: 'clientName',
          label: 'Client',
          field: 'ClientName',
          sortable: true,
          align: 'left',
          style: 'min-width: 90px;',
          headerStyle: 'min-width: 90px',
          classes: 'ellipsis',
        },
        {
          name: 'isHighPriority',
          label: 'High Priority',
          field: 'IsHightPriority',
          sortable: true,
          align: 'left',
          style: 'min-width: 70px; max-width: 90px;',
          headerStyle: 'min-width: 70px; max-width: 90px;',
          classes: 'ellipsis',
        },
      ],
    )
    const inQueueDevRunRecords: Ref<any[]> = computed(() => $store.getters['devmonitoring/inQueueDevRunRecords'])
    const isDark = computed(() => globalStore.darkTheme)
    const initialPagination = {
      sortBy: 'createAt',
      descending: true,
      // page: 2,
      // rowsPerPage: 3,
      // rowsNumber: xx if getting data from a server
    }
    return {
      columns,
      inQueueDevRunRecords,
      isDark,
      filter: ref(''),
      initialPagination,
    }
  },
});
</script>
