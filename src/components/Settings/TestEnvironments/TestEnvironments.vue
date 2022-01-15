<template>
  <div>
    <div class="row no-wrap q-mb-md">
        <q-select
          dense
          outlined
          :model-value="selectedTestEnv"
          :options="testEnvs"
          label="Environments"
          option-label="Name"
          @update:model-value="onTestEnvChange($event)"
          class="col-2 q-mr-md"
        />
        <q-btn outline label="New" color="secondary" class="q-mr-sm" style="width: 100px;"/>
        <q-btn outline label="Clone" color="secondary" class="q-mr-sm" style="width: 100px;"/>
        <q-btn outline label="Delete" color="secondary" class="q-mr-sm" style="width: 100px;"/>
    </div>
    <div class="row q-mb-sm">
      <q-table
        dense
        title="Test Environment"
        :rows="testEnvTableDatas"
        :columns="testEnvColumns"
        row-key="name"
        :filter="testEnvFilter"
        separator="cell"
        :pagination="initialPagination"
        :visible-columns="visibleColumns"
        class="col-10"
      >
        <template v-slot:top>
          <q-input borderless dense debounce="300" color="primary" v-model="testEnvFilter" label="Filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px;"/>
          <q-btn outline label="Save" color="secondary" class="q-mr-sm" style="width: 100px;"/>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer">
            <q-td key="no" :props="props">
              {{ props.row.rowIndex }}
            </q-td>
            <q-td
              key="category"
              :props="props"
              @click="footerInfo = props.row.Category"
            >
              {{ props.row.Category }}
            </q-td>
            <q-td
              key="name"
              :props="props"
              style="white-space: normal"
              @click="footerInfo = props.row.Name"
            >
              <div>{{ props.row.Name }}</div>
            </q-td>
            <q-td
              key="value"
              :props="props"
              @click="footerInfo = props.row.Value"
            >
              <q-tooltip v-if="props.row.Value !== ''">
                {{ props.row.Value }}
              </q-tooltip>
              {{ props.row.Value }}
            </q-td>
            <q-td
              key="description"
              :props="props"
              @click="footerInfo = props.row.Description"
            >
              <q-tooltip v-if="props.row.Description !== ''">
                {{ props.row.Description }}
              </q-tooltip>
              {{ props.row.Description }}
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn size="sm" outline @click="deleteRow(props.row)">Delete</q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="row inline">
      <q-btn outline label="New node" color="secondary" class="q-mr-sm" style="width: 110px;"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import {
  ref, Ref, onBeforeMount, nextTick, computed,
} from 'vue';
import { useStore } from 'vuex';
import { TestEnvInterface } from 'src/Models/TestEnv';
import { TestEnvCategoryInterface } from 'src/Models/TestEnvCategory';
import { TestEnvNodeInterface } from 'src/Models/TestEnvNode';
import { TestEnvFlatNodeInterface } from 'src/Models/TestEnvFlatNode';
import { testEnvColumns } from 'src/components/tableColumns';
import { useQuasar } from 'quasar'
// import { useClipboard } from '@vueuse/core'

// const { copy } = useClipboard()
const testEnvTableDatas: Ref<TestEnvFlatNodeInterface[]> = ref([])
const footerInfo = ref('')
const $q = useQuasar()
const $store = useStore();
// const filter = ref('');
const testEnvFilter = ref('');
const initialPagination = {
  rowsPerPage: 50,
};
const selectedTestEnv = computed(() => $store.getters['testenvironment/selectedTestEnv'] as TestEnvInterface)
const visibleColumns: Ref<string[]> = ref(['no', 'category', 'name', 'value', 'description', 'delete']);
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
function deleteRow(flatNode: TestEnvFlatNodeInterface) {
  // TODO
}
</script>
