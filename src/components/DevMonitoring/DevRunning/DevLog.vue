<template>
  <div>
    <span @click="showDialog()">
      {{ DevRunRecord.Log }}
    </span>
    <q-tooltip :delay="300" v-model="showing">
      <div style="white-space: pre; font-size: medium;">
        {{ DevRunRecord.Log }}
      </div>
    </q-tooltip>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref,
} from 'vue';

import { DevRunRecordInterface } from 'src/Models/DevRunRecord';
import { useQuasar } from 'quasar'
import DevLogDialog from '../Dialog/DevLogDialog.vue';

export default defineComponent({
  name: 'DevLog',
  props: {
    DevRunRecord: {
      type: Object as PropType<DevRunRecordInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { },
  setup(props) {
    const $q = useQuasar()
    function showDialog() {
      console.log('showDialog')
      $q.dialog({
        component: DevLogDialog,
        componentProps: {
          DevRunRecord: props.DevRunRecord,
        },
      }).onOk(() => {
        // TODO: handle ok
        console.log('OK')
      }).onCancel(() => {
        // TODO
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Dismiss')
      })
    }
    return {
      showing: ref(false),
      showDialog,
    }
  },
});
</script>
