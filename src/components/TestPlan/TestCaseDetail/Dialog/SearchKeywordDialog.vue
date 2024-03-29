<template>
<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
  <q-layout view="hHh lpR fFf"
    :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
    style="max-height: 900px; min-height: 100px !important; min-width: 800px"
    container
  >
    <q-header reveal bordered class="row justify-between bg-secondary">
      <div class="self-center text-subtitle1 q-pl-sm">Search Keyword</div>
      <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-header>
    <q-page-container>
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
          @update:model-value="onCategoryChange($event)"
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
          @update:model-value="onFeatureChange($event)"
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
          :rows="filteredKeywords"
          :columns="keywordColumns"
          row-key="name"
          :filter = "kwFilter"
          separator="cell"
          :visible-columns="keywordVisibleColumns"
          :pagination="initialPagination"
          :hide-pagination="true"
          :rows-per-page-options="[0]"
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
                <q-tooltip>
                  <div class="text-body2">Category: {{ props.row.Category }}</div>
                  <div class="text-body2">Feature: {{ props.row.Feature }}</div>
                </q-tooltip>
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
              <q-td key="use" :props="props">
                <q-btn size="sm" outline @click="useKeyword(props.row)">Use</q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
    </q-page-container>
    <q-footer bordered class="bg-secondary text-white"  style="height: 24px;width: -webkit-fill-available;">
      <div class="row justify-between items-center">
        <div @click="copy(footerInfoLeft)" class="q-pl-sm">{{footerInfoLeft}}</div>
        <div class="q-pr-sm">{{footerInfoRight}}</div>
      </div>
    </q-footer>
  </q-layout>
</q-dialog>
</template>
<script lang="ts">
import {
  defineComponent, ref, PropType, Ref, onBeforeMount, computed,
} from 'vue';
import _ from 'lodash'
import { QSelect, useDialogPluginComponent, useQuasar } from 'quasar'
import { TestStepInterface } from 'src/Models/TestStep';
import { TestCaseInterface } from 'src/Models/TestCase';
import { useClipboard } from '@vueuse/core'
import { useGlobalStore } from 'src/pinia/globalStore';
import { useKeywordStore } from 'src/pinia/keywordStore';
import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordFeatureInterface } from 'src/Models/KeywordFeature';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';

