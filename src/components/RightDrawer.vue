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
          :filter = "kwFilter"
          separator="cell"
          :visible-columns="keywordVisibleColumns"
        >
        <template v-slot:top>
          <div class="col-2 q-table__title">Keywords</div>
          <q-toggle v-model="keywordVisibleColumns" val="owner" label="Owner" />
          <q-toggle v-model="keywordVisibleColumns" val="createdDate" label="CreatedDate" />
        </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              @click="onSelectKeyword(props.row)"
              class="cursor-pointer"
              >
              <q-td key="no" :props="props">
                {{ props.row.rowIndex }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.Name }}
              </q-td>
              <q-td key="description" :props="props" style="white-space: normal;">
                <div>{{ props.row.Description }}</div>
              </q-td>
              <q-td key="owner" :props="props">
                {{ props.row.Owner }}
              </q-td>
              <q-td key="updatedMessage" :props="props">
                {{ props.row.UpdatedMessage }}
              </q-td>
              <q-td key="createdDate" :props="props">
                {{ props.row.CreatedDate }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <q-table
          dense
          title="Parameters"
          :data="paramDatas"
          :columns="paramColumns"
          row-key="name"
          :hide-pagination="true"
          separator="cell"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              >
              <q-td key="no" :props="props" class="q-c-input">
                {{ props.row.rowIndex }}
              </q-td>
              <q-td key="name" :props="props" class="q-c-input">
                {{ props.row.Name }}
              </q-td>
              <q-td key="value" :props="props" class="q-c-input">
                <q-input v-model="props.row.Value" dense borderless/>
              </q-td>
              <q-td key="testBed" :props="props" class="q-c-input">
                {{ props.row.TestBed }}
              </q-td>
              <q-td key="description" :props="props" style="white-space: normal;" class="q-c-input">
                {{ props.row.Description }}
              </q-td>
              <q-td key="example" :props="props" class="q-c-input" style="white-space: normal;">
                {{ props.row.ExampleValue }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
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
    const selectedKeyword = ref()
    const kwFilter = ref('');
    const isShowOwner = ref(true);
    const isShowCreatedDate = ref(false);
    const allKeyword = ref();
    const paramDatas: Ref<any[]> = ref([]);
    const paramColumns = [
      {
        name: 'no',
        required: true,
        label: 'No',
        align: 'left',
        field: 'rowIndex',
        sortable: false,
        style: 'max-width: 40px',
        headerStyle: 'max-width: 40px',
      },
      {
        name: 'name',
        required: true,
        label: 'Name',
        align: 'left',
        field: 'Name',
        format: (val: any) => `${val}`,
        sortable: false,
      },
      {
        name: 'value',
        align: 'left',
        label: 'Value',
        field: 'Value',
        sortable: false,
        style: 'min-width: 100px',
        headerStyle: 'min-width: 100px',
      },
      {
        name: 'testBed',
        align: 'left',
        label: 'TestBed',
        field: 'TestBed',
        sortable: false,
      },
      {
        name: 'description',
        align: 'left',
        label: 'Description',
        field: 'Description',
        sortable: false,
      },
      {
        name: 'example',
        align: 'left',
        label: 'Example',
        field: 'ExampleValue',
        sortable: false,
        style: 'max-width: 100px',
        headerStyle: 'max-width: 100px',
      },
    ]
    const keywordColumns = [
      {
        name: 'no',
        required: true,
        label: 'No',
        align: 'left',
        field: 'rowIndex',
        sortable: true,
        style: 'max-width: 40px',
        headerStyle: 'max-width: 40px',
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
        style: 'max-width: 500px',
        headerStyle: 'max-width: 500px',
      },
      {
        name: 'owner',
        align: 'left',
        label: 'Owner',
        field: 'Owner',
        sortable: false,
      },
      {
        name: 'updatedMessage',
        align: 'left',
        label: 'Updated Message',
        field: 'UpdatedMessage',
        sortable: true,
      },
      {
        name: 'createdDate',
        align: 'left',
        label: 'CreatedDate',
        field: 'CreatedDate',
        sortable: false,
      },
    ];
    const keywordVisibleColumns: Ref<string[]> = ref(['no', 'name', 'description', 'owner', 'updatedMessage', 'createdDate']);
    const keywordDatas: Ref<any[]> = ref([]);
    allKeyword.value = context.root.$store.getters['keyword/keywords'];
    categories.options = allKeyword.value.categories.map((c: { Name: string; }) => c.Name);
    allKeyword.value.categories.forEach((c: { Features: []; }) => {
      c.Features.forEach((f: { Name: never; }) => features.options.push(f.Name));
    })
    allKeyword.value.categories.forEach((c: any) => {
      c.Features.forEach((f: any) => {
        f.Keywords.forEach((k: any) => {
          k = { ...k, Category: c.Name, Feature: f.Name }
          keywordDatas.value.push(k);
        })
      });
    });
    keywordDatas.value = keywordDatas.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))

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

    function onFeatureChange() {
      console.log('selectedFeature', features.selectedFeature)
      keywordDatas.value = [];
      if (categories.selectedCategory == null) {
        if (features.selectedFeature == null) {
          // Todo: Load all keywords
          allKeyword.value.categories.forEach((c: any) => {
            c.Features.forEach((f: any) => {
              f.Keywords.forEach((k: any) => {
                k = { ...k, Category: c.Name, Feature: f.Name }
                keywordDatas.value.push(k);
              })
            });
          });
        } else {
          // Todo: Load all keywords base on Feature
          allKeyword.value.categories.forEach((c: any) => {
            c.Features.forEach((f: any) => {
              if (f.Name === features.selectedFeature) {
                f.Keywords.forEach((k: any) => {
                  k = { ...k, Category: c.Name, Feature: f.Name }
                  keywordDatas.value.push(k)
                })
              }
            });
          });
        }
      } else if (features.selectedFeature == null) {
        // Load all keyword that contains category
        allKeyword.value.categories.forEach((c: any) => {
          if (c.Name === categories.selectedCategory) {
            c.Features.forEach((f: any) => {
              f.Keywords.forEach((k: any) => {
                k = { ...k, Category: c.Name, Feature: f.Name }
                keywordDatas.value.push(k);
              })
            });
          }
        });
      } else {
        // Load all keyword that contains both category and feature
        allKeyword.value.categories.forEach((c: any) => {
          if (c.Name === categories.selectedCategory) {
            c.Features.forEach((f: any) => {
              if (f.Name === features.selectedFeature) {
                f.Keywords.forEach((k: any) => {
                  k = { ...k, Category: c.Name, Feature: f.Name }
                  keywordDatas.value.push(k)
                })
              }
            });
          }
        });
      }
      keywordDatas.value = keywordDatas.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))
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
      onFeatureChange();
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

    function showParams(selectedKw: any) {
      paramDatas.value = []
      selectedKw.Params.forEach((p: any) => {
        paramDatas.value.push(p)
      });
      paramDatas.value = paramDatas.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))
    }

    function onSelectKeyword(row: any) {
      // todo
      console.log('selectedKw', row)
      selectedKeyword.value = row
      showParams(selectedKeyword.value)
    }

    return {
      kwFilter,
      categories,
      features,
      isShowOwner,
      isShowCreatedDate,
      keywordDatas,
      keywordColumns,
      keywordVisibleColumns,
      filterCategory,
      abortFilterCategory,
      onCategoryChange,
      filterFeature,
      abortFilterFeature,
      onFeatureChange,
      onSelectKeyword,
      paramDatas,
      paramColumns,
      selectedKeyword,
    };
  },
});
</script>
<style scoped lang="scss">
::v-deep .q-c-input {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
}
</style>
