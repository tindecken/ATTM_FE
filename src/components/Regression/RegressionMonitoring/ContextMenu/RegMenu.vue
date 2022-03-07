<template>
  <q-menu touch-position context-menu class="q-menu-custom" auto-close>
    <q-list dense style="min-width: 100px">
      <slot>
      </slot>
      <q-item clickable v-close-popup @click="update()">
        <q-item-section avatar>
          <q-icon color="primary" name="edit" />
        </q-item-section>
        <q-item-section>Update</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="copyTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="play_circle_outline" />
        </q-item-section>
        <q-item-section>Re-run</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="cutTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="play_circle_outline" />
        </q-item-section>
        <q-item-section>Re-run On</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="pasteTestSteps()">
        <q-item-section avatar>
          <q-icon class="material-icons-outlined" color="primary" name="check_circle_outline" />
        </q-item-section>
        <q-item-section>Analyse Pass</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="insertTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="error_outline" />
        </q-item-section>
        <q-item-section>Analyse Fail</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="insertPasteTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="warning_amber" />
        </q-item-section>
        <q-item-section>InCompatible</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="insertDescription()">
        <q-item-section avatar>
          <q-icon color="primary" name="content_copy" />
        </q-item-section>
        <q-item-section>Error Message</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="deleteTestSteps()">
        <q-item-section avatar>
          <q-icon color="primary" name="content_copy" />
        </q-item-section>
        <q-item-section>Running Log</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="enableRows()">
        <q-item-section avatar>
          <q-icon color="primary" name="history" />
        </q-item-section>
        <q-item-section>Histories</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegMenu',
  props: {
    selected: Array,
  },
  components: {},
  setup(props, { emit }) {
    function update() {
      emit('update')
    }
    function enableRows() {
      emit('enableRows')
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
    function deleteTestSteps() {
      emit('deleteTestSteps')
    }
    return {
      update,
      enableRows,
      useTestEnv,
      insertDescription,
      copyTestSteps,
      cutTestSteps,
      pasteTestSteps,
      insertTestSteps,
      insertPasteTestSteps,
      deleteTestSteps,
    };
  },
})
</script>
<style scoped lang="scss">
::v-deep(.q-menu) {
  box-shadow: 0 0px 1px rgb(0 0 0 / 20%), 0 0px 0px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%) !important;
}
</style>
