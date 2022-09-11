<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 170px; min-height: 100px !important; min-width: 600px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Save Test Case: {{ props.TestCase.CodeName }}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-form autofocus greedy @submit="save" ref="form">
          <div class="row q-pa-sm">
            <q-input
              autofocus
              dense
              outlined
              v-model="saveMessage"
              label="Save message"
              class="col-12 q-mb-sm"
              :rules="[(val) => !!val || 'Field is required']"
              @keyup.enter="save()"
            />
          </div>
          <div class="row q-mt-sm">
            <q-space />
            <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px" @click="onDialogHide" />
            <q-btn outline label="Save" color="secondary" class="q-mr-sm" style="width: 100px" type="submit" />
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'SaveTestCaseDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, ref, defineProps } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { TestCaseInterface } from '../../../../Models/TestCase';

const globalStore = useGlobalStore();
const props = defineProps<{
  TestCase: TestCaseInterface;
}>();

const saveMessage = ref('');
const isDark = computed(() => globalStore.darkTheme);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();

function save() {
  if (saveMessage.value === '') {
    $q.notify({
      color: 'negative',
      message: 'Save message is required.',
      icon: 'report_problem',
    });
    return;
  }
  onDialogOK(saveMessage.value);
  onDialogHide();
}
</script>
