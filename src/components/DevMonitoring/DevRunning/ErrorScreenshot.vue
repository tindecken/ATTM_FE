<template>
  <div v-if="DevRunRecord.ErrorScreenshotId">
    <q-btn @click="showError(DevRunRecord.ErrorScreenshotId)" size="sm" outline> View </q-btn>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { DevRunRecordInterface } from '../../../Models/DevRunRecord';
import { showErrorScreenShot } from '../Utils/utils';

const props = defineProps({
  DevRunRecord: { type: Object as PropType<DevRunRecordInterface>, required: true },
});

const showError = async (errorScreenshotId: string) => {
  await showErrorScreenShot(errorScreenshotId);
};
</script>
