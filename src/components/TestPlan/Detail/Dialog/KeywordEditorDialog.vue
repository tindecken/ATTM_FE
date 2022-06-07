<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 900px; min-height: 100px !important; min-width: 800px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">
          Edit Test Step: {{ testStep.Keyword?.Name }}
        </div>
        <q-btn
          class="self-center"
          dense
          flat
          icon="close"
          @click="onDialogHide"
        >
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-card>
          <q-card-section>
            <q-input
              dense
              outlined
              v-model="testStep.Description"
              label="Description"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-table
              dense
              title="Parameters"
              :rows="testStep.Params"
              :columns="paramColumns"
              row-key="name"
              :hide-pagination="true"
              separator="cell"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="no" :props="props" class="q-c-input">
                    {{ props.row.rowIndex }}
                  </q-td>
                  <q-td key="name" :props="props" class="q-pl-sm">
                    {{ props.row.Name }}
                  </q-td>
                  <q-td
                    key="value"
                    :props="props"
                    class="q-c-input"
                    @click="footerInfo = props.row.Value"
                  >
                    <q-input
                      :class="valueStyle(props.row)"
                      v-model="props.row.Value"
                      dense
                      borderless
                      :readonly="props.row.TestNodePath !== ''"
                    />
                  </q-td>
                  <q-td key="testBed" :props="props" class="q-c-input">
                    <q-btn
                      outline
                      color="primary"
                      label="Use"
                      @click="useTestEnv(props.row)"
                    ></q-btn>
                    <q-btn
                      outline
                      color="primary"
                      label="UnUse"
                      class="q-ml-sm"
                      @click="unUseTestEnv(props.row)"
                    ></q-btn>
                  </q-td>
                  <q-td
                    key="description"
                    :props="props"
                    class="q-pl-sm"
                    @click="footerInfo = props.row.Description"
                  >
                    {{ props.row.Description }}
                  </q-td>
                  <q-td
                    key="exampleValue"
                    :props="props"
                    class="q-pl-sm"
                    @click="footerInfo = props.row.ExampleValue"
                  >
                    {{ props.row.ExampleValue }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
          <q-card-section class="row reverse">
            <q-btn
              outline
              color="primary"
              label="Cancel"
              class="q-ml-sm"
              @click="onDialogHide"
            ></q-btn>
            <q-btn
              outline
              color="primary"
              label="OK"
              @click="okClick()"
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-page-container>
      <q-footer
        bordered
        class="bg-secondary text-white"
        style="height: 24px; width: -webkit-fill-available"
      >
        <div class="row inline justify-between items-center">
          <span @click="copy(footerInfo)" class="q-pl-sm">{{
            footerInfo
          }}</span>
        </div>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, PropType, Ref } from 'vue';
import _ from 'lodash';
import { useGlobalStore } from '../../../../pinia/globalStore';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { TestStepInterface } from '../../../../Models/TestStep';
import { TestCaseInterface } from '../../../../Models/TestCase';
import { TestParamInterface } from '../../../../Models/TestParam';
import { TestEnvNodeInterface } from '../../../../Models/TestEnv';
import { useClipboard } from '@vueuse/core';
import TestEnvironmentDialog from './TestEnvironmentDialog.vue';
import { getValueType } from '../Utils/utils';

