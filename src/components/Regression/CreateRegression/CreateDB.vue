<template>
  <div class="q-pa-md">
    <q-btn
      class="q-mb-md"
      color="primary"
      @click="createDB"
      label="Create DB"
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
          <q-tab name="createRegression" label="Create Regression" />
          <q-tab name="createRegressionTest" label="Create Regression Tests" />
          <q-tab name="generateRegCode" label="Generate Regression Code" />
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
          <q-tab-panel name="createRegression">
            <div class="text-h6 q-mb-md">Status: {{createRegressionStatus}}</div>
            <p style="white-space: pre;">{{createRegressionMessage}}</p>
          </q-tab-panel>

          <q-tab-panel name="createRegressionTest">
            <div class="text-h6 q-mb-md">Status: {{createRegressionTestStatus}}</div>
            <p style="white-space: pre;">{{createRegressionTestMessage}}</p>
          </q-tab-panel>

          <q-tab-panel name="generateRegCode">
            <div class="text-h6 q-mb-md">Status: {{generateRegCodeStatus}}</div>
            <p style="white-space: pre;">{{generateRegCodeMessage}}</p>
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
import { computed, defineComponent, ref } from 'vue';
import { DefineRegressionInterface } from 'src/Models/DefineRegression';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestCaseDetailInterface } from 'src/Models/TestCaseDetail';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'CreateDb',
  components: {},
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const splitterModel = ref(10)
    const tab = ref('createRegression')
    const createRegressionStatus = ref('')
    const createRegressionMessage = ref('')
    const createRegressionTestStatus = ref('')
    const createRegressionTestMessage = ref('')
    const generateRegCodeStatus = ref('')
    const generateRegCodeMessage = ref('')
    const buildProjectStatus = ref('')
    const buildProjectMessage = ref('')
    const selectedTestCasesDetail = computed(() => $store.getters['createregression/selectedTestCasesDetail'] as TestCaseDetailInterface[]);
    const selectedTestCases = computed(() => $store.getters['createregression/selectedTestCases'] as TestCaseInterface[]);
    const defineRegression = computed(() => $store.getters['createregression/defineRegression'] as DefineRegressionInterface);
    console.log('selectedTestCasesDetail', selectedTestCasesDetail)
    console.log('selectedTestCases', selectedTestCases)
    console.log('defineRegression', defineRegression)
    function clearStatusAndMessage() {
      createRegressionStatus.value = ''
      createRegressionMessage.value = ''
      createRegressionTestStatus.value = ''
      createRegressionTestMessage.value = ''
      generateRegCodeStatus.value = ''
      generateRegCodeMessage.value = ''
      buildProjectStatus.value = ''
      buildProjectMessage.value = ''
      tab.value = 'createRegression'
    }
    function createDB() {
      clearStatusAndMessage()
      const createRegression: Promise<any> = $store.dispatch('createregression/createRegression', defineRegression.value);
      createRegression.then((r) => {
        tab.value = 'createRegression'
        createRegressionStatus.value = 'Success'
        createRegressionMessage.value += `RegressionId: ${r.data.Id}\r\n`
        createRegressionMessage.value += `Name: ${r.data.Name}\r\n`
        createRegressionMessage.value += `Release: ${r.data.Release}\r\n`
        createRegressionMessage.value += `Build: ${r.data.Build}\r\n`
        createRegressionMessage.value += `This is an official regression: ${r.data.IsOfficial}\r\n`
        createRegressionMessage.value += `Description: ${r.data.Description}\r\n`
        createRegressionMessage.value += `Start Date: ${r.data.StartDate}\r\n`
        createRegressionMessage.value += `End Date: ${r.data.EndDate}\r\n`
        console.log('r', r)
        $q.notify({
          type: 'positive',
          message: `Created regression: ${r.data.Name}`,
        });
        const Ids: any[] = []
        selectedTestCasesDetail.value.forEach((c: TestCaseDetailInterface) => {
          Ids.push(c.Id)
        })
        const createRegressionTest: Promise<any> = $store.dispatch('createregression/createRegressionTests', { regressionId: r.data.Id, selectedTestCasesDetailIds: Ids });
        createRegressionTest.then((t) => {
          tab.value = 'createRegressionTest'
          createRegressionTestStatus.value = 'Success'
          createRegressionTestMessage.value = t.data
          $q.notify({
            type: 'positive',
            message: `Created regression Tests: ${t.data.message}`,
          });
          const generateRegCodeResult: Promise<any> = $store.dispatch('global/generateRegCode', t.data.data);
          generateRegCodeResult.then((g) => {
            tab.value = 'generateRegCode'
            generateRegCodeStatus.value = 'Success'
            generateRegCodeMessage.value = g
            console.log('g', g)
            $q.notify({
              type: 'positive',
              message: `Generate Regression Code Successful for ${g.count} test case(s) !`,
            });
            const buildResult: Promise<any> = $store.dispatch('global/buildProject');
            buildResult.then((b) => {
              console.log('b', b)
              tab.value = 'buildProject'
              buildProjectStatus.value = 'Success'
              buildProjectMessage.value = b.buildMessage
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
              buildProjectMessage.value = e
            })
          }).catch((e) => {
            $q.notify({
              type: 'negative',
              message: `Generate Regression Code Unsuccessful: ${e}`,
            });
            generateRegCodeStatus.value = 'Error'
            generateRegCodeMessage.value = e
          })
        }).catch((e) => {
          $q.notify({
            type: 'negative',
            message: `Error while creating RegressionTest: ${e}`,
          });
          createRegressionTestStatus.value = 'Error'
          createRegressionTestMessage.value = e
        })
      }).catch((e) => {
        console.log('e', e)
        $q.notify({
          type: 'negative',
          message: `Error while creating regression: ${e}`,
        });
        createRegressionStatus.value = 'Error'
        createRegressionMessage.value = e
      })
    }
    return {
      createDB,
      splitterModel,
      tab,
      createRegressionStatus,
      createRegressionMessage,
      createRegressionTestStatus,
      createRegressionTestMessage,
      generateRegCodeStatus,
      generateRegCodeMessage,
      buildProjectStatus,
      buildProjectMessage,
    }
  },
});
</script>
