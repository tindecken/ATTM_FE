<template>
  <div class="q-pa-md">
    <q-btn
      class="q-mr-md"
      color="primary"
      @click="createDB"
      label="Create DB"
    />
    <div v-html="output"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';

export default defineComponent({
  name: 'CreateDb',
  components: {},
  setup(props, context) {
    const output = ref('')
    const selectedTestCasesDetail = computed(() => context.root.$store.getters['createregression/selectedTestCasesDetail'] as TestCaseDetailInterface[]);
    const selectedTestCases = computed(() => context.root.$store.getters['createregression/selectedTestCases'] as TestCaseInterface[]);
    const defineRegression = computed(() => context.root.$store.getters['createregression/defineRegression'] as DefineRegressionInterface);
    console.log('selectedTestCasesDetail', selectedTestCasesDetail)
    console.log('selectedTestCases', selectedTestCases)
    console.log('defineRegression', defineRegression)
    function createDB() {
      output.value = ''
      const createRegression: Promise<any> = context.root.$store.dispatch('createregression/createRegression', defineRegression.value);
      createRegression.then((r) => {
        console.log('r', r)
        context.root.$q.notify({
          type: 'positive',
          message: `Created regression: ${r.data.Name}`,
        });
        const Ids: any[] = []
        selectedTestCasesDetail.value.forEach((c: TestCaseDetailInterface) => {
          Ids.push(c.Id)
        })
        const createRegressionTest: Promise<any> = context.root.$store.dispatch('createregression/createRegressionTests', { regressionId: r.data.Id, selectedTestCasesDetailIds: Ids });
        createRegressionTest.then((t) => {
          console.log('tt', t)
          context.root.$q.notify({
            type: 'positive',
            message: `Created regression Tests: ${t.data.message}`,
          });
          const generateRegCodeResult: Promise<any> = context.root.$store.dispatch('global/generateRegCode', t.data.data);
          generateRegCodeResult.then((g) => {
            console.log('g', g)
            context.root.$q.notify({
              type: 'positive',
              message: `Generate Regression Code Successful for ${g.count} test case(s) !`,
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
          }).catch((e) => {
            context.root.$q.notify({
              type: 'negative',
              message: `Generate Regression Code Unsuccessful: ${e}`,
            });
          })
        }).catch((e) => {
          context.root.$q.notify({
            type: 'negative',
            message: `Error while creating RegressionTest: ${e}`,
          });
        })
      }).catch((e) => {
        console.log('e', e)
        context.root.$q.notify({
          type: 'negative',
          message: `Error while creating regression: ${e}`,
        });
      })
    }
    return {
      createDB,
      output,
    }
  },
});
</script>
