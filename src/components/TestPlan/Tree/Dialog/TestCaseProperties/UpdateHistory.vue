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
      <q-tr :props="props">
        <q-td key="no" :props="props">
          {{ props.row.rowIndex }}
        </q-td>
        <q-td key="updateType" :props="props">
          {{ props.row.UpdateTestCaseData.UpdateType }}
        </q-td>
        <q-td key="updateMessage" :props="props">
          <q-tooltip v-if="props.row.UpdateTestCaseData.UpdateMessage !== ''" style="white-space: pre-wrap; font-size: small">
            {{ props.row.UpdateTestCaseData.UpdateMessage }}
          </q-tooltip>
          <div class="ellipsis" style="white-space: pre-wrap; font-size: small">
            {{ props.row.UpdateTestCaseData.UpdateMessage }}
          </div>
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
        <q-td key="view" :props="props">
          <q-btn size="sm" outline @click="view(props.row)">View Test</q-btn>
        </q-td>
        <q-td key="compare" :props="props">
          <q-btn size="sm" outline @click="compare(props.row)" label="Compare" :color="firstCompareTestHistory?.Id === props.row?.Id ? 'primary' : ''" />
        </q-td>
        <q-td key="restore" :props="props">
          <q-btn size="sm" outline @click="restore(props.row)" v-if="!isRestoreDisabled(props.row)">Restore</q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { TestCaseInterface } from '../../../../../Models/TestCase';
import { TestCaseHistoryInterface } from '../../../../../Models/TestCaseHistory';
import { onMounted, ref, Ref } from 'vue';
import { useTestCaseStore } from '../../../../../pinia/testCaseStore';
import { UseTimeAgo } from '@vueuse/components';
import { useQuasar } from 'quasar';
import RestoreTestCaseDialog from './UpdateHistory/RestoreTestCaseDialog.vue';
import { RestoreTestCaseDataInterface } from '../../../../../Models/Entities/RestoreTestCaseData';
import { useUserStore } from '../../../../../pinia/userStore';
import ViewTestCaseDialog from './UpdateHistory/ViewTestCaseDialog.vue';
import CompareTestCaseDialog from './UpdateHistory/CompareTestCaseDialog.vue';

const props = defineProps<{
  TestCase: TestCaseInterface;
}>();

const userStore = useUserStore();
const testCaseStore = useTestCaseStore();
const $q = useQuasar();
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
    style: 'max-width: 300px',
    headerStyle: 'max-width: 300px',
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
  {
    name: 'view',
    align: 'left',
    label: '',
    field: 'view',
    sortable: false,
    style: 'max-width: 80x; width: 80px',
    headerStyle: 'max-width: 80px',
  },
  {
    name: 'compare',
    align: 'left',
    label: '',
    field: 'compare',
    sortable: false,
    style: 'max-width: 80x; width: 80px',
    headerStyle: 'max-width: 80px',
  },
  {
    name: 'restore',
    align: 'left',
    label: '',
    field: 'restore',
    sortable: false,
    style: 'max-width: 80x; width: 80px',
    headerStyle: 'max-width: 80px',
  },
];
const initialPagination = {
  sortBy: 'startAt',
  descending: true,
  page: 1,
  rowsPerPage: 50,
  // rowsNumber: xx if getting data from a server
};
const filter = ref('');
const testUpdateHistories: Ref<TestCaseHistoryInterface[]> = ref([]);
const firstCompareTestHistory = ref<TestCaseHistoryInterface | null>(null);
const secondCompareTestHistory = ref<TestCaseHistoryInterface | null>(null);
function isRestoreDisabled(TestCaseHistory: TestCaseHistoryInterface) {
  if (TestCaseHistory) {
    const index = testUpdateHistories.value.findIndex((testHistory: TestCaseHistoryInterface) => testHistory.Id === TestCaseHistory.Id);
    if (index == 0) {
      return true;
    }
  }
  return false;
}
onMounted(async () => {
  try {
    testUpdateHistories.value = await testCaseStore.getUpateHistories(props.TestCase.Id);
    testUpdateHistories.value = testUpdateHistories.value.map((value: TestCaseHistoryInterface, i: number) => ({
      ...value,
      rowIndex: i + 1,
    }));
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
});
function restore(testCaseHistory: TestCaseHistoryInterface) {
  $q.dialog({
    component: RestoreTestCaseDialog,
    componentProps: {},
  })
    .onOk(async (restoreMessage: string) => {
      try {
        const restoreTestCaseData: RestoreTestCaseDataInterface = {
          Id: testCaseHistory.Id,
          RestoreMessage: restoreMessage,
          RestoreBy: userStore.Username,
        };
        const result = await testCaseStore.restoreTestCase(restoreTestCaseData);
        $q.notify({
          type: 'positive',
          message: result.message,
        });
        // Refresh the test case history
        testUpdateHistories.value = await testCaseStore.getUpateHistories(props.TestCase.Id);
        testUpdateHistories.value = testUpdateHistories.value.map((value: TestCaseHistoryInterface, i: number) => ({
          ...value,
          rowIndex: i + 1,
        }));
      } catch (error: any) {
        $q.notify({
          type: 'warning',
          message: error.error,
        });
      }
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function view(testCaseHistory: TestCaseHistoryInterface) {
  $q.dialog({
    component: ViewTestCaseDialog,
    componentProps: {
      TestCaseHistory: testCaseHistory,
    },
  })
    .onOk(async (restoreMessage: string) => {
      try {
        const restoreTestCaseData: RestoreTestCaseDataInterface = {
          Id: testCaseHistory.Id,
          RestoreMessage: restoreMessage,
          RestoreBy: userStore.Username,
        };
        const result = await testCaseStore.restoreTestCase(restoreTestCaseData);
        $q.notify({
          type: 'positive',
          message: result.message,
        });
        // Refresh the test case history
        testUpdateHistories.value = await testCaseStore.getUpateHistories(props.TestCase.Id);
        testUpdateHistories.value = testUpdateHistories.value.map((value: TestCaseHistoryInterface, i: number) => ({
          ...value,
          rowIndex: i + 1,
        }));
      } catch (error: any) {
        $q.notify({
          type: 'warning',
          message: error.error,
        });
      }
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function compare(testCaseHistory: TestCaseHistoryInterface) {
  if (firstCompareTestHistory.value === null) {
    firstCompareTestHistory.value = testCaseHistory;
  } else {
    if (testCaseHistory.Id === firstCompareTestHistory.value.Id) {
      firstCompareTestHistory.value = null;
      return;
    }

    secondCompareTestHistory.value = testCaseHistory;
    $q.dialog({
      component: CompareTestCaseDialog,
      componentProps: {
        FirstCompareTestCaseHistory: firstCompareTestHistory.value,
        SecondCompareTestCaseHistory: secondCompareTestHistory.value,
      },
    })
      .onOk(() => {
        firstCompareTestHistory.value = null;
        secondCompareTestHistory.value = null;
      })
      .onCancel(() => {
        firstCompareTestHistory.value = null;
        secondCompareTestHistory.value = null;
      })
      .onDismiss(() => {
        firstCompareTestHistory.value = null;
        secondCompareTestHistory.value = null;
      });
  }
}
</script>
