<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6" v-if="testGroup && testGroup.TestCaseIds && testGroup.TestCaseIds.length > 0">Are you sure to delete test group: {{testGroup.CodeName}} - {{testGroup.Name}}, and its {{testGroup.TestCaseIds?.length}} test case(s)?</span>
        <span class="text-h6" v-else>Are you sure to delete test group: {{testGroup.CodeName}} - {{testGroup.Name}}?</span>
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
              color="primary"
              @click="onDeleteClick()"
            />
          </div>
        </div>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, PropType,
} from 'vue';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { useStore } from 'vuex'
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
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const $store = useStore()
    const isDark = computed(() => $store.getters['global/darkTheme']);
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
