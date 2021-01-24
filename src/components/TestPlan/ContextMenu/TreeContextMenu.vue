<template>
  <q-menu touch-position context-menu>
    <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section @click="run()">Run</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section @click="debug()">Debug</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section @click="runOn()">Run On</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section @click="debugOn()">Debug On</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section @click="generateCode()">Generate Code</q-item-section>
        </q-item>
        <q-separator />
        <template v-if="node.type == 'Category'">
          <q-item clickable v-close-popup>
            <q-item-section @click="newTestSuite()">New Test Suite</q-item-section>
          </q-item>
        </template>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section @click="edit()">Edit</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section @click="deleteNode()">Delete</q-item-section>
        </q-item>
        <q-separator />
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

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
      console.log('node', props.node)
      emit('deleteNode', props.node)
    }

    function generateCode() {
      emit('generateCode')
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
    function edit() {
      emit('edit')
    }
    return {
      deleteNode,
      generateCode,
      run,
      runOn,
      debug,
      debugOn,
      newTestSuite,
      edit,
    };
  },
})
</script>
