<template>
  <q-form
    autofocus
    greedy
    @submit="onSubmit"
    ref="form">
    <div class="row q-pa-sm">
      <q-input dense outlined v-model="newName" label="Name" class="col-12 q-mb-sm"
        :rules="[ val => !!val || 'Field is required',
                  val => val.length <= 50 || 'Maximum 50 characters'
                ]"
      />
      <q-input type="textarea" rows="4" dense outlined v-model="newDescription" label="Description - max 500 characters" class="col-12"
        :rules="[ val => val.length <= 500 || 'Maximum 500 characters' ]"
      />
      <q-input readonly :model-value="date.formatDate(props.TestEnv.LastModifiedDate, 'YYYY-MM-DD HH:mm:ss')" label="Last Modified Date"/>
      <q-input readonly :model-value="props.TestEnv.LastModifiedMessage" label="Last Modified Message"/>
      <q-input readonly :model-value="props.TestEnv.LastModifiedUser" label="Last Modified By"/>
    </div>
    <div class="row q-mt-sm">
      <q-space />
      <q-btn outline label="Cancel" color="secondary" class="q-mr-sm" style="width: 100px;" @click="onCancel()"/>
      <q-btn outline label="Save" color="secondary" class="q-mr-sm" style="width: 100px;" type="submit"/>
    </div>
  </q-form>
</template>

<script lang="ts">
export default {
  name: 'Properties',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import {
  ref, defineProps, defineEmits,
} from 'vue'
import { useQuasar, date } from 'quasar'
import { TestEnvInterface } from 'src/Models/TestEnv';
import { api } from 'boot/axios'
import config from 'src/config'
import { UpdateTestEnvDataInterface } from 'src/Models/Entities/UpdateTestEnvData';
import { TestEnvHistoryInterface } from 'src/Models/TestEnvHistory';
import { useUserStore } from 'src/pinia/userStore';

const userStore = useUserStore()
const $q = useQuasar()
const props = defineProps<{
  TestEnv: TestEnvInterface
}>()

const emit = defineEmits(['cancel', 'submit'])
const newName = ref(props.TestEnv.Name)
const newDescription = ref(props.TestEnv.Description)
function onCancel() {
  emit('cancel')
}
function onSubmit() {
  const updateTestEnvData: UpdateTestEnvDataInterface = {
    UpdateBy: userStore.Username,
    UpdateMessage: 'Update Test Properties',
    UpdateType: 'Update Properties',
  }
  const testEnv: TestEnvInterface = {
    Id: props.TestEnv.Id,
    Name: newName.value,
    Description: newDescription.value,
    Nodes: props.TestEnv.Nodes,
  }
  const testEnvHistory: TestEnvHistoryInterface = {
    UpdateTestEnvData: updateTestEnvData,
    TestEnv: testEnv,
  }
  api.post(
    `${config.baseURL}/testenvs/update`,
    testEnvHistory,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.Token}`,
      },
    },
  ).then((res) => {
    $q.notify({
      type: 'positive',
      message: res.data.message,
    })
    emit('submit', res.data.data as TestEnvInterface)
  }).catch((err) => {
    $q.notify({
      type: 'negative',
      message: err.response.data.message,
      icon: 'report_problem',
    })
    emit('submit', null)
  });
}

</script>
