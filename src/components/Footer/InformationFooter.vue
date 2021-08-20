<template>
  <div>
    <span @click="copy(infoStatus.Info)">{{infoStatus.Info}}</span>
    <q-tooltip v-if="infoStatus.Data">
      <div style="font-size: small;">
        {{ infoStatus.Data }}
      </div>
    </q-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'
import { InfoStatusDataInterface } from 'src/Models/Entities/InfoStatusData'

export default defineComponent({
  name: 'InformationFooter',
  components: {},
  setup() {
    const $store = useStore()
    const { copy } = useClipboard()
    const infoStatus = computed(() => $store.getters['global/infoStatus'] as InfoStatusDataInterface)
    return {
      infoStatus,
      copy,
    };
  },
});
</script>
