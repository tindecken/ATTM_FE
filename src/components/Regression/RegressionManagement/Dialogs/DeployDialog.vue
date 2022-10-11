<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 300px; min-height: 100px !important; min-width: 750px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">Select test clients to deploy</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="q-pa-sm">
        <q-table
          :filter="filter"
          dense
          title="Clients"
          :rows="testClients"
          :columns="clientColumns"
          :visible-columns="visibleColumns"
          row-key="Id"
          :selected-rows-label="getSelectedString"
          selection="multiple"
          v-model:selected="selectedClients"
          no-data-label="No test client"
          :pagination="initialPagination"
          separator="cell"
          class="q-mt-sm"
        >
          <template v-slot:top>
            <q-input dense debounce="300" v-model="filter" placeholder="Search" class="q-mr-md">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
        </q-table>
        <div class="q-mt-sm">
          <q-btn outline color="primary" label="Build - Deploy - Configure Runner" class="q-mr-sm" @click="build_deploy_configure()">
            <q-tooltip style="white-space: pre; font-size: small" class="bg-amber-1 text-black">
              Get latest code <br />
              Build Project <br />
              Copy build to test client<br />
              Update configuration file for test client
            </q-tooltip>
          </q-btn>
          <q-btn outline color="primary" label="Deploy - Configure Runner" class="q-mr-sm" @click="deploy_configure()">
            <q-tooltip style="white-space: pre; font-size: small" class="bg-amber-1 text-black">
              Copy build to test client<br />
              Update configuration file for test client
            </q-tooltip>
          </q-btn>
          <q-btn outline color="primary" label="Configure Runner" @click="configure()">
            <q-tooltip style="white-space: pre; font-size: small" class="bg-amber-1 text-black">Update configuration file for test client </q-tooltip>
          </q-btn>
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, Ref, onBeforeMount, computed } from 'vue';
import { TestClientInterface } from '../../../../Models/TestClient';
import { clientColumns } from '../../../../components/tableColumns';
import { useQuasar, useDialogPluginComponent, uid } from 'quasar';
import { useTestClientStore } from '../../../../pinia/testClientStore';
import { useGlobalStore } from '../../../../pinia/globalStore';
import _ from 'lodash';
import { RegressionInterface } from '../../../../Models/Regression';

const testClientStore = useTestClientStore();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.darkTheme);
const filter = ref('');
const $q = useQuasar();
const initialPagination = {
  rowsPerPage: 15,
};
const testClients: Ref<TestClientInterface[]> = ref(testClientStore?.testClients);
const selectedClients: Ref<TestClientInterface[]> = ref([]);

const props = defineProps<{
  Regression: RegressionInterface;
}>();

const emits = defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

onBeforeMount(async () => {
  try {
    await testClientStore.getTestClients();
    testClients.value = testClientStore.testClients;
    testClients.value = testClients.value.map((tc: TestClientInterface, i: number) => ({
      ...tc,
      rowIndex: i + 1,
    }));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
});
const visibleColumns = ref(['no', 'name', 'ipAddress', 'type', 'regressionFolder', 'runnerFolder']);
function getSelectedString() {
  return selectedClients.value.length === 0
    ? ''
    : `${selectedClients.value.length} record${selectedClients.value.length > 1 ? 's' : ''} selected of ${testClients.value.length}`;
}
async function build_deploy_configure() {
  // TODO
}
async function deploy_configure() {
  // TODO
}
async function configure() {
  // TODO
}
</script>

<style scoped lang="scss">
:deep(td.q-td) {
  padding: 0px 2px !important;
}
:deep(input.q-field__native) {
  padding: 0px;
}
:deep(th.text-left) {
  padding-left: 8px !important;
}
</style>
