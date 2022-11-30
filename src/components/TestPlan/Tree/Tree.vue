<template>
  <div class="q-pa-xs">
    <div class="row">
      <div class="col-8 q-mr-sm">
        <q-input ref="filterInput" v-model="filter" label="Filter" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
          </template>
        </q-input>
      </div>
      <div class="col self-center">
        <q-btn outline color="primary" @click="toggleTree()" v-if="allCat.length > 0">Toggle</q-btn>
      </div>
    </div>
    <q-scroll-area style="height: 85vh; max-width: 600px">
      <div class="row q-mt-md">
        <div class="col">
          <q-tree
            dense
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
            no-selection-unset
          >
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <div style="display: inherit">
                  <icon-status :Node="prop.node" />
                  <!-- <q-icon :name="prop.node.icon" class="q-mr-sm self-center" color="primary" /> -->
                  <div>{{ prop.node.label }}</div>
                  <tree-context-menu
                    :node="prop.node"
                    @generateDevCode="onGenerateDevCode(tree.getTickedNodes())"
                    @copy="onCopyTestCase(prop.node)"
                    @pasteTestCase="onPasteTestCase(prop.node)"
                    @run="onRun()"
                    @newCategory="onNewCategory(prop.node)"
                    @newTestSuite="onNewTestSuite(prop.node)"
                    @newTestGroup="onNewTestGroup(prop.node)"
                    @newTestCase="onNewTestCase(prop.node)"
                    @edit="onEdit(prop.node)"
                    @deleteNodes="onDeleteNodes(prop.node)"
                    @viewProperties="onViewProperties(prop.node)"
                    @viewGenerateCode="onViewGenerateCode(prop.node)"
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

<script setup lang="ts">
import { computed, onMounted, ref, Ref, nextTick } from 'vue';

import { CategoryInterface } from '../../../Models/Category';
import { TestGroupInterface } from '../../../Models/TestGroup';
import { TestCaseInterface } from '../../../Models/TestCase';
import { TestSuiteInterface } from '../../../Models/TestSuite';
import { TestClientInterface } from '../../../Models/TestClient';
import { useQuasar } from 'quasar';
import uuid from 'uuid-random';
import { useGlobalStore } from '../../../pinia/globalStore';
import { useCategoryStore } from '../../../pinia/categoryStore';
import { useTestCaseStore } from '../../../pinia/testCaseStore';
import { useTestSuiteStore } from '../../../pinia/testSuiteStore';
import { useTestGroupStore } from '../../../pinia/testGroupStore';
import { useTestClientStore } from '../../../pinia/testClientStore';
import { TestCaseHistoryInterface } from '../../../Models/TestCaseHistory';
import _ from 'lodash';
import { TestStepInterface } from '../../../Models/TestStep';
import TreeContextMenu from './Menu/TreeContextMenu.vue';
import NewTestSuiteDialog from './Dialog/NewTestSuiteDialog.vue';
import NewTestGroupDialog from './Dialog/NewTestGroupDialog.vue';
import NewTestCaseDialog from './Dialog/NewTestCaseDialog.vue';
import DeleteTestCaseDialog from './Dialog/DeleteTestCaseDialog.vue';
import DeleteTestGroupDialog from './Dialog/DeleteTestGroupDialog.vue';
import DeleteTestSuiteDialog from './Dialog/DeleteTestSuiteDialog.vue';
import DeleteCategoryDialog from './Dialog/DeleteCategoryDialog.vue';
import NewCategoryDialog from './Dialog/NewCategoryDialog.vue';
import EditTestCaseDialog from './Dialog/EditTestCaseDialog.vue';
import EditCategoryDialog from './Dialog/EditCategoryDialog.vue';
import TestCasePropertiesDialog from './Dialog/TestCaseProperties/TestCasePropertiesDialog.vue';
import ViewGenerateCodeDialog from './Dialog/ViewGenerateCodeDialog.vue';
import EditTestSuiteDialog from './Dialog/EditTestSuiteDialog.vue';
import EditTestGroupDialog from './Dialog/EditTestGroupDialog.vue';
import IconStatus from './Labels/IconStatus.vue';
import { LastRegressionResultInterface } from '../../../Models/Entities/LastRegressionResult';

