<template>
  <div>
    <span @click="copy(infoStatus.Info)" class="q-pr-sm q-pl-sm">{{infoStatus.Info}}</span>
    <q-tooltip v-if="infoStatus.Data">
      <div style="font-size: small;">
        {{ infoStatus.Data }}
      </div>
    </q-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useClipboard } from '@vueuse/core'
import { InfoStatusDataInterface } from 'src/Models/Entities/InfoStatusData'
import { useGlobalStore } from 'src/pinia/globalStore';

export default defineComponent({
  name: 'InformationFooter',
  components: {},
  setup() {
    const globalStore = useGlobalStore()
    const { copy } = useClipboard()
    const infoStatus = computed(() => globalStore.infoStatus as InfoStatusDataInterface)
    return {
      infoStatus,
      copy,
    };
  },
});
</script>
