<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 270px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">New Category</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="q-pa-sm">
        <q-form
          @submit="onOKClick"
          greedy
          @validation-success="isFormValid = true"
          @validation-error="isFormValid = false"
          ref="form"
          class="q-mt-sm"
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
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref,
} from 'vue';
import { CategoryInterface } from 'src/Models/Category';
import { useGlobalStore } from 'src/pinia/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar';

export default defineComponent({
  name: 'NewCategoryDialog',
  props: {
  },
  components: {},
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const globalStore = useGlobalStore()
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const codeName = ref('');
    const name = ref('');
    const author = ref('');
    const description = ref('');
    const workItem = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => globalStore.darkTheme);
    const isFormValid = ref(false);
    const form = ref(QForm);

    function onOKClick() {
      const newCategory: CategoryInterface = {
        Id: '',
        Name: name.value,
        Description: description.value,
        WorkItem: workItem.value,
        TestSuiteIds: [],
        children: [],
      }
      onDialogOK(newCategory)
    }

    function validateForm() {
      if (form.value !== null) form.value.validate(false);
    }
    return {
      dialogRef,
      codeName,
      name,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,
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
