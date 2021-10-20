<template>
<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
  <q-layout
    :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
    style="max-height: 400px; min-height: 100px !important;"
  >
  <q-card>
        <q-bar>
          <div>Edit Test Step: {{testStep?.Keyword?.Name}}</div>
          <q-space />
          <q-btn dense flat icon="close" @click="onDialogHide">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <q-input dense outlined :modelValue="testStep?.Description" label="Description" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-table
          dense
          title="Parameters"
          :rows="testStep?.Params"
          :columns="paramColumns"
          row-key="name"
          :hide-pagination="true"
          separator="cell"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              >
              <q-td key="no" :props="props" class="q-c-input">
                {{ props.row.rowIndex }}
              </q-td>
              <q-td key="name" :props="props" class="q-c-input">
                {{ props.row.Name }}
              </q-td>
              <q-td key="value" :props="props" class="q-c-input">
                <q-input v-model="props.row.Value" dense borderless/>
              </q-td>
              <q-td key="testBed" :props="props" class="q-c-input">
                <q-btn outline color="primary" label="Use"></q-btn>
                <q-btn outline color="primary" label="UnUse" class="q-ml-sm"></q-btn>
              </q-td>
              <q-td key="description" :props="props" style="white-space: normal;" class="q-c-input">
                {{ props.row.Description }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
        </q-card-section>
        <q-card-section>
          <q-btn outline  color="primary" label="OK"></q-btn>
          <q-btn outline  color="primary" label="Cancel" class="q-ml-sm"></q-btn>
        </q-card-section>
      </q-card>
  </q-layout>
  </q-dialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent, onMounted, ref, PropType, Ref,
} from 'vue';
import _ from 'lodash'
import { useStore } from 'vuex'
import { useDialogPluginComponent } from 'quasar'
import { TestStepInterface } from 'src/Models/TestStep';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestParamInterface } from 'src/Models/TestParam';

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
  components: {
  },
  setup(props) {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const $store = useStore()
    // const $q = useQuasar()
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
        style: 'min-width: 100px',
        headerStyle: 'min-width: 100px',
      },
      {
        name: 'testBed',
        align: 'left',
        label: 'TestBed',
        field: 'TestBed',
        sortable: false,
      },
      {
        name: 'description',
        align: 'left',
        label: 'Description',
        field: 'Description',
        sortable: false,
      },
    ]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => $store.getters['global/darkTheme'])
    const testCase: Ref<TestCaseInterface | null> = ref(null)
    const testStep: Ref<TestStepInterface | null> = ref(null)
    onMounted(() => {
      testCase.value = _.cloneDeep(props.TestCase)
      testStep.value = _.cloneDeep(props.TestStep)
      testStep.value.Params = testStep.value.Params.map((pr: TestParamInterface, i: number) => ({ ...pr, rowIndex: i + 1 }))
    })

    // other methods that we used in our vue html template;
    // these are part of our example (so not required)
    function onOKClick() {
      // on OK, it is REQUIRED to
      // call onDialogOK (with optional payload)
      onDialogOK()
      // or with payload: onDialogOK({ ... })
      // ...and it will also hide the dialog automatically
    }
    return {
      testCase,
      testStep,
      onOKClick,
      paramColumns,
      onDialogHide,
      dialogRef,
      isDark,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
<style scoped lang="scss">
</style>
