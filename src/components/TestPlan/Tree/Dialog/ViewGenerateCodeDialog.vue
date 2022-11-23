<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-layout
      view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 900px; min-height: 100px !important; max-width: 1250px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">
          View Generate Code for test case: {{ props.TestCase.CodeName }} -
          {{ props.TestCase.Name }}
        </div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <div class="row">
          <q-btn outline icon="content_copy" primary @click="copy(code)" class="q-mt-sm q-ml-md q-mb-sm">Copy</q-btn>
        </div>
        <div class="row">
          <q-markdown show-copy copy-icon="content_copy" :src="code" class="q-pl-md"></q-markdown>
        </div>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
export default {
  name: 'ViewGenerateCodeDialog',
  inheritAttrs: false,
  customOptions: {},
};
</script>

<script setup lang="ts">
import { computed, defineProps, onBeforeMount, ref } from 'vue';
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { TestCaseInterface } from '../../../../Models/TestCase';
import { useClipboard } from '@vueuse/core';
import { useGlobalStore } from '../../../../pinia/globalStore';
import 'prismjs/components/prism-csharp';

const globalStore = useGlobalStore();
const { copy } = useClipboard();
const props = defineProps<{
  TestCase: TestCaseInterface;
}>();
const isDark = computed(() => globalStore.darkTheme);
const $q = useQuasar();
const { dialogRef, onDialogHide } = useDialogPluginComponent();
const code = ref('');
onBeforeMount(async () => {
  const generateDevCodeResult = await globalStore.generateDevCode([props.TestCase]);
  if (generateDevCodeResult.result === 'success') {
    code.value = generateDevCodeResult.message[0].generatedCode.trim();
    code.value = `\`\`\`csharp\n${code.value}\n\`\`\``;
  } else {
    $q.notify({
      type: 'negative',
      message: 'Error while generating code',
    });
  }
});
</script>
