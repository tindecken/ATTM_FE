<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 150px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Delete Test Environment: {{props.TestEnv.Name}}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <div class="row q-pa-sm">
          <span class="text-body1">Are you sure to delete test environment: {{props.TestEnv.Name}}?</span>
        </div>
        <div class="row q-mt-sm">
          <q-space />
          <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px;" @click="onDialogHide"/>
          <q-btn outline label="Delete" color="negative" class="q-mr-sm" style="width: 100px;" @click="deleteTestEnv()"/>
        </div>
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
import {
  computed, ref, defineProps,
} from 'vue'
import { useStore } from 'vuex'
import { useDialogPluginComponent } from 'quasar'
import { TestEnvInterface } from 'src/Models/TestEnv';

const props = defineProps<{
  TestEnv: TestEnvInterface
}>()
const testEnvName = ref('')
const isDark = computed(() => $store.getters['global/darkTheme'])
const $store = useStore();
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

function deleteTestEnv() {
  onDialogOK(testEnvName.value)
  onDialogHide()
}

</script>
