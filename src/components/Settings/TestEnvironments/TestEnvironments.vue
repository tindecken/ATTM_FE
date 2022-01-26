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
        <q-btn outline label="New" color="secondary" class="q-mr-sm" style="width: 100px;" @click="newTestEnv()"/>
        <q-btn outline label="Rename" color="secondary" class="q-mr-sm" style="width: 100px;" @click="renameTestEnv()"/>
        <q-btn outline label="Clone" color="secondary" class="q-mr-sm" style="width: 100px;" @click="cloneTestEnv()"/>
        <q-btn outline label="Delete" color="negative" class="q-mr-sm" style="width: 100px;" @click="deleteTestEnv()"/>
    </div>
    <div class="row q-mb-sm">
      <q-table
        dense
        title="Test Environment"
        :rows="selectedTestEnv.Nodes"
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
          <q-btn outline label="Save" color="secondary" class="q-mr-sm" style="width: 100px;" @click="saveTestEnv"/>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer">
            <q-td key="no" :props="props">
              {{ props.row.rowIndex }}
            </q-td>
            <q-td
              key="category"
              :props="props"
              @click="$store.commit('global/setInfoStatus', { Info: props.row.Category })"
            >
              <q-input
                v-model="props.row.Category"
                dense
                borderless
              >
              </q-input>
            </q-td>
            <q-td
              key="name"
              :props="props"
              style="white-space: normal"
              @click="$store.commit('global/setInfoStatus', { Info: props.row.Name })"
            >
              <q-input
                v-model="props.row.Name"
                dense
                borderless
              >
              </q-input>
            </q-td>
            <q-td
              key="value"
              :props="props"
              @click="$store.commit('global/setInfoStatus', { Info: props.row.Value })"
            >
              <q-input
                v-model="props.row.Value"
                dense
                borderless
              >
              </q-input>
            </q-td>
            <q-td
              key="description"
              :props="props"
              @click="$store.commit('global/setInfoStatus', { Info: props.row.Description })"
            >
              <q-input
                v-model="props.row.Description"
                dense
                borderless
              >
              </q-input>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn size="sm" outline @click="deleteNode(props.row)">Delete</q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="row inline">
      <q-btn outline label="New node" color="secondary" class="q-mr-sm" style="width: 110px;" @click="addNode()"/>
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
  ref, Ref, onBeforeMount, nextTick,
} from 'vue';
import { useStore } from 'vuex';
import { TestEnvInterface, TestEnvNodeInterface } from 'src/Models/TestEnv';
import { testEnvColumns } from 'src/components/tableColumns';
import { useQuasar } from 'quasar'
import NewTestEnvDialog from 'src/components/Settings/TestEnvironments/Dialog/NewTestEnvDialog.vue';
import RenameTestEnvDialog from 'src/components/Settings/TestEnvironments/Dialog/RenameTestEnvDialog.vue';
import CloneTestEnvDialog from 'src/components/Settings/TestEnvironments/Dialog/CloneTestEnvDialog.vue';
import DeleteTestEnvDialog from 'src/components/Settings/TestEnvironments/Dialog/DeleteTestEnvDialog.vue';
import SaveTestEnvDialog from 'src/components/Settings/TestEnvironments/Dialog/SaveTestEnvDialog.vue';

const $q = useQuasar()
const $store = useStore();
const testEnvFilter = ref('');
const initialPagination = {
  rowsPerPage: 50,
};
const testEnvs = $store.getters['testenvironment/testEnvs'] as TestEnvInterface[]
const selectedTestEnv = ref<TestEnvInterface>(testEnvs[0])
const visibleColumns: Ref<string[]> = ref(['no', 'category', 'name', 'value', 'description', 'delete']);
function onTestEnvChange(newTestEnv: TestEnvInterface) {
  selectedTestEnv.value = newTestEnv
  selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({ ...envNode, rowIndex: i + 1 }))
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
  void nextTick()
  selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({ ...envNode, rowIndex: i + 1 }))
})
function deleteNode(testEnvNote: TestEnvNodeInterface) {
  const index = selectedTestEnv.value.Nodes.findIndex((envNode: TestEnvNodeInterface) => envNode.Name === testEnvNote.Name && envNode.Category === testEnvNote.Category)
  if (index > -1) {
    selectedTestEnv.value.Nodes.splice(index, 1)
    selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({ ...envNode, rowIndex: i + 1 }))
  }
}
function addNode() {
  const newNode: TestEnvNodeInterface = {
    Name: '',
    Value: '',
    Description: '',
    Category: '',
  }
  selectedTestEnv.value.Nodes.push(newNode)
  selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({ ...envNode, rowIndex: i + 1 }))
}
function newTestEnv() {
  $q.dialog({
    component: NewTestEnvDialog,
    componentProps: {
    },
  }).onOk((newName: string) => {
    console.log('newName', newName)
  }).onCancel(() => {
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
}
function renameTestEnv() {
  console.log('selectedTestEnv.value', selectedTestEnv.value)
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    })
    return
  }
  $q.dialog({
    component: RenameTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  }).onOk((newName: string) => {
    console.log('newName', newName)
  }).onCancel(() => {
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
}
function cloneTestEnv() {
  console.log('selectedTestEnv.value', selectedTestEnv.value)
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    })
    return
  }
  $q.dialog({
    component: CloneTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  }).onOk(async (newTestEnv: TestEnvInterface) => {
    await $store.dispatch('testenvironment/getTestEnvironments');
    testEnvs.push(newTestEnv)
    selectedTestEnv.value = newTestEnv
    selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({ ...envNode, rowIndex: i + 1 }))
  }).onCancel(() => {
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
}
function deleteTestEnv() {
  console.log('selectedTestEnv.value', selectedTestEnv.value)
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    })
    return
  }
  $q.dialog({
    component: DeleteTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  }).onOk(() => {
    console.log('Deleting')
  }).onCancel(() => {
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
}
function saveTestEnv() {
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    })
    return
  }
  $q.dialog({
    component: SaveTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  }).onOk(() => {
    console.log('Saved')
  }).onCancel(() => {
    console.log('Cancel')
  }).onDismiss(() => {
    console.log('Called on OK or Cancel')
  })
}
</script>
