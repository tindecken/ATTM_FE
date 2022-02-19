<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6" v-if="testSuite && testSuite.TestGroupIds && testSuite.TestGroupIds.length > 0">Are you sure to delete test suite: {{testSuite.CodeName}} - {{testSuite.Name}}, and its {{testSuite.TestGroupIds?.length}} test group(s)?</span>
        <span class="text-h6" v-else>Are you sure to delete test suite: {{testSuite.CodeName}} - {{testSuite.Name}}?</span>
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
import { TestSuiteInterface } from 'src/Models/TestSuite';
import { useDialogPluginComponent } from 'quasar'
import { useGlobalStore } from 'src/pinia/globalStore';

export default defineComponent({
  name: 'DeleteTestSuiteDialog',
  props: {
    testSuite: {
      type: Object as PropType<TestSuiteInterface>,
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
    const form = ref(null);

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
