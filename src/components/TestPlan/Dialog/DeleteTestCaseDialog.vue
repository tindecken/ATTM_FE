<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6">Are you sure to delete {{testCases.length}} test case(s)?</span>
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
  computed, defineComponent, Ref, ref, PropType,
} from 'vue';
import { TestCaseInterface } from 'src/Models/TestCase';
import { useStore } from 'vuex'
import { useDialogPluginComponent } from 'quasar'

export default defineComponent({
  name: 'DeleteTestCaseDialog',
  props: {
    testCases: {
      type: Object as PropType<TestCaseInterface[]>,
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
    const form: Ref<any> = ref(null);

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
