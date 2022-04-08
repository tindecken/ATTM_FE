<template>
  <common-table :testCases="testCases" :filterTestCase="props.filterTestCase" :visibleColumns="visibleColumns"> </common-table>
</template>

<script setup lang="ts">
import { defineProps, PropType, computed, Ref } from 'vue';
import { useRegMonitoringStore } from '../../../../pinia/regMonitoring';
import { RegressionTestInterface } from '../../../../Models/RegressionTest';
import CommonTable from './_CommonTable.vue';

const regMonitoringStore = useRegMonitoringStore();
const props = defineProps({
  filterTestCase: { type: Object as PropType<string>, required: true },
});
const testCases: Ref<RegressionTestInterface[]> = computed(() => regMonitoringStore.regTests);
const visibleColumns = [
  'testCaseFullName',
  'category',
  'testSuite',
  'testGroup',
  'status',
  'clientName',
  'isHighPriority',
  'description',
  'testCaseType',
  'team',
  'errorMessage',
  'log',
  'errorScreenShot',
  'startAt',
  'endAt',
  'executeTime',
  'workItem',
  'queue',
  'owner',
  'analyseBy',
  'issue',
  'comments',
  'runMachine',
  'buffers',
];
</script>

<style lang="sass" scoped></style>
