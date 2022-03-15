<template>
  <q-table
    dense
    :rows="testUpdateHistories"
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
          {{ props.row.UpdateTestCaseData.UpdateType }}
        </q-td>
        <q-td key="updateMessage" :props="props">
          <q-tooltip v-if="props.row.UpdateTestCaseData.UpdateMessage !== ''">
            {{ props.row.UpdateTestCaseData.UpdateMessage }}
          </q-tooltip>
          <div class="ellipsis">{{ props.row.UpdateTestCaseData.UpdateMessage }}</div>
        </q-td>
        <q-td key="updateDate" :props="props">
          <q-tooltip v-if="props.row.UpdateTestCaseData.UpdateDate !== ''">
            {{ props.row.UpdateTestCaseData.UpdateDate }}
          </q-tooltip>
          <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.UpdateTestCaseData.UpdateDate">
            {{ timeAgo }}
          </UseTimeAgo>
        </q-td>
        <q-td key="updateBy" :props="props">
          {{ props.row.UpdateTestCaseData.UpdateBy }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseHistoryInterface } from 'src/Models/TestCaseHistory';
import {
  defineComponent, onMounted, PropType, ref, Ref,
} from 'vue';
import { useTestCaseStore } from 'src/pinia/testCaseStore';
import { UseTimeAgo } from '@vueuse/components'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'UpdateHistory',
  props: {
    TestCase: {
      type: Object as PropType<TestCaseInterface>,
      required: true,
    },
  },
  components: { UseTimeAgo },
  setup(props) {
    const testCaseStore = useTestCaseStore()
    const $q = useQuasar()
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
      rowsPerPage: 50,
      // rowsNumber: xx if getting data from a server
    }
    const filter = ref('')
    const testUpdateHistories: Ref<TestCaseHistoryInterface[]> = ref([])
    onMounted(async () => {
      try {
        testUpdateHistories.value = await testCaseStore.getUpateHistories(props.TestCase.Id)
        testUpdateHistories.value = testUpdateHistories.value.map((value: TestCaseHistoryInterface, i: number) => ({ ...value, rowIndex: i + 1 }))
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    })

    return {
      columns,
      testUpdateHistories,
      filter,
      initialPagination,
    }
  },
});
</script>
