<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 340px; min-height: 100px !important; min-width: 400px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">New Test Group</div>
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
            <div class="col-8 q-mr-sm">
              <q-input
                label="WorkItem"
                outlined
                dense
                v-model="workItem"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'WorkItem maximum is 50 chars']"
              />
            </div>
            <div class="col">
              <q-input
                label="Author"
                outlined
                dense
                v-model="author"
                @blur="validateForm()"
                :rules="[(val) => val.length < 50 || 'Author maximum is 50 chars']"
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
import { TestGroupInterface } from '../../../../Models/TestGroup';
import { TestSuiteInterface } from '../../../../Models/TestSuite';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar';
import { useUserStore } from '../../../../pinia/userStore';

export default defineComponent({
  name: 'NewTestGroupDialog',
  props: {
    TestSuite: {
      type: Object as PropType<TestSuiteInterface>,
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
    const isDark = computed(() => globalStore.darkTheme);
    const isFormValid = ref(false);
    const form = ref() as Ref<QForm>;
    // following method is REQUIRED
    // (don't change its name --> "show")
    function onOKClick() {
      const { TestSuite } = props;
      const newTestGroup: TestGroupInterface = {
        Id: '',
        CodeName: codeName.value.trim(),
        Name: name.value.trim(),
        Owner: author.value.trim(),
        TestCaseIds: [],
        Description: description.value.trim(),
        WorkItem: workItem.value.trim(),
        TestSuiteId: TestSuite.Id,
        CategoryId: TestSuite.CategoryId,
        children: [],
      };
      // context.emit('ok', newTestGroup);
      onDialogOK(newTestGroup);
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
