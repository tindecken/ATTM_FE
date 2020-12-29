/* eslint-disable no-sequences */
<template>
  <div>
    <div class="row">
      <div class="col">
        <q-tabs
          v-model="opennedSelectedTC"
          dense
          active-color="primary"
          align="left"
          inline-label
          @input="onTabChanging"
        >
          <q-tab v-for="testcase in testcases" :key="testcase.Id" :name="testcase.Id" :ripple="false" @mouseover="showByIndex = testcase.Id" @mouseout="showByIndex = null">
            <div class="q-mr-xs">{{testcase.Name}}</div>
            <q-btn dense flat icon="close" size="xs" :style="{visibility: showByIndex === testcase.Id ? 'visible' : 'hidden'}" @click.stop="closeTab(testcase)"></q-btn>
          </q-tab>
        </q-tabs>

        <q-tab-panels
          v-model="opennedSelectedTC"
          animated
          keep-alive
          >
          <q-tab-panel v-for="tc in testcases" :key="tc.Id" :name="tc.Id">
            <q-table
              dense
              :data="tc.TestSteps"
              :columns="columns"
              row-key="UUID"
              :hide-pagination="true"
              separator="cell"
              :wrap-cells="false"
              :selected.sync="selected"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-bold text-primary"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  @mouseover="onRowHover(props.row.Params)"
                  @click.ctrl="toggleSelectedRow(props.row)"
                  @click.exact="toggleSingleRow(props.row)"
                  @click.shift="toggleRowGroup(props.row)"
                  >
                  <q-td key="no" :props="props" class="q-c-input">
                    {{ props.rowIndex + 1 }}
                    <detail-context-menu></detail-context-menu>
                  </q-td>
                  <q-td key="client" :props="props" class="q-c-input">
                    {{ props.row.TestClient }}
                    <detail-context-menu></detail-context-menu>
                  </q-td>
                  <q-td key="keyword" :props="props" class="q-c-input">
                    <q-input :debounce="300" :value="props.row.Keyword" dense borderless @input="changeKeyword({testcase: tc, stepIndex: props.rowIndex, property: 'Keyword'}, $event)"/>
                    <detail-context-menu></detail-context-menu>
                  </q-td>
                  <q-td v-for="index in 20" :key="index" class="q-c-input">
                    <q-input
                      :debounce="300"
                      :value="props.row.Params[index-1] ? props.row.Params[index-1].Value : ''" dense borderless
                      @input="changeParam({testcase: tc, stepIndex: props.rowIndex, paramIndex: index-1}, $event)"
                      :readonly="index > props.row.Params.length"
                    />
                    <detail-context-menu v-if="index <= props.row.Params.length"></detail-context-menu>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-btn color="primary" label="Add" @click="addNewStep()"></q-btn>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <div class="row">
      <div class="col">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, Ref, ref,
} from '@vue/composition-api'
import _ from 'lodash'
import DetailContextMenu from './ContextMenu/DetailContextMenu.vue'

