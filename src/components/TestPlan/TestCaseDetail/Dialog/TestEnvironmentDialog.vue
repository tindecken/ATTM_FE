<template>
<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
  <q-layout
    :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
    style="max-height: 400px; min-height: 100px !important;"
  >
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col">
        <q-input dense outlined v-model="testEnvFilter" label="Filter" />
      </div>
      <div class="col">
        <q-select
          dense
          outlined
          v-model="selectedTestEnv"
          :options="filteredTestEnvs"
          label="Environments"
          option-label="Name"
          @filter="filterTestEnv"
          @filter-abort="abortFilterTestEnv"
          @input="val => { onTestEnvChange() }"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :readonly="isReadonly"
        />
      </div>
      <div class="col">
        <q-btn outline @click="enableEdit()">Enable Edit</q-btn>
      </div>
      <div class="col">
        <q-btn outline @click="applyTestEnv()">Apply</q-btn>
      </div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <q-table
          dense
          title="Test Environment"
          :rows="testEnvTableDatas"
          :columns="testEnvColumns"
          row-key="name"
          :hide-pagination="true"
          :filter="testEnvFilter"
          separator="cell"
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
              <q-td key="category" :props="props">
                {{ props.row.Category }}
              </q-td>
              <q-td key="name" :props="props" style="white-space: normal;">
                <div>{{ props.row.Name }}</div>
              </q-td>
              <q-td key="value" :props="props">
                {{ props.row.Value }}
              </q-td>
              <q-td key="description" :props="props">
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
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
    </div>
  </div>
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
import { QDialog, useQuasar } from 'quasar'

export default defineComponent({
  name: 'TestEnvironmentDialog',
  props: {},
  components: {
  },
  setup(props, context) {
    const $store = useStore()
    const $q = useQuasar()
    const testEnvTableDatas: Ref<TestEnvFlatNodeInterface[]> = ref([])
    const dialogRef = ref(QDialog);
    const isReadonly: Ref<boolean> = ref(true);
    const testEnvFilter = ref('');
    const selectedTestEnv: Ref<TestEnvInterface | null> = ref(null);
    const filteredTestEnvs: Ref<TestEnvInterface[]> = ref([]);
    const testEnvs: Ref<TestEnvInterface[]> = ref([]);
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
        sortable: false,
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
      testEnvs.value = $store.getters['testenvironment/testEnvs'] as TestEnvInterface[]
      selectedTestEnv.value = $store.getters['testenvironment/selectedTestEnv'] as TestEnvInterface

      // testEnvTableDatas
      testEnvTableDatas.value = transformToFlatNode(selectedTestEnv.value)
      filteredTestEnvs.value = testEnvs.value
      void nextTick()
    })

    function onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      context.emit('cancel');
    }

    function onTestEnvChange() {
      testEnvTableDatas.value = transformToFlatNode(selectedTestEnv.value)
    }
    function filterTestEnv(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              filteredTestEnvs.value = testEnvs.value;
            } else {
              const needle = val.toLowerCase()
              filteredTestEnvs.value = testEnvs.value.filter((testEnv: TestEnvInterface) => testEnv.Name.toLowerCase().indexOf(needle) > -1)
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (refQ: any) => {
            if (val !== '' && refQ.options.length > 0) {
              refQ.setOptionIndex(-1) // reset optionIndex in case there is something selected
              // eslint-disable-next-line max-len
              refQ.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          },
        )
      }, 300)
    }

    function abortFilterTestEnv() {
      // TODO
    }
    function show() {
      dialogRef.value.show();
    }

    // following method is REQUIRED
    // (don't change its name --> "hide")
    function hide() {
      dialogRef.value.hide();
    }

    function enableEdit() {
      isReadonly.value = false
    }

    function applyTestEnv() {
      if (selectedTestEnv.value) $store.commit('testenvironment/setSelectedTestEnv', selectedTestEnv.value)
    }

    function use(flatNode: TestEnvFlatNodeInterface) {
      context.emit('ok', flatNode)
      hide()
    }

    return {
      testEnvColumns,
      onTestEnvChange,
      onDialogHide,
      testEnvFilter,
      selectedTestEnv,
      filteredTestEnvs,
      filterTestEnv,
      abortFilterTestEnv,
      dialogRef,
      show,
      hide,
      isDark,
      enableEdit,
      applyTestEnv,
      isReadonly,
      testEnvTableDatas,
      use,
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
