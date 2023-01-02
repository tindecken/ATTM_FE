<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 900px; min-height: 100px !important; max-width: 1000px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">
          Keyword Code: {{ props.data.Name }}
        </div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <div class="row q-mt-sm q-ml-md q-mb-sm">
          File: {{ filePath }}
        </div>
        <div class="row q-mt-sm q-ml-md q-mb-sm">
          Line Number: {{ index }}
        </div>
        <div class="row">
          <q-btn outline icon="content_copy" primary @click="copy(code)" class="q-mt-sm q-ml-md q-mb-sm">Copy</q-btn>
        </div>
        <div class="row">
          <q-markdown  show-copy copy-icon="content_copy" :src="code" class="q-pl-md"></q-markdown>
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, defineProps, onBeforeMount, ref } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { KeywordInterface } from '../../../Models/Keyword';
import { useClipboard } from '@vueuse/core';
import { useGlobalStore } from '../../../pinia/globalStore';
import 'prismjs/components/prism-csharp';
import { useKeywordStore} from '../../../pinia/keywordStore';
import {ResponseDataInterface} from '../../../Models/Entities/ResponseData';
import {CategoryFeatureKeywordDataInterface} from '../../../Models/Entities/CategoryFeatureKeywordData';
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const keywordStore = useKeywordStore();
const globalStore = useGlobalStore();
const { copy } = useClipboard();
const props = defineProps<{
  data: any
}>();
const isDark = computed(() => globalStore.darkTheme);
const $q = useQuasar();
const index = ref(0);
const filePath = ref('');
const code = ref('');
onBeforeMount(async () => {
  console.log('data', props.data);
  const payload: CategoryFeatureKeywordDataInterface = {
    CategoryName: props.data.Category,
    FeatureName: props.data.Feature,
    KeywordName: props.data.Name,
  };
  console.log('payload', payload)
  keywordStore.getKeywordCode(payload)
    .then((responseData: any) => {
      console.log('responseData', responseData);
      $q.notify({
        type: 'positive',
        message: responseData.Message,
      });
      index.value = responseData.Data.Index
      filePath.value = responseData.Data.File
      code.value = responseData.Data.Code;
      console.log(code.value)
      code.value = `\`\`\`csharp\n${code.value}\n\`\`\``;
    })
    .catch((error: ResponseDataInterface) => {
      console.log('error', error);
      $q.notify({
        type: 'negative',
        message: error.Message,
      });
    });

});
</script>
