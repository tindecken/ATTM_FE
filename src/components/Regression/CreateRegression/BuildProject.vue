<template>
  <div class="q-pa-md">
    <q-btn
      class="q-mr-md"
      color="primary"
      @click="generateAndBuildProject"
      label="Generate Code and Build Project"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';

export default defineComponent({
  name: 'BuildProject',
  components: {},
  setup(props, context) {
    const selectedTestCasesDetail = computed(() => context.root.$store.getters['createregression/selectedTestCasesDetail'] as TestCaseDetailInterface[]);
    const selectedTestCases = computed(() => context.root.$store.getters['createregression/selectedTestCases'] as TestCaseInterface[]);
    console.log('selectedTestCasesDetail', selectedTestCasesDetail)
    async function generateAndBuildProject() {
      console.log('generateAndBuildProject')
      context.root.$store.commit('createregression/setSelectedTestCases', [])
      await context.root.$store.dispatch('createregression/getAndAddSelectedTestCase', selectedTestCasesDetail.value);
      console.log('selectedTestCases.value', selectedTestCases.value)
      const generateRegCodeResult: Promise<any> = context.root.$store.dispatch('global/generateRegCode', selectedTestCases.value);
      console.log('generateRegCodeResult', generateRegCodeResult)
      generateRegCodeResult.then(() => {
        context.root.$q.notify({
          type: 'positive',
          message: 'Generate Code Success !',
        });
        const buildResult: Promise<any> = context.root.$store.dispatch('global/buildProject');
        buildResult.then(() => {
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
    }
    return {
      generateAndBuildProject,
    }
  },
});
</script>
