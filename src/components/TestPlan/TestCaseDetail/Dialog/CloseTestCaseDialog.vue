<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important"
    >
      <div class="row q-mb-sm">
        <span class="text-h6">Save Test Case?</span>
      </div>
      <div class="row q-mb-sm justify-end">
        <q-btn outline label="Save" @click="save()"></q-btn>
        <q-btn
          outline
          label="Discard"
          @click="discard()"
          class="q-ml-sm"
        ></q-btn>
        <q-btn outline label="Cancel" @click="cancel()" class="q-ml-sm"></q-btn>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed, defineComponent } from 'vue';
import { useGlobalStore } from '../../../../pinia/globalStore';

export default defineComponent({
  name: 'CloseTestCaseDialog',
  props: {},
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {},
  setup(props, context) {
    const globalStore = useGlobalStore();
    const { dialogRef, onDialogHide, onDialogCancel } =
      useDialogPluginComponent();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => globalStore.darkTheme);

    function save() {
      context.emit('ok', 'Save');
      onDialogHide();
    }
    function discard() {
      context.emit('ok', 'Discard');
      onDialogHide();
    }
    function cancel() {
      onDialogHide();
    }
    return {
      dialogRef,
      onDialogHide,
      save,
      isDark,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      discard,
      cancel,
    };
  },
});
</script>
