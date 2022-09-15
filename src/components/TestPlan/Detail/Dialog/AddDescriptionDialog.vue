<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 180px; min-height: 100px !important; min-width: 600px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Add Description</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-form @submit="onOKClick" greedy @validation-success="isFormValid = true" @validation-error="isFormValid = false" ref="formRef" class="q-pa-sm">
          <div class="row">
            <div class="col">
              <q-input
                label="Description"
                autofocus
                outlined
                dense
                v-model="description"
                @blur="validateForm()"
                :rules="[(val) => !!val || '* Required', (val) => val.length < 100 || 'Maximum is 100 chars']"
                lazy-rules
                @mouseup.enter="onOKClick()"
              />
            </div>
          </div>
          <div class="column items-end q-mt-md">
            <div class="col">
              <q-btn flat label="Cancel" @click="onCancelClick()" class="q-mr-sm" />
              <q-btn outline label="Create" type="submit" color="primary" />
            </div>
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, Ref } from 'vue';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar';
import { TestStepInterface } from '../../../../Models/TestStep';

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
    const globalStore = useGlobalStore();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    const description = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => globalStore.darkTheme);
    const isFormValid = ref(false);
    const formRef = ref() as Ref<QForm>;

    function onOKClick() {
      onDialogOK(description.value);
    }

    function validateForm() {
      if (formRef.value !== null) formRef.value.validate(false);
    }
    return {
      dialogRef,
      onDialogHide,
      onOKClick,
      isDark,
      description,
      isFormValid,
      validateForm,
      formRef,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
