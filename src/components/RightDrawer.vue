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
          v-model="selectedKeywordCategory"
          :options="filteredKeywordCategories"
          label="Category"
          option-label="Name"
          @filter="filterCategory"
          @filter-abort="abortFilterCategory"
          @input="
            (val) => {
              onCategoryChange();
            }
          "
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
          v-model="selectedKeywordFeature"
          :options="filteredKeywordFeatures"
          label="Feature"
          option-label="Name"
          @filter="filterFeature"
          @filter-abort="abortFilterFeature"
          @input="
            (val) => {
              onFeatureChange();
            }
          "
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          clearable
        />
      </div>
      <div class="col"></div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <q-table
          dense
          title="Keywords"
          :rows="filteredKeywords"
          :columns="keywordColumns"
          row-key="name"
          :hide-pagination="true"
          :filter="kwFilter"
          separator="cell"
          :visible-columns="keywordVisibleColumns"
        >
          <template v-slot:top>
            <div class="col-2 q-table__title">Keywords</div>
            <q-toggle v-model="keywordVisibleColumns" val="owner" label="Owner" />
            <q-toggle v-model="keywordVisibleColumns" val="createdDate" label="CreatedDate" />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="onSelectKeyword(props.row)" class="cursor-pointer">
              <q-td key="no" :props="props">
                {{ props.row.rowIndex }}
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row.Name }}
              </q-td>
              <q-td key="description" :props="props" style="white-space: normal">
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
        <q-table dense title="Parameters" :rows="params" :columns="paramColumns" row-key="name" :hide-pagination="true" separator="cell">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="no" :props="props" class="q-c-input">
                {{ props.row.rowIndex }}
              </q-td>
              <q-td key="name" :props="props" class="q-c-input">
                {{ props.row.Name }}
              </q-td>
              <q-td key="value" :props="props" class="q-c-input">
                <q-input v-model="props.row.Value" dense borderless />
              </q-td>
              <q-td key="testBed" :props="props" class="q-c-input">
                {{ props.row.TestBed }}
              </q-td>
              <q-td key="description" :props="props" style="white-space: normal" class="q-c-input">
                {{ props.row.Description }}
              </q-td>
              <q-td key="example" :props="props" class="q-c-input" style="white-space: normal">
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
import { defineComponent, onBeforeMount, Ref, ref } from 'vue';
import { useKeywordStore } from '../pinia/keywordStore';
import { KeywordInterface } from '../Models/Keyword';
import { KeywordCategoryInterface } from '../Models/KeywordCategory';
import { KeywordFeatureInterface } from '../Models/KeywordFeature';
import { TestParamInterface } from '../Models/TestParam';
import { QSelect, useQuasar } from 'quasar';

