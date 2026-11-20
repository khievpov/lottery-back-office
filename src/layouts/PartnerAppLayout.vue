<template>
  <q-layout view="hHh lpR fFf" class="partner-app">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="partner-app__footer">
      <nav aria-label="App">
        <q-tabs
          v-model="tab"
          no-caps
          dense
          indicator-color="transparent"
          active-color="primary"
          class="partner-app__tabs"
        >
          <q-tab name="home" icon="sym_o_home" label="Home" />
          <q-tab name="sales" icon="sym_o_bar_chart" label="My sales" />
          <q-tab name="results" icon="sym_o_schedule" label="Results" />
          <q-tab name="account" icon="sym_o_person" label="Account" />
        </q-tabs>
      </nav>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('home')
</script>

<style lang="scss" scoped>
.partner-app {
  max-width: 480px;
  margin: 0 auto;
  background: var(--bo-page);
}
.partner-app__footer {
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-top: 1px solid var(--bo-border);
  padding: 6px 4px 18px;
}
.partner-app__tabs {
  color: var(--bo-muted);

  :deep(.q-tab) {
    flex: 1 1 0;
    min-height: 52px;
    padding: 0 4px;
  }
  :deep(.q-tab__label) {
    font-size: 12px;
  }
  :deep(.q-tab--active .q-tab__label) {
    font-weight: 600;
  }
}
</style>