export default defineComponent({
  name: 'SearchKeywordDialog',
  props: {
    TestStep: {
      type: Object as PropType<TestStepInterface>,
      required: true,
    },
    TestCase: {
      type: Object as PropType<TestCaseInterface>,
      required: true,
    },
  },
  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],
  components: {
  },
  setup(props) {
    const globalStore = useGlobalStore()
    const keywordStore = useKeywordStore()
    const {
      dialogRef, onDialogHide, onDialogOK, onDialogCancel,
    } = useDialogPluginComponent()
    const { copy } = useClipboard()
    const $q = useQuasar()
    const footerInfoLeft = ref('')
    const keywordCategories = computed(() => keywordStore.keywordCategories as KeywordCategoryInterface [])
    const keywords = computed(() => keywordStore.keywords as KeywordInterface[])
    const footerInfoRight = computed(() => `${keywords.value.length} keywords`)
    const filteredKeywordCategories: Ref<KeywordCategoryInterface[]> = ref([]);
    const keywordFeatures: Ref<KeywordFeatureInterface[]> = ref([]);
    const filteredKeywordFeatures: Ref<KeywordFeatureInterface[]> = ref([]);
    const filteredKeywords: Ref<KeywordInterface[]> = ref([]);
    const selectedKeywordCategory: Ref<KeywordCategoryInterface | null> = ref(null);
    const selectedKeywordFeature: Ref<KeywordFeatureInterface | null> = ref(null);
    const selectedKeyword: Ref<KeywordInterface | null> = ref(null);
    const selected = ref([])
    const kwFilter = ref('');
    const isShowOwner = ref(true);
    const isShowCreatedDate = ref(false);
    const initialPagination = {
      sortBy: 'startAt',
      descending: true,
      // page: 2,
      // rowsPerPage: 3,
      // rowsNumber: xx if getting data from a server
    }
    const isDark = computed(() => globalStore.darkTheme)
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
      {
        name: 'use',
        align: 'left',
        label: '',
        field: 'use',
        sortable: false,
      },
    ];
    const keywordVisibleColumns: Ref<string[]> = ref(['no', 'name', 'description', 'owner', 'updatedMessage', 'createdDate', 'use']);

    onBeforeMount(async () => {
      try {
        const allKeywords = await keywordStore.getKeywords()
        console.log('keywords', allKeywords)
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
      // get all keywordFeatures
      keywordCategories.value.forEach((kwCategory: KeywordCategoryInterface) => {
        if (kwCategory.Features) {
          kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
            keywordFeatures.value.push(kwFeature);
          })
        }
      })
      // set filteredKeyword and add number
      filteredKeywords.value = keywords.value
      filteredKeywords.value = filteredKeywords.value.map((kw: KeywordInterface, i: number) => ({ ...kw, rowIndex: i + 1 }))
    })

    function filterCategory(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              filteredKeywordCategories.value = keywordCategories.value;
            } else {
              const needle = val.toLowerCase()
              filteredKeywordCategories.value = keywordCategories.value.filter((kwCategory: KeywordCategoryInterface) => kwCategory.Name.toLowerCase().indexOf(needle) > -1)
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (refQ: QSelect) => {
            if (val !== '' && refQ.options && refQ.options.length > 0) {
              refQ.setOptionIndex(-1) // reset optionIndex in case there is something selected
              // eslint-disable-next-line max-len
              refQ.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          },
        )
      }, 100)
    }

    function onFeatureChange(newKeywordFeature: KeywordFeatureInterface | null) {
      filteredKeywords.value = []
      if (selectedKeywordCategory.value == null) { // No category is selected
        if (newKeywordFeature == null) {
          filteredKeywords.value = keywords.value
        } else {
          // Load all keywords base on Feature
          keywordCategories.value.forEach((kwCategory: KeywordCategoryInterface) => {
            if (kwCategory.Features) {
              kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
                if (kwFeature.Name === newKeywordFeature.Name) {
                  if (kwFeature.Keywords) {
                    kwFeature.Keywords.forEach((kwKeyword: KeywordInterface) => {
                      filteredKeywords.value.push(kwKeyword)
                    })
                  }
                }
              })
            }
          })
        }
      } else if (newKeywordFeature == null) { // No Feature is selected
        // Load all keyword that contains category
        const kwCategory = keywordCategories.value.find((kwCat: KeywordCategoryInterface) => kwCat.Name === selectedKeywordCategory.value?.Name)
        if (kwCategory !== undefined && kwCategory.Features) {
          kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
            if (kwFeature.Keywords) {
              kwFeature.Keywords.forEach((keyword: KeywordInterface) => {
                filteredKeywords.value.push(keyword)
              })
            }
          })
        }
      } else {
        // Load all keyword that contains both category and feature
        // filteredKeywords.value = keywords.value
        const kwCategory = keywordCategories.value.find((kwCat: KeywordCategoryInterface) => kwCat.Name === selectedKeywordCategory.value?.Name)
        if (kwCategory !== undefined && kwCategory.Features) {
          kwCategory.Features.forEach((kwFeature: KeywordFeatureInterface) => {
            if (kwFeature.Name === newKeywordFeature?.Name) {
              if (kwFeature.Keywords) {
                kwFeature.Keywords.forEach((keyword: KeywordInterface) => {
                  filteredKeywords.value.push(keyword)
                })
              }
            }
          })
        }
      }
      filteredKeywords.value = filteredKeywords.value.map((kw: KeywordInterface, i: number) => ({ ...kw, rowIndex: i + 1 }))
    }

    function onCategoryChange(newKeywordCategory: KeywordCategoryInterface | null) {
      if (newKeywordCategory === null) { // will display all features
        filteredKeywordFeatures.value = keywordFeatures.value
        selectedKeywordFeature.value = null
      } else if (newKeywordCategory.Features !== undefined) {
        filteredKeywordFeatures.value = newKeywordCategory.Features
        selectedKeywordFeature.value = null
      } else filteredKeywordFeatures.value = []
      onFeatureChange(null);
    }

    function filterFeature(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              // TODO
            } else {
              const needle = val.toLowerCase()
              // eslint-disable-next-line max-len
              filteredKeywordFeatures.value = keywordFeatures.value.filter((kwFeature: KeywordFeatureInterface) => kwFeature.Name.toLowerCase().indexOf(needle) > -1)
            }
          },

          // next function is available in Quasar v1.7.4+;
          // "ref" is the Vue reference to the QSelect
          (refQ: QSelect) => {
            if (val !== '' && refQ.options && refQ.options.length > 0) {
              refQ.setOptionIndex(-1) // reset optionIndex in case there is something selected
              // eslint-disable-next-line max-len
              refQ.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            }
          },
        )
      }, 100)
    }

    function onSelectKeyword(kw: KeywordInterface) {
      selectedKeyword.value = kw
    }
    function useKeyword(keyword: KeywordInterface) {
      const testStep = _.cloneDeep(props.TestStep)
      testStep.Keyword = keyword
      testStep.Params = keyword.Params
      onDialogOK(testStep)
    }

    return {
      kwFilter,
      isShowOwner,
      isShowCreatedDate,
      keywordColumns,
      keywordVisibleColumns,
      filterCategory,
      onCategoryChange,
      filterFeature,
      onFeatureChange,
      onSelectKeyword,
      selectedKeyword,
      keywordCategories,
      keywordFeatures,
      keywords,
      selectedKeywordCategory,
      selectedKeywordFeature,
      filteredKeywordCategories,
      filteredKeywordFeatures,
      filteredKeywords,
      onDialogHide,
      onCancelClick: onDialogCancel,
      onDialogOK,
      copy,
      onBeforeMount,
      dialogRef,
      footerInfoLeft,
      footerInfoRight,
      isDark,
      initialPagination,
      selected,
      useKeyword,
    };
  },
});
</script>
<style scoped lang="scss">
:deep td.q-c-input {
  padding-right: 1px;
  padding-left: 1px;
  padding-top: 0px;
  padding-bottom: 0px;
}

:deep td.q-c-input .q-field__native {
  padding-right: 0px;
  padding-left: 5px;
  padding-top: 1px;
  padding-bottom: 1px;
}
:deep(.testBed) {
  background-color: $teal-2;
  background-clip: content-box;
}
:deep(.testBuffer) {
  background-color: $green-2;
  background-clip: content-box;
}
:deep(.testBedDark) {
  background-color: $teal-10;
  background-clip: content-box;
}
:deep(.testBufferDark) {
  background-color: $green-10;
  background-clip: content-box;
}
</style>
