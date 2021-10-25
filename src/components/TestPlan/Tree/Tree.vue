<template>
  <div class="q-pa-xs">
    <div class="row">
      <div class="col-8 q-mr-sm">
        <q-input ref='filterInput' v-model="filter" label="Filter" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
          </template>
        </q-input>
      </div>
      <div class="col self-center">
        <q-btn dense @click="toggleTree()" v-if="allCat.length > 0">Toggle</q-btn>
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
            no-nodes-label="There is no category, create one!"
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
                  @newCategory="onNewCategory(prop.node)"
                  @newTestSuite="onNewTestSuite(prop.node)"
                  @newTestGroup="onNewTestGroup(prop.node)"
                  @newTestCase="onNewTestCase(prop.node)"
                  @edit="onEdit(prop.node)"
                  @deleteNodes="onDeleteNodes(prop.node)"
                  >
                </tree-context-menu>
              </div>
            </div>
          </template>
          </q-tree>
          <q-btn v-if="allCat.length === 0" label="Create Category" @click="createCategory()"></q-btn>
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
import TreeContextMenu from './Menu/TreeContextMenu.vue'
import NewTestSuiteDialog from './Dialog/NewTestSuiteDialog.vue'
import NewTestGroupDialog from './Dialog/NewTestGroupDialog.vue'
import NewTestCaseDialog from './Dialog/NewTestCaseDialog.vue'
import DeleteTestCaseDialog from './Dialog/DeleteTestCaseDialog.vue'
import DeleteTestGroupDialog from './Dialog/DeleteTestGroupDialog.vue'
import DeleteTestSuiteDialog from './Dialog/DeleteTestSuiteDialog.vue'
import DeleteCategoryDialog from './Dialog/DeleteCategoryDialog.vue'
import NewCategoryDialog from './Dialog/NewCategoryDialog.vue';
import EditTestCaseDialog from './Dialog/EditTestCaseDialog.vue';

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
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    });
    function toggleTree() {
      const firstCategory = allCat.value[0]
      if (tree.value.isExpanded(firstCategory.Id)) {
        tree.value.collapseAll();
      } else {
        tree.value.expandAll();
      }
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
        const testsuite = await $store.dispatch('category/createTestSuite', tsInfo) as TestSuiteInterface;
        tree.value.setExpanded(testsuite.CategoryId, true)
        selectedNode.value = testsuite.Id
        $q.notify({
          type: 'positive',
          message: 'Created new test suite !',
        });
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }
    async function onCreateTestGroup(newTestGroup: TestGroupInterface) {
      try {
        const testGroup = await $store.dispatch('testsuite/createTestGroup', newTestGroup) as TestGroupInterface;
        tree.value.setExpanded(testGroup.TestSuiteId, true)
        selectedNode.value = testGroup.Id
        $q.notify({
          type: 'positive',
          message: 'Created new test group !',
        });
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }

    async function onCreateTestCase(testCase: TestCaseInterface) {
      try {
        const createTestCase = await $store.dispatch('testgroup/createTestCase', testCase) as TestCaseInterface;
        tree.value.setExpanded(createTestCase.TestGroupId, true)
        selectedNode.value = createTestCase.Id
        $q.notify({
          type: 'positive',
          message: `Created new test case: ${createTestCase.Name} !`,
        });
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }

    function createCategory() {
      $q.dialog({
        component: NewCategoryDialog,
        componentProps: {
        },
      }).onOk(async (newCategory: CategoryInterface) => {
        try {
          const category = await $store.dispatch('category/createCategory', newCategory);
          console.log('category', category);
          $q.notify({
            type: 'positive',
            message: `Created new category: ${category.Name}`,
          });
        } catch (error: any) {
          $q.notify({
            type: 'negative',
            message: `${error}`,
          });
        }
        console.log('newCategory', newCategory);
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
    }

    function onNewCategory(Category: CategoryInterface) {
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
        component: NewCategoryDialog,
        componentProps: {
        },
      }).onOk(async (newCategory: CategoryInterface) => {
        try {
          const category = await $store.dispatch('category/createCategory', newCategory);
          console.log('category', category);
          $q.notify({
            type: 'positive',
            message: `Created new category: ${category.Name}`,
          });
        } catch (error: any) {
          $q.notify({
            type: 'negative',
            message: `${error.message}`,
          });
        }
        console.log('newCategory', newCategory);
      }).onCancel(() => {
        // TODO
      }).onDismiss(() => {
        // TODO
      })
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
    function onEdit(node: CategoryInterface | TestSuiteInterface | TestGroupInterface | TestCaseInterface) {
      switch (node.nodeType) {
        case 'TestCase':
          $q.dialog({
            component: EditTestCaseDialog,
            componentProps: {
              TestCase: node,
            },
          }).onOk((newTestCase: TestCaseInterface) => {
            // TODO: handle ok
            console.log('newTestCase', newTestCase);
          }).onCancel(() => {
            // TODO
          }).onDismiss(() => {
            // TODO
          })
          break;
        case 'TestGroup':
          // TODO
          break;
        case 'TestSuite':
          // TODO
          break;
        case 'Category':
          // TODO
          break;
        default:
          break;
      }
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
      } catch (error: any) {
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
      } catch (error: any) {
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
      } catch (error: any) {
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

    function onDeleteNodes(node: any) {
      const tickedNodes = tree.value.getTickedNodes();
      // Get actual ticked nodes, this is a Quasar issue, after delete node in tree, it return undefined nodes
      const actualTickedNodes = tickedNodes.filter((n: any) => n !== undefined && n !== null);
      console.log('tickedNodes', tickedNodes)
      console.log('actualTickedNodes', actualTickedNodes)
      if (actualTickedNodes.length !== 0) {
        const testCases = actualTickedNodes.filter((n: any) => n && n.nodeType === 'TestCase') as TestCaseInterface[];
        if (testCases.length !== 0) {
          $q.dialog({
            component: DeleteTestCaseDialog,
            componentProps: {
              testCases,
            },
          })
            .onOk(async () => {
              try {
                const deleteResult = await $store.dispatch('testgroup/deleteTestCase', testCases)
                $q.notify({
                  type: 'positive',
                  message: `Deleted ${deleteResult.length} test case(s) `,
                })
                tree.value.setTicked(testCases[0].TestGroupId, false)
              } catch (err: any) {
                $q.notify({
                  type: 'negative',
                  message: `${err}`,
                })
              }
            })
            .onCancel(() => {
              // TODO
            })
            .onDismiss(() => {
              // TODO
            });
        }
      } else {
        const currentNode = tree.value.getNodeByKey(node.Id);
        console.log('currentNode', currentNode);
        switch (currentNode.nodeType) {
          case 'Category':
            const category = currentNode as CategoryInterface;
            $q.dialog({
              component: DeleteCategoryDialog,
              componentProps: {
                category,
              },
            })
              .onOk(async () => {
                try {
                  const deleteResult = await $store.dispatch('category/deleteCategory', category)
                  console.log('deleteResult', deleteResult)
                  $q.notify({
                    type: 'positive',
                    message: `${deleteResult.data.message}`,
                  })
                } catch (err: any) {
                  $q.notify({
                    type: 'negative',
                    message: `${err}`,
                  })
                }
              })
              .onCancel(() => {
              // TODO
              })
              .onDismiss(() => {
              // TODO
              });
            break
          case 'TestSuite':
            const testSuite: TestSuiteInterface = currentNode as TestSuiteInterface
            $q.dialog({
              component: DeleteTestSuiteDialog,
              componentProps: {
                testSuite,
              },
            })
              .onOk(async () => {
                try {
                  const deleteResult = await $store.dispatch('category/deleteTestSuite', testSuite)
                  console.log('deleteResult', deleteResult)
                  $q.notify({
                    type: 'positive',
                    message: `${deleteResult.data.message}`,
                  })
                } catch (err: any) {
                  $q.notify({
                    type: 'negative',
                    message: `${err}`,
                  })
                }
              })
              .onCancel(() => {
              // TODO
              })
              .onDismiss(() => {
              // TODO
              });
            break
          case 'TestGroup':
            const testGroup: TestGroupInterface = currentNode as TestGroupInterface
            $q.dialog({
              component: DeleteTestGroupDialog,
              componentProps: {
                testGroup,
              },
            })
              .onOk(async () => {
                try {
                  const deleteResult = await $store.dispatch('testsuite/deleteTestGroup', testGroup)
                  console.log('deleteResult', deleteResult)
                  $q.notify({
                    type: 'positive',
                    message: `${deleteResult.data.message}`,
                  })
                } catch (err: any) {
                  $q.notify({
                    type: 'negative',
                    message: `${err}`,
                  })
                }
              })
              .onCancel(() => {
              // TODO
              })
              .onDismiss(() => {
              // TODO
              });
            break
          case 'TestCase':
            const testCase: TestCaseInterface = currentNode as TestCaseInterface
            $q.dialog({
              component: DeleteTestCaseDialog,
              componentProps: {
                testCases: [testCase],
              },
            })
              .onOk(async () => {
                try {
                  const deleteResult = await $store.dispatch('testgroup/deleteTestCase', [testCase])
                  $q.notify({
                    type: 'positive',
                    message: `Deleted ${deleteResult.length} test case(s) `,
                  })
                } catch (err: any) {
                  $q.notify({
                    type: 'negative',
                    message: `${err}`,
                  })
                }
              })
              .onCancel(() => {
              // TODO
              })
              .onDismiss(() => {
              // TODO
              });
            break
          default:
            break
        }
      }
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
      onDeleteNodes,
      onGenerateDevCode,
      onRun,
      onRunOn,
      onDebug,
      onDebugOn,
      onEdit,
      onNewTestSuite,
      onNewTestGroup,
      onNewTestCase,
      createCategory,
      onNewCategory,
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
