<template>
  <span class="bo-pill" :class="`bo-pill--${tone}`">{{ status }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { STATUS_TONES } from 'stores/backoffice'

const props = defineProps({
  status: { type: String, required: true },
})

const tone = computed(() => STATUS_TONES[props.status] ?? 'neutral')
</script>

<style lang="scss" scoped>
.bo-pill--positive {
  background: #e3f4eb;
  color: #0b6640;
}
.bo-pill--warning {
  background: #fff1d6;
  color: #8a4f00;
}
.bo-pill--negative {
  background: #fde7e5;
  color: #a11e14;
}
.bo-pill--primary {
  background: var(--bo-primary-soft);
  color: $primary;
}
.bo-pill--neutral {
  background: var(--bo-line);
  color: var(--bo-ink-2);
}
</style>
