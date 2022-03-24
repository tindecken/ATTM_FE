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
      <q-btn outline label="New" color="secondary" class="q-mr-sm" style="width: 100px" @click="newTestEnv()" />
      <q-btn outline label="Properties" color="secondary" class="q-mr-sm" style="width: 100px" @click="propertiesTestEnv()" />
      <q-btn outline label="Clone" color="secondary" class="q-mr-sm" style="width: 100px" @click="cloneTestEnv()" />
      <q-btn outline label="Delete" color="negative" class="q-mr-sm" style="width: 100px" @click="deleteTestEnv()" />
    </div>
    <div class="row q-mb-sm">
      <q-table
        dense
        title="Test Environment"
        :rows="selectedTestEnv?.Nodes"
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
          <q-btn outline label="Discard" color="secondary" class="q-mr-sm" style="width: 100px" @click="discard()" />
          <q-btn outline label="Save" color="secondary" class="q-mr-sm" style="width: 100px" @click="saveTestEnv" />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer">
            <q-td key="no" :props="props">
              {{ props.row.rowIndex }}
            </q-td>
            <q-td key="category" :props="props" @click="globalStore.infoStatus.Info = props.row.Category">
              <q-input v-model="props.row.Category" dense borderless> </q-input>
            </q-td>
            <q-td key="name" :props="props" style="white-space: normal" @click="globalStore.infoStatus.Info = props.row.Name">
              <q-input v-model="props.row.Name" dense borderless> </q-input>
            </q-td>
            <q-td key="value" :props="props" @click="globalStore.infoStatus.Info = props.row.Value">
              <q-input v-model="props.row.Value" dense borderless> </q-input>
            </q-td>
            <q-td key="description" :props="props" @click="globalStore.infoStatus.Info = props.row.Description">
              <q-input v-model="props.row.Description" dense borderless> </q-input>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn size="sm" outline @click="deleteNode(props.row)">Delete</q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="row inline">
      <q-btn outline label="New node" color="secondary" class="q-mr-sm" style="width: 110px" @click="addNode()" />
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
import { ref, Ref, onBeforeMount, nextTick } from 'vue';
import { TestEnvInterface, TestEnvNodeInterface } from '../../../Models/TestEnv';
import { testEnvColumns } from '../../../components/tableColumns';
import { useQuasar } from 'quasar';
import { useGlobalStore } from '../../../pinia/globalStore';
import { useTestEnvironmentStore } from '../../../pinia/testEnvironmentStore';
import NewTestEnvDialog from '../../../components/Settings/TestEnvironments/Dialog/NewTestEnvDialog.vue';
import PropertiesTestEnvDialog from '../../../components/Settings/TestEnvironments/Dialog/PropertiesTestEnvDialog/PropertiesTestEnvDialog.vue';
import CloneTestEnvDialog from '../../../components/Settings/TestEnvironments/Dialog/CloneTestEnvDialog.vue';
import DeleteTestEnvDialog from '../../../components/Settings/TestEnvironments/Dialog/DeleteTestEnvDialog.vue';
import SaveTestEnvDialog from '../../../components/Settings/TestEnvironments/Dialog/SaveTestEnvDialog.vue';
import _ from 'lodash';

