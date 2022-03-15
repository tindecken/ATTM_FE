<template>
  <q-menu touch-position context-menu>
    <q-list dense style="min-width: 100px">
      <slot>
      </slot>
      <q-item clickable v-close-popup @click="editTestStep()">
        <q-item-section avatar>
          <q-icon color="primary" name="create" />
        </q-item-section>
        <q-item-section>Edit</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="searchKeyword()">
        <q-item-section avatar>
          <q-icon color="primary" name="search" />
        </q-item-section>
        <q-item-section>Search</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="copyTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="content_copy" />
        </q-item-section>
        <q-item-section>Copy</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="cutTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="content_cut" />
        </q-item-section>
        <q-item-section>Cut</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="pasteTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="content_paste" />
        </q-item-section>
        <q-item-section>Paste</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="insertTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="add" />
        </q-item-section>
        <q-item-section>Insert</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="insertPasteTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="post_add" />
        </q-item-section>
        <q-item-section>Insert and Paste</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="insertDescription()">
        <q-item-section avatar>
          <q-icon color="primary" name="insert_comment" />
        </q-item-section>
        <q-item-section>Insert Description</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="deleteTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="delete_outline" />
        </q-item-section>
        <q-item-section>Delete</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="enableRows()">
        <q-item-section avatar>
          <q-icon color="primary" name="toggle_on" />
        </q-item-section>
        <q-item-section>Enable</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="disableRows()">
        <q-item-section avatar>
          <q-icon color="primary" name="toggle_off" />
        </q-item-section>
        <q-item-section>Disable</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DetailContextMenu',
  props: {
    selected: Array,
  },
  components: {},
  setup(props, { emit }) {
    function deleteTestSteps() {
      emit('deleteTestSteps')
    }
    function enableRows() {
      emit('enableRows')
    }
    function disableRows() {
      emit('disableRows')
    }
    function useTestEnv() {
      emit('useTestEnv')
    }
    function insertDescription() {
      emit('insertDescription')
    }
    function copyTestSteps() {
      emit('copyTestSteps')
    }
    function cutTestSteps() {
      emit('cutTestSteps')
    }
    function pasteTestSteps() {
      emit('pasteTestSteps')
    }
    function insertTestSteps() {
      emit('insertTestSteps')
    }
    function insertPasteTestSteps() {
      emit('insertPasteTestSteps')
    }
    function editTestStep() {
      emit('editTestStep')
    }
    function searchKeyword() {
      emit('searchKeyword')
    }
    return {
      deleteTestSteps,
      enableRows,
      disableRows,
      useTestEnv,
      insertDescription,
      copyTestSteps,
      cutTestSteps,
      pasteTestSteps,
      insertTestSteps,
      insertPasteTestSteps,
      editTestStep,
      searchKeyword,
    };
  },
})
</script>
