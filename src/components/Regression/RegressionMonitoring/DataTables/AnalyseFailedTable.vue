<template>
  <common-table
    :testCases="testCases"
    :filterTestCase="props.filterTestCase"
    :visibleColumns="visibleColumns">
  </common-table>
</template>

<script setup lang="ts">
import {
  defineProps, PropType, computed, Ref,
} from 'vue';
import { useRegMonitoringStore } from 'src/pinia/regMonitoring';
import { RegressionTestInterface } from 'src/Models/RegressionTest';
import CommonTable from './_CommonTable.vue';

const regMonitoringStore = useRegMonitoringStore()
const props = defineProps({
  filterTestCase: { type: Object as PropType<string>, required: true },
})
const testCases: Ref<RegressionTestInterface[]> = computed(() => regMonitoringStore.analyseFailedRegTests)
const visibleColumns = ['testCaseFullName', 'category', 'testSuite', 'testGroup', 'clientName', 'isHighPriority', 'description', 'testCaseType', 'team', 'errorMessage', 'log', 'errorScreenShot', 'startAt', 'endAt', 'executeTime', 'workItem', 'queue', 'owner', 'analyseBy', 'issue', 'comments', 'runMachine', 'buffers']
</script>

<style lang="sass" scoped>
</style>
