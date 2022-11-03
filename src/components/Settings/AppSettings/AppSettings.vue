<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-10 col-lg-6">
        <div class="row">
          <div class="col">
            <q-input :readonly="readonly" v-model="configurations" type="textarea" rows="40"> </q-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useSettingStore } from '../../../pinia/settingStore';

const settingStore = useSettingStore();
const $q = useQuasar();
const readonly = ref(true);
const configurations = ref('');

onMounted(async () => {
  settingStore
    .getConfigurations()
    .then((result) => {
      console.log('result', result);
      configurations.value = JSON.stringify(result.data, null, 2);
    })
    .catch((error) => {
      console.log('error', error);
      $q.notify({
        type: 'negative',
        message: error.message ? error.message : error.error,
      });
    });
});
</script>
