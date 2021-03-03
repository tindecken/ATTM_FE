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
          <q-tab v-for="testcase in opennedTCs" :key="testcase.Id" :name="testcase.Id" :ripple="false" @mouseover="showByIndex = testcase.Id" @mouseout="showByIndex = null">
            <div class="q-mr-xs">{{testcase.Name}}</div>
            <q-btn dense flat icon="close" size="xs" :style="{visibility: showByIndex === testcase.Id ? 'visible' : 'hidden'}" @click.stop="closeTab(testcase)"></q-btn>
          </q-tab>
        </q-tabs>

        <q-tab-panels
          v-model="opennedSelectedTC"
          animated
          keep-alive
          >
          <q-tab-panel v-for="tc in opennedTCs" :key="tc.Id" :name="tc.Id">
            <q-table
              dense
              :data="tc.TestSteps"
              :columns="columns"
              row-key="UUID"
              :hide-pagination="true"
              separator="cell"
              :wrap-cells="false"
              :selected.sync="selected"
              :rows-per-page-options="[0]"
              no-data-label="Test case has no step"
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
                    <detail-context-menu
                     :selected.sync="selected"
                     @deleteRows="onDeleteRows()">
                    </detail-context-menu>
                  </q-td>
                  <q-td key="testAUT" :props="props" class="q-c-input">
                    <q-select
                      dense
                      :value="props.row.TestAUT"
                      :options="optionTestAUTDatas"
                      option-label="Name"
                      @input="changeTestAUT({testcase: tc, stepIndex: props.rowIndex, property: 'TestAUT'}, $event)"
                      @filter="filterTestAUTFn"
                      input-debounce="0"
                      use-input
                      fill-input
                      hide-selected
                      options-dense
                    />
                    <detail-context-menu
                     :selected.sync="selected"
                     @deleteRows="onDeleteRows()">
                    </detail-context-menu>
                  </q-td>
                  <q-td key="keyword" :props="props" class="q-c-input">
                    <q-select
                      dense
                      :value="props.row.Keyword"
                      :options="optionKeywordDatas"
                      option-label="Name"
                      @input="changeKeyword({testcase: tc, stepIndex: props.rowIndex, property: 'Keyword'}, $event)"
                      @filter="filterKeywordFn"
                      input-debounce="0"
                      use-input
                      fill-input
                      hide-selected
                      options-dense
                    />
                    <detail-context-menu
                     :selected.sync="selected"
                     @deleteRows="onDeleteRows()">
                    </detail-context-menu>
                  </q-td>
                  <q-td v-for="index in 20" :key="index" class="q-c-input">
                    <q-input
                      :debounce="300"
                      :value="props.row.Params[index-1] ? props.row.Params[index-1].Value : ''" dense borderless
                      @input="changeParam({testcase: tc, stepIndex: props.rowIndex, paramIndex: index-1}, $event)"
                      :readonly="index > props.row.Params.length"
                    />
                    <detail-context-menu
                     :selected.sync="selected"
                     @deleteRows="onDeleteRows()">
                    </detail-context-menu>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-btn color="primary" label="New Step" @click="addNewStep()"></q-btn>
            <q-btn color="primary" label="Save" @click="saveTestCase()"></q-btn>
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
    const optionKeywordDatas: Ref<any[]> = ref([])
    const optionTestAUTDatas: Ref<any[]> = ref([])
    const showByIndex = ref(null)
    const selectedKeyword = ref('')
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
          name: 'testAUT',
          align: 'center',
          label: 'TestAUT',
          field: 'TestAUT',
          sortable: false,
          style: 'min-width: 80px; max-width: 100px',
          headerStyle: 'min-width: 80px; max-width: 100px',
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
    const opennedSelectedTC = computed({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      get: () => context.root.$store.getters['testcase/opennedSelectedTC'],
      set: (val) => {
        context.root.$store.commit('testcase/setOpennedSelectedTC', val);
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const opennedTCs = computed(() => context.root.$store.getters['testcase/opennedTCs'])
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const keywords = computed(() => context.root.$store.getters['keyword/keywords'])
    const keywordDatas: Ref<any[]> = ref([]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const testAUTs = computed(() => context.root.$store.getters['global/testAuTs'])
    const testAUTDatas: Ref<any[]> = ref([]);
    testAUTDatas.value = testAUTs.value
    keywords.value.categories.forEach((c: any) => {
      c.Features.forEach((f: any) => {
        f.Keywords.forEach((k: any) => {
          k = { ...k, Category: c.Name, Feature: f.Name }
          keywordDatas.value.push(k);
        })
      });
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    keywordDatas.value = keywordDatas.value.map((v: any, i: number) => ({ ...v, rowIndex: i + 1 }))
    console.log('keywordDatas.value', keywordDatas.value)

    function closeTab(testcase: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      context.root.$store.commit('testcase/removeOpennedTC', testcase.Id)
    }
    function changeKeyword(payload: any, newKeyword: any) {
      console.log('newKeyword', newKeyword)
      const tempTC = _.cloneDeep(payload.testcase)
      tempTC.TestSteps[payload.stepIndex][payload.property] = newKeyword.Name;
      tempTC.TestSteps[payload.stepIndex].Params = []
      newKeyword.Params.forEach((pr: any) => {
        tempTC.TestSteps[payload.stepIndex].Params.push(pr)
      })
      console.log('payload.testcase', payload.testcase)
      console.log('tempTC', tempTC)
      context.root.$store.commit('testcase/updateOpennedTCs', tempTC)
    }
    function changeTestAUT(payload: any, newTestAUT: any) {
      console.log('newTestAUT', newTestAUT)
      const tempTC = _.cloneDeep(payload.testcase)
      tempTC.TestSteps[payload.stepIndex][payload.property] = newTestAUT.Name;
      tempTC.TestSteps[payload.stepIndex].Params = []
      console.log('payload.testcase', payload.testcase)
      console.log('tempTC', tempTC)
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
    function getRowIndexByUUID(currentTest: any, uuid: any) {
      console.log('uuid', uuid)
      console.log('currentTest', currentTest)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const index: number = currentTest.TestSteps.findIndex((step: any) => step.UUID === uuid)
      if (index === -1) return 0
      return index
    }

    // With Shift pressed, select contiguous group
    function toggleRowGroup(row: any) {
      if (selected.value.length === 1) { // There is a previous selection
        // Select contiguous block from previous selection to this one
        // But if clicked one already selected, remove any selected since then
        const matched = selected.value.find((item: any) => item.UUID === row.UUID)
        if (matched) { // Had already selected this one --> do nothing
        } else { // New selection - add it and any between
          // find selected testcase
          const currTestCase = opennedTCs.value.find((tc: any) => tc.Id === opennedSelectedTC.value)

          // find previous selected teststep
          const previousSelectedStep = currTestCase.TestSteps.find((step: any) => step.UUID === selected.value[0].UUID)

          // get index for previousSelectedStep and currentSelectedStep
          const previousIndex = getRowIndexByUUID(currTestCase, previousSelectedStep.UUID)
          const currentIndex = getRowIndexByUUID(currTestCase, row.UUID)

          let first: number
          let last: number

          if (previousIndex < currentIndex) {
            first = previousIndex
            last = currentIndex
          } else {
            first = currentIndex
            last = previousIndex
          }

          // row Index need to push
          // eslint-disable-next-line no-plusplus
          for (let index = first + 1; index < last; index++) {
            selected.value.push(currTestCase.TestSteps[index])
          }

          selected.value.push(row)
        }
      } else if (selected.value.length > 1) { // there're multiple row previous selection
        selected.value = []
        selected.value.push(row)
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
      context.root.$store.commit('testcase/addNewStep');
    }

    function onDeleteRows() {
      console.log('onDeleteRows')
      const currTestCase = opennedTCs.value.find((tc: any) => tc.Id === opennedSelectedTC.value)
      selected.value.forEach((selectedRow: any) => {
        currTestCase.TestSteps.forEach((testStep: any) => {
          if (testStep.UUID === selectedRow.UUID) {
            console.log('delete me', testStep)
            context.root.$store.commit('testcase/deleteStep', { testCaseId: opennedSelectedTC.value, stepUUID: selectedRow.UUID });
          }
        })
      })
    }

    async function saveTestCase() {
      try {
        const currTestCase = opennedTCs.value.find((tc: any) => tc.Id === opennedSelectedTC.value)
        console.log('currTestCase', currTestCase)
        const result = await context.root.$store.dispatch('testcase/saveTestCase', currTestCase)
        console.log('result', result)
        context.root.$q.notify({
          type: 'positive',
          message: result.message,
        });
      } catch (error) {
        context.root.$q.notify({
          type: 'warning',
          message: error.error,
        });
      }
    }

    function filterKeywordFn(val: any, update: any, abort: any) {
      update(() => {
        const needle = val.toLowerCase()
        optionKeywordDatas.value = keywordDatas.value.filter((v) => v.Name.toLowerCase().indexOf(needle) > -1)
      })
    }
    function filterTestAUTFn(val: any, update: any, abort: any) {
      update(() => {
        const needle = val.toLowerCase()
        optionTestAUTDatas.value = testAUTDatas.value.filter((v) => v.Name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function test() {
      console.log('test')
    }

    return {
      optionKeywordDatas,
      optionTestAUTDatas,
      filterKeywordFn,
      filterTestAUTFn,
      showByIndex,
      columns,
      opennedTCs,
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
      keywords,
      selectedKeyword,
      keywordDatas,
      testAUTDatas,
      onDeleteRows,
      saveTestCase,
      changeTestAUT,
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
