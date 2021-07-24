<template>
  <div>AllTestTable</div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { computed, defineComponent, onBeforeMount } from 'vue';
import { useStore } from 'vuex'

export default defineComponent({
  name: 'AllTestTable',
  components: {},
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    return {
    };
  },
});
</script>
