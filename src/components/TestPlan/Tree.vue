<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="row q-col-gutter-xs">
      <div class="col">
        <q-input ref='filterInput' v-model="filter" label="Filter" dense outlined>
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-tree
          :nodes="simple"
          node-key="label"
          :filter="filter"
          default-expand-all
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api';

export default defineComponent({
  name: 'Tree',
  components: {},
  setup() {
    const filter: Ref<string> = ref('');
    const filterInput: Ref<any> = ref(null)
    const simple = ref([
      {
        label: 'Satisfied customers',
        children: [
          {
            label: 'Good food',
            children: [
              { label: 'Quality ingredients' },
              { label: 'Good recipe' },
            ],
          },
          {
            label: 'Good service (disabled node)',
            disabled: true,
            children: [
              { label: 'Prompt attention' },
              { label: 'Professional waiter' },
            ],
          },
          {
            label: 'Pleasant surroundings',
            children: [
              { label: 'Happy atmosphere' },
              { label: 'Good table presentation' },
              { label: 'Pleasing decor' },
            ],
          },
        ],
      },
    ])
    function resetFilter() {
      filter.value = ''
      filterInput.value.focus();
    }
    return {
      filter,
      resetFilter,
      simple,
      filterInput,
    }
  },
});
</script>
