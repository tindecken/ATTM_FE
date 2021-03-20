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
  computed, defineComponent, Ref, ref,
} from '@vue/composition-api';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestGroupInterface } from 'src/Models/TestGroup';

export default defineComponent({
  name: 'NewTestCaseDialog',
  props: {
    testGroup: {
      type: Object,
      required: true,
    },
  },
  components: {},
  setup(props, context) {
    const dialogRef: Ref<any> = ref(null);
    const codeName = ref('');
    const name = ref('');
    const author = ref('');
    const description = ref('');
    const workItem = ref('');
    const type = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => context.root.$store.getters['global/darkTheme']);
    const isFormValid = ref(false);
    const form: Ref<any> = ref(null);
    // following method is REQUIRED
    // (don't change its name --> "show")
    function show() {
      console.log(dialogRef.value);
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
      context.emit('hide');
    }

    function onOKClick() {
      console.log('testgroup', props.testGroup);
      const testGroup = props.testGroup as TestGroupInterface
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      // console.log('sdfsd', context.root.$emit)
      const newTestCase: TestCaseInterface = {
        CodeName: codeName.value,
        Id: '',
        Name: name.value,
        TestSteps: [],
        WorkItem: workItem.value,
        Description: description.value,
        TestCaseType: type.value,
        Designer: author.value,
        CategoryId: testGroup.CategoryId,
        TestSuiteId: testGroup.TestSuiteId,
        TestGroupId: testGroup.Id,
      }
      context.emit('ok', newTestCase)
      // {
      //   // tgMongoId: props.testGroup.Id,
      //   // catId: props.catId,
      //   // tsId: props.tsId,
      //   // tcId: id.value,
      //   // name: name.value,
      //   // author: author.value,
      //   // workItem: workItem.value,
      //   // testCaseType: type.value,
      //   // description: description.value,
      //   // tgId: props.tgId,
      //   // tgName: props.testGroup.Name,
      // }
      // );
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
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
      type,
      isFormValid,
      validateForm,
      form,
    };
  },
});
</script>
