<template>
  <q-menu touch-position context-menu>
    <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="play_arrow" />
          </q-item-section>
          <q-item-section @click="run()">Run</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="play_circle" />
          </q-item-section>
          <q-item-section @click="debug()">Debug</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="play_arrow" />
          </q-item-section>
          <q-item-section @click="runOn()">Run On</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="play_circle" />
          </q-item-section>
          <q-item-section @click="debugOn()">Debug On</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="code" />
          </q-item-section>
          <q-item-section @click="generateDevCode()">Generate Code</q-item-section>
        </q-item>
        <q-separator />
        <template v-if="node.nodeType == 'Category'">
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-icon color="primary" name="playlist_add" />
            </q-item-section>
            <q-item-section @click="newTestSuite()">New Test Suite</q-item-section>
          </q-item>
        </template>
        <template v-else-if="node.nodeType == 'TestSuite'">
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-icon color="primary" name="playlist_add" />
            </q-item-section>
            <q-item-section @click="newTestGroup()">New Test Group</q-item-section>
          </q-item>
        </template>
        <template v-else-if="node.nodeType == 'TestGroup'">
          <q-item clickable v-close-popup>
            <q-item-section avatar>
              <q-icon color="primary" name="playlist_add" />
            </q-item-section>
            <q-item-section @click="newTestCase()">New Test Case</q-item-section>
          </q-item>
        </template>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="create" />
          </q-item-section>
          <q-item-section @click="edit()">Edit</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section avatar>
            <q-icon color="primary" name="delete_outline" />
          </q-item-section>
          <q-item-section @click="deleteNode()">Delete</q-item-section>
        </q-item>
        <q-separator />
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

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
    function deleteNode() {
      emit('deleteNode', props.node)
    }

    function generateDevCode() {
      emit('generateDevCode')
    }
    function run() {
      emit('run')
    }
    function runOn() {
      emit('runOn')
    }
    function debug() {
      emit('debug')
    }
    function debugOn() {
      emit('debugOn')
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
    return {
      deleteNode,
      generateDevCode,
      run,
      runOn,
      debug,
      debugOn,
      newTestSuite,
      newTestGroup,
      newTestCase,
      edit,
    };
  },
})
</script>
