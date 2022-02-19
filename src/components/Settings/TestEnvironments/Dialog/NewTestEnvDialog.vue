<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 290px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">New Test Environment</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-form
          autofocus
          greedy
          @submit="onSubmit"
          ref="form">
          <div class="row q-pa-sm">
            <q-input dense outlined v-model="testEnvName" label="Name" class="col-12 q-mb-sm"
              :rules="[ val => !!val || 'Field is required',
                        val => val.length <= 50 || 'Maximum 50 characters'
                      ]"
            />
            <q-input type="textarea" rows="4" dense outlined v-model="description" label="Description - max 500 characters" class="col-12"
              :rules="[ val => val.length <= 500 || 'Maximum 500 characters' ]"
            />
          </div>
          <div class="row q-mt-sm">
            <q-space />
            <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px;" @click="onDialogHide"/>
            <q-btn outline label="Create" color="secondary" class="q-mr-sm" style="width: 100px;" type="submit"/>
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'NewTestEnvDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import {
  computed, ref,
} from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { api } from 'boot/axios'
import config from 'src/config'
import { TestEnvInterface } from 'src/Models/TestEnv'
import { useUserStore } from 'src/pinia/userStore'
import { useGlobalStore } from 'src/pinia/globalStore'

const globalStore = useGlobalStore()
const userStore = useUserStore()
const testEnvName = ref('')
const description = ref('')
const isDark = computed(() => globalStore.darkTheme)
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
const $q = useQuasar()

function onSubmit() {
  const newTestEnv: TestEnvInterface = {
    Id: '',
    Name: testEnvName.value,
    Description: description.value,
    Nodes: [],
    LastModifiedUser: userStore.Username,
  }
  api.post(
    `${config.baseURL}/testenvs/create`,
    newTestEnv,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.Token}`,
      },
    },
  ).then((res) => {
    $q.notify({
      type: 'positive',
      message: res.data.message,
    })
    onDialogOK(res.data.data as TestEnvInterface)
    onDialogHide()
  }).catch((err) => {
    $q.notify({
      type: 'negative',
      message: err.response.data.message,
      icon: 'report_problem',
    })
  });
}

</script>
