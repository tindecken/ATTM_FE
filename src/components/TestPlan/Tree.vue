<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input ref="filter" filled v-model="filter" label="Filter">
      <template v-slot:append>
        <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
      </template>
    </q-input>

    <q-tree
      :nodes="simple"
      node-key="label"
      :filter="filter"
      default-expand-all
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'Tree',
  components: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup() {
    const filter = ref('');
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
    }
    return {
      filter,
      resetFilter,
      simple,
    }
  },
});
</script>
