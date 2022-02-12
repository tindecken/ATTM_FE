<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 415px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Environment: {{props.TestEnv.Name}}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-tabs
          v-model="tab"
          no-caps
        >
          <q-tab name="properties" label="Properties" />
          <q-tab name="histories" label="Histories" />
        </q-tabs>
        <q-tab-panels
          v-model="tab"
          animated
          vertical
          transition-prev="jump-down"
          transition-next="jump-down"
        >
          <q-tab-panel name="properties">
            <properties
              :TestEnv="props.TestEnv"
              @submit="onSubmitProperties($event)"
              @cancel="onCancelProperties()"></properties>
          </q-tab-panel>
          <q-tab-panel name="histories">
            <histories :TestEnv="props.TestEnv"></histories>
          </q-tab-panel>
        </q-tab-panels>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'PropertiesTestEnvDialog',
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
import Histories from './Histories.vue'
import Properties from './Properties.vue'

const props = defineProps<{
  TestEnv: TestEnvInterface
}>()
const tab = ref('properties')
const isDark = computed(() => $store.getters['global/darkTheme'])
const $store = useStore();
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

function onSubmitProperties(testEnv: TestEnvInterface) {
  onDialogOK(testEnv)
}
function onCancelProperties() {
  onDialogHide()
}
</script>
