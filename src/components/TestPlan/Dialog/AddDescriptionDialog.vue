<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6">Add Description</span>
      </div>
      <q-form
        @submit="onOKClick"
        greedy
        @validation-success="isFormValid = true"
        @validation-error="isFormValid = false"
        ref="form"
      >
        <div class="row">
          <div class="col">
            <q-input
              label="Description"
              autofocus
              outlined
              dense
              v-model="description"
              @blur="validateForm()"
              :rules="[
                val => !!val || '* Required',
                val => val.length < 100 || 'Maximum is 100 chars'
              ]"
              lazy-rules
            />
          </div>
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
              label="Create"
              :disable="!isFormValid"
              type="submit"
              color="primary"
            />
          </div>
        </div>
      </q-form>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, Ref, ref, PropType,
} from 'vue';
import { useStore } from 'vuex'
import { useDialogPluginComponent } from 'quasar'
import { TestStepInterface } from 'src/Models/TestStep';

export default defineComponent({
  name: 'AddDescriptionDialog',
  props: {
    TestStep: {
      type: Object as PropType<TestStepInterface>,
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
    const description = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => $store.getters['global/darkTheme']);
    const isFormValid = ref(false);
    const form: Ref<any> = ref(null);

    function onOKClick() {
      onDialogOK(description.value)
    }

    function validateForm() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (form.value !== null) form.value.validate(false);
    }
    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      isDark,
      description,
      isFormValid,
      validateForm,
      form,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
