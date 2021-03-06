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
            <div class="text-h6 q-mb-md">Status: {{getLatestCodeStatus}}</div>
            <p style="white-space: pre;">{{getLatestCodeMessage}}</p>
          </q-tab-panel>

          <q-tab-panel name="generateCode">
            <div class="text-h6 q-mb-md">Status: {{generateCodeStatus}}</div>
            <p style="white-space: pre;">{{generateCodeMessage}}</p>
          </q-tab-panel>

          <q-tab-panel name="buildProject">
            <div class="text-h6 q-mb-md">Status: {{buildProjectStatus}}</div>
            <p style="white-space: pre;">{{buildProjectMessage}}</p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';

export default defineComponent({
  name: 'BuildProject',
  components: {},
  setup(props, context) {
    const tab = ref('getLatestCode')
    const getLatestCodeStatus = ref('')
    const getLatestCodeMessage = ref('')
    const generateCodeStatus = ref('')
    const generateCodeMessage = ref('')
    const buildProjectStatus = ref('')
    const buildProjectMessage = ref('')
    const splitterModel = ref(7)
    const selectedTestCasesDetail = computed(() => context.root.$store.getters['createregression/selectedTestCasesDetail'] as TestCaseDetailInterface[]);
    const selectedTestCases = computed(() => context.root.$store.getters['createregression/selectedTestCases'] as TestCaseInterface[]);
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
      context.root.$store.commit('createregression/setSelectedTestCases', [])
      await context.root.$store.dispatch('createregression/getAndAddSelectedTestCase', selectedTestCasesDetail.value);
      console.log('selectedTestCases.value', selectedTestCases.value)
      const getLatestCodeResult: Promise<any> = context.root.$store.dispatch('global/getLatestCode');

      getLatestCodeResult.then((r) => {
        console.log('r', r)
        getLatestCodeStatus.value = 'Success'
        getLatestCodeMessage.value = r.message
        context.root.$q.notify({
          type: 'positive',
          message: 'Get Latest Code success !',
        });
        const generateDevCodeResult: Promise<any> = context.root.$store.dispatch('global/generateDevCode', selectedTestCases.value);
        generateDevCodeResult.then((g) => {
          tab.value = 'generateCode'
          generateCodeStatus.value = 'Success'
          console.log('g', g)
          g.message.forEach((m: any) => {
            console.log('m', m)
            generateCodeMessage.value += `Test Case: ${m.testCase}\r\n\r\n`
            generateCodeMessage.value += `${m.generatedCode}\r\n`
            generateCodeMessage.value += '------------------\r\n'
          });
          context.root.$q.notify({
            type: 'positive',
            message: 'Generate Code Success !',
          });
          const buildResult: Promise<any> = context.root.$store.dispatch('global/buildProject');
          buildResult.then((b) => {
            tab.value = 'buildProject'
            buildProjectStatus.value = 'Success'
            buildProjectMessage.value = b.buildMessage
            console.log('b', b)
            context.root.$q.notify({
              type: 'positive',
              message: 'Build Project Success !',
            });
          }).catch((e) => {
            context.root.$q.notify({
              type: 'negative',
              message: 'Build Project Error',
            });
            buildProjectStatus.value = 'Error'
            buildProjectMessage.value = e
          })
        }).catch((e) => {
          context.root.$q.notify({
            type: 'negative',
            message: 'Generate Code Error',
          });
          generateCodeStatus.value = 'Error'
          generateCodeMessage.value = e
        })
      }).catch((e) => {
        getLatestCodeStatus.value = 'Error'
        getLatestCodeMessage.value = e
        context.root.$q.notify({
          type: 'negative',
          message: 'Get Latest Code Error',
        });
      })
    }
    return {
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
