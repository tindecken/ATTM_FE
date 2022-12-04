<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 170px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Restore Test Case</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-form autofocus greedy @submit="restore" ref="form">
          <div class="row q-pa-sm">
            <q-input
              autofocus
              dense
              outlined
              v-model="restoreMessage"
              label="Restore message"
              class="col-12 q-mb-sm"
              :rules="[(val) => !!val || 'Field is required']"
              @keyup.enter="restore()"
            />
          </div>
          <div class="row q-mt-sm">
            <q-space />
            <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px" @click="onDialogHide" />
            <q-btn outline label="Restore" color="secondary" class="q-mr-sm" style="width: 100px" type="submit" />
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'RestoreTestCaseDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { useGlobalStore } from '../../../../../../pinia/globalStore';
const globalStore = useGlobalStore();

const restoreMessage = ref('');
const isDark = computed(() => globalStore.darkTheme);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();

function restore() {
  if (restoreMessage.value === '') {
    $q.notify({
      color: 'negative',
      message: 'Restore message is required.',
      icon: 'report_problem',
    });
    return;
  }
  onDialogOK(restoreMessage.value);
  onDialogHide();
}
</script>
