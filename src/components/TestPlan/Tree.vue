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
          :nodes="allCat"
          node-key="_id"
          :filter="filter"
          default-expand-all
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from '@vue/composition-api';

export default defineComponent({
  name: 'Tree',
  components: {},
  setup(props, context) {
    const filter: Ref<string> = ref('');
    const filterInput: Ref<any> = ref(null)
    const allCat: Ref<any[]> = ref([]);
    allCat.value = context.root.$store.getters['category/categories'];
    console.log('allCat', allCat.value)
    function resetFilter() {
      filter.value = ''
      filterInput.value.focus();
    }
    onMounted(async () => {
      try {
        await context.root.$store.dispatch('category/getAllCategories');
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    });
    return {
      filter,
      resetFilter,
      allCat,
      filterInput,
    }
  },
});
</script>
