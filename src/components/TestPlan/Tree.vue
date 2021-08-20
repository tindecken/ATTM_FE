<template>
  <div class="q-pa-xs">
    <div class="row">
      <div class="col-8">
        <q-input ref='filterInput' v-model="filter" label="Filter" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-btn dense @click="toggleTree">Toggle</q-btn>
      </div>
    </div>
    <q-scroll-area style="height: 85vh; max-width: 600px;">
    <div class="row q-mt-md">
        <div class="col">
          <q-tree
            :nodes="allCat"
            node-key="Id"
            :filter="filter"
            default-expand-all
            tick-strategy="leaf"
            v-model:selected="selectedNode"
            v-model:ticked="ticked"
            @update:selected="fnSelectedNode(selectedNode)"
            ref="tree"
            selected-color="primary"
          >
          <template v-slot:default-header="prop">
            <div class="row items-center">
              <div style="display: inherit">
                <q-icon :name="prop.node.icon || 'share'" class="q-mr-sm" />
                <div>{{ prop.node.label }}</div>
                <tree-context-menu
                  :node="prop.node"
                  @generateDevCode="onGenerateDevCode()"
                  @run="onRun()"
                  @runOn="onRunOn()"
                  @debug="onDebug()"
                  @debugOn="onDebugOn()"
                  @newTestSuite="onNewTestSuite(prop.node)"
                  @newTestGroup="onNewTestGroup(prop.node)"
                  @newTestCase="onNewTestCase(prop.node)"
                  @edit="onEdit()"
                  @deleteNode="onDeleteNode(prop.node)"
                  >
                </tree-context-menu>
                <template v-if="prop.node.nodeType === 'Category'">
                </template>
                <template v-else-if="prop.node.nodeType === 'TestSuite'">
                </template>
                <template v-else-if="prop.node.nodeType === 'TestGroup'">
                </template>
              </div>
            </div>
          </template>
          </q-tree>
        </div>
    </div>
    </q-scroll-area>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, onMounted, ref, Ref, nextTick,
} from 'vue';

import { CategoryInterface } from 'src/Models/Category';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestSuiteInterface } from 'src/Models/TestSuite';
import { TestClientInterface } from 'src/Models/TestClient';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import TreeContextMenu from './ContextMenu/TreeContextMenu.vue'
import NewTestSuiteDialog from './Dialog/NewTestSuiteDialog.vue'
import NewTestGroupDialog from './Dialog/NewTestGroupDialog.vue'
import NewTestCaseDialog from './Dialog/NewTestCaseDialog.vue'

