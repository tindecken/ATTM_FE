<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 190px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">
          Delete Test Environment: {{ props.TestEnv.Name }}
        </div>
        <q-btn
          class="self-center"
          dense
          flat
          icon="close"
          @click="onDialogHide"
        >
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-form autofocus greedy @submit="deleteTestEnv" ref="form">
          <div class="row q-pa-sm">
            <span class="text-body1"
              >Are you sure to delete test environment:
              {{ props.TestEnv.Name }}?</span
            >
            <q-input
              dense
              outlined
              v-model="reason"
              label="Reason"
              class="col-12 q-mb-sm"
              :rules="[
                (val) => !!val || 'Field is required',
                (val) => val.length <= 50 || 'Maximum 50 characters',
              ]"
            />
          </div>
          <div class="row q-mt-sm">
            <q-space />
            <q-btn
              outline
              label="Cancel"
              color="secondary"
              class="q-mr-sm"
              style="width: 100px"
              @click="onDialogHide"
            />
            <q-btn
              outline
              label="Delete"
              color="negative"
              class="q-mr-sm"
              style="width: 100px"
              type="submit"
            />
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'DeleteTestEnvDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { TestEnvInterface } from '../../../../Models/TestEnv';
import { api } from '../../../../boot/axios';
import { useGlobalStore } from '../../../../pinia/globalStore';
import config from '../../../../config';
import { UpdateTestEnvDataInterface } from '../../../../Models/Entities/UpdateTestEnvData';
import { TestEnvHistoryInterface } from '../../../../Models/TestEnvHistory';
import { useUserStore } from '../../../../pinia/userStore';

const globalStore = useGlobalStore();
const userStore = useUserStore();
const props = defineProps<{
  TestEnv: TestEnvInterface;
}>();
const isDark = computed(() => globalStore.darkTheme);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const reason = ref('');
const $q = useQuasar();

function deleteTestEnv() {
  const updateTestEnvData: UpdateTestEnvDataInterface = {
    UpdateBy: userStore.Username,
    UpdateMessage: reason.value,
    UpdateType: 'Delete',
  };
  const testEnvHistory: TestEnvHistoryInterface = {
    UpdateTestEnvData: updateTestEnvData,
    TestEnv: props.TestEnv,
  };
  api
    .post(`${config.baseURL}/testenvs/delete`, testEnvHistory, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.Token}`,
      },
    })
    .then((res) => {
      $q.notify({
        type: 'positive',
        message: res.data.message,
      });
      onDialogOK(res.data.data as TestEnvInterface);
      onDialogHide();
    })
    .catch((err) => {
      $q.notify({
        type: 'negative',
        message: err.response.data.message,
        icon: 'report_problem',
      });
    });
}
</script>
