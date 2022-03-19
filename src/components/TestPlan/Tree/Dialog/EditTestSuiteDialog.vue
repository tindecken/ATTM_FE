<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 340px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Edit Test Suite: {{ $props.TestSuite.Name }}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="q-pa-sm">
        <q-form @submit="onOKClick" greedy @validation-success="isFormValid = true" @validation-error="isFormValid = false" ref="form" class="q-mt-sm">
          <div class="row">
            <div class="col-4 q-mr-sm">
              <q-input
                label="Code Name"
                outlined
                dense
                autofocus
                :model-value="editTestSuite?.CodeName"
                @update:model-value="
                  (value: string) =>
                    editTestSuite ? (editTestSuite.CodeName = value) : ''
                "
                @blur="validateForm()"
                :rules="[
                  (val) => !!val || '* Required',
                  (val) => val.length < 15 || 'Maximum is 15 chars',
                  (val) => isNaN(val.charAt(0)) || 'First char can not a number',
                ]"
                lazy-rules
              />
            </div>
            <div class="col">
              <q-input
                label="Name"
                outlined
                dense
                :model-value="editTestSuite?.Name"
                @update:model-value="
                  (value: string) =>
                    editTestSuite ? (editTestSuite.Name = value) : ''
                "
                @blur="validateForm()"
                :rules="[(val) => !!val || '* Required', (val) => val.length < 50 || 'Maximum is 50 chars']"
                lazy-rules
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-8 q-mr-sm">
              <q-input
                label="WorkItem"
                outlined
                dense
                :model-value="editTestSuite?.WorkItem"
                @update:model-value="
                  (value: string) =>
                    editTestSuite ? (editTestSuite.WorkItem = value) : ''
                "
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'WorkItem maximum is 50 chars']"
              />
            </div>
            <div class="col">
              <q-input
                label="Owner"
                outlined
                dense
                :model-value="editTestSuite?.Owner"
                @update:model-value="
                  (value: string) =>
                    editTestSuite && editTestSuite.Owner ? (editTestSuite.Owner = value) : ''
                "
                @blur="validateForm()"
                :rules="[(val: string) => val.length < 50 || 'Author maximum is 50 chars']"
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
                :model-value="editTestSuite?.Description"
                @update:model-value="
                  (value: string) =>
                    editTestSuite ? (editTestSuite.Description = value) : ''
                "
                @blur="validateForm()"
                :rules="[(val) => val.length < 500 || 'Description maximum is 500 chars']"
              />
            </div>
          </div>
          <div class="column items-end q-mt-md">
            <div class="col">
              <q-btn flat label="Cancel" @click="onDialogCancel()" v-close-popup class="q-mr-sm" />
              <q-btn outline label="Update" :disable="!isFormValid" type="submit" color="primary" />
            </div>
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, PropType, onMounted, Ref } from 'vue';
import _ from 'lodash';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar';
import { TestSuiteInterface } from '../../../../Models/TestSuite';

const props = defineProps({
  TestSuite: { type: Object as PropType<TestSuiteInterface>, required: true },
});

const emits = defineEmits([...useDialogPluginComponent.emits]);

const globalStore = useGlobalStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const isDark = computed(() => globalStore.darkTheme);
const isFormValid = ref(false);
const form = ref(QForm);
const editTestSuite: Ref<TestSuiteInterface | null> = ref(null);
onMounted(() => {
  editTestSuite.value = _.cloneDeep(props.TestSuite);
  console.log('editTestSuite', editTestSuite.value);
});
function onOKClick() {
  onDialogOK(editTestSuite.value);
}

function validateForm() {
  if (form.value !== null) form.value.validate(false);
}
</script>
