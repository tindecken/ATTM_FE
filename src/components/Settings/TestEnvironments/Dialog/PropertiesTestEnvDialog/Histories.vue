<template>
  <q-table
    dense
    :rows="testEnvHistories"
    :columns="columns"
    row-key="name"
    :filter="filter"
    separator="cell"
    :pagination="initialPagination"
    :hide-pagination="false"
    no-data-label="No histories found"
  >
    <template v-slot:body="props">
      <q-tr
        :props="props"
        >
        <q-td key="no" :props="props">
          {{ props.row.rowIndex }}
        </q-td>
        <q-td key="updateType" :props="props">
          {{ props.row.UpdateTestEnvData.UpdateType }}
        </q-td>
        <q-td key="updateMessage" :props="props">
          <q-tooltip v-if="props.row.UpdateTestEnvData.UpdateMessage !== ''">
            {{ props.row.UpdateTestEnvData.UpdateMessage }}
          </q-tooltip>
          <div class="ellipsis">{{ props.row.UpdateTestEnvData.UpdateMessage }}</div>
        </q-td>
        <q-td key="updateDate" :props="props">
          <q-tooltip v-if="props.row.UpdateTestEnvData.UpdateDate !== ''">
            {{ props.row.UpdateTestEnvData.UpdateDate }}
          </q-tooltip>
          <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.UpdateTestEnvData.UpdateDate">
            {{ timeAgo }}
          </UseTimeAgo>
        </q-td>
        <q-td key="updateBy" :props="props">
          {{ props.row.UpdateTestEnvData.UpdateBy }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
export default {
  name: 'History',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import {
  ref, Ref, onMounted, defineProps,
} from 'vue';
import { TestEnvHistoryInterface } from 'src/Models/TestEnvHistory';
import { useQuasar } from 'quasar'
import { UseTimeAgo } from '@vueuse/components'
import { useTestEnvironmentStore } from 'src/pinia/testEnvironmentStore';
import { TestEnvInterface } from 'src/Models/TestEnv';

const testEnvironmentStore = useTestEnvironmentStore()
const $q = useQuasar()
const props = defineProps<{
  TestEnv: TestEnvInterface
}>()
const columns = [
  {
    name: 'no',
    required: true,
    label: 'No',
    align: 'left',
    field: 'rowIndex',
    sortable: true,
    style: 'max-width: 40px; width: 40px',
    headerStyle: 'max-width: 40px',
  },
  {
    name: 'updateType',
    required: true,
    label: 'Type',
    align: 'left',
    field: 'Type',
    sortable: true,
    style: 'max-width: 140px; width: 140px',
    headerStyle: 'max-width: 140px',
    classes: 'ellipsis',
  },
  {
    name: 'updateMessage',
    align: 'left',
    label: 'Message',
    field: 'Message',
    sortable: true,
    style: 'max-width: 100px',
    headerStyle: 'max-width: 100px',
    classes: 'ellipsis',
  },
  {
    name: 'updateDate',
    align: 'left',
    label: 'Date',
    field: 'Date',
    style: 'max-width: 100px; width: 80px',
    headerStyle: 'max-width: 100px',
    sortable: true,
  },
  {
    name: 'updateBy',
    align: 'left',
    label: 'Update By',
    field: 'By',
    sortable: false,
    style: 'max-width: 100px; width: 80px',
    headerStyle: 'max-width: 100px',
  },
]
const initialPagination = {
  sortBy: 'startAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  // rowsNumber: xx if getting data from a server
}
const filter = ref('')
const testEnvHistories: Ref<TestEnvHistoryInterface[]> = ref([])
onMounted(async () => {
  try {
    console.log('props.TestEnv.Id', props.TestEnv.Id)
    testEnvHistories.value = await testEnvironmentStore.getTestEnvHistories(props.TestEnv.Id)
    testEnvHistories.value = testEnvHistories.value.map((value: TestEnvHistoryInterface, i: number) => ({ ...value, rowIndex: i + 1 }))
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
})
</script>
