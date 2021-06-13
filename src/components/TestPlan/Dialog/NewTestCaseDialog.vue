<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      class="q-pa-sm"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important;"
    >
      <div class="row q-mb-sm">
        <span class="text-h6">New Test Case</span>
      </div>
      <q-form
        @submit="onOKClick"
        greedy
        @validation-success="isFormValid = true"
        @validation-error="isFormValid = false"
        ref="form"
      >
        <div class="row">
          <div class="col-4 q-mr-sm">
            <q-input
              label="Code Name"
              outlined
              dense
              autofocus
              v-model="codeName"
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
              label="Name"
              outlined
              dense
              v-model="name"
              @blur="validateForm()"
              :rules="[
                val => !!val || '* Required',
                val => val.length < 50 || 'Maximum is 50 chars'
              ]"
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
              v-model="workItem"
              @blur="validateForm()"
              :rules="[
                val => val.length < 50 || 'WorkItem maximum is 50 chars'
              ]"
            />
          </div>
          <div class="col-4 q-mr-sm">
            <q-input
              label="Type"
              outlined
              dense
              v-model="type"
              @blur="validateForm()"
              :rules="[
                val => val.length < 50 || 'Type maximum is 50 chars'
              ]"
            />
          </div>
          <div class="col">
            <q-input
              label="Author"
              outlined
              dense
              v-model="author"
              @blur="validateForm()"
              :rules="[val => val.length < 50 || 'Author maximum is 50 chars']"
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
  computed, defineComponent, Ref, ref, PropType,
} from 'vue';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { useStore } from 'vuex'
import { useDialogPluginComponent } from 'quasar'

export default defineComponent({
  name: 'NewTestCaseDialog',
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
  setup(props) {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const $store = useStore()
    const codeName = ref('');
    const name = ref('');
    const author = ref('');
    const description = ref('');
    const workItem = ref('');
    const type = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => $store.getters['global/darkTheme']);
    const isFormValid = ref(false);
    const form: Ref<any> = ref(null);

    function onOKClick() {
      const { testGroup } = props
      const newTestCase: TestCaseInterface = {
        CodeName: codeName.value,
        Id: '',
        Name: name.value,
        TestSteps: [],
        WorkItem: workItem.value,
        Description: description.value,
        TestCaseType: type.value,
        Owner: author.value,
        CategoryId: testGroup.CategoryId,
        TestSuiteId: testGroup.TestSuiteId,
        TestGroupId: testGroup.Id,
      }
      onDialogOK(newTestCase)
      // context.emit('ok', newTestCase)
    }

    function validateForm() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (form.value !== null) form.value.validate(false);
    }
    return {
      dialogRef,
      codeName,
      name,
      onDialogHide,
      onOKClick,
      isDark,
      author,
      description,
      workItem,
      type,
      isFormValid,
      validateForm,
      form,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
