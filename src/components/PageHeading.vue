<template>
  <header class="page-heading">
    <div class="column q-gutter-y-xs">
      <p v-if="crumb" class="page-heading__crumb">
        <router-link :to="{ name: 'overview' }">Overview</router-link> / {{ crumb }}
      </p>
      <div class="row items-center no-wrap q-gutter-x-sm">
        <h1 class="page-heading__title">{{ title }}</h1>
        <span class="page-heading__chip">Sample data</span>
      </div>
      <p v-if="subtitle" class="page-heading__sub">{{ subtitle }}</p>
    </div>
    <div class="page-heading__actions">
      <slot />
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  crumb: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.page-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.page-heading__crumb,
.page-heading__sub {
  margin: 0;
  font-size: 13px;
  color: var(--bo-muted);
}
.page-heading__sub {
  font-size: 14px;
}
.page-heading__title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}
.page-heading__chip {
  font-size: 12px;
  font-weight: 500;
  color: var(--bo-muted);
  border: 1px solid var(--bo-border-strong);
  border-radius: 999px;
  padding: 2px 10px;
  white-space: nowrap;
}
.page-heading__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
