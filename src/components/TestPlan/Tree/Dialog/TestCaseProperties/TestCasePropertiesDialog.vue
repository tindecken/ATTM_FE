<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf"
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 900px; min-height: 200px !important; min-width: 600px"
      container
    >
      <q-header reveal bordered class="row justify-between bg-secondary">
        <div class="self-center text-subtitle1 q-pl-sm">{{ TestCase.CodeName}}: {{ TestCase.Name }}</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container>
        <q-tabs
          v-model="tab"
          no-caps
        >
          <q-tab name="properties" label="Properties" />
          <q-tab name="historyUpdate" label="Update Histories" />
          <q-tab name="regressionHistory" label="Regression Histories" />
        </q-tabs>
        <q-tab-panels
          v-model="tab"
          animated
          vertical
          transition-prev="jump-down"
          transition-next="jump-down"
        >
          <q-tab-panel name="properties">
            <properties :TestCase="TestCase"></properties>
          </q-tab-panel>
          <q-tab-panel name="historyUpdate">
            <update-history :TestCase="TestCase" ></update-history>
          </q-tab-panel>
          <q-tab-panel name="regressionHistory">
            <regression-history :TestCase="TestCase"></regression-history>
          </q-tab-panel>
        </q-tab-panels>
      </q-page-container>
      <q-footer bordered class="bg-secondary text-white"  style="height: 24px;width: -webkit-fill-available;">
        <div class="row inline justify-between items-center">
          <span @click="copy(footerInfo)" class="q-pl-sm">{{footerInfo}}</span>
        </div>
    </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, PropType, onMounted,
} from 'vue';
import { TestCaseInterface } from 'src/Models/TestCase';
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'
import { QForm, useDialogPluginComponent } from 'quasar'
import Properties from 'src/components/TestPlan/Tree/Dialog/TestCaseProperties/Properties.vue'
import RegressionHistory from 'src/components/TestPlan/Tree/Dialog/TestCaseProperties/RegressionHistory.vue'
import UpdateHistory from 'src/components/TestPlan/Tree/Dialog/TestCaseProperties/UpdateHistory.vue'

export default defineComponent({
  name: 'TestCasePropertiesDialog',
  props: {
    TestCase: {
      type: Object as PropType<TestCaseInterface>,
      required: true,
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: { Properties, RegressionHistory, UpdateHistory },
  setup(props) {
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const $store = useStore()
    const { copy } = useClipboard()
    const isDark = computed(() => $store.getters['global/darkTheme']);
    const footerInfo = ref('');
    const isFormValid = ref(false);
    const form = ref(QForm);
    const tab = ref('properties');
    onMounted(() => {
      console.log('Props.TestCase', props.TestCase);
    })
    function onOKClick() {
      onDialogOK()
    }

    function validateForm() {
      if (form.value !== null) form.value.validate(false);
    }
    return {
      tab,
      copy,
      dialogRef,
      onDialogHide,
      onOKClick,
      isDark,
      isFormValid,
      validateForm,
      form,
      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
      footerInfo,
    };
  },
});
</script>