const globalStore = useGlobalStore();
const categoryStore = useCategoryStore();
const testCaseStore = useTestCaseStore();
const testSuiteStore = useTestSuiteStore();
const testGroupStore = useTestGroupStore();
const testClientStore = useTestClientStore();
const $q = useQuasar();
const filter: Ref<string> = ref('');
const filterInput: Ref<any> = ref(null);
const allCat: Ref<CategoryInterface[]> = ref([]);
const allTestAUT: Ref<any[]> = ref([]);
const selectedNode: Ref<any> = ref(null);
const ticked: Ref<any[]> = ref([]);
const tree: Ref<any> = ref(null);
function resetFilter() {
  filter.value = '';
  filterInput.value.focus();
}
async function fnSelectedNode(target: string) {
  const currentNode = tree.value.getNodeByKey(target) as TestCaseInterface;
  if (currentNode == null) return;
  switch (currentNode.nodeType) {
    case 'Category':
      globalStore.infoStatus.Info = `${currentNode.Name}`;
      break;
    case 'TestSuite':
      globalStore.infoStatus.Info = `${currentNode.CodeName}: ${currentNode.Name}`;
      break;
    case 'TestGroup':
      globalStore.infoStatus.Info = `${currentNode.CodeName}: ${currentNode.Name}`;
      break;
    case 'TestCase':
      globalStore.infoStatus.Info = `${currentNode.Id} - ${currentNode.CodeName}: ${currentNode.Name}`;
      const { openedTCs } = testCaseStore;
      const found = openedTCs.some((el: any) => el.Id === currentNode.Id);
      if (found) {
        const testcase = openedTCs.find((el: any) => el.Id === currentNode.Id) as TestCaseInterface;
        testCaseStore.setOpenedTCs(testcase);
      } else {
        await testCaseStore.getTestCaseById(currentNode.Id);
      }
      testCaseStore
        .GetLastRegressionResult(currentNode.Id)
        .then((resp) => {
          if (resp.data) categoryStore.setLastRegressionResultForTestCase(currentNode, resp.data as LastRegressionResultInterface);
        })
        .catch((error) => {
          console.log('error', error);
          $q.notify({
            type: 'negative',
            message: error.message ? error.message : error.error,
          });
        });
      break;
    default:
      break;
  }
}
const selectedTestClient = computed(() => testClientStore.selectedTestClient);
onMounted(async () => {
  try {
    // get category
    await categoryStore.getAllCategories();
    allCat.value = categoryStore.Categories;
    // get all TestAUT
    await globalStore.getTestAUT();
    allTestAUT.value = globalStore.testAUTs;
    await nextTick();
    tree.value.expandAll();
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error}`,
    });
  }
});
function toggleTree() {
  const firstCategory = allCat.value[0];
  if (tree.value.isExpanded(firstCategory.Id)) {
    tree.value.collapseAll();
  } else {
    tree.value.expandAll();
  }
}

async function onCreateTestSuite(tsInfo: any) {
  try {
    const testsuite = await categoryStore.createTestSuite(tsInfo);
    tree.value.setExpanded(testsuite.CategoryId, true);
    selectedNode.value = testsuite.Id;
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
    const testGroup = await testSuiteStore.createTestGroup(newTestGroup);
    tree.value.setExpanded(testGroup.TestSuiteId, true);
    selectedNode.value = testGroup.Id;
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
    const createTestCase = await testGroupStore.createTestCase(testCase);
    tree.value.setExpanded(createTestCase.TestGroupId, true);
    selectedNode.value = createTestCase.Id;
    void fnSelectedNode(createTestCase.Id);
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
async function onEditTestCase(editedTestCase: TestCaseHistoryInterface) {
  try {
    const editTestCase = await testCaseStore.editTestCase(editedTestCase);
    $q.notify({
      type: 'positive',
      message: `Updated test case: ${editTestCase.Name} !`,
    });
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'Unable to update test case !',
    });
  }
}
async function onEditCategory(editedCategory: CategoryInterface) {
  try {
    const editCategory = await categoryStore.editCategory(editedCategory);
    console.log('editCategory', editCategory);
    $q.notify({
      type: 'positive',
      message: `Updated category: ${editedCategory.Name} !`,
    });
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error.message}`,
    });
  }
}
async function onEditTestSuite(editedTestSuite: TestSuiteInterface) {
  try {
    const editTestSuite = await testSuiteStore.editTestSuite(editedTestSuite);
    $q.notify({
      type: 'positive',
      message: `Updated test suite: ${editedTestSuite.Name} !`,
    });
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error.message}`,
    });
  }
}
async function onEditTestGroup(editedTestGroup: TestGroupInterface) {
  try {
    const editTestGroup = await testGroupStore.editTestGroup(editedTestGroup);
    $q.notify({
      type: 'positive',
      message: `Updated test group: ${editedTestGroup.Name} !`,
    });
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error.message}`,
    });
  }
}

