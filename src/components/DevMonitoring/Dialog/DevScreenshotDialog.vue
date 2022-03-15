<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" fullHeight>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-width: 1200px; min-height: 400px !important;"
    >
      <q-img
        :src="url"
        spinner-color="white"
        fit="fill"
      />
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { DevRunRecordInterface } from 'src/Models/DevRunRecord';
import {
  defineComponent, computed, PropType,
} from 'vue';

import { useGlobalStore } from 'src/pinia/globalStore';

export default defineComponent({
  name: 'DevScreenshotDialog',
  props: {
    DevRunRecord: {
      type: Object as PropType<DevRunRecordInterface>,
      required: false,
      default: () => ({}),
    },
    url: {
      type: String,
      required: true,
      default: () => (''),
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: { },
  setup() {
    const globalStore = useGlobalStore()
    const isDark = computed(() => globalStore.darkTheme)
    // REQUIRED; must be called inside of setup()
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    return {
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