export default defineComponent({
  name: 'KeywordEditorDialog',
  props: {
    TestStep: {
      type: Object as PropType<TestStepInterface>,
      required: true,
    },
    TestCase: {
      type: Object as PropType<TestCaseInterface>,
      required: true,
    },
  },
  components: {},
  setup(props) {
    const globalStore = useGlobalStore();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const { copy } = useClipboard();
    const $q = useQuasar();
    const paramColumns = [
      {
        name: 'no',
        required: true,
        label: 'No',
        align: 'left',
        field: 'rowIndex',
        sortable: false,
        style: 'max-width: 40px',
        headerStyle: 'max-width: 40px',
      },
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: 'Name',
        format: (val: any) => `${val}`,
        sortable: false,
      },
      {
        name: 'value',
        align: 'left',
        label: 'Value',
        field: 'Value',
        sortable: false,
        style: 'min-width: 200px',
        headerStyle: 'min-width: 200px',
      },
      {
        name: 'testBed',
        align: 'left',
        label: 'Test Environment',
        field: 'TestBed',
        sortable: false,
      },
      {
        name: 'description',
        align: 'left',
        label: 'Description',
        field: 'Description',
        sortable: false,
        classes: 'ellipsis',
      },
      {
        name: 'exampleValue',
        align: 'left',
        label: 'Example',
        field: 'ExampleValue',
        sortable: false,
        classes: 'ellipsis',
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => globalStore.darkTheme);
    const testCase: Ref<TestCaseInterface> = ref(props.TestCase);
    const testStep: Ref<TestStepInterface> = ref(props.TestStep);
    const footerInfo = ref('');
    onMounted(() => {
      testCase.value = _.cloneDeep(props.TestCase);
      testStep.value = _.cloneDeep(props.TestStep);
      testStep.value.Params = testStep.value.Params.map(
        (pr: TestParamInterface, i: number) => ({ ...pr, rowIndex: i + 1 })
      );
    });

    function valueStyle(pr: TestParamInterface) {
      const prIndex = testStep.value.Params.findIndex(
        (p: TestParamInterface) => p.Name === pr.Name
      );
      if (prIndex === -1) return '';
      return getValueType(testStep.value.Params[prIndex]);
    }

    // other methods that we used in our vue html template;
    // these are part of our example (so not required)
    function onOKClick() {
      // on OK, it is REQUIRED to
      // call onDialogOK (with optional payload)
      onDialogOK();
      // or with payload: onDialogOK({ ... })
      // ...and it will also hide the dialog automatically
    }

    function useTestEnv(pr: TestParamInterface) {
      $q.dialog({
        component: TestEnvironmentDialog,
      })
        .onOk((testEnvNode: TestEnvNodeInterface) => {
          // TODO: handle ok
          if (testEnvNode) {
            const prIndex = testStep.value.Params.findIndex(
              (p: TestParamInterface) => p.Name === pr.Name
            );
            if (prIndex === -1) return;
            testStep.value.Params[prIndex].Value = testEnvNode.Value;
            testStep.value.Params[
              prIndex
            ].TestNodePath = `${testEnvNode.Category}/${testEnvNode.Name}`;
          }
        })
        .onCancel(() => {
          // TODO
        })
        .onDismiss(() => {
          // TODO
        });
    }

    function okClick() {
      console.log('Description', testStep.value.Description);
      onDialogOK(testStep.value);
      onDialogHide();
    }

    function unUseTestEnv(pr: TestParamInterface) {
      console.log('row', pr);
      const prIndex = testStep.value.Params.findIndex(
        (p: TestParamInterface) => p.Name === pr.Name
      );
      if (prIndex === -1) return;
      testStep.value.Params[prIndex].Value = pr.Value;
      testStep.value.Params[prIndex].TestNodePath = '';
    }

    return {
      okClick,
      copy,
      footerInfo,
      useTestEnv,
      unUseTestEnv,
      testCase,
      testStep,
      onOKClick,
      paramColumns,
      onDialogHide,
      dialogRef,
      isDark,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      valueStyle,
    };
  },
});
</script>
<style scoped lang="scss">
:deep td.q-c-input {
  padding-right: 1px;
  padding-left: 1px;
  padding-top: 0px;
  padding-bottom: 0px;
}

:deep td.q-c-input .q-field__native {
  padding-right: 0px;
  padding-left: 5px;
  padding-top: 1px;
  padding-bottom: 1px;
}
:deep(.testBed) {
  background-color: $teal-2;
  background-clip: content-box;
}
:deep(.testBuffer) {
  background-color: $green-2;
  background-clip: content-box;
}
:deep(.testBedDark) {
  background-color: $teal-10;
  background-clip: content-box;
}
:deep(.testBufferDark) {
  background-color: $green-10;
  background-clip: content-box;
}
</style>
