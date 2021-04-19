<template>
  <div v-if="!selectedEnv" class="q-pr-sm">No Environment is selected</div>
  <div v-else class="q-pr-sm">Environment: {{selectedEnv.Name}}</div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { TestEnvInterface } from 'src/Models/TestEnv';

export default defineComponent({
  name: 'EnvFooter',
  components: {},
  setup(props, context) {
    const selectedEnv = computed(() => context.root.$store.getters['global/selectedTestEnv'] as TestEnvInterface);
    return {
      selectedEnv,
    };
  },
});
</script>