export default defineComponent({
  name: 'Tree',
  components: {
    TreeContextMenu,
  },
  setup() {
    const $store = useStore()
    const $q = useQuasar()
    const filter: Ref<string> = ref('');
    const filterInput: Ref<any> = ref(null)
    const allCat: Ref<CategoryInterface[]> = ref([]);
    const allTestAUT: Ref<any[]> = ref([]);
    const selectedNode: Ref<any> = ref(null)
    const ticked: Ref<any[]> = ref([])
    const tree: Ref<any> = ref(null)
    function resetFilter() {
      filter.value = ''
      filterInput.value.focus();
    }
    async function fnSelectedNode(target: any) {
      const currentNode = tree.value.getNodeByKey(target) as TestCaseInterface;
      if (currentNode == null) return
      switch (currentNode.nodeType) {
        case 'Category':
          $store.commit('global/setInfoStatus', { Info: `${currentNode.Id} - ${currentNode.Name}` })
          break
        case 'TestSuite':
          $store.commit('global/setInfoStatus', { Info: `${currentNode.Id} - ${currentNode.CodeName}: ${currentNode.Name}` })
          break
        case 'TestGroup':
          $store.commit('global/setInfoStatus', { Info: `${currentNode.Id} - ${currentNode.CodeName}: ${currentNode.Name}` })
          break
        case 'TestCase':
          $store.commit('global/setInfoStatus', { Info: `${currentNode.Id} - ${currentNode.CodeName}: ${currentNode.Name}` })
          const openedTCs = $store.getters['testcase/openedTCs'];
          const found = openedTCs.some((el: any) => el.Id === currentNode.Id);
          if (found) {
            const testcase = openedTCs.find((el: any) => el.Id === currentNode.Id)
            $store.commit('testcase/setOpenedTCs', testcase);
          } else {
            await $store.dispatch('testcase/getTestCaseById', currentNode.Id);
          }
          break
        default:
          break
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const selectedTestClient = computed(() => $store.getters['testclient/selectedTestClient'] as TestClientInterface);
    onMounted(async () => {
      try {
        // get category
        await $store.dispatch('category/getAllCategories');
        allCat.value = $store.getters['category/categories'];
        // gt all TestAUT
        await $store.dispatch('global/getTestAUT');
        allTestAUT.value = $store.getters['global/testAuTs']
        await nextTick()
        tree.value.expandAll();
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    });
    function toggleTree() {
      tree.value.collapseAll();
    }
    function onRunOn() {
      $q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }
    function onDebug() {
      $q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }
    function onDebugOn() {
      $q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }

    async function onCreateTestSuite(tsInfo: any) {
      try {
        await $store.dispatch('category/createTestSuite', tsInfo);
        $q.notify({
          type: 'positive',
          message: 'Created new test suite !',
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }
    async function onCreateTestGroup(newTestGroup: TestGroupInterface) {
      try {
        await $store.dispatch('testsuite/createTestGroup', newTestGroup);
        $q.notify({
          type: 'positive',
          message: 'Created new test group !',
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }

    async function onCreateTestCase(testCase: TestCaseInterface) {
      try {
        console.log('testCase', testCase);
        await $store.dispatch('testgroup/createTestCase', testCase);
        $q.notify({
          type: 'positive',
          message: 'Created new test case !',
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }

    function onNewTestSuite(Category: CategoryInterface) {
      // check if current node is not Category --> return
      if (Category.nodeType !== 'Category') {
        $q.notify({
          type: 'negative',
          message: 'Something errors, node Type is not Category',
        });
        return
      }
      // open new testsuite dialog
      $q.dialog({
        component: NewTestSuiteDialog,
        componentProps: {
          Category,
        },
      }).onOk((newTestSuite: TestSuiteInterface) => {
        void onCreateTestSuite(newTestSuite)
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }
    function onNewTestGroup(TestSuite: TestSuiteInterface) {
      // check if current node is not TestSuite --> return
      if (TestSuite.nodeType !== 'TestSuite') {
        $q.notify({
          type: 'negative',
          message: 'Something errors, node Type is not TestSuite',
        });
        return
      }
      // open new testgroup dialog
      $q.dialog({
        component: NewTestGroupDialog,
        componentProps: {
          TestSuite,
        },
      }).onOk((newTestGroup: TestGroupInterface) => {
        void onCreateTestGroup(newTestGroup)
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }
    function onNewTestCase(testGroup: TestGroupInterface) {
      if (testGroup.nodeType !== 'TestGroup') {
        $q.notify({
          type: 'negative',
          message: 'Something errors, node Type is not TestGroup',
        });
        return
      }
      // open new testcase dialog
      $q.dialog({
        component: NewTestCaseDialog,
        componentProps: {
          testGroup,
        },
      }).onOk((newTestCase: TestCaseInterface) => {
        void onCreateTestCase(newTestCase)
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }
    function onEdit() {
      $q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }

    async function onGenerateDevCode() {
      try {
        const tickedNodes = tree.value.getTickedNodes()
        const testcases = tickedNodes.filter((n: any) => n.nodeType === 'TestCase') as TestCaseInterface[]
        const numberOfTestCase = tickedNodes.filter((n: TestCaseInterface) => n.nodeType === 'TestCase').length
        if (numberOfTestCase === 0) {
          $q.notify({
            type: 'negative',
            message: 'No test case is selected',
          });
          return null
        }
        const generateDevCodeResult: Promise<any> = await $store.dispatch('global/generateDevCode', testcases);
        $q.notify({
          type: 'positive',
          message: 'Generate code success.',
        });
        return generateDevCodeResult
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error.error}`,
        });
        return null
      }
    }

    async function buildProject() {
      try {
        const buildResult: Promise<any> = await $store.dispatch('global/buildProject');
        $q.notify({
          type: 'positive',
          message: 'Build success.',
        });
        return buildResult
      } catch (error) {
        $q.notify({
          progress: true,
          timeout: 10000,
          type: 'negative',
          message: `${error.buildMessage}`,
        });
        return null
      }
    }

    async function createDevQueue() {
      const tickedNodes = tree.value.getTickedNodes()
      const testcases = tickedNodes.filter((n: any) => n.nodeType === 'TestCase') as TestCaseInterface[]
      try {
        const createDevQueueResult: any = await $store.dispatch('global/createDevQueue', { testcases, testClient: selectedTestClient.value });
        console.log('createDevQueueResult', createDevQueueResult)
        $q.notify({
          type: 'positive',
          message: `${createDevQueueResult.count} queue(s) added.`,
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `${error.error}`,
        });
      }
    }
    async function onRun() {
      console.log('selectedTestClient', selectedTestClient)
      if (selectedTestClient.value === undefined) {
        $q.notify({
          type: 'negative',
          message: 'No test client is selected',
        });
        return
      }
      const generateCodeResult = await onGenerateDevCode()
      if (generateCodeResult) {
        const buildProjectResult = await buildProject()
        if (buildProjectResult) await createDevQueue()
      }
    }

    function onDeleteNode(value: any) {
      $q.notify({
        type: 'negative',
        message: `Not develop yet: ${value}`,
      });
    }

    return {
      filter,
      resetFilter,
      allCat,
      allTestAUT,
      filterInput,
      selectedNode,
      ticked,
      fnSelectedNode,
      tree,
      toggleTree,
      onDeleteNode,
      onGenerateDevCode,
      onRun,
      onRunOn,
      onDebug,
      onDebugOn,
      onEdit,
      onNewTestSuite,
      onNewTestGroup,
      onNewTestCase,
      onCreateTestSuite,
      onCreateTestGroup,
      onCreateTestCase,
      selectedTestClient,
    }
  },
});
</script>

<style scoped lang="scss">
:deep(.q-tree__node-header) {
  padding-top: 0;
  padding-bottom: 0;
}
:deep(.q-tree__node) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
