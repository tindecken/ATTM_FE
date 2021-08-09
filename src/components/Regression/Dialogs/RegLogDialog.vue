<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" fullHeight>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-width: 1200px; min-height: 400px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6">{{ RegressionTest.TestCaseCodeName }}: {{ RegressionTest.TestCaseName }}</span>
        <q-space />
        <q-btn outline icon="visibility" primary @click="showImage()" class="q-mr-sm">View Screenshot</q-btn>
        <q-btn outline icon="content_copy" primary @click="copy(RegressionTest.TestCaseCodeName)" class="q-mr-sm">TestCase Code Name</q-btn>
        <q-btn outline icon="content_copy"  primary @click="copy(RegressionTest.TestCaseName)" class="q-mr-sm">TestCase Name</q-btn>
        <q-btn outline icon="content_copy"  primary @click="copy(RegressionTest.LastRegressionRunRecord?.Log || '')">Log</q-btn>
      </div>
      <q-separator class="q-mb-sm q-mt-sm" />
      <div style="white-space: pre-wrap;">
        {{ RegressionTest.LastRegressionRunRecord.Log }}
      </div>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { RegressionTestInterface } from 'src/Models/RegressionTest';
import {
  defineComponent, computed, PropType,
} from 'vue';

import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'

export default defineComponent({
  name: 'RegLogDialog',
  props: {
    RegressionTest: {
      type: Object as PropType<RegressionTestInterface>,
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
  setup(props) {
    const $store = useStore()
    const isDark = computed(() => $store.getters['global/darkTheme'])
    // REQUIRED; must be called inside of setup()
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const { copy } = useClipboard()
    async function showImage() {
      const image = await $store.dispatch('regmonitoring/getScreenshot', props.RegressionTest.LastRegressionRunRecord?.ErrorScreenshot);
      const contentType = 'image/png';
      const byteCharacters = atob(image.substr(`data:${contentType};base64,`.length));
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i += 1) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
    }
    return {
      showImage,
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
