<template>
  <div>
    <span v-if="RegRunRecord" @click="showDialog()">
      {{ RegRunRecord.Log }}
    </span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref,
} from 'vue';

import { RegressionRunRecordInterface } from 'src/Models/RegressionRunRecord';
import { useQuasar } from 'quasar'
import RegLogDialog from '../Dialog/RegLogDialog.vue';

export default defineComponent({
  name: 'DevLog',
  props: {
    RegRunRecord: {
      type: Object as PropType<RegressionRunRecordInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { },
  setup(props) {
    const $q = useQuasar()
    function showDialog() {
      $q.dialog({
        component: RegLogDialog,
        componentProps: {
          RegRunRecord: props.RegRunRecord,
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
