<template>
  <div>
    <q-table
      :filter="filter"
      dense
      :rows="regressions"
      :columns="regressionColumns"
      :visible-columns="visibleColumns"
      row-key="Id"
      no-data-label="No regression"
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
        <div v-if="$q.screen.gt.xs" class="col">
          <q-toggle
            keep-color
            color="secondary"
            dense
            :model-value="isShowUnOfficial"
            @update:model-value="toggleShowOfficial()"
            val="isOfficial"
            label="Show UnOfficical Releases"
          />
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="no" :props="props"> {{ props.row.rowIndex }}</q-td>
          <q-td key="name" :props="props" @click="globalStore.infoStatus.Info = props.row.Name">
            {{ props.row.Name }}
          </q-td>
          <q-td key="build" :props="props" @click="globalStore.infoStatus.Info = props.row.Build">
            {{ props.row.Build }}
          </q-td>
          <q-td key="description" :props="props" class="ellipsis" @click="globalStore.infoStatus.Info = props.row.Description">
            {{ props.row.Description }}
          </q-td>
          <q-td key="isOfficial" :props="props">
            {{ props.row.IsOfficial }}
          </q-td>
          <q-td key="startDate" :props="props">
            {{ date.formatDate(props.row.StartDate, 'YYYY/MM/DD') }}
          </q-td>
          <q-td key="endDate" :props="props">
            {{ date.formatDate(props.row.EndDate, 'YYYY/MM/DD') }}
          </q-td>
          <q-td key="createdDate" :props="props">
            <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.CreatedDate">
              {{ timeAgo }}
            </UseTimeAgo>
          </q-td>
          <q-td key="createdBy" :props="props">
            {{ props.row.CreatedBy }}
          </q-td>
          <q-td key="lastUpdatedDate" :props="props">
            <div v-if="date.formatDate(props.row.LastUpdatedDate, 'YYYY') !== '1'">
              <UseTimeAgo v-slot="{ timeAgo }" :time="props.row.LastUpdatedDate">
                {{ timeAgo }}
              </UseTimeAgo>
            </div>
          </q-td>
          <q-td key="lastUpdatedBy" :props="props">
            {{ props.row.LastUpdatedBy }}
          </q-td>
          <q-td key="totalTestCase" :props="props">
            {{ props.row.RegressionTestIds.length }}
          </q-td>
          <q-td key="edit" :props="props">
            <q-btn size="sm" color="secondary" class="q-mr-sm" outline @click="editRegression(props.row)">Edit</q-btn>
            <q-btn size="sm" color="secondary" class="q-mr-sm" outline @click="deployRegression(props.row)">Deploy</q-btn>
            <q-btn size="sm" color="negative" outline @click="deleteRegression(props.row)">Delete</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';
import { regressionColumns } from '../../tableColumns';
import { useQuasar, date } from 'quasar';
import { useTitle } from '@vueuse/core';
import { useRegressionStore } from '../../../pinia/regressionStore';
import { useGlobalStore } from '../../../pinia/globalStore';
import { RegressionInterface } from '../../../Models/Regression';
import { UseTimeAgo } from '@vueuse/components';
import EditRegressionDialog from './Dialogs/EditRegressionDialog.vue';
import DeployDialog from './Dialogs/DeployDialog.vue';
import DeleteRegressionDialog from './Dialogs/DeleteRegressionDialog.vue';
import { DeleteRegressionDataInterface } from '../../../Models/Entities/DeleteRegressionData';

const regressionStore = useRegressionStore();
const globalStore = useGlobalStore();
const filter = ref('');
const $q = useQuasar();
const initialPagination = {
  rowsPerPage: 15,
};
const isShowUnOfficial = ref(true);
const regressions: Ref<RegressionInterface[]> = ref([]);
useTitle('Regression Management');
onBeforeMount(() => {
  getRegressions();
});
async function getRegressions() {
  regressionStore
    .getRegressions()
    .then(() => {
      regressions.value = regressionStore.regressions;
      if (!isShowUnOfficial.value) {
        regressions.value = regressions.value.filter((regression) => regression.IsOfficial === true);
      }
      regressions.value = regressions.value.map((rg: RegressionInterface, i: number) => ({
        ...rg,
        rowIndex: i + 1,
      }));
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: `${error}`,
      });
    });
}
function toggleShowOfficial() {
  isShowUnOfficial.value = !isShowUnOfficial.value;
  if (!isShowUnOfficial.value) {
    regressions.value = regressionStore.regressions.filter((rg: RegressionInterface) => rg.IsOfficial);
  } else {
    regressions.value = regressionStore.regressions;
  }
  regressions.value = regressions.value.map((rg: RegressionInterface, i: number) => ({
    ...rg,
    rowIndex: i + 1,
  }));
}
function editRegression(regression: RegressionInterface) {
  $q.dialog({
    component: EditRegressionDialog,
    componentProps: {
      Regression: regression,
    },
  })
    .onOk(async (updatedRegression: RegressionInterface) => {
      regressionStore
        .updateRegression(updatedRegression)
        .then(() => {
          $q.notify({
            type: 'positive',
            message: 'Update regression success!',
          });
          // update selectedRegression if any
          if (regressionStore.selectedRegression?.Id === updatedRegression.Id) {
            regressionStore.selectedRegression = updatedRegression;
          }
          getRegressions();
        })
        .catch((error) => {
          $q.notify({
            type: 'negative',
            message: `${error.message}`,
          });
        });
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function deployRegression(regression: RegressionInterface) {
  $q.dialog({
    component: DeployDialog,
    componentProps: {
      Regression: regression,
    },
  })
    .onOk(async (updatedRegression: RegressionInterface) => {
      // TODO
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function deleteRegression(regression: RegressionInterface) {
  $q.dialog({
    component: DeleteRegressionDialog,
    componentProps: {
      Regression: regression,
    },
  })
    .onOk(async (deleteRegData: DeleteRegressionDataInterface) => {
      regressionStore
        .deleteRegression(deleteRegData)
        .then(() => {
          getRegressions();
          $q.notify({
            type: 'positive',
            message: 'Delete Regression successfully !',
          });
        })
        .catch((error) => {
          $q.notify({
            type: 'negative',
            message: `${error}`,
          });
        });
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
const visibleColumns = ref([
  'no',
  'name',
  'build',
  'description',
  'isOfficial',
  'startDate',
  'endDate',
  'createdDate',
  'createdBy',
  'lastUpdatedDate',
  'lastUpdatedBy',
  'totalTestCase',
  'edit',
]);
</script>

<style scoped lang="scss">
:deep(td.q-td) {
  padding: 0px 2px 0px 6px !important;
}
:deep(th.text-left) {
  padding-left: 8px !important;
}
</style>
