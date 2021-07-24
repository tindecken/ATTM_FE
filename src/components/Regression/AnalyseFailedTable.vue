<template>
  <div>AnalyseFailedTable</div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { computed, defineComponent, onBeforeMount } from 'vue';
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AnalyseFailedTable',
  components: {},
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    return {
    };
  },
});
</script>
