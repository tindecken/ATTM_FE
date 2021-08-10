<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" fullHeight>
    <q-layout
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-width: 1200px; min-height: 400px !important;"
    >
      <div class="row q-mb-sm">
        <div class="col-12">
          <q-bar>
          <q-icon name="edit" />
          <div>Update {{RegressionTests.length}} Test(s)</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>
        </div>
      </div>
      <div class="row">
        <div class="col-1">
        <q-tabs
          v-model="selectedRegTest"
          dense
          active-color="primary"
          align="left"
          vertical
        >
          <q-tab v-for="regTest in RegressionTests" :key="regTest.Id" :name="regTest.Id" :ripple="false">
            <div class="q-mr-xs">{{regTest.TestCaseCodeName}}</div>
          </q-tab>
        </q-tabs>
        </div>
        <div class="col-11">
        <q-tab-panels
          v-model="selectedRegTest"
          animated
          keep-alive
          >
          <q-tab-panel v-for="regTest in RegressionTests" :key="regTest.Id" :name="regTest.Id">
            <div class="row">
                <span class="text-subtitle2">{{ regTest.TestCaseName}}</span>
                <q-space />
              <q-btn size="sm" outline icon="visibility" primary @click="showImage(regTest)" class="q-mr-sm" v-if="regTest.LastRegressionRunRecord.ErrorScreenshot">View Screenshot</q-btn>
              <q-btn size="sm" outline icon="content_copy" primary @click="copy(regTest.TestCaseCodeName)" class="q-mr-sm">TestCase Code Name</q-btn>
              <q-btn size="sm" outline icon="content_copy"  primary @click="copy(regTest.TestCaseName)" class="q-mr-sm">TestCase Name</q-btn>
              <q-btn size="sm" outline icon="content_copy"  primary @click="copy(regTest.LastRegressionRunRecord?.Log || '')">Log</q-btn>
            </div>
            <q-separator class="q-mb-sm q-mt-sm"></q-separator>
            <div class="row">
              {{ regTest.LastRegressionRunRecord.Log}}
            </div>
          </q-tab-panel>
        </q-tab-panels>
        </div>
      </div>
      <div style="white-space: pre-wrap;">
        <!-- {{ RegressionTest.LastRegressionRunRecord.Log }} -->
      </div>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, Ref, ref, PropType, onMounted,
} from 'vue';
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'
import { useDialogPluginComponent } from 'quasar'
import { RegressionTestInterface } from 'src/Models/RegressionTest';

export default defineComponent({
  name: 'UpdateDialog',
  props: {
    RegressionTests: {
      type: Object as PropType<RegressionTestInterface[]>,
      required: true,
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {},
  setup(props) {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const { copy } = useClipboard()
    const $store = useStore()
    const description = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => $store.getters['global/darkTheme']);
    const isFormValid = ref(false);
    const form: Ref<any> = ref(null);
    const selectedRegTest = ref('');
    onMounted(() => {
      if (props.RegressionTests.length > 0) {
        selectedRegTest.value = props.RegressionTests[0].Id;
      }
    })
    function onOKClick() {
      onDialogOK(description.value)
    }

    function validateForm() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (form.value !== null) form.value.validate(false);
    }
    async function showImage(regTest: RegressionTestInterface) {
      const image = await $store.dispatch('regmonitoring/getScreenshot', regTest.LastRegressionRunRecord?.ErrorScreenshot);
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
      copy,
      selectedRegTest,
      dialogRef,
      onDialogHide,
      onOKClick,
      isDark,
      description,
      isFormValid,
      validateForm,
      form,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
});
</script>

function onMounted(arg0: () => void) {
  throw new Error('Function not implemented.');
}

function onMounted(arg0: () => void) {
  throw new Error('Function not implemented.');
}
