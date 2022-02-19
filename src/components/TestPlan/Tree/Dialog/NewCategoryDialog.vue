<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6">New Category</span>
      </div>
      <q-form
        @submit="onOKClick"
        greedy
        @validation-success="isFormValid = true"
        @validation-error="isFormValid = false"
        ref="form"
      >
        <div class="row">
          <div class="col-8 q-mr-sm">
            <q-input
              label="Name"
              outlined
              dense
              autofocus
              v-model="name"
              @blur="validateForm()"
              :rules="[
                val => !!val || '* Required',
                val => val.length < 15 || 'Maximum is 15 chars',
                val => isNaN(val.charAt(0)) || 'First char can not a number'
              ]"
              lazy-rules
            />
          </div>
          <div class="col">
            <q-input
              label="WorkItem"
              outlined
              dense
              v-model="workItem"
              @blur="validateForm()"
              :rules="[
                val => val.length < 50 || 'WorkItem maximum is 50 chars'
              ]"
            />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col">
            <q-input
              label="Description"
              outlined
              dense
              type="textarea"
              rows="3"
              v-model="description"
              @blur="validateForm()"
              :rules="[
                val => val.length < 500 || 'Description maximum is 500 chars'
              ]"
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
  computed, defineComponent, ref,
} from 'vue';
import { CategoryInterface } from 'src/Models/Category';
import { useGlobalStore } from 'src/pinia/globalStore';
import { QDialog, QForm } from 'quasar';

export default defineComponent({
  name: 'NewCategoryDialog',
  props: {
  },
  components: {},
  emits: ['ok', 'cancel'],
  setup(props, context) {
    const globalStore = useGlobalStore()
    const dialogRef = ref(QDialog);
    const codeName = ref('');
    const name = ref('');
    const author = ref('');
    const description = ref('');
    const workItem = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => globalStore.darkTheme);
    const isFormValid = ref(false);
    const form = ref(QForm);
    function show() {
      dialogRef.value.show();
    }

    // following method is REQUIRED
    // (don't change its name --> "hide")
    function hide() {
      dialogRef.value.hide();
    }

    function onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      context.emit('cancel');
    }

    function onOKClick() {
      const newCategory: CategoryInterface = {
        Id: '',
        Name: name.value,
        Description: description.value,
        WorkItem: workItem.value,
        TestSuiteIds: [],
        children: [],
      }
      context.emit('ok', newCategory);
      hide();
    }

    function onCancelClick() {
      // we just need to hide dialog
      hide();
    }
    function validateForm() {
      if (form.value !== null) form.value.validate(false);
    }
    return {
      dialogRef,
      codeName,
      name,
      show,
      hide,
      onDialogHide,
      onOKClick,
      onCancelClick,
      isDark,
      author,
      description,
      workItem,
      isFormValid,
      validateForm,
      form,
    };
  },
});
</script>
