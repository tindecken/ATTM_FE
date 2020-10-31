<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col">
        <q-input dense outlined v-model="kwFilter" label="Filter" />
      </div>
      <div class="col">
        <q-select
          dense
          outlined
          v-model="categories.selectedCategory"
          :options="categories.options"
          label="Category"
          @filter="filterCategory"
          @filter-abort="abortFilterCategory"
          @input="val => { onCategoryChange() }"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          clearable
        />
      </div>
      <div class="col">
        <q-select
          dense
          outlined
          v-model="features.selectedFeature"
          :options="features.options"
          label="Feature"
          @filter="filterFeature"
          @filter-abort="abortFilterFeature"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          clearable
        />
      </div>
      <div class="col">
        <q-checkbox v-model="isShowOwner" label="Owner" />
        <q-checkbox v-model="isShowCreatedDate" label="Created Date" />
      </div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <q-table
          dense
          title="Keywords"
          :data="categories"
          :columns="categoriesColumns"
          row-key="name"
          :hide-pagination="true"
        />
      </div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <q-table
          dense
          title="Parameters"
          :data="keywordDatas"
          :columns="keywordColumns"
          row-key="name"
          :hide-pagination="true"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  defineComponent, reactive, ref,
} from '@vue/composition-api';

export default defineComponent({
  name: 'RightDrawer',
  props: {},
  setup(props, context) {
    const categories = reactive({
      selectedCategory: null,
      options: [],
    });
    const features = reactive({
      selectedFeature: null,
      options: [],
    })
    const kwFilter = ref('');
    const selectedCategory = ref();
    const selectedFeature = ref();
    const isShowOwner = ref(true);
    const isShowCreatedDate = ref(false);
    const allKeyword = ref();
    const keywordColumns = ref();
    const categoriesColumns = [
      {
        name: 'no',
        required: true,
        label: 'No',
        align: 'left',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        field: 'index',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        field: (row: { name: any }) => row.name,
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'calories',
        align: 'center',
        label: 'Description',
        field: 'calories',
        sortable: true,
      },
      {
        name: 'fat',
        label: 'Owner',
        field: 'fat',
        sortable: true,
      },
      { name: 'carbs', label: 'Created Date', field: 'carbs' },
      { name: 'protein', label: 'Image', field: 'protein' },
      { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
      {
        name: 'calcium',
        label: 'Calcium (%)',
        field: 'calcium',
        sortable: true,
        sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: 'iron',
        label: 'Iron (%)',
        field: 'iron',
        sortable: true,
        sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10),
      },
    ];
    const keywordDatas = [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%',
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%',
      },
      {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%',
      },
      {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%',
      },
      {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        sodium: 327,
        calcium: '7%',
        iron: '16%',
      },
      {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        sodium: 50,
        calcium: '0%',
        iron: '0%',
      },
      {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        sodium: 38,
        calcium: '0%',
        iron: '2%',
      },
      {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        sodium: 562,
        calcium: '0%',
        iron: '45%',
      },
      {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        sodium: 326,
        calcium: '2%',
        iron: '22%',
      },
      {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        sodium: 54,
        calcium: '12%',
        iron: '6%',
      },
    ];
    allKeyword.value = context.root.$store.getters['keyword/keywords'];
    categories.options = allKeyword.value.categories.map((c: { Name: string; }) => c.Name);
    allKeyword.value.categories.forEach((c: { Features: []; }) => {
      c.Features.forEach((f: { Name: never; }) => features.options.push(f.Name));
    });
    function filterCategory(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              categories.options = allKeyword.value.categories.map((c: { Name: string; }) => c.Name);
            } else {
              const needle = val.toLowerCase()
              // eslint-disable-next-line max-len
              categories.options = categories.options.filter((t: string) => t.toLowerCase().indexOf(needle) > -1)
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (refQ: any) => {
            if (val !== '' && refQ.options.length > 0) {
              refQ.setOptionIndex(-1) // reset optionIndex in case there is something selected
              // eslint-disable-next-line max-len
              refQ.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          },
        )
      }, 300)
    }
    function abortFilterCategory() {
      console.log('delayed filter aborted')
    }

    function onCategoryChange() {
      console.log('selectedCategory', categories.selectedCategory)
      features.options = []
      features.selectedFeature = null
      if (categories.selectedCategory == null) { // will display all features
        allKeyword.value.categories.forEach((c: { Features: []; }) => {
          c.Features.forEach((f: { Name: never; }) => features.options.push(f.Name));
        });
      } else { // only display features in specific category
        allKeyword.value.categories.forEach((c: { Features: []; Name: string; }) => {
          if (c.Name === categories.selectedCategory) {
            c.Features.forEach((f: { Name: never; }) => features.options.push(f.Name));
          }
        });
      }
    }

    function filterFeature(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              onCategoryChange()
            } else {
              const needle = val.toLowerCase()
              // eslint-disable-next-line max-len
              features.options = features.options.filter((t: string) => t.toLowerCase().indexOf(needle) > -1)
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (refQ: any) => {
            if (val !== '' && refQ.options.length > 0) {
              refQ.setOptionIndex(-1) // reset optionIndex in case there is something selected
              // eslint-disable-next-line max-len
              refQ.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          },
        )
      }, 300)
    }
    function abortFilterFeature() {
      console.log('delayed filter aborted')
    }

    return {
      kwFilter,
      selectedCategory,
      categories,
      selectedFeature,
      features,
      isShowOwner,
      isShowCreatedDate,
      categoriesColumns,
      keywordDatas,
      keywordColumns,
      filterCategory,
      abortFilterCategory,
      onCategoryChange,
      filterFeature,
      abortFilterFeature,
    };
  },
});
</script>
