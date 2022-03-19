<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Edit Test Case: {{ $props.TestCase.CodeName }}</div>
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
                :model-value="editTestCase?.CodeName"
                @update:model-value="
                  (value: string) =>
                    editTestCase ? (editTestCase.CodeName = value) : ''
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
                :model-value="editTestCase?.Name"
                @update:model-value="(value) => (editTestCase ? (editTestCase.Name = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => !!val || '* Required', (val) => val.length < 50 || 'Maximum is 50 chars']"
                lazy-rules
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-4 q-mr-sm">
              <q-input
                label="WorkItem"
                outlined
                dense
                :model-value="editTestCase?.WorkItem"
                @update:model-value="(value) => (editTestCase ? (editTestCase.WorkItem = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'WorkItem maximum is 50 chars']"
              />
            </div>
            <div class="col-4 q-mr-sm">
              <q-input
                label="Type"
                outlined
                dense
                :model-value="editTestCase?.TestCaseType"
                @update:model-value="(value) => (editTestCase ? (editTestCase.TestCaseType = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'Type maximum is 50 chars']"
              />
            </div>
            <div class="col">
              <q-input
                label="Author"
                outlined
                dense
                :model-value="editTestCase?.Owner"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'Author maximum is 50 chars']"
                :readonly="true"
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-4 q-mr-sm">
              <q-input
                label="Queue"
                outlined
                dense
                :model-value="editTestCase?.Queue"
                @update:model-value="(value) => (editTestCase ? (editTestCase.Queue = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'Maximum is 50 chars']"
              />
            </div>
            <div class="col q-mr-sm">
              <q-input
                label="Do not run with Queues, separate by comma"
                outlined
                dense
                :model-value="editTestCase?.DontRunWithQueues"
                @update:model-value="(value) => (editTestCase ? (editTestCase.DontRunWithQueues = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'Maximum is 50 chars']"
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
                :model-value="editTestCase?.Description"
                @update:model-value="(value) => (editTestCase ? (editTestCase.Description = value) : '')"
                @blur="validateForm()"
                :rules="[(val) => val.length < 500 || 'Description maximum is 500 chars']"
              />
            </div>
          </div>
          <div class="column items-end q-mt-md">
            <div class="col">
              <q-btn flat label="Cancel" @click="onCancelClick()" v-close-popup class="q-mr-sm" />
              <q-btn outline label="Update" :disable="!isFormValid" type="submit" color="primary" />
            </div>
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, onMounted, Ref } from 'vue';
import _ from 'lodash';
import { TestCaseInterface } from '../../../../Models/TestCase';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar';
import { UpdateTestCaseDataInterface } from '../../../../Models/Entities/UpdateTestCaseData';
import { TestCaseHistoryInterface } from '../../../../Models/TestCaseHistory';

export default defineComponent({
  name: 'EditTestCaseDialog',
  props: {
    TestCase: {
      type: Object as PropType<TestCaseInterface>,
      required: true,
    },
  },
  emits: [...useDialogPluginComponent.emits],
  components: {},
  setup(props) {
    const globalStore = useGlobalStore();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    const isDark = computed(() => globalStore.darkTheme);
    const isFormValid = ref(false);
    const form = ref(QForm);
    const editTestCase: Ref<TestCaseInterface | null> = ref(null);
    onMounted(() => {
      editTestCase.value = _.cloneDeep(props.TestCase);
    });
    function onOKClick() {
      if (editTestCase.value) {
        editTestCase.value.DontRunWithQueues = editTestCase.value.DontRunWithQueues?.toString()
          .split(',')
          .map((item: string) => item.trim());
      }
      const UpdateTestCaseData: UpdateTestCaseDataInterface = {
        UpdateMessage: '',
        UpdateBy: editTestCase.value?.Owner || '',
        UpdateType: 'Change Properties',
      };
      const TestCaseHistory: TestCaseHistoryInterface = {
        TestCase: editTestCase.value as TestCaseInterface,
        UpdateTestCaseData,
      };
      console.log('onOKClick - EditTestStep', TestCaseHistory);
      onDialogOK(TestCaseHistory);
    }

    function validateForm() {
      if (form.value !== null) form.value.validate(false);
    }
    return {
      editTestCase,
      dialogRef,
      onDialogHide,
      onOKClick,
      isDark,
      isFormValid,
      validateForm,
      form,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
