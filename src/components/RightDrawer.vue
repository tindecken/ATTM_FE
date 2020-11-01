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
          @input="val => { onFeatureChange() }"
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
          :data="keywordDatas"
          :columns="keywordColumns"
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
  defineComponent, reactive, Ref, ref,
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
    const keywordColumns = [
      {
        name: 'no',
        required: true,
        label: 'No',
        align: 'left',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        field: 'rowIndex',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        field: 'Name',
        format: (val: any) => `${val}`,
        sortable: true,
      },
      {
        name: 'description',
        align: 'left',
        label: 'Description',
        field: 'Description',
        sortable: true,
      },
      {
        name: 'updatedMessage',
        align: 'left',
        label: 'Updated Message',
        field: 'UpdatedMessage',
        sortable: true,
      },
    ];
    const keywordDatas: Ref<any[]> = ref([]);
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

    function onFeatureChange() {
      console.log('selectedFeature', features.selectedFeature)
      keywordDatas.value = [];
      if (categories.selectedCategory == null) {
        if (features.selectedFeature == null) {
          // Todo: Load all keywords
          allKeyword.value.categories.forEach((c: { Features: []; }) => {
            c.Features.forEach((f: { Keywords: []; }) => {
              f.Keywords.forEach((k: any) => {
                keywordDatas.value.push(k);
              })
            });
          });
          keywordDatas.value = keywordDatas.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))
        } else {
          // Todo: Load all keywords base on Feature
          allKeyword.value.categories.forEach((c: { Features: []; }) => {
            c.Features.forEach((f: any) => {
              if (f.Name === features.selectedFeature) {
                f.Keywords.forEach((k: any) => {
                  keywordDatas.value.push(k)
                })
              }
            });
          });
          console.log('keywordDatas', keywordDatas.value)
          keywordDatas.value = keywordDatas.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))
          console.log('keywordDatas', keywordDatas.value)
        }
      } else if (features.selectedFeature == null) {
        // Todo
      } else {
        // Todo
      }
    }

    return {
      kwFilter,
      selectedCategory,
      categories,
      selectedFeature,
      features,
      isShowOwner,
      isShowCreatedDate,
      keywordDatas,
      keywordColumns,
      filterCategory,
      abortFilterCategory,
      onCategoryChange,
      filterFeature,
      abortFilterFeature,
      onFeatureChange,
    };
  },
});
</script>
