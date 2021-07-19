<template>
  <div v-if="DevRunRecord.ErrorScreenshot">
    <q-btn @click="showImage()" size="sm" outline>
      View
    </q-btn>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType,
} from 'vue';

import { DevRunRecordInterface } from 'src/Models/DevRunRecord';
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ErrorScreenshot',
  props: {
    DevRunRecord: {
      type: Object as PropType<DevRunRecordInterface>,
      required: true,
      default: () => ({}),
    },
  },
  components: { },
  setup(props) {
    const $store = useStore()
    async function showImage() {
      const image = await $store.dispatch('devmonitoring/getScreenshot', props.DevRunRecord.ErrorScreenshot);
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
