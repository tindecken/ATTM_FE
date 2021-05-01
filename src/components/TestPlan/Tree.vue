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
        <q-btn dense @click="toogleTree">Toogle</q-btn>
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
            :selected.sync="selectedNode"
            :ticked.sync="ticked"
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
  defineComponent, onMounted, ref, Ref,
} from '@vue/composition-api';

import { CategoryInterface } from 'src/Models/Category';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestSuiteInterface } from 'src/Models/TestSuite';
import { TestClientInterface } from 'src/Models/TestClient';
import TreeContextMenu from './ContextMenu/TreeContextMenu.vue'
import NewTestSuiteDialog from './Dialog/NewTestSuiteDialog.vue'
import NewTestGroupDialog from './Dialog/NewTestGroupDialog.vue'
import NewTestCaseDialog from './Dialog/NewTestCaseDialog.vue'

export default defineComponent({
  name: 'Tree',
  components: {
    TreeContextMenu,
    NewTestGroupDialog,
    NewTestCaseDialog,
  },
  setup(props, context) {
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
          break
        case 'TestSuite':
          break
        case 'TestGroup':
          break
        case 'TestCase':
          const openedTCs = context.root.$store.getters['testcase/openedTCs'];
          const found = openedTCs.some((el: any) => el.Id === currentNode.Id);
          if (found) {
            const testcase = openedTCs.find((el: any) => el.Id === currentNode.Id)
            context.root.$store.commit('testcase/setOpenedTCs', testcase);
          } else {
            await context.root.$store.dispatch('testcase/getTestCaseById', currentNode.Id);
          }
          break
        default:
          break
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const selectedTestClient = computed(() => context.root.$store.getters['testclient/selectedTestClient'] as TestClientInterface);
    onMounted(async () => {
      try {
        // get category
        await context.root.$store.dispatch('category/getAllCategories');
        allCat.value = context.root.$store.getters['category/categories'];
        // gt all TestAUT
        await context.root.$store.dispatch('global/getTestAUT');
        allTestAUT.value = context.root.$store.getters['global/testAuTs']
        await context.root.$nextTick()
        tree.value.expandAll();
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    });
    function toogleTree() {
      tree.value.collapseAll();
    }
    function onRunOn() {
      context.root.$q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }
    function onDebug() {
      context.root.$q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }
    function onDebugOn() {
      context.root.$q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }

    async function onCreateTestSuite(tsInfo: any) {
      try {
        await context.root.$store.dispatch('category/createTestSuite', tsInfo);
        context.root.$q.notify({
          type: 'positive',
          message: 'Created new test suite !',
        });
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }
    async function onCreateTestGroup(newTestGroup: TestGroupInterface) {
      try {
        await context.root.$store.dispatch('testsuite/createTestGroup', newTestGroup);
        context.root.$q.notify({
          type: 'positive',
          message: 'Created new test group !',
        });
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }

    async function onCreateTestCase(testCase: TestCaseInterface) {
      try {
        await context.root.$store.dispatch('testgroup/createTestCase', testCase);
        context.root.$q.notify({
          type: 'positive',
          message: 'Created new test case !',
        });
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }

    function onNewTestSuite(Category: CategoryInterface) {
      // check if current node is not Category --> return
      if (Category.nodeType !== 'Category') {
        context.root.$q.notify({
          type: 'negative',
          message: 'Something errors, node Type is not Category',
        });
        return
      }
      // open new testsuite dialog
      context.root.$q.dialog({
        component: NewTestSuiteDialog,
        parent: context.root,
        Category,
      }).onOk((newTestSuite: TestSuiteInterface) => {
        onCreateTestSuite(newTestSuite)
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }
    function onNewTestGroup(TestSuite: TestSuiteInterface) {
      // check if current node is not TestSuite --> return
      if (TestSuite.nodeType !== 'TestSuite') {
        context.root.$q.notify({
          type: 'negative',
          message: 'Something errors, node Type is not TestSuite',
        });
        return
      }
      // open new testgroup dialog
      context.root.$q.dialog({
        component: NewTestGroupDialog,
        parent: context.root,
        TestSuite,
      }).onOk((newTestGroup: TestGroupInterface) => {
        onCreateTestGroup(newTestGroup)
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }
    function onNewTestCase(testGroup: TestGroupInterface) {
      if (testGroup.nodeType !== 'TestGroup') {
        context.root.$q.notify({
          type: 'negative',
          message: 'Something errors, node Type is not TestGroup',
        });
        return
      }
      // open new testcase dialog
      context.root.$q.dialog({
        component: NewTestCaseDialog,
        parent: context.root,
        testGroup,
      }).onOk((newTestCase: TestCaseInterface) => {
        onCreateTestCase(newTestCase)
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }
    function onEdit() {
      context.root.$q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }

    async function onGenerateDevCode() {
      const tickedNodes = tree.value.getTickedNodes()
      const testcases = tickedNodes.filter((n: any) => n.nodeType === 'TestCase') as TestCaseInterface[]
      const numberOfTestCase = tickedNodes.filter((n: TestCaseInterface) => n.nodeType === 'TestCase').length
      if (numberOfTestCase === 0) {
        context.root.$q.notify({
          type: 'negative',
          message: 'No test case is selected',
        });
        return
      }
      try {
        await context.root.$store.dispatch('global/generateDevCode', testcases);
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error.error}`,
        });
      }
    }

    async function buildProject() {
      try {
        await context.root.$store.dispatch('global/buildProject');
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error.error}`,
        });
      }
    }

    async function createDevQueue() {
      const tickedNodes = tree.value.getTickedNodes()
      const testcases = tickedNodes.filter((n: any) => n.nodeType === 'TestCase') as TestCaseInterface[]
      try {
        await context.root.$store.dispatch('global/createDevQueue', { testcases, testClient: selectedTestClient.value });
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error.error}`,
        });
      }
    }
    async function onRun() {
      console.log('selectedTestClient', selectedTestClient)
      if (selectedTestClient.value === undefined) {
        context.root.$q.notify({
          type: 'negative',
          message: 'No test client is selected',
        });
        return
      }
      await onGenerateDevCode();
      await buildProject();
      await createDevQueue();
    }

    function onDeleteNode(value: any) {
      context.root.$q.notify({
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
      toogleTree,
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
::v-deep .q-tree__node-header {
  padding-top: 0;
  padding-bottom: 0;
}
::v-deep .q-tree__node {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
