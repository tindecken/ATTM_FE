<template>
  <div class="q-pa-md">
    <q-btn
      class="q-mb-md"
      color="primary"
      @click="getLatestCodeThenGenerateAndBuildProject"
      label="Get Latest Code, Generate Code and Build Project"
    />
    <q-splitter
      v-model="splitterModel"
      style="height: 250px"
    >

      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          no-caps
        >
          <q-tab name="getLatestCode" label="Get Latest Code" />
          <q-tab name="generateCode" label="Generate Code" />
          <q-tab name="buildProject" label="Build Project" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="getLatestCode">
            <div class="text-h6 q-mb-md">Status: {{getLatestCodeStatus}}
              <q-btn flat round icon="content_copy" size="md" primary @click="copy(getLatestCodeMessage || '')" class="q-mr-sm" v-if="getLatestCodeStatus"></q-btn>
            </div>
            <p style="white-space: pre-wrap;">{{getLatestCodeMessage}}</p>
          </q-tab-panel>

          <q-tab-panel name="generateCode">
            <div class="text-h6 q-mb-md">Status: {{generateCodeStatus}}
              <q-btn flat round icon="content_copy" size="md" primary @click="copy(generateCodeMessage || '')" class="q-mr-sm" v-if="generateCodeStatus"></q-btn>
            </div>
            <p style="white-space: pre-wrap;">{{generateCodeMessage}}</p>
          </q-tab-panel>

          <q-tab-panel name="buildProject">
            <div class="text-h6 q-mb-md">Status: {{buildProjectStatus}}
              <q-btn flat round icon="content_copy" size="md" primary @click="copy(buildProjectMessage || '')" class="q-mr-sm" v-if="buildProjectStatus"></q-btn>
            </div>
            <p style="white-space: pre-wrap;">{{buildProjectMessage}}</p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useGlobalStore } from 'src/pinia/globalStore';
import { useClipboard } from '@vueuse/core'

export default defineComponent({
  name: 'BuildProject',
  components: {},
  setup() {
    const globalStore = useGlobalStore()
    const $store = useStore()
    const $q = useQuasar()
    const tab = ref('getLatestCode')
    const { copy } = useClipboard()
    const getLatestCodeStatus = ref('')
    const getLatestCodeMessage = ref('')
    const generateCodeStatus = ref('')
    const generateCodeMessage = ref('')
    const buildProjectStatus = ref('')
    const buildProjectMessage = ref('')
    const splitterModel = ref(7)
    const selectedTestCasesDetail = computed(() => $store.getters['createregression/selectedTestCasesDetail'] as TestCaseDetailInterface[]);
    const selectedTestCases = computed(() => $store.getters['createregression/selectedTestCases'] as TestCaseInterface[]);
    console.log('selectedTestCasesDetail', selectedTestCasesDetail)
    function clearStatusAndMessage() {
      getLatestCodeStatus.value = ''
      getLatestCodeMessage.value = ''
      generateCodeStatus.value = ''
      generateCodeMessage.value = ''
      buildProjectStatus.value = ''
      buildProjectMessage.value = ''
    }
    async function getLatestCodeThenGenerateAndBuildProject() {
      clearStatusAndMessage()
      tab.value = 'getLatestCode'
      console.log('generateAndBuildProject')
      $store.commit('createregression/setSelectedTestCases', [])
      await $store.dispatch('createregression/getAndAddSelectedTestCase', selectedTestCasesDetail.value);
      console.log('selectedTestCases.value', selectedTestCases.value)
      const getLatestCodeResult: Promise<any> = globalStore.getLatestCode();

      getLatestCodeResult.then((r) => {
        console.log('r', r)
        getLatestCodeStatus.value = 'Success'
        getLatestCodeMessage.value = r.message
        $q.notify({
          type: 'positive',
          message: 'Get Latest Code success !',
        });
        const generateDevCodeResult: Promise<any> = globalStore.generateDevCode(selectedTestCases.value)
        generateDevCodeResult.then((g) => {
          tab.value = 'generateCode'
          generateCodeStatus.value = 'Success'
          g.message.forEach((m: any) => {
            console.log('m', m)
            generateCodeMessage.value += `Test Case: ${m.testCase}\r\n\r\n`
            generateCodeMessage.value += `${m.generatedCode}\r\n`
            generateCodeMessage.value += '------------------\r\n'
          });
          $q.notify({
            type: 'positive',
            message: 'Generate Code Success !',
          });
          const buildResult: Promise<any> = globalStore.buildProject()
          buildResult.then((b) => {
            tab.value = 'buildProject'
            buildProjectStatus.value = 'Success'
            buildProjectMessage.value = b.buildMessage
            console.log('b', b)
            $q.notify({
              type: 'positive',
              message: 'Build Project Success !',
            });
          }).catch((e) => {
            $q.notify({
              type: 'negative',
              message: 'Build Project Error',
            });
            buildProjectStatus.value = 'Error'
            buildProjectMessage.value = e.buildMessage
          })
        }).catch((e) => {
          $q.notify({
            type: 'negative',
            message: 'Generate Code Error',
          });
          generateCodeStatus.value = 'Error'
          generateCodeMessage.value = e
        })
      }).catch((e) => {
        getLatestCodeStatus.value = 'Error'
        getLatestCodeMessage.value = e
        $q.notify({
          type: 'negative',
          message: 'Get Latest Code Error',
        });
      })
    }
    return {
      copy,
      splitterModel,
      getLatestCodeThenGenerateAndBuildProject,
      tab,
      getLatestCodeStatus,
      getLatestCodeMessage,
      generateCodeStatus,
      generateCodeMessage,
      buildProjectStatus,
      buildProjectMessage,
    }
  },
});
</script>
