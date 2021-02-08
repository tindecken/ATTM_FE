<template>
  <q-dialog v-model="isShowed" persistent square>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New Test Group</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="cancelDialog()" v-close-popup />
          <q-btn flat label="Create" @click="createTestGroup()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: 'NewTestGroupDialog',
  props: {
    testsuite: {
      type: Object,
      required: true,
    },
    isShowed: {
      type: Boolean,
      required: true,
    }
  },
  components: {},
  setup(props, { emit }) {
    function createTestGroup() {
      console.log('create TestGroup')
      emit('createTestGroup')
    }
    function cancelDialog() {
      emit('cancelDialog')
    }
    return {
      createTestGroup,
      cancelDialog
    };
  },
})
</script>
