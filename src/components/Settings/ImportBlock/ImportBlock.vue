<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-xs-12 col-md-10 col-lg-6">
        <div class="row">
          <div class="col">
            <q-input :readonly="readonly" v-model="importBlock" type="textarea" rows="20" />
          </div>
        </div>
        <div class="row reverse q-mt-md">
          <div>
            <q-btn outline label="Edit" color="primary" class="q-mr-sm" @click="readonly=false"/>
            <q-btn outline label="Save" color="primary"  @click="updateImportBlock()"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, PropType, Ref,
} from 'vue';
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/pinia/userStore';
import { SettingInterface } from '../../../Models/Setting'

export default defineComponent({
  name: 'ImportBlock',
  components: {},
  props: {
    settings: {
      type: Object as PropType<SettingInterface[]>,
      required: true,
      default: () => ({}),
    },
  },
  setup(props) {
    const userStore = useUserStore()
    const $store = useStore()
    const $q = useQuasar()
    const readonly = ref(true)
    const importBlockSetting: Ref<SettingInterface> = computed(() => props.settings.find((setting: SettingInterface) => setting.Name === 'ImportBlock') as SettingInterface)
    const importBlock = ref('')
    importBlock.value = importBlockSetting.value?.Value
    async function updateImportBlock() {
      try {
        const newSetting: SettingInterface = {
          Id: importBlockSetting.value.Id,
          Name: 'ImportBlock',
          Value: importBlock.value,
          IsDeleted: importBlockSetting.value.IsDeleted,
          Description: importBlockSetting.value.Description,
          UpdatedDateTime: new Date(),
          UpdatedBy: userStore.Username,
        }
        console.log('newSetting', newSetting)
        const result = await $store.dispatch('setting/updateSetting', { settingId: importBlockSetting.value.Id, setting: newSetting });
        $q.notify({
          type: 'positive',
          message: `${result.message}`,
        });
      } catch (error: any) {
        $q.notify({
          type: 'negative',
          message: `${error}`,
        });
      }
    }
    function update(event: any) {
      importBlock.value = event
    }
    return {
      importBlock,
      update,
      readonly,
      updateImportBlock,
    };
  },
});
</script>
