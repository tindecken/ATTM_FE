<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 170px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Save Test Environment: {{props.TestEnv.Name}}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <div class="row q-pa-sm">
          <q-input dense outlined v-model="saveMessage" label="Name" class="col-12 q-mb-sm"
            :rules="[val => !!val || 'Field is required']"
          />
        </div>
        <div class="row q-mt-sm">
          <q-space />
          <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px;" @click="onDialogHide"/>
          <q-btn outline label="Discard" color="secondary" class="q-mr-sm" style="width: 100px;" @click="discard()"/>
          <q-btn outline label="Save" color="secondary" class="q-mr-sm" style="width: 100px;" @click="save()"/>
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'SaveTestEnvDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import {
  computed, ref, defineProps,
} from 'vue'
import { useStore } from 'vuex'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { TestEnvInterface } from 'src/Models/TestEnv'
import { UpdateTestEnvDataInterface } from 'src/Models/Entities/UpdateTestEnvData';
import { api } from 'boot/axios'
import config from 'src/config'
import { TestEnvHistoryInterface } from 'src/Models/TestEnvHistory';

const props = defineProps<{
  TestEnv: TestEnvInterface
}>()

const saveMessage = ref('')
const isDark = computed(() => $store.getters['global/darkTheme'])
const $store = useStore();
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
const $q = useQuasar()

function save() {
  if (saveMessage.value === '') {
    $q.notify({
      color: 'negative',
      message: 'Save message is required.',
      icon: 'report_problem',
    })
    return
  }

  const updateTestEnvData: UpdateTestEnvDataInterface = {
    UpdateBy: $store.getters['auth/Username'],
    UpdateMessage: saveMessage.value,
    UpdateType: 'Update Test Environment',
  }
  const testEnvHistory: TestEnvHistoryInterface = {
    UpdateTestEnvData: updateTestEnvData,
    TestEnv: props.TestEnv,
  }
  api.post(
    `${config.baseURL}/testenvs/update`,
    testEnvHistory,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${$store.getters['auth/Token']}`,
      },
    },
  ).then((res) => {
    $q.notify({
      color: 'positive',
      message: res.data.message,
    })
    onDialogOK(res.data.data as TestEnvInterface)
    onDialogHide()
  }).catch((err) => {
    $q.notify({
      color: 'negative',
      message: err.response.data.message,
      icon: 'report_problem',
    })
  });
}
function discard() {
  // TODO
}

</script>
