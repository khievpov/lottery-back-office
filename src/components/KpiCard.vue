<template>
  <q-card flat class="bo-card kpi-card" :class="{ 'kpi-card--compact': compact }">
    <span class="kpi-card__label">{{ label }}</span>
    <span class="kpi-card__value bo-mono" :class="valueClass">{{ value }}</span>
    <span
      v-if="delta"
      class="kpi-card__delta"
      :class="trend === 'up' ? 'text-positive' : 'text-muted'"
    >
      {{ delta }}
    </span>
  </q-card>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  delta: { type: String, default: '' },
  trend: { type: String, default: '' },
  valueClass: { type: String, default: '' },
  compact: Boolean,
})
</script>

<style lang="scss" scoped>
.kpi-card {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kpi-card__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--bo-muted);
}
.kpi-card__value {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.kpi-card__delta {
  font-size: 13px;
}
.kpi-card--compact {
  padding: 14px 16px;
  gap: 4px;

  .kpi-card__label {
    font-size: 12px;
  }
  .kpi-card__value {
    font-size: 22px;
  }
}
</style>
