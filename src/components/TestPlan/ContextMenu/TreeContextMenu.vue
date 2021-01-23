<template>
  <q-menu touch-position context-menu>
    <q-list dense style="min-width: 100px">
      <q-item clickable v-close-popup>
        <q-item-section>Edit</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section>Copy</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section>Cut</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section>Paste</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section>Insert</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section>Insert and Past</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section>Insert Comment</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section @click="deleteRows()">Delete</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section>Enable</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section>Disable</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: 'TreeContextMenu',
  props: {
    selected: Array,
  },
  components: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, { emit }) {
    function deleteRows() {
      emit('deleteRows')
    }
    return {
      deleteRows,
    };
  },
})
</script>
