<template>
  <div v-if="RegTest.LastRegressionRunRecord?.ErrorScreenshot">
    <q-btn @click="showImage()" size="sm" outline>
      View
    </q-btn>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
} from 'vue';

import { useRegMonitoringStore } from 'src/pinia/regMonitoring';
import { RegressionTestInterface } from 'src/Models/RegressionTest';

export default defineComponent({
  name: 'ErrorScreenshot',
  props: {
    RegTest: {
      type: Object as PropType<RegressionTestInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { },
  setup(props) {
    const regMonitoringStore = useRegMonitoringStore()
    async function showImage() {
      const image = await regMonitoringStore.getScreenshot(props.RegTest.LastRegressionRunRecord?.ErrorScreenshot)
      const contentType = 'image/png';
      const byteCharacters = atob(image.substr(`data:${contentType};base64,`.length));
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i += 1) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
    }
    return {
      showImage,
    }
  },
});
</script>
