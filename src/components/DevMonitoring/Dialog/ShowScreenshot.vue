<template>
  <q-img loading="lazy" :src="image" @dblclick="openScreenshot(image)">
    <q-tooltip style="font-size: small">Double click to open in new tab</q-tooltip>
  </q-img>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getScreenshot } from '../Utils/utils';

const props = defineProps<{
  screenshotId: string;
}>();

const image = ref<string>('');
onMounted(async () => {
  image.value = await getScreenshot(props.screenshotId);
});

const openScreenshot = (image: string) => {
  window.open(image, '_blank');
};
</script>
