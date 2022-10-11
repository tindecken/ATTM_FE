<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 190px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Delete Regression: {{ props.Regression.Name }}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-form autofocus greedy @submit="deleteRegression" ref="form">
          <div class="row q-pa-sm">
            <span class="text-body1 q-mb-sm">Are you sure to delete ? If yes, please enter the regression name.</span>
            <q-input autofocus dense outlined v-model="name" label="Name" class="col-12 q-mb-sm" :rules="[(val) => !!val || 'Field is required']" />
          </div>
          <div class="row">
            <q-space />
            <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px" @click="onDialogHide" />
            <q-btn outline label="Delete" color="negative" class="q-mr-sm" style="width: 100px" type="submit" />
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'DeleteRegressionDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { useUserStore } from '../../../../pinia/userStore';
import { RegressionInterface } from '../../../../Models/Regression';
import { DeleteRegressionDataInterface } from '../../../../Models/Entities/DeleteRegressionData';

const globalStore = useGlobalStore();
const userStore = useUserStore();
const props = defineProps<{
  Regression: RegressionInterface;
}>();
const isDark = computed(() => globalStore.darkTheme);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const name = ref('');
const $q = useQuasar();

function deleteRegression() {
  if (name.value !== props.Regression.Name) {
    $q.notify({
      color: 'negative',
      message: 'Regression name is not correct.',
      icon: 'error',
    });
    return;
  }
  const deleteRegressionData: DeleteRegressionDataInterface = {
    RegressionId: props.Regression.Id,
    DeletedBy: userStore.Username,
  };
  onDialogOK(deleteRegressionData);
}
</script>