function createCategory() {
  $q.dialog({
    component: NewCategoryDialog,
    componentProps: {},
  })
    .onOk(async (newCategory: CategoryInterface) => {
      try {
        const category = await categoryStore.createCategory(newCategory);
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
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}

function onNewCategory(Category: CategoryInterface) {
  // check if current node is not Category --> return
  if (Category.nodeType !== 'Category') {
    $q.notify({
      type: 'negative',
      message: 'Something errors, node Type is not Category',
    });
    return;
  }
  // open new testsuite dialog
  $q.dialog({
    component: NewCategoryDialog,
    componentProps: {},
  })
    .onOk(async (newCategory: CategoryInterface) => {
      try {
        const category = await categoryStore.createCategory(newCategory);
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
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}

function onNewTestSuite(Category: CategoryInterface) {
  // check if current node is not Category --> return
  if (Category.nodeType !== 'Category') {
    $q.notify({
      type: 'negative',
      message: 'Something errors, node Type is not Category',
    });
    return;
  }
  // open new testsuite dialog
  $q.dialog({
    component: NewTestSuiteDialog,
    componentProps: {
      Category,
    },
  })
    .onOk((newTestSuite: TestSuiteInterface) => {
      void onCreateTestSuite(newTestSuite);
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function onNewTestGroup(TestSuite: TestSuiteInterface) {
  // check if current node is not TestSuite --> return
  if (TestSuite.nodeType !== 'TestSuite') {
    $q.notify({
      type: 'negative',
      message: 'Something errors, node Type is not TestSuite',
    });
    return;
  }
  // open new testgroup dialog
  $q.dialog({
    component: NewTestGroupDialog,
    componentProps: {
      TestSuite,
    },
  })
    .onOk((newTestGroup: TestGroupInterface) => {
      void onCreateTestGroup(newTestGroup);
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function onNewTestCase(testGroup: TestGroupInterface) {
  if (testGroup.nodeType !== 'TestGroup') {
    $q.notify({
      type: 'negative',
      message: 'Something errors, node Type is not TestGroup',
    });
    return;
  }
  // open new testcase dialog
  $q.dialog({
    component: NewTestCaseDialog,
    componentProps: {
      testGroup,
    },
  })
    .onOk((newTestCase: TestCaseInterface) => {
      void onCreateTestCase(newTestCase);
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function onEdit(node: CategoryInterface | TestSuiteInterface | TestGroupInterface | TestCaseInterface) {
  switch (node.nodeType) {
    case 'TestCase':
      $q.dialog({
        component: EditTestCaseDialog,
        componentProps: {
          TestCase: node,
        },
      })
        .onOk((editedTestCase: TestCaseHistoryInterface) => {
          // TODO: handle ok
          console.log('editedTestCase', editedTestCase);
          void onEditTestCase(editedTestCase);
        })
        .onCancel(() => {
          // TODO
        })
        .onDismiss(() => {
          // TODO
        });
      break;
    case 'TestGroup':
      $q.dialog({
        component: EditTestGroupDialog,
        componentProps: {
          TestGroup: node,
        },
      })
        .onOk((editedTestGroup: TestGroupInterface) => {
          // TODO: handle ok
          console.log('editedTestGroup', editedTestGroup);
          void onEditTestGroup(editedTestGroup);
        })
        .onCancel(() => {
          // TODO
        })
        .onDismiss(() => {
          // TODO
        });
      break;
      break;
    case 'TestSuite':
      $q.dialog({
        component: EditTestSuiteDialog,
        componentProps: {
          TestSuite: node as TestSuiteInterface,
        },
      })
        .onOk((editedTestSuite: TestSuiteInterface) => {
          // TODO: handle ok
          console.log('editedTestSuite', editedTestSuite);
          void onEditTestSuite(editedTestSuite);
        })
        .onCancel(() => {
          // TODO
        })
        .onDismiss(() => {
          // TODO
        });
      break;
    case 'Category':
      $q.dialog({
        component: EditCategoryDialog,
        componentProps: {
          Category: node,
        },
      })
        .onOk((editedCategory: CategoryInterface) => {
          // TODO: handle ok
          console.log('editedCategory', editedCategory);
          void onEditCategory(editedCategory);
        })
        .onCancel(() => {
          // TODO
        })
        .onDismiss(() => {
          // TODO
        });
      break;
    default:
      break;
  }
}

async function onGenerateDevCode(tickedNodes: any[]) {
  try {
    const testcases = tickedNodes.filter((n: any) => n.nodeType === 'TestCase') as TestCaseInterface[];
    const numberOfTestCase = tickedNodes.filter((n: TestCaseInterface) => n.nodeType === 'TestCase').length;
    if (numberOfTestCase === 0) {
      $q.notify({
        type: 'negative',
        message: 'No test case is selected',
      });
      return null;
    }
    const generateDevCodeResult: Promise<any> = await globalStore.generateDevCode(testcases);
    $q.notify({
      type: 'positive',
      message: 'Generate code success.',
    });
    return generateDevCodeResult;
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error.message}`,
    });
    return null;
  }
}

async function copyCodeToClient() {
  try {
    const checkping = await testClientStore.ping(selectedTestClient.value?.IPAddress as string);
    if (checkping.data !== 'success') {
      $q.notify({
        type: 'negative',
        message: `Ping to ${selectedTestClient.value?.IPAddress as string} failed, can't deploy code to this client !`,
        timeout: 10000,
      });
      return null;
    }
    const copyCodeToClientResult: Promise<any> = await globalStore.copydevcodetoclient(selectedTestClient.value as TestClientInterface);
    $q.notify({
      type: 'positive',
      message: `Copy code to client ${selectedTestClient.value?.Name as string} success.`,
    });
    return copyCodeToClientResult;
  } catch (error: any) {
    console.log('error', error);
    $q.notify({
      type: 'negative',
      message: `${error.message}`,
    });
    return null;
  }
}

async function buildProject() {
  try {
    const buildResult: Promise<any> = await globalStore.buildProject();
    $q.notify({
      type: 'positive',
      message: 'Build success.',
    });
    return buildResult;
  } catch (error: any) {
    $q.notify({
      progress: true,
      timeout: 10000,
      type: 'negative',
      message: `${error.buildMessage}`,
    });
    return null;
  }
}

async function createDevQueue(tickedNodes: any[]) {
  const testcases = tickedNodes.filter((n: any) => n.nodeType === 'TestCase') as TestCaseInterface[];
  try {
    const createDevQueueResult: any = await globalStore.createDevQueue({
      testcases,
      testClient: selectedTestClient.value,
    });
    console.log('createDevQueueResult', createDevQueueResult);
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

async function checkRunner() {
  try {
    const checkRunnerResult = await globalStore.checkautorunner(selectedTestClient.value as TestClientInterface);
    console.log('checkRunnerResult', checkRunnerResult);
    if (checkRunnerResult.result === 'success' && checkRunnerResult.message.includes('Runner is running')) {
      $q.notify({
        type: 'positive',
        message: `${checkRunnerResult.message}`,
      });
    } else {
      $q.notify({
        type: 'warning',
        message: `${checkRunnerResult.message} Open it to run the test.`,
        timeout: 10000,
      });
      globalStore.infoStatus.Info = `${checkRunnerResult.message} Open it to run the test.`;
    }
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: `${error.error ? error.error : error}`,
    });
  }
}
async function onRun() {
  if (selectedTestClient.value === undefined) {
    $q.notify({
      type: 'negative',
      message: 'No test client is selected',
    });
    return;
  }
  const tickedNodes = tree.value.getTickedNodes();
  console.log('tickNodes', tickedNodes);
  const generateCodeResult = await onGenerateDevCode(tickedNodes);
  if (generateCodeResult) {
    const buildProjectResult = await buildProject();
    if (buildProjectResult) {
      const copyCodeToClientResult = await copyCodeToClient();
      if (copyCodeToClientResult) {
        await createDevQueue(tickedNodes);
        await checkRunner();
      }
    }
  }
}

function onDeleteNodes(node: any) {
  const tickedNodes = tree.value.getTickedNodes();
  // Get actual ticked nodes, this is a Quasar issue, after delete node in tree, it return undefined nodes
  const actualTickedNodes = tickedNodes.filter((n: any) => n !== undefined && n !== null);
  console.log('tickedNodes', tickedNodes);
  console.log('actualTickedNodes', actualTickedNodes);
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
            const deleteResult = await testGroupStore.deleteTestCase(testCases);
            $q.notify({
              type: 'positive',
              message: `Deleted ${deleteResult.length} test case(s) `,
            });
            tree.value.setTicked(testCases[0].TestGroupId, false);
          } catch (err: any) {
            $q.notify({
              type: 'negative',
              message: `${err}`,
            });
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
              const deleteResult = await categoryStore.deleteCategory(category);
              console.log('deleteResult', deleteResult);
              $q.notify({
                type: 'positive',
                message: `${deleteResult.data.message}`,
              });
            } catch (err: any) {
              $q.notify({
                type: 'negative',
                message: `${err}`,
              });
            }
          })
          .onCancel(() => {
            // TODO
          })
          .onDismiss(() => {
            // TODO
          });
        break;
      case 'TestSuite':
        const testSuite: TestSuiteInterface = currentNode as TestSuiteInterface;
        $q.dialog({
          component: DeleteTestSuiteDialog,
          componentProps: {
            testSuite,
          },
        })
          .onOk(async () => {
            try {
              const deleteResult = await categoryStore.deleteTestSuite(testSuite);
              console.log('deleteResult', deleteResult);
              $q.notify({
                type: 'positive',
                message: `${deleteResult.data.message}`,
              });
            } catch (err: any) {
              $q.notify({
                type: 'negative',
                message: `${err}`,
              });
            }
          })
          .onCancel(() => {
            // TODO
          })
          .onDismiss(() => {
            // TODO
          });
        break;
      case 'TestGroup':
        const testGroup: TestGroupInterface = currentNode as TestGroupInterface;
        $q.dialog({
          component: DeleteTestGroupDialog,
          componentProps: {
            testGroup,
          },
        })
          .onOk(async () => {
            try {
              const deleteResult = await testSuiteStore.deleteTestGroup(testGroup);
              console.log('deleteResult', deleteResult);
              $q.notify({
                type: 'positive',
                message: `${deleteResult.data.message}`,
              });
            } catch (err: any) {
              $q.notify({
                type: 'negative',
                message: `${err}`,
              });
            }
          })
          .onCancel(() => {
            // TODO
          })
          .onDismiss(() => {
            // TODO
          });
        break;
      case 'TestCase':
        const testCase: TestCaseInterface = currentNode as TestCaseInterface;
        $q.dialog({
          component: DeleteTestCaseDialog,
          componentProps: {
            testCases: [testCase],
          },
        })
          .onOk(async () => {
            try {
              const deleteResult = await testGroupStore.deleteTestCase([testCase]);
              $q.notify({
                type: 'positive',
                message: `Deleted ${deleteResult.length} test case(s) `,
              });
            } catch (err: any) {
              $q.notify({
                type: 'negative',
                message: `${err}`,
              });
            }
          })
          .onCancel(() => {
            // TODO
          })
          .onDismiss(() => {
            // TODO
          });
        break;
      default:
        break;
    }
  }
}
function onViewProperties(node: any) {
  const currentNode = tree.value.getNodeByKey(node.Id);
  switch (currentNode.nodeType) {
    case 'Category':
      break;
    case 'TestSuite':
      break;
    case 'TestGroup':
      break;
    case 'TestCase':
      const testCase: TestCaseInterface = currentNode as TestCaseInterface;
      $q.dialog({
        component: TestCasePropertiesDialog,
        componentProps: {
          TestCase: testCase,
        },
      })
        .onOk(async () => {
          // TODO
        })
        .onCancel(() => {
          // TODO
        })
        .onDismiss(() => {
          // TODO
        });
      break;
    default:
      break;
  }
}
function onViewGenerateCode(node: TestCaseInterface) {
  if (node.nodeType !== 'TestCase') {
    $q.notify({
      type: 'negative',
      message: 'Something errors, node Type is not TestCase',
    });
    return;
  }
  $q.dialog({
    component: ViewGenerateCodeDialog,
    componentProps: {
      TestCase: node,
    },
  })
    .onOk(() => {
      // TODO
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function onCopyTestCase(testCase: TestCaseInterface) {
  console.log('a', testCase.TestSteps);
  const copiedTC = _.cloneDeep(testCase);
  copiedTC.CodeName = `${testCase.CodeName}`;
  copiedTC.Id = '';
  copiedTC.TestGroupId = '';
  copiedTC.TestSuiteId = '';
  copiedTC.CategoryId = '';
  copiedTC.TestSteps = copiedTC.TestSteps.map((step: TestStepInterface) => {
    step.UUID = uuid();
    return {
      ...step,
    };
  });
  console.log('b', copiedTC.TestSteps);
  testCaseStore.copiedTC = copiedTC;
}
async function onPasteTestCase(node: any) {
  console.log('onPasteTestCase', node);
  if (node.nodeType !== 'TestGroup') {
    $q.notify({
      type: 'negative',
      message: 'Something errors, node Type is not TestGroup',
    });
    return;
  }
  if (testCaseStore.copiedTC === undefined) {
    $q.notify({
      type: 'warning',
      message: 'No test case is copied, nothing to paste !',
    });
    return;
  }
  const testGroup: TestGroupInterface = node as TestGroupInterface;
  const tempTC = _.cloneDeep(testCaseStore.copiedTC);
  tempTC.CodeName = `${tempTC.CodeName}_${Math.floor(Math.random() * 100)}`;
  tempTC.TestGroupId = testGroup.Id;
  tempTC.TestSuiteId = testGroup.TestSuiteId;
  tempTC.CategoryId = testGroup.CategoryId;
  try {
    const createTestCaseResponse = await testGroupStore.createTestCase(tempTC);
    console.log('createTestCaseResponse', createTestCaseResponse);
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: `${err}`,
    });
  }
}
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