export default defineComponent({
  name: 'Detail',
  components: { DetailContextMenu },
  setup(props, context) {
    const showByIndex = ref(null)
    const selected: Ref<any[]> = ref([])
    const columns = ref(
      [
        {
          name: 'no',
          required: true,
          label: 'No',
          align: 'left',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          field: 'rowIndex',
          sortable: false,
          style: 'max-width: 40px',
          headerStyle: 'max-width: 40px',
        },
        {
          name: 'client',
          align: 'center',
          label: 'Client',
          field: 'Client',
          sortable: false,
          style: 'min-width: 80px;',
          headerStyle: 'min-width: 80px',
        },
        {
          name: 'keyword',
          label: 'Keyword',
          field: 'Keyword',
          sortable: false,
          align: 'left',
          style: 'min-width: 150px;',
          headerStyle: 'min-width: 150px',
        },
        {
          name: 'param1',
          label: 'Param 1',
          field: 'Param1',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param2',
          label: 'Param 2',
          field: 'Param2',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param3',
          label: 'Param 3',
          field: 'Param3',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param4',
          label: 'Param 4',
          field: 'Param4',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param5',
          label: 'Param 5',
          field: 'Param5',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param6',
          label: 'Param 6',
          field: 'Param6',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param7',
          label: 'Param 7',
          field: 'Param7',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param8',
          label: 'Param 8',
          field: 'Param8',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param9',
          label: 'Param 9',
          field: 'Param9',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param10',
          label: 'Param 10',
          field: 'Param10',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param11',
          label: 'Param 11',
          field: 'Param11',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param12',
          label: 'Param 12',
          field: 'Param12',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param13',
          label: 'Param 13',
          field: 'Param13',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param14',
          label: 'Param 14',
          field: 'Param14',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param15',
          label: 'Param 15',
          field: 'Param15',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param16',
          label: 'Param 16',
          field: 'Param16',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param17',
          label: 'Param 17',
          field: 'Param17',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param18',
          label: 'Param 18',
          field: 'Param18',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param19',
          label: 'Param 19',
          field: 'Param19',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
        {
          name: 'param20',
          label: 'Param 20',
          field: 'Param20',
          sortable: false,
          align: 'left',
          style: 'min-width: 135px;',
          headerStyle: 'min-width: 135px',
        },
      ],
    )
    const data = ref([
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
    ])
    const opennedSelectedTC = computed({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      get: () => context.root.$store.getters['testcase/opennedSelectedTC'],
      set: (val) => {
        context.root.$store.commit('testcase/setOpennedSelectedTC', val);
      },
    })
    const testcases = context.root.$store.getters['testcase/opennedTCs']
    function closeTab(testcase: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      context.root.$store.commit('testcase/removeOpennedTC', testcase.Id)
    }
    function changeKeyword(payload: any, e: any) {
      payload.newValue = e;
      const tempTC = _.cloneDeep(payload.testcase)
      tempTC.TestSteps[payload.stepIndex][payload.property] = payload.newValue;
      context.root.$store.commit('testcase/updateOpennedTCs', tempTC)
    }
    function changeParam(payload: any, e: any) {
      payload.newValue = e;
      const tempTC = _.cloneDeep(payload.testcase)
      tempTC.TestSteps[payload.stepIndex].Params[payload.paramIndex].Value = payload.newValue;
      context.root.$store.commit('testcase/updateOpennedTCs', tempTC)
    }
    function onRowHover(params: any) {
      columns.value.forEach((col: any, index: number) => {
        if (index >= 3) {
          if (params.length > index - 3) {
            columns.value[index].label = params[index - 3].Name
          } else {
            columns.value[index].label = ''
          }
        }
      })
    }

    function toggleSelectedRow(row: any) {
      if (selected.value.length > 0) { // We can add another row
        console.log('selected.value.length', selected.value.length)
        // But if clicking one already selected, we'll remove it instead
        let i = 0
        const matched = selected.value.find((item: any, index: number) => {
          console.log('item', item)
          console.log('row', row)
          i = index
          return item.UUID === row.UUID
        })
        if (matched) { // This row was already selected, so remove it
          selected.value.splice(i, 1)
        } else { // Add to selection
          selected.value.push(row)
        }
      } else { // First selection - add it
        selected.value.push(row)
      }
    }
    // With Shift pressed, select contiguous group
    function toggleRowGroup(row: any) {
      if (selected.value.length > 0) { // There is a previous selection
        // Select contiguous block from previous selection to this one
        // But if clicked one already selected, remove any selected since then
        let i = 0
        const matched = selected.value.find((item: any, index: number) => {
          i = index
          return item.UUID === row.UUID
        })
        if (matched) { // Had already selected this one
          // Remove any selected since that one
          const selectedIndex = selected.value.indexOf(row)
          console.log(`selectedIndex ${selectedIndex}`)
          console.log(`removing item beyond ${selectedIndex.toString()}`)
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          selected.value = selected.value.slice(0, selectedIndex + 1)
        } else { // New selection - add it and any between
          selected.value.push(row)
        }
      } else { // No previous selection - just select this one
        selected.value = []
        selected.value.push(row)
      }
    }
    // With no key pressed - single selection
    function toggleSingleRow(row: any) {
      selected.value = []
      selected.value.push(row)
    }

    function onTabChanging() {
      columns.value.forEach((col: any, index: number) => {
        if (index >= 3) {
          columns.value[index].label = `Param ${index - 2}`
        }
      })
    }

    function addNewStep() {
      // find selected testcases
      console.log('tests', testcases)
      console.log('opennedSelectedTC', opennedSelectedTC.value)
      // eslint-disable-next-line array-callback-return
      const index = _.findIndex(testcases, (tc: any) => tc.Id === opennedSelectedTC.value)

      console.log('index', index)
      console.log('3', testcases[index])
      testcases[index].TestSteps.push({
        Description: '',
        Keywords: '',
        Name: '',
        Params: [],
        TestClient: '',
        UUID: 'dsfsdfsd',
      })
    }

    function test() {
      console.log('test')
    }

    return {
      showByIndex,
      columns,
      data,
      testcases,
      opennedSelectedTC,
      closeTab,
      changeParam,
      changeKeyword,
      onRowHover,
      selected,
      toggleSelectedRow,
      toggleRowGroup,
      toggleSingleRow,
      onTabChanging,
      addNewStep,
      test,
    };
  },
});
</script>

<style scoped lang="scss">
::v-deep .q-tab {
  padding-right: 2px;
  padding-left: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
}
::v-deep .q-tab-panel {
  padding: 1px;
}
::v-deep td.q-c-input {
  padding-right: 1px;
  padding-left: 1px;
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
