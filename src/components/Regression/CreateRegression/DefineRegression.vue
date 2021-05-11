<template>
  <div class="q-pa-md">
    <q-form
      greedy
      ref="form"
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
      style="max-width: 320px;"
    >
      <q-input
        outlined
        dense
        autofocus
        v-model="regressionName"
        label="Regression Name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Provide regression name' ]"
      />

      <q-input
        outlined
        dense
        v-model="regressionRelease"
        label="Release Name *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Provide Release Name' ]"
      />
      <q-input
        outlined
        dense
        v-model="regressionBuild"
        label="Build Name"
      />

      <q-date v-model="model" range today-btn subtitle="Start Date - End Date"/>

      <q-toggle v-model="isOfficial" label="Is this regression official?" />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DefineRegression',
  components: {},
  setup(props, context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const isDark = computed(() => context.root.$store.getters['global/darkTheme']);
    return {
      isDark,
    }
  },
});
</script>
