<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 140px; min-height: 100px !important; min-width: 200px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Delete test group</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="q-pa-sm">
        <div class="row q-mb-sm">
          <span class="text-subtitle1" v-if="testGroup && testGroup.TestCaseIds && testGroup.TestCaseIds.length > 0">Are you sure to delete test group: {{testGroup.CodeName}} - {{testGroup.Name}}, and its {{testGroup.TestCaseIds?.length}} test case(s)?</span>
          <span class="text-subtitle1" v-else>Are you sure to delete test group: {{testGroup.CodeName}} - {{testGroup.Name}}?</span>
        </div>
        <div class="column items-end q-mt-md">
          <div class="col">
            <q-btn
              flat
              label="Cancel"
              @click="onCancelClick()"
              v-close-popup
              class="q-mr-sm"
            />
            <q-btn
              outline
              label="Delete"
              type="submit"
              color="negative"
              @click="onDeleteClick()"
            />
          </div>
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, PropType,
} from 'vue';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { useGlobalStore } from 'src/pinia/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar'

export default defineComponent({
  name: 'DeleteTestGroupDialog',
  props: {
    testGroup: {
      type: Object as PropType<TestGroupInterface>,
      required: true,
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {},
  setup() {
    const globalStore = useGlobalStore()
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const isDark = computed(() => globalStore.darkTheme);
    const form = ref(QForm);

    function onDeleteClick() {
      onDialogOK()
    }
    return {
      dialogRef,
      onDialogHide,
      onDeleteClick,
      isDark,
      form,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
