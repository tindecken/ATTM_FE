<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 250px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">New Test Environment</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <div class="row q-pa-sm">
          <q-input dense outlined v-model="testEnvName" label="Name" class="col-12 q-mb-sm"/>
          <q-input type="textarea" rows="4" dense outlined v-model="description" label="Description" class="col-12"/>
        </div>
        <div class="row q-mt-sm">
          <q-space />
          <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px;" @click="onDialogHide"/>
          <q-btn outline label="Create" color="secondary" class="q-mr-sm" style="width: 100px;" @click="create()"/>
        </div>
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
import { useStore } from 'vuex'
import { useDialogPluginComponent } from 'quasar'

const testEnvName = ref('')
const description = ref('')
const isDark = computed(() => $store.getters['global/darkTheme'])
const $store = useStore();
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

function create() {
  onDialogOK(testEnvName.value)
  onDialogHide()
}

</script>