const globalStore = useGlobalStore();
const testEnvironmentStore = useTestEnvironmentStore();
const $q = useQuasar();
const testEnvFilter = ref('');
const initialPagination = {
  rowsPerPage: 50,
};
const testEnvs = testEnvironmentStore.testEnvs as TestEnvInterface[];
const selectedTestEnv = ref<TestEnvInterface | null>(testEnvs.length > 0 ? testEnvs[0] : null);
const visibleColumns: Ref<string[]> = ref(['no', 'category', 'name', 'value', 'description', 'delete']);
function onTestEnvChange(newTestEnv: TestEnvInterface) {
  selectedTestEnv.value = newTestEnv;
  selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
    ...envNode,
    rowIndex: i + 1,
  }));
}
onBeforeMount(async () => {
  try {
    await testEnvironmentStore.getTestEnvironments();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
  void nextTick();
  if (selectedTestEnv.value) {
    selectedTestEnv.value.Nodes = selectedTestEnv.value?.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
      ...envNode,
      rowIndex: i + 1,
    }));
  }
});
function deleteNode(testEnvNote: TestEnvNodeInterface) {
  const index = selectedTestEnv.value?.Nodes.findIndex(
    (envNode: TestEnvNodeInterface) => envNode.Name === testEnvNote.Name && envNode.Category === testEnvNote.Category
  ) as number;
  if (index > -1 && selectedTestEnv.value) {
    selectedTestEnv.value.Nodes.splice(index, 1);
    selectedTestEnv.value.Nodes = selectedTestEnv.value?.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
      ...envNode,
      rowIndex: i + 1,
    }));
  }
}
function addNode() {
  const newNode: TestEnvNodeInterface = {
    Name: '',
    Value: '',
    Description: '',
    Category: '',
  };
  if (selectedTestEnv.value) {
    selectedTestEnv.value.Nodes.push(newNode);
    selectedTestEnv.value.Nodes = selectedTestEnv.value?.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
      ...envNode,
      rowIndex: i + 1,
    }));
  }
}
function newTestEnv() {
  $q.dialog({
    component: NewTestEnvDialog,
    componentProps: {},
  })
    .onOk(async (testEnv: TestEnvInterface) => {
      await testEnvironmentStore.getTestEnvironments();
      testEnvs.push(testEnv);
      selectedTestEnv.value = testEnv;
      selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
        ...envNode,
        rowIndex: i + 1,
      }));
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}
function propertiesTestEnv() {
  console.log('selectedTestEnv.value', selectedTestEnv.value);
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    });
    return;
  }
  $q.dialog({
    component: PropertiesTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  })
    .onOk(async (testEnv: TestEnvInterface) => {
      await testEnvironmentStore.getTestEnvironments();
      const foundIndex = testEnvs.findIndex((te: TestEnvInterface) => te.Id === testEnv.Id);
      if (foundIndex === -1) {
        $q.notify({
          type: 'warning',
          message: `Something went wrong, can't find test environment ${testEnv.Name} with Id: ${testEnv.Id}`,
        });
        return;
      }
      testEnvs[foundIndex] = testEnv;
      selectedTestEnv.value = testEnv;
      selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
        ...envNode,
        rowIndex: i + 1,
      }));
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}
function cloneTestEnv() {
  console.log('selectedTestEnv.value', selectedTestEnv.value);
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    });
    return;
  }
  $q.dialog({
    component: CloneTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  })
    .onOk(async (newTestEnv: TestEnvInterface) => {
      await testEnvironmentStore.getTestEnvironments();
      testEnvs.push(newTestEnv);
      selectedTestEnv.value = newTestEnv;
      selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
        ...envNode,
        rowIndex: i + 1,
      }));
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}
function deleteTestEnv() {
  console.log('selectedTestEnv.value', selectedTestEnv.value);
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    });
    return;
  }
  $q.dialog({
    component: DeleteTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  })
    .onOk(async (testEnv: TestEnvInterface) => {
      await testEnvironmentStore.getTestEnvironments();
      const foundIndex = testEnvs.findIndex((te: TestEnvInterface) => te.Id === testEnv.Id);
      if (foundIndex === -1) {
        $q.notify({
          type: 'warning',
          message: `Something went wrong, can't find test environment ${testEnv.Name} with Id: ${testEnv.Id}`,
        });
        return;
      }
      console.log('foundIndex', foundIndex);
      console.log('testEnvs before', testEnvs.length);
      _.remove(testEnvs, (te: TestEnvInterface) => te.Id === testEnv.Id);
      console.log('testEnvs after', testEnvs.length);

      if (testEnvs.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        selectedTestEnv.value = testEnvs[0];
        selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
          ...envNode,
          rowIndex: i + 1,
        }));
      } else {
        selectedTestEnv.value = null;
      }
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}
function saveTestEnv() {
  if (selectedTestEnv.value === null || selectedTestEnv.value === undefined) {
    $q.notify({
      type: 'warning',
      message: 'Please select a test environment',
    });
    return;
  }
  $q.dialog({
    component: SaveTestEnvDialog,
    componentProps: {
      TestEnv: selectedTestEnv.value,
    },
  })
    .onOk(async (testEnv: TestEnvInterface) => {
      await testEnvironmentStore.getTestEnvironments();
      const foundIndex = testEnvs.findIndex((te: TestEnvInterface) => te.Id === testEnv.Id);
      if (foundIndex === -1) {
        $q.notify({
          type: 'warning',
          message: `Something went wrong, can't find test environment ${testEnv.Name} with Id: ${testEnv.Id}`,
        });
        return;
      }
      testEnvs[foundIndex] = testEnv;
      selectedTestEnv.value = testEnv;
      selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
        ...envNode,
        rowIndex: i + 1,
      }));
    })
    .onCancel(() => {
      console.log('Cancel');
    })
    .onDismiss(() => {
      console.log('Called on OK or Cancel');
    });
}

async function discard() {
  const testEnv = await testEnvironmentStore.getTestEnv(selectedTestEnv.value?.Id as string);
  const foundIndex = testEnvs.findIndex((te: TestEnvInterface) => te.Id === selectedTestEnv.value?.Id);
  testEnvs[foundIndex] = testEnv;
  selectedTestEnv.value = testEnv;
  if (selectedTestEnv.value)
    selectedTestEnv.value.Nodes = selectedTestEnv.value.Nodes.map((envNode: TestEnvNodeInterface, i: number) => ({
      ...envNode,
      rowIndex: i + 1,
    }));
}
</script>
