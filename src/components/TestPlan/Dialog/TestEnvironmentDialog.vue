<template>
<q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
  <q-layout
      :class="isDark ? 'bg-grey-9' : 'bg-grey-3'"
      style="max-height: 400px; min-height: 100px !important;"
    >
  <div class="q-pa-md">
    <div class="row q-col-gutter-xs">
      <div class="col">
        <q-input dense outlined v-model="testEnvFilter" label="Filter" />
      </div>
      <div class="col">
        <q-select
          dense
          outlined
          v-model="selectedTestEnv"
          :options="filteredTestEnvs"
          label="Environments"
          option-label="Name"
          @filter="filterTestEnv"
          @filter-abort="abortFilterTestEnv"
          @input="val => { onTestEnvChange() }"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :readonly="isReadonly"
        />
      </div>
      <div class="col">
        <q-btn outline @click="enableEdit()">Enable Edit</q-btn>
      </div>
      <div class="col">
        <q-btn outline @click="applyTestEnv()">Apply</q-btn>
      </div>
    </div>
    <q-separator class="q-mb-sm q-mt-sm" />
    <div class="row">
      <div class="col">
        <q-table
          dense
          title="Test Environment"
          :data="selectedTestEnv ? selectedTestEnv.Categories : []"
          :columns="testEnvColumns"
          row-key="name"
          :hide-pagination="true"
          :filter="testEnvFilter"
          separator="cell"
        >
        <template v-slot:top>
          <div class="col-2 q-table__title">Test Environment</div>
        </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
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
    </div>
  </div>
      </q-layout>
  </q-dialog>
</template>
<script lang="ts">
import {
  computed,
  defineComponent, onBeforeMount, Ref, ref,
} from '@vue/composition-api';
import { TestEnvInterface } from 'src/Models/TestEnv';
import { TestEnvCategoryInterface } from 'src/Models/TestEnvCategory';

export default defineComponent({
  name: 'TestEnvironmentDialog',
  props: {},
  components: {
  },
  setup(props, context) {
    const dialogRef: Ref<any> = ref(null);
    const isReadonly: Ref<boolean> = ref(true);
    const testEnvFilter = ref('');
    const selectedTestEnv: Ref<TestEnvInterface | null> = ref(null);
    const filteredTestEnvs: Ref<TestEnvCategoryInterface[]> = ref([]);
    const testEnvCategories: Ref<TestEnvCategoryInterface[]> = ref([]);
    const testEnvColumns = [
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => context.root.$store.getters['global/darkTheme']);
    onBeforeMount(async () => {
      try {
        await context.root.$store.dispatch('testenvironment/getTestEnvironments');
      } catch (error) {
        context.root.$q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
      testEnvCategories.value = context.root.$store.getters['testenvironment/testEnvCategories'] as TestEnvCategoryInterface[]
      selectedTestEnv.value = context.root.$store.getters['global/selectedTestEnv'] as TestEnvInterface
      filteredTestEnvs.value = testEnvCategories.value
      console.log('testEnvCategories.value', testEnvCategories.value)
      console.log('filteredTestEnvs.value', filteredTestEnvs.value)
      context.root.$nextTick()
    })

    function onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      context.emit('hide');
    }

    function onTestEnvChange() {
      // TODO
    }

    function filterTestEnv(val: string, update: any) {
      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              filteredTestEnvs.value = testEnvCategories.value;
            } else {
              const needle = val.toLowerCase()
              filteredTestEnvs.value = testEnvCategories.value.filter((testEnvCategory: TestEnvCategoryInterface) => testEnvCategory.Name.toLowerCase().indexOf(needle) > -1)
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

    function abortFilterTestEnv() {
      console.log('delayed filter aborted')
    }
    function show() {
      console.log(dialogRef.value);
      dialogRef.value.show();
    }

    // following method is REQUIRED
    // (don't change its name --> "hide")
    function hide() {
      dialogRef.value.hide();
    }

    function enableEdit() {
      isReadonly.value = false
    }

    function applyTestEnv() {
      if (selectedTestEnv.value) context.root.$store.commit('global/setSelectedTestEnv', selectedTestEnv.value)
    }

    return {
      testEnvColumns,
      onTestEnvChange,
      onDialogHide,
      testEnvFilter,
      selectedTestEnv,
      filteredTestEnvs,
      filterTestEnv,
      abortFilterTestEnv,
      testEnvCategories,
      dialogRef,
      show,
      hide,
      isDark,
      enableEdit,
      applyTestEnv,
      isReadonly,
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
