<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" fullHeight>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-width: 1200px; min-height: 400px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6">{{ DevRunRecord.TestCaseCodeName }}: {{ DevRunRecord.TestCaseName }}</span>
        <q-space />
        <q-btn outline icon="content_copy" primary @click="copy(DevRunRecord.TestCaseCodeName)" class="q-mr-sm">TestCase Code Name</q-btn>
        <q-btn outline icon="content_copy"  primary @click="copy(DevRunRecord.TestCaseName)" class="q-mr-sm">TestCase Name</q-btn>
        <q-btn outline icon="content_copy"  primary @click="copy(DevRunRecord.Log || '')">Log</q-btn>
      </div>
      <q-separator class="q-mb-sm q-mt-sm" />
      <div style="white-space: pre-wrap;">
        {{ DevRunRecord.Log }}
      </div>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { DevRunRecordInterface } from 'src/Models/DevRunRecord';
import {
  defineComponent, computed, PropType,
} from 'vue';

import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'

export default defineComponent({
  name: 'DevLogDialog',
  props: {
    DevRunRecord: {
      type: Object as PropType<DevRunRecordInterface>,
      required: true,
      default: () => ({}),
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: { },
  setup() {
    const $store = useStore()
    const isDark = computed(() => $store.getters['global/darkTheme'])
    // REQUIRED; must be called inside of setup()
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const { copy } = useClipboard()
    return {
      copy,
      isDark,
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    }
  },
});
</script>
