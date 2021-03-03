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
    const allCat: Ref<any[]> = ref([]);
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
          const opennedTCs = context.root.$store.getters['testcase/opennedTCs'];
          const found = opennedTCs.some((el: any) => el.Id === currentNode.Id);
          if (found) {
            const testcase = opennedTCs.find((el: any) => el.Id === currentNode.Id)
            context.root.$store.commit('testcase/setOpennedTCs', testcase);
          } else {
            await context.root.$store.dispatch('testcase/getTestCasebyId', currentNode.Id);
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
    async function onCreateTestGroup(tgInfo: any) {
      try {
        console.log('tgInfo', tgInfo);
        await context.root.$store.dispatch('testsuite/createTestGroup', tgInfo);
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

    async function onCreateTestCase(tcInfo: any) {
      try {
        console.log('tcInfo', tcInfo);
        await context.root.$store.dispatch('testgroup/createTestCase', tcInfo);
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

    function onNewTestSuite(node: any) {
      console.log('node', node)
      // check if current node is not Category --> return
      if (node.nodeType !== 'Category') {
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
        category: node,
      }).onOk((tsInfo: any) => {
        onCreateTestSuite(tsInfo)
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    }
    function onNewTestGroup(node: any) {
      console.log('node', node)
      // check if current node is not TestSuite --> return
      if (node.nodeType !== 'TestSuite') {
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
        testsuite: node,
        catId: node.catId,
      }).onOk((tgInfo: any) => {
        onCreateTestGroup(tgInfo)
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Called on OK or Cancel')
      })
    }
    function onNewTestCase(node: any) {
      console.log('node', node)
      // check if current node is not TestGroup --> return
      if (node.nodeType !== 'TestGroup') {
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
        testGroup: node,
        catId: node.catId,
        tsId: node.tsId,
        tgId: node.tgId,
      }).onOk((tcInfo: any) => {
        onCreateTestCase(tcInfo)
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
