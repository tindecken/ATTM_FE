<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">New Test Case</div>
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
                v-model="codeName"
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
                v-model="name"
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
                v-model="workItem"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'WorkItem maximum is 50 chars']"
              />
            </div>
            <div class="col-4 q-mr-sm">
              <q-input label="Type" outlined dense v-model="type" @blur="validateForm()" :rules="[(val) => val.length < 50 || 'Type maximum is 50 chars']" />
            </div>
            <div class="col">
              <q-input
                label="Author"
                outlined
                dense
                v-model="author"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'Author maximum is 50 chars']"
                :readonly="true"
              />
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-4 q-mr-sm">
              <q-input label="Queue" outlined dense v-model="queue" @blur="validateForm()" :rules="[(val) => val.length < 50 || 'Maximum is 50 chars']" />
            </div>
            <div class="col q-mr-sm">
              <q-input
                label="Do not run with Queues, separate by comma"
                outlined
                dense
                v-model="dontRunWithQueues"
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
                v-model="description"
                @blur="validateForm()"
                :rules="[(val) => val.length < 500 || 'Description maximum is 500 chars']"
              />
            </div>
          </div>
          <div class="column items-end q-mt-md">
            <div class="col">
              <q-btn flat label="Cancel" @click="onCancelClick()" v-close-popup class="q-mr-sm" />
              <q-btn outline label="Create" :disable="!isFormValid" type="submit" color="primary" />
            </div>
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, Ref } from 'vue';
import { TestCaseInterface } from '../../../../Models/TestCase';
import { TestGroupInterface } from '../../../../Models/TestGroup';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar';
import { useUserStore } from '../../../../pinia/userStore';

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
    const globalStore = useGlobalStore();
    const userStore = useUserStore();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    const codeName = ref('');
    const name = ref('');
    const author = computed(() => userStore.Username);
    const description = ref('');
    const workItem = ref('');
    const type = ref('');
    const queue = ref('');
    const dontRunWithQueues = ref('');
    const isDark = computed(() => globalStore.darkTheme);
    const isFormValid = ref(false);
    const form = ref() as Ref<QForm>;

    function onOKClick() {
      const { testGroup } = props;
      const newTestCase: TestCaseInterface = {
        CodeName: codeName.value,
        Id: '',
        Name: name.value,
        TestSteps: [],
        WorkItem: workItem.value,
        Description: description.value,
        TestCaseType: type.value,
        Owner: author.value,
        Queue: queue.value,
        DontRunWithQueues: dontRunWithQueues.value.trim() !== '' ? dontRunWithQueues.value.split(',').map((s: string) => s.trim()) : [],
        CategoryId: testGroup.CategoryId,
        TestSuiteId: testGroup.TestSuiteId,
        TestGroupId: testGroup.Id,
      };
      onDialogOK(newTestCase);
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
      queue,
      dontRunWithQueues,
    };
  },
});
</script>
