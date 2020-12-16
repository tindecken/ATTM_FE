/* eslint-disable no-sequences */
<template>
  <div class="q-pa-xs">
    <div class="row q-col-gutter-xs">
      <div class="col">
        <q-tabs
          v-model="opennedSelectedTC"
          dense
          active-color="primary"
          align="left"
          inline-label
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
              row-key="Name"
              :hide-pagination="true"
              separator="cell"
              :wrap-cells="false"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-italic text-purple"
                  >
                    {{ col.label }}
                    {{ col.name }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr
                  :props="props"
                  @mouseover="test(props.cols)"
                  >
                  <q-td key="no" :props="props" class="q-c-input">
                    {{ props.rowIndex + 1 }}
                  </q-td>
                  <q-td key="client" :props="props" class="q-c-input">
                    {{ props.row.TestClient }}
                  </q-td>
                  <q-td key="keyword" :props="props" class="q-c-input">
                    <q-input :debounce="300" :value="props.row.Keyword" dense borderless @input="changeKeyword({testcase: tc, stepIndex: props.rowIndex, property: 'Keyword'}, $event)"/>
                  </q-td>
                  <q-td v-for="index in 20" :key="index" class="q-c-input">
                    <q-input
                      :debounce="300"
                      :value="props.row.Params[index-1] ? props.row.Params[index-1].Value : ''" dense borderless
                      @input="changeParam({testcase: tc, stepIndex: props.rowIndex, paramIndex: index-1}, $event)"
                      :readonly="index > props.row.Params.length"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
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
  defineComponent, ref,
} from '@vue/composition-api'
import _ from 'lodash'

export default defineComponent({
  name: 'Detail',
  components: {},
  setup(props, context) {
    const showByIndex = ref(null)
    const columns = ref(
      [
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
          name: 'client', align: 'center', label: 'Client', field: 'calories', sortable: false,
        },
        {
          name: 'keyword', label: 'Keyword', field: 'fat', sortable: false,
        },
        {
          name: 'param1',
          label: 'Param 1',
          field: 'carbs',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param2',
          label: 'Param 2',
          field: 'protein',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param3',
          label: 'Param 3',
          field: 'sodium',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param4',
          label: 'Param 4',
          field: 'calcium',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param5',
          label: 'Param 5',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param6',
          label: 'Param 6',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param7',
          label: 'Param 7',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param8',
          label: 'Param 8',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param9',
          label: 'Param 9',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param10',
          label: 'Param 10',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param11',
          label: 'Param 11',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param12',
          label: 'Param 12',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param13',
          label: 'Param 13',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param14',
          label: 'Param 14',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param15',
          label: 'Param 15',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param16',
          label: 'Param 16',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param17',
          label: 'Param 17',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param18',
          label: 'Param 18',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param19',
          label: 'Param 19',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
        },
        {
          name: 'param20',
          label: 'Param 20',
          field: 'iron',
          sortable: false,
          style: 'max-width: 120px',
          headerStyle: 'max-width: 120px',
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
      console.log('testcase', testcase)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      context.root.$store.commit('testcase/removeOpennedTC', testcase.Id)
    }
    function changeKeyword(payload: any, e: any) {
      payload.newValue = e;
      const tempTC = _.cloneDeep(payload.testcase)
      console.log(tempTC)
      console.log('payload.stepIndex', payload.stepIndex)
      console.log('payload.property', payload.property)
      console.log('payload.newValue', payload.newValue)
      tempTC.TestSteps[payload.stepIndex][payload.property] = payload.newValue;
      context.root.$store.commit('testcase/updateOpennedTCs', tempTC)
    }
    function changeParam(payload: any, e: any) {
      payload.newValue = e;
      const tempTC = _.cloneDeep(payload.testcase)
      console.log(tempTC)
      console.log('payload.stepIndex', payload.stepIndex)
      console.log('payload.paramIndex', payload.paramIndex)
      console.log('payload.newValue', payload.newValue)
      tempTC.TestSteps[payload.stepIndex].Params[payload.paramIndex].Value = payload.newValue;
      context.root.$store.commit('testcase/updateOpennedTCs', tempTC)
    }
    function test(cols) {
      console.log("Hi", cols[3].label);
      cols[3].label = 'labelddddddddd'
      columns.value[3].label = 'labelddddddddd'
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