export default defineComponent({
  name: 'RightDrawer',
  props: {},
  setup() {
    const keywordStore = useKeywordStore();
    const $q = useQuasar();
    const keywordCategories: Ref<KeywordCategoryInterface[]> = ref([]);
    const filteredKeywordCategories: Ref<KeywordCategoryInterface[]> = ref([]);
    const keywordFeatures: Ref<KeywordFeatureInterface[]> = ref([]);
    const filteredKeywordFeatures: Ref<KeywordFeatureInterface[]> = ref([]);
    const keywords: Ref<KeywordInterface[]> = ref([]);
    const filteredKeywords: Ref<KeywordInterface[]> = ref([]);
    const selectedKeywordCategory: Ref<KeywordCategoryInterface | null> = ref(null);
    const selectedKeywordFeature: Ref<KeywordFeatureInterface | null> = ref(null);
    const selectedKeyword: Ref<KeywordInterface | null> = ref(null);
    const kwFilter = ref('');
    const isShowOwner = ref(true);
    const isShowCreatedDate = ref(false);
    const params: Ref<TestParamInterface[]> = ref([]);
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
    ];
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

    onBeforeMount(async () => {
      keywordStore
        .getKeywords()
        .then(() => {
          // get all keywordFeatures
          keywordCategories.value.forEach((kwCategory: KeywordCategoryInterface) => {
            if (kwCategory.Features) {
              kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
                keywordFeatures.value.push(kwFeature);
              });
            }
          });
          // get all keywords
          keywordCategories.value.forEach((kwCategory: KeywordCategoryInterface) => {
            if (kwCategory.Features) {
              kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
                if (kwFeature.Keywords) {
                  kwFeature.Keywords.forEach((keyword: KeywordInterface) => {
                    keywords.value.push(keyword);
                  });
                }
              });
            }
          });
          // set filteredKeyword and add number
          filteredKeywords.value = keywords.value;
          filteredKeywords.value = filteredKeywords.value.map((kw: KeywordInterface, i: number) => ({ ...kw, rowIndex: i + 1 }));
        })
        .catch((error) => {
          $q.notify({
            type: 'negative',
            message: error.message ? error.message : error.error,
          });
        });
    });

    function filterCategory(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              filteredKeywordCategories.value = keywordCategories.value;
            } else {
              const needle = val.toLowerCase();
              filteredKeywordCategories.value = keywordCategories.value.filter(
                (kwCategory: KeywordCategoryInterface) => kwCategory.Name.toLowerCase().indexOf(needle) > -1
              );
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (refQ: QSelect) => {
            if (val !== '' && refQ.options && refQ.options.length > 0) {
              refQ.setOptionIndex(-1); // reset optionIndex in case there is something selected
              // eslint-disable-next-line max-len
              refQ.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    }
    function abortFilterCategory() {
      // TODO
    }

    function onFeatureChange() {
      filteredKeywords.value = [];
      if (selectedKeywordCategory.value == null) {
        // No category is selected
        if (selectedKeywordFeature.value == null) {
          filteredKeywords.value = keywords.value;
        } else {
          // Load all keywords base on Feature
          keywordCategories.value.forEach((kwCategory: KeywordCategoryInterface) => {
            if (kwCategory.Features) {
              kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
                if (kwFeature.Name === selectedKeywordFeature.value?.Name) {
                  if (kwFeature.Keywords) {
                    kwFeature.Keywords.forEach((kwKeyword: KeywordInterface) => {
                      filteredKeywords.value.push(kwKeyword);
                    });
                  }
                }
              });
            }
          });
        }
      } else if (selectedKeywordFeature.value == null) {
        // No Feature is selected
        // Load all keyword that contains category
        const kwCategory = keywordCategories.value.find((kwCat: KeywordCategoryInterface) => kwCat.Name === selectedKeywordCategory.value?.Name);
        if (kwCategory !== undefined && kwCategory.Features) {
          kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
            if (kwFeature.Keywords) {
              kwFeature.Keywords.forEach((keyword: KeywordInterface) => {
                filteredKeywords.value.push(keyword);
              });
            }
          });
        }
      } else {
        // Load all keyword that contains both category and feature
        // filteredKeywords.value = keywords.value
        const kwCategory = keywordCategories.value.find((kwCat: KeywordCategoryInterface) => kwCat.Name === selectedKeywordCategory.value?.Name);
        if (kwCategory !== undefined && kwCategory.Features) {
          kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
            if (kwFeature.Name === selectedKeywordFeature.value?.Name) {
              if (kwFeature.Keywords) {
                kwFeature.Keywords.forEach((keyword: KeywordInterface) => {
                  filteredKeywords.value.push(keyword);
                });
              }
            }
          });
        }
      }
      filteredKeywords.value = filteredKeywords.value.map((kw: KeywordInterface, i: number) => ({ ...kw, rowIndex: i + 1 }));
    }

    function onCategoryChange() {
      if (selectedKeywordCategory.value === null) {
        // will display all features
        filteredKeywordFeatures.value = keywordFeatures.value;
      } else if (selectedKeywordCategory.value?.Features !== undefined) filteredKeywordFeatures.value = selectedKeywordCategory.value?.Features;
      onFeatureChange();
    }

    function filterFeature(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              onCategoryChange();
            } else {
              const needle = val.toLowerCase();
              // eslint-disable-next-line max-len
              filteredKeywordFeatures.value = keywordFeatures.value.filter(
                (kwFeature: KeywordFeatureInterface) => kwFeature.Name.toLowerCase().indexOf(needle) > -1
              );
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (refQ: QSelect) => {
            if (val !== '' && refQ.options && refQ.options.length > 0) {
              refQ.setOptionIndex(-1); // reset optionIndex in case there is something selected
              // eslint-disable-next-line max-len
              refQ.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
            }
          }
        );
      }, 300);
    }
    function abortFilterFeature() {
      // TODO
    }

    function showParams(selectedKw: KeywordInterface) {
      params.value = [];
      selectedKw.Params.forEach((p: any) => {
        params.value.push(p);
      });
      params.value = params.value.map((pr: TestParamInterface, i: number) => ({
        ...pr,
        rowIndex: i + 1,
      }));
      // params.value = params.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))
    }

    function onSelectKeyword(kw: KeywordInterface) {
      selectedKeyword.value = kw;
      showParams(selectedKeyword.value);
    }

    return {
      kwFilter,
      isShowOwner,
      isShowCreatedDate,
      keywordColumns,
      keywordVisibleColumns,
      filterCategory,
      abortFilterCategory,
      onCategoryChange,
      filterFeature,
      abortFilterFeature,
      onFeatureChange,
      onSelectKeyword,
      params,
      paramColumns,
      selectedKeyword,
      keywordCategories,
      keywordFeatures,
      keywords,
      selectedKeywordCategory,
      selectedKeywordFeature,
      filteredKeywordCategories,
      filteredKeywordFeatures,
      filteredKeywords,
    };
  },
});
</script>
<style scoped lang="scss">
:deep(.q-c-input) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  input {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
}
</style>
