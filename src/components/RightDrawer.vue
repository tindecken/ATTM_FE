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
          :options="keywordCategories"
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
          v-model="selectedKeywordFeature"
          :options="keywordFeatures"
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
          :data="keywords"
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
          :data="params"
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
import {
  defineComponent, Ref, ref,
} from '@vue/composition-api';
import { KeywordInterface } from 'src/Models/Keyword';
import { KeywordCategoryInterface } from 'src/Models/KeywordCategory';
import { KeywordFeatureInterface } from 'src/Models/KeywordFeature';
import { TestParamInterface } from 'src/Models/TestParam';

export default defineComponent({
  name: 'RightDrawer',
  props: {},
  setup(props, context) {
    const keywordCategories: Ref<KeywordCategoryInterface[]> = ref([]);
    const keywordFeatures: Ref<KeywordFeatureInterface[]> = ref([]);
    const keywords: Ref<KeywordInterface[]> = ref([]);
    const selectedKeywordCategory: Ref<KeywordCategoryInterface | undefined> = ref();
    const selectedKeywordFeature: Ref<KeywordFeatureInterface | undefined> = ref();
    const selectedKeyword: Ref<KeywordInterface | undefined> = ref();
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
      // TODO onFeatureChange
    }

    function onCategoryChange() {
      // TODO onCategoryChange
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

    function showParams(selectedKw: KeywordInterface) {
      params.value = []
      selectedKw.Params.forEach((p: any) => {
        params.value.push(p)
      });
      params.value = params.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))
    }

    function onSelectKeyword(row: any) {
      // TODO onSelectKeyword()
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
