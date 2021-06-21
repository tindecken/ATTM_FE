<template>
  <q-menu touch-position context-menu ref="menuRef">
    <q-list dense style="min-width: 100px">
      <slot>
      </slot>
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="primary" name="create" />
        </q-item-section>
        <q-item-section>Edit</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="primary" name="content_copy" />
        </q-item-section>
        <q-item-section>Copy</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="primary" name="content_cut" />
        </q-item-section>
        <q-item-section>Cut</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="primary" name="content_paste" />
        </q-item-section>
        <q-item-section>Paste</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="primary" name="add" />
        </q-item-section>
        <q-item-section>Insert</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
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
      <q-item clickable v-close-popup @click="deleteRows()">
        <q-item-section avatar>
          <q-icon color="primary" name="delete_outline" />
        </q-item-section>
        <q-item-section>Delete</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="primary" name="toggle_on" />
        </q-item-section>
        <q-item-section>Enable</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section avatar>
          <q-icon color="primary" name="toggle_off" />
        </q-item-section>
        <q-item-section>Disable</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import {
  defineComponent, ref, Ref,
} from 'vue';

export default defineComponent({
  name: 'DetailContextMenu',
  props: {
    selected: Array,
  },
  components: {},
  setup(props, { emit }) {
    const menuRef: Ref<any> = ref(null)
    function deleteRows() {
      emit('deleteRows')
    }
    function useTestEnv() {
      emit('useTestEnv')
    }

    function insertDescription() {
      console.log('menuRef.value', menuRef.value)
      menuRef.value.toggle()
      emit('insertDescription')
    }
    return {
      menuRef,
      deleteRows,
      useTestEnv,
      insertDescription,
    };
  },
})
</script>
