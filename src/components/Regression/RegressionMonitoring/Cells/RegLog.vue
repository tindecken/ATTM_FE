<template>
  <div>
    <span v-if="RegressionTest" @click="showDialog()">
      {{ RegressionTest.LastRegressionRunRecord?.Log }}
    </span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, ref,
} from 'vue';

import { RegressionTestInterface } from 'src/Models/RegressionTest';
import { useQuasar } from 'quasar'
import RegLogDialog from '../Dialogs/RegLogDialog.vue';

export default defineComponent({
  name: 'DevLog',
  props: {
    RegressionTest: {
      type: Object as PropType<RegressionTestInterface>,
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
          RegressionTest: props.RegressionTest,
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
