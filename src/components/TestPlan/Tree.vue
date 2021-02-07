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
    <div class="row">
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
                @edit="onEdit()"
                @deleteNode="onDeleteNode(prop.node)"
                >
              </tree-context-menu>
              <template v-if="prop.node.nodeType === 'Category'">
                <new-test-suite-dialog 
                  :category="prop.node" 
                  :isShowed="isShowedNewTestSuiteDialog"
                  @createTestSuite="onCreateTestSuite()"
                  @cancelDialog="isShowedNewTestSuiteDialog = false"
                ></new-test-suite-dialog>
              </template>
            </div>
          </div>
        </template>
        </q-tree>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, Ref,
} from '@vue/composition-api';

import TreeContextMenu from './ContextMenu/TreeContextMenu.vue'
import NewTestSuiteDialog from './Dialog/NewTestSuiteDialog.vue'

export default defineComponent({
  name: 'Tree',
  components: { 
    TreeContextMenu,
    NewTestSuiteDialog
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
    function resetFilter() {
      filter.value = ''
      filterInput.value.focus();
    }
    async function fnSelectedNode(target: any) {
      const currentNode = tree.value.getNodeByKey(target);
      if (currentNode == null) return
      switch (currentNode.nodeType) {
        case 'Category':
          console.log('Category')
          // get testcase detail
          break
        case 'TestSuite':
          console.log('TestSuite')
          break
        case 'TestGroup':
          console.log('TestGroup')
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
        message: `Not develop yet`,
      });
    }
    function onRunOn() {
      context.root.$q.notify({
        type: 'negative',
        message: `Not develop yet`,
      });
    }
    function onDebug() {
      context.root.$q.notify({
        type: 'negative',
        message: `Not develop yet`,
      });
    }
    function onDebugOn() {
      context.root.$q.notify({
        type: 'negative',
        message: `Not develop yet`,
      });
    }
    function onNewTestSuite(node: any) {
      console.log('node', node)
      // check if current node is not Category --> return
      if(node.nodeType !== 'Category') {
        context.root.$q.notify({
          type: 'negative',
          message: `Something errors, node Type is not Category`,
        });
        return
      }
      // open new testsuite dialog
      isShowedNewTestSuiteDialog.value = true
    }
    function onEdit() {
      context.root.$q.notify({
        type: 'negative',
        message: `Not develop yet`,
      });
    }
    async function onGenerateCode() {
      const tickedNodes = tree.value.getTickedNodes()
      const testcases = tickedNodes.filter((n:any) => n.nodeType === 'TestCase')
      const numberOfTestCase = tickedNodes.filter((n:any) => n.nodeType === 'TestCase').length
      if (numberOfTestCase === 0) {
        context.root.$q.notify({
          type: 'negative',
          message: `No test case is slected`,
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
        message: `Not develop yet`,
      });
    }
    function onCreateTestSuite() {
      console.log('onCreateTestSuite')
      isShowedNewTestSuiteDialog.value = false
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
      onNewTestSuite,
      onEdit,
      onCreateTestSuite,
      isShowedNewTestSuiteDialog,
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
