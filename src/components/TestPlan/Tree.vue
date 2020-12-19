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
              <q-popup-proxy context-menu>
                <q-banner>
                  <template v-slot:avatar>
                    <q-icon name="signal_wifi_off" color="primary" />
                  </template>
                  You have lost connection to the internet. This app is offline.
                </q-banner>
              </q-popup-proxy>
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

export default defineComponent({
  name: 'Tree',
  components: {},
  setup(props, context) {
    const filter: Ref<string> = ref('');
    const filterInput: Ref<any> = ref(null)
    const allCat: Ref<any[]> = ref([]);
    const selectedNode: Ref<any> = ref(null)
    const ticked: Ref<any[]> = ref([])
    const tree: Ref<any> = ref(null)
    function resetFilter() {
      filter.value = ''
      filterInput.value.focus();
    }
    async function fnSelectedNode(target: any) {
      const currentNode = tree.value.getNodeByKey(target);
      if (currentNode == null) return
      switch (currentNode.type) {
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
          // // get currentTest
          // await context.root.$store.dispatch('testcase/getTestCasebyId', currentNode.Id);
          // const currentTest = context.root.$store.getters['testcase/opennedSelectedTC'];
          // console.log('currTest', currentTest);
          // // set rowIndex for testSteps
          // // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          // currentTest.TestSteps = currentTest.TestSteps.map((teststep: any, i: number) => ({ ...teststep, rowIndex: i + 1 }))
          // console.log('currTest', currentTest)
          // check is already open or not
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
        await context.root.$store.dispatch('category/getAllCategories');
        allCat.value = context.root.$store.getters['category/categories'];
        console.log('allCat', allCat.value)
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
    return {
      filter,
      resetFilter,
      allCat,
      filterInput,
      selectedNode,
      ticked,
      fnSelectedNode,
      tree,
      toogleTree,
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
