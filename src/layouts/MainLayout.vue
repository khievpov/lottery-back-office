<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!drawerDocked" class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="sym_o_menu"
          aria-label="Menu"
          @click="drawerOpen = !drawerOpen"
        />
        <q-toolbar-title class="text-subtitle1 text-weight-semibold">[YOUR BRAND]</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      :width="232"
      :breakpoint="1023"
      class="bo-nav bg-dark"
      @on-layout="(docked) => (drawerDocked = docked)"
    >
      <nav aria-label="Main" class="bo-nav__inner">
        <div class="bo-nav__brand">
          <div class="bo-nav__logo" aria-hidden="true">L</div>
          <div class="column">
            <span class="bo-nav__brand-name">[YOUR BRAND]</span>
            <span class="bo-nav__brand-sub">Back office</span>
          </div>
        </div>

        <q-list class="column q-gutter-y-xs">
          <q-item
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            :clickable="!!link.to"
            exact
            class="bo-nav__item"
            active-class="bo-nav__item--active"
          >
            <q-item-section avatar class="bo-nav__icon">
              <q-icon :name="link.icon" size="20px" />
            </q-item-section>
            <q-item-section>{{ link.label }}</q-item-section>
          </q-item>
        </q-list>
      </nav>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawerOpen = ref(false)
// True while the drawer takes layout space (wide screens); otherwise show the top bar.
const drawerDocked = ref(true)

const links = [
  { label: 'Overview', icon: 'sym_o_home', to: { name: 'overview' } },
  { label: 'Sales reports', icon: 'sym_o_bar_chart', to: { name: 'reports' } },
  { label: 'Partners', icon: 'sym_o_group', to: { name: 'partners' } },
  { label: 'Draws & results', icon: 'sym_o_schedule', to: { name: 'draws' } },
  { label: 'Payouts', icon: 'sym_o_payments', to: { name: 'payouts' } },
  // TODO: settings page not designed yet
  { label: 'Settings', icon: 'sym_o_settings', to: null },
]
</script>

<style lang="scss" scoped>
.bo-nav__inner {
  padding: 24px 16px;
  color: #e8eaf0;
}
.bo-nav__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 24px;
}
.bo-nav__logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: $accent;
  color: $dark;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
}
.bo-nav__brand-name {
  font-weight: 600;
  font-size: 15px;
}
.bo-nav__brand-sub {
  font-size: 12px;
  color: #a9afbc;
}
.bo-nav__item {
  min-height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  color: #c9cdd6;
  font-size: 14px;
}
.bo-nav__item--active {
  background: #2a2f3d;
  color: #fff;
  font-weight: 500;
}
.bo-nav__icon {
  min-width: 0;
  padding-right: 10px;
}
</style>
