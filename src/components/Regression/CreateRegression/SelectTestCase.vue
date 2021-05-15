<template>
  <div>
    <q-table
      :filter="filter"
      dense
      title="Test Cases"
      :data="testCases"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="Id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      no-data-label="No test case"
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
    <div class="q-mt-md">
      Selected: {{ JSON.stringify(selected) }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, Ref, ref, watch,
} from '@vue/composition-api';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';

export default defineComponent({
  name: 'SelectTestCase',
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
        name: 'CodeName',
        required: false,
        label: 'Code Name',
        align: 'left',
        field: 'CodeName',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Name',
        required: false,
        label: 'Test Case Name',
        align: 'left',
        field: 'Name',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'FullName',
        required: true,
        label: 'Test Case Name',
        align: 'left',
        field: 'FullName',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Category',
        required: true,
        label: 'Category',
        align: 'left',
        field: 'Category',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'TestSuite',
        required: true,
        label: 'Test Suite',
        align: 'left',
        field: 'TestSuite',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'TestGroup',
        required: true,
        label: 'Test Group',
        align: 'left',
        field: 'TestGroup',
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
        name: 'Type',
        required: false,
        label: 'Type',
        align: 'left',
        field: 'TestCaseType',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'IsPrimary',
        required: false,
        label: 'Primary',
        align: 'left',
        field: 'IsPrimary',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Owner',
        required: false,
        label: 'Owner',
        align: 'left',
        field: 'Owner',
        format: (val: any) => (val === null ? '' : `${val}`),
        sortable: true,
      },
      {
        name: 'CreatedDate',
        required: false,
        label: 'Created Date',
        align: 'left',
        field: 'CreatedDate',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'LastModifiedDate',
        required: false,
        label: 'Last Modified Date',
        align: 'left',
        field: 'LastModifiedDate',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'Team',
        required: false,
        label: 'Team',
        align: 'left',
        field: 'Team',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'QueueId',
        required: false,
        label: 'QueueId',
        align: 'left',
        field: 'QueueId',
        format: (val: any) => `${val}`,
        sortable: true,
      },
    ]
    const filter = ref('')
    const initialPagination = {
      rowsPerPage: 50,
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const testCases: Ref<TestCaseDetailInterface[]> = computed(() => context.root.$store.getters['testcase/allTestCasesDetail'])
    const selected: Ref<TestCaseDetailInterface[]> = ref([])
    const visibleColumns = ref(['FullName', 'Category', 'TestSuite', 'TestGroup', 'Owner', 'Type', 'IsPrimary', 'QueueId', 'CreatedDate', 'LastModifiedDate'])
    function getSelectedString() {
      return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${testCases.value.length}`
    }
    watch(
      () => selected.value,
      () => {
        console.log('selected', selected.value);
        context.root.$store.commit('testcase/setSelectedTestCasesDetail', selected.value)
      },
    )
    onMounted(async () => {
      try {
        context.root.$store.commit('testcase/setSelectedTestCasesDetail', [])
        await context.root.$store.dispatch('testcase/getAllTestCaseDetails');
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    });

    return {
      visibleColumns,
      columns,
      getSelectedString,
      testCases,
      filter,
      selected,
      initialPagination,
    }
  },
});
</script>
