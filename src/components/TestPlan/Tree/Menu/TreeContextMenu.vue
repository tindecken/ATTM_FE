<template>
  <q-menu touch-position context-menu>
    <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup @click="run()">
          <q-item-section avatar>
            <q-icon color="primary" name="play_arrow" />
          </q-item-section>
          <q-item-section>Run</q-item-section>
        </q-item>
        <template v-if="node.nodeType == 'TestCase'">
          <q-item clickable v-close-popup @click="copy()">
          <q-item-section avatar>
            <q-icon color="primary" name="content_copy" />
          </q-item-section>
          <q-item-section>Copy</q-item-section>
        </q-item>
        </template>
        <q-item clickable v-close-popup @click="viewGenerateCode()">
          <q-item-section avatar>
            <q-icon color="primary" name="code" />
          </q-item-section>
          <q-item-section>View Generate Code</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="generateDevCode()">
          <q-item-section avatar>
            <q-icon color="primary" name="code" />
          </q-item-section>
          <q-item-section>Generate Code</q-item-section>
        </q-item>
        <q-separator />
        <template v-if="node.nodeType == 'Category'">
          <q-item clickable v-close-popup @click="newCategory()">
            <q-item-section avatar>
              <q-icon color="primary" name="playlist_add" />
            </q-item-section>
            <q-item-section>New Category</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="newTestSuite()">
            <q-item-section avatar>
              <q-icon color="primary" name="playlist_add" />
            </q-item-section>
            <q-item-section>New Test Suite</q-item-section>
          </q-item>
        </template>
        <template v-else-if="node.nodeType == 'TestSuite'">
          <q-item clickable v-close-popup @click="newTestGroup()">
            <q-item-section avatar>
              <q-icon color="primary" name="playlist_add" />
            </q-item-section>
            <q-item-section>New Test Group</q-item-section>
          </q-item>
        </template>
        <template v-else-if="node.nodeType == 'TestGroup'">
          <q-item clickable v-close-popup @click="newTestCase()">
            <q-item-section avatar>
              <q-icon color="primary" name="playlist_add" />
            </q-item-section>
            <q-item-section>New Test Case</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="pasteTestCase()">
            <q-item-section avatar>
              <q-icon color="primary" name="content_paste" />
            </q-item-section>
            <q-item-section>Paste</q-item-section>
          </q-item>
        </template>
        <q-separator />
        <q-item clickable v-close-popup @click="edit()">
          <q-item-section avatar>
            <q-icon color="primary" name="create" />
          </q-item-section>
          <q-item-section>Edit</q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="deleteNodes()">
          <q-item-section avatar>
            <q-icon color="primary" name="delete_outline" />
          </q-item-section>
          <q-item-section>Delete</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="viewProperties()">
          <q-item-section avatar>
            <q-icon color="primary" name="info" />
          </q-item-section>
          <q-item-section>Properties</q-item-section>
        </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TreeContextMenu',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  components: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    function deleteNodes() {
      emit('deleteNodes')
    }
    function viewProperties() {
      emit('viewProperties')
    }
    function generateDevCode() {
      emit('generateDevCode')
    }
    function run() {
      emit('run')
    }
    function viewGenerateCode() {
      emit('viewGenerateCode')
    }
    function newCategory() {
      emit('newCategory')
    }
    function newTestSuite() {
      emit('newTestSuite')
    }
    function newTestGroup() {
      emit('newTestGroup')
    }
    function newTestCase() {
      emit('newTestCase')
    }
    function edit() {
      emit('edit')
    }
    function copy() {
      emit('copy')
    }
    function pasteTestCase() {
      emit('pasteTestCase')
    }
    return {
      deleteNodes,
      generateDevCode,
      run,
      viewGenerateCode,
      newCategory,
      newTestSuite,
      newTestGroup,
      newTestCase,
      edit,
      viewProperties,
      copy,
      pasteTestCase,
    };
  },
})
</script>
