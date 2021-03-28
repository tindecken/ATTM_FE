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
                  @generateCode="onGenerateCode()"
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
  defineComponent, onMounted, ref, Ref,
} from '@vue/composition-api';

import { CategoryInterface } from 'src/Models/Category';
import { TestGroupInterface } from 'src/Models/TestGroup';
import { TestCaseInterface } from 'src/Models/TestCase';
import { TestSuiteInterface } from 'src/Models/TestSuite';
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
    const isShowedNewTestSuiteDialog = ref(false)
    const isShowedNewTestGroupDialog = ref(false)
    const isShowedNewTestCaseDialog = ref(false)
    function resetFilter() {
      filter.value = ''
      filterInput.value.focus();
    }
    async function fnSelectedNode(target: any) {
      const currentNode = tree.value.getNodeByKey(target);
      console.log('currentNode: ', currentNode);
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
    onMounted(async () => {
      try {
        // get category
        await context.root.$store.dispatch('category/getAllCategories');
        allCat.value = context.root.$store.getters['category/categories'];
        console.log('allCat', allCat.value)
        // gt all TestAUT
        await context.root.$store.dispatch('global/getTestAUT');
        allTestAUT.value = context.root.$store.getters['global/testAuTs']
        console.log('allTestAUT', allTestAUT.value)
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
    function onRun() {
      context.root.$q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
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
        console.log('newTestGroup', newTestGroup);
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
        console.log('testCase', testCase);
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
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    }
    function onNewTestGroup(TestSuite: TestSuiteInterface) {
      console.log('TestSuite', TestSuite)
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
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
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
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    }
    function onEdit() {
      context.root.$q.notify({
        type: 'negative',
        message: 'Not develop yet',
      });
    }
    async function onGenerateCode() {
      const tickedNodes = tree.value.getTickedNodes()
      const testcases = tickedNodes.filter((n:any) => n.nodeType === 'TestCase')
      const numberOfTestCase = tickedNodes.filter((n:any) => n.nodeType === 'TestCase').length
      if (numberOfTestCase === 0) {
        context.root.$q.notify({
          type: 'negative',
          message: 'No test case is slected',
        });
        return
      }
      try {
        await context.root.$store.dispatch('global/generateCode', testcases);
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error.error}`,
        });
      }
    }
    function onDeleteNode(value: any) {
      console.log(value)
      context.root.$q.notify({
        type: 'negative',
        message: 'Not develop yet',
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
      onGenerateCode,
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
      isShowedNewTestSuiteDialog,
      isShowedNewTestGroupDialog,
      isShowedNewTestCaseDialog,
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
