<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important; min-width: 800px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Select Test Environment</div>
        <q-btn dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <div class="row q-col-gutter-xs q-pa-xs">
          <div class="col">
            <q-input dense outlined v-model="testEnvFilter" label="Filter" />
          </div>
          <div class="col">
            <q-select
              dense
              outlined
              :model-value="selectedTestEnv"
              :options="testEnvs"
              label="Environments"
              option-label="Name"
              @update:model-value="onTestEnvChange($event)"
              :readonly="isReadonly"
            />
          </div>
        </div>
        <q-separator class="q-mb-sm q-mt-sm" />
        <div class="row">
          <div class="col q-pa-xs">
            <q-table
              dense
              title="Test Environment"
              :rows="testEnvTableDatas"
              :columns="testEnvColumns"
              row-key="name"
              :filter="testEnvFilter"
              separator="cell"
              :pagination="initialPagination"
              :hide-pagination="true"
            >
            <template v-slot:top>
              <div class="col-6 q-table__title">Test Environment</div>
            </template>
              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  class="cursor-pointer"
                  >
                  <q-td key="no" :props="props">
                    {{ props.row.rowIndex }}
                  </q-td>
                  <q-td key="category" :props="props" @click="footerInfo = props.row.Category">
                    {{ props.row.Category }}
                  </q-td>
                  <q-td key="name" :props="props" style="white-space: normal;" @click="footerInfo = props.row.Name">
                    <div>{{ props.row.Name }}</div>
                  </q-td>
                  <q-td key="value" :props="props" @click="footerInfo = props.row.Value">
                    <q-tooltip v-if="props.row.Value !== ''">
                      {{ props.row.Value }}
                    </q-tooltip>
                    {{ props.row.Value }}
                  </q-td>
                  <q-td key="description" :props="props"  @click="footerInfo = props.row.Description">
                    <q-tooltip v-if="props.row.Description !== ''">
                      {{ props.row.Description }}
                    </q-tooltip>
                    {{ props.row.Description }}
                  </q-td>
                  <q-td key="use" :props="props">
                    <q-btn size="sm" outline @click="use(props.row)">Use</q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-page-container>
      <q-footer bordered class="bg-secondary text-white"  style="height: 24px;width: -webkit-fill-available;">
        <div class="row inline justify-between items-center">
          <span @click="copy(footerInfo)" class="q-pl-sm">{{footerInfo}}</span>
        </div>
    </q-footer>
    </q-layout>
  </q-dialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent, nextTick, onBeforeMount, Ref, ref,
} from 'vue';
import { TestEnvInterface } from 'src/Models/TestEnv';
import { TestEnvCategoryInterface } from 'src/Models/TestEnvCategory';
import { TestEnvNodeInterface } from 'src/Models/TestEnvNode';
import { TestEnvFlatNodeInterface } from 'src/Models/TestEnvFlatNode';
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'
import { useQuasar, useDialogPluginComponent } from 'quasar'

export default defineComponent({
  name: 'TestEnvironmentDialog',
  props: {},
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {
  },
  setup() {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const $store = useStore()
    const $q = useQuasar()
    const { copy } = useClipboard()
    const footerInfo = ref('')
    const testEnvTableDatas: Ref<TestEnvFlatNodeInterface[]> = ref([])
    const isReadonly: Ref<boolean> = ref(false);
    const initialPagination = {
      sortBy: 'startAt',
      descending: true,
      // page: 2,
      // rowsPerPage: 3,
      // rowsNumber: xx if getting data from a server
    }
    const testEnvFilter = ref('');
    const testEnvColumns = [
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
        name: 'category',
        required: true,
        label: 'Category',
        align: 'left',
        field: 'Category',
        format: (val: any) => `${val}`,
        sortable: false,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Name',
        field: 'Name',
        sortable: false,
        style: 'min-width: 100px',
        headerStyle: 'min-width: 100px',
      },
      {
        name: 'value',
        align: 'left',
        label: 'Value',
        field: 'Value',
        style: 'max-width: 100px',
        headerStyle: 'max-width: 100px',
        sortable: false,
        classes: 'ellipsis',
      },
      {
        name: 'description',
        align: 'left',
        label: 'Description',
        field: 'Description',
        sortable: false,
      },
      {
        name: 'use',
        align: 'left',
        label: '',
        field: 'use',
        sortable: false,
      },
    ]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => $store.getters['global/darkTheme'])
    const selectedTestEnv = computed(() => $store.getters['testenvironment/selectedTestEnv'] as TestEnvInterface)
    const testEnvs = $store.getters['testenvironment/testEnvs'] as TestEnvInterface[]
    function transformToFlatNode(testEnv: TestEnvInterface | null): TestEnvFlatNodeInterface[] {
      let flatNodes: TestEnvFlatNodeInterface[] = []
      if (testEnv && testEnv.Categories) {
        testEnv.Categories.forEach((category: TestEnvCategoryInterface) => {
          category.Nodes.forEach((node: TestEnvNodeInterface) => {
            const nodeEnv: TestEnvFlatNodeInterface = { ...node, Category: category.Name, CategoryDescription: category.Description };
            flatNodes.push(nodeEnv);
            flatNodes = flatNodes.map((value: TestEnvFlatNodeInterface, i: number) => ({ ...value, rowIndex: i + 1 }))
          })
        })
      }
      return flatNodes
    }
    onBeforeMount(async () => {
      try {
        await $store.dispatch('testenvironment/getTestEnvironments');
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
      // testEnvTableDatas
      testEnvTableDatas.value = transformToFlatNode(selectedTestEnv.value)
      void nextTick()
    })

    function onTestEnvChange(newValue: TestEnvInterface) {
      console.log(newValue)
      testEnvTableDatas.value = transformToFlatNode(newValue)
      $store.commit('testenvironment/setSelectedTestEnv', newValue)
    }

    // other methods that we used in our vue html template;
    // these are part of our example (so not required)
    function onOKClick() {
      // on OK, it is REQUIRED to
      // call onDialogOK (with optional payload)
      onDialogOK()
      // or with payload: onDialogOK({ ... })
      // ...and it will also hide the dialog automatically
    }

    function use(flatNode: TestEnvFlatNodeInterface) {
      onDialogOK(flatNode)
    }

    return {
      testEnvs,
      onOKClick,
      onDialogHide,
      testEnvColumns,
      onTestEnvChange,
      testEnvFilter,
      selectedTestEnv,
      dialogRef,
      isDark,
      isReadonly,
      testEnvTableDatas,
      use,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      footerInfo,
      copy,
      initialPagination,
    };
  },
});
</script>
<style scoped lang="scss">
:deep(.q-c-input) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
}
</style>
