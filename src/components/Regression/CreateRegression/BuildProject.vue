<template>
  <div class="q-pa-md">
    <q-btn
      class="q-mr-md"
      color="primary"
      @click="getLatestCodeThenGenerateAndBuildProject"
      label="Get Latest Code, Generate Code and Build Project"
    />
    <div v-html="output"></div>
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
    const output = ref('')
    const selectedTestCasesDetail = computed(() => context.root.$store.getters['createregression/selectedTestCasesDetail'] as TestCaseDetailInterface[]);
    const selectedTestCases = computed(() => context.root.$store.getters['createregression/selectedTestCases'] as TestCaseInterface[]);
    console.log('selectedTestCasesDetail', selectedTestCasesDetail)
    async function getLatestCodeThenGenerateAndBuildProject() {
      output.value = ''
      console.log('generateAndBuildProject')
      context.root.$store.commit('createregression/setSelectedTestCases', [])
      await context.root.$store.dispatch('createregression/getAndAddSelectedTestCase', selectedTestCasesDetail.value);
      console.log('selectedTestCases.value', selectedTestCases.value)
      const getLatestCodeResult: Promise<any> = context.root.$store.dispatch('global/getLatestCode');

      getLatestCodeResult.then((r) => {
        console.log('r', r)
        output.value += r.message
        context.root.$q.notify({
          type: 'positive',
          message: 'Get Latest Code success !',
        });
        const generateRegCodeResult: Promise<any> = context.root.$store.dispatch('global/generateRegCode', selectedTestCases.value);
        generateRegCodeResult.then((g) => {
          console.log('g', g)
          g.message.forEach((m: any) => {
            output.value += m.generatedCode
          });
          context.root.$q.notify({
            type: 'positive',
            message: 'Generate Code Success !',
          });
          const buildResult: Promise<any> = context.root.$store.dispatch('global/buildProject');
          buildResult.then((b) => {
            console.log('b', b)
            output.value += b.buildMessage
            context.root.$q.notify({
              type: 'positive',
              message: 'Build Project Success !',
            });
          }).catch(() => {
            context.root.$q.notify({
              type: 'negative',
              message: 'Build Project Error',
            });
          })
        }).catch(() => {
          context.root.$q.notify({
            type: 'negative',
            message: 'Generate Code Error',
          });
        })
      }).catch(() => {
        context.root.$q.notify({
          type: 'negative',
          message: 'Get Latest Code Error',
        });
      })
    }
    return {
      getLatestCodeThenGenerateAndBuildProject,
      output,
    }
  },
});
</script>
