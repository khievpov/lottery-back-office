<template>
  <q-page class="bo-page">
    <PageHeading
      title="Sales overview"
      :subtitle="`${store.today} · All regions · Updated ${store.updatedAt}`"
    >
      <q-btn-toggle
        v-model="period"
        aria-label="Period"
        class="bo-segment"
        unelevated
        no-caps
        toggle-color="dark"
        :options="periodOptions"
      />
      <q-btn-toggle
        v-model="store.currency"
        aria-label="Currency"
        class="bo-segment"
        unelevated
        no-caps
        toggle-color="primary-soft"
        toggle-text-color="primary"
        :options="currencyOptions"
      />
      <q-btn
        unelevated
        no-caps
        color="primary"
        class="bo-btn"
        icon="sym_o_download"
        label="Export report"
      />
    </PageHeading>

    <section aria-label="Key figures" class="kpi-grid">
      <KpiCard v-for="k in store.kpis" :key="k.label" v-bind="k" />
    </section>

    <div class="bo-row">
      <q-card flat class="bo-card bo-section" style="flex: 3 1 460px">
        <div class="row items-baseline justify-between q-gutter-sm">
          <h2 class="bo-h2">Sales by draw</h2>
          <span class="text-muted text-body2">
            {{ store.draws.length }} draws today · {{ usd(store.totalSalesToday) }} total
          </span>
        </div>
        <figure class="draw-chart">
          <div class="draw-chart__plot">
            <div v-for="(d, i) in store.draws" :key="d.id" class="draw-chart__col">
              <span class="bo-mono draw-chart__amount">{{ usd(d.sales) }}</span>
              <div
                aria-hidden="true"
                class="draw-chart__bar"
                :style="{ height: barHeight(d.sales) + 'px', background: barColors[i] }"
              />
            </div>
          </div>
          <div class="draw-chart__labels">
            <div v-for="d in store.draws" :key="d.id" class="draw-chart__label">
              <span class="text-weight-medium">{{ d.name }}</span>
              <span class="text-muted text-caption">{{ d.status }}</span>
            </div>
          </div>
          <figcaption class="text-caption text-muted">
            Gross ticket sales per draw. The {{ store.nextDraw.drawAt }} draw is still selling.
          </figcaption>
        </figure>
      </q-card>

      <q-card flat class="bo-card bo-section" style="flex: 2 1 320px; gap: 14px">
        <h2 class="bo-h2">Sales by region</h2>
        <div v-for="r in store.regionsWithShare" :key="r.name" class="column q-gutter-y-xs">
          <div class="row justify-between region-row">
            <span>{{ r.name }}</span>
            <span class="bo-mono text-weight-medium">
              {{ usd(r.sales) }} <span class="text-muted">· {{ r.pct }}%</span>
            </span>
          </div>
          <q-linear-progress
            :value="r.ratio"
            size="8px"
            rounded
            color="primary"
            track-color="grey-3"
            aria-hidden="true"
            class="region-bar"
          />
        </div>
      </q-card>
    </div>

    <div class="bo-row">
      <q-card flat class="bo-card bo-section" style="flex: 3 1 520px; padding-bottom: 8px">
        <div class="row items-center justify-between">
          <h2 class="bo-h2">Top partners today</h2>
          <q-btn
            flat
            no-caps
            dense
            color="primary"
            class="bo-btn"
            label="View all partners"
            :to="{ name: 'partners' }"
          />
        </div>
        <q-markup-table flat separator="horizontal" class="bo-table top-partners">
          <thead>
            <tr>
              <th class="text-left">Partner</th>
              <th class="text-left">Region</th>
              <th class="text-right">Tickets</th>
              <th class="text-right">Sales</th>
              <th class="text-right">Commission</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in store.topPartnersToday" :key="p.id">
              <td>
                <div class="text-weight-medium">{{ p.name }}</div>
                <div class="text-caption text-muted">{{ p.id }}</div>
              </td>
              <td>{{ p.region }}</td>
              <td class="text-right bo-mono">{{ num(p.tickets) }}</td>
              <td class="text-right bo-mono text-weight-medium">{{ usd(p.sales) }}</td>
              <td class="text-right bo-mono text-ink-2">{{ usd(p.sales * 0.12) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>

      <div class="column q-gutter-y-md" style="flex: 2 1 300px; min-width: 0">
        <q-card flat dark class="bg-dark bo-section next-draw" aria-labelledby="h-next">
          <h2 id="h-next" class="next-draw__title">Next draw · {{ store.nextDraw.name }}</h2>
          <span class="bo-mono next-draw__countdown">{{ store.nextDraw.countdown }}</span>
          <span class="next-draw__meta">
            Sales close at {{ store.nextDraw.closesAt }} · Draw at {{ store.nextDraw.drawAt }}
          </span>
          <div class="row justify-between next-draw__sold">
            <span class="next-draw__meta">Sold so far</span>
            <span class="bo-mono text-accent">{{ usd(store.nextDraw.soldSoFar) }}</span>
          </div>
        </q-card>

        <q-card flat class="bo-card bo-section" style="gap: 12px">
          <h3 class="attention__title">Needs attention</h3>
          <div class="attention__item">
            <span class="attention__dot bg-negative" aria-hidden="true" />
            <span>
              3 partners have unsettled balances over 7 days
              <router-link :to="{ name: 'partners' }">Review</router-link>
            </span>
          </div>
          <div class="attention__item">
            <span class="attention__dot bg-warning" aria-hidden="true" />
            <span>
              Draw C payouts: {{ store.pendingClaimsTotal }} large prizes awaiting approval
              <router-link :to="{ name: 'payouts' }">Approve</router-link>
            </span>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import PageHeading from 'components/PageHeading.vue'
import KpiCard from 'components/KpiCard.vue'
import { useBackofficeStore, usd, num } from 'stores/backoffice'

const store = useBackofficeStore()

const period = ref('today')
const periodOptions = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
]
const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'KHR', value: 'KHR' },
]

// Settled draws are lighter; the live draw is full primary.
const barColors = ['#9AA9DA', '#9AA9DA', '#5B73C4', '#1F3FA8']
const maxSales = Math.max(...store.draws.map((d) => d.sales))
const barHeight = (v) => Math.round((v / maxSales) * 190)
</script>

<style lang="scss" scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
}
.bo-section {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.draw-chart {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.draw-chart__plot {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  height: 240px;
  padding: 0 8px;
  border-bottom: 1px solid var(--bo-border-strong);
}
.draw-chart__col {
  flex: 1 1 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}
.draw-chart__amount {
  font-size: 13px;
  font-weight: 500;
}
.draw-chart__bar {
  width: 100%;
  max-width: 88px;
  border-radius: 6px 6px 0 0;
}
.draw-chart__labels {
  display: flex;
  gap: 20px;
  padding: 0 8px;
}
.draw-chart__label {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
  font-size: 13px;
}

.region-row {
  font-size: 13px;
}
.region-bar :deep(.q-linear-progress__track) {
  background: var(--bo-line);
  opacity: 1;
}

.top-partners :deep(table) {
  min-width: 560px;
}
.top-partners :deep(th:first-child),
.top-partners :deep(td:first-child) {
  padding-left: 4px;
}
.top-partners :deep(th:last-child),
.top-partners :deep(td:last-child) {
  padding-right: 4px;
}

.next-draw {
  border-radius: 12px;
  gap: 10px;
}
.next-draw__title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: normal;
  color: #c9cdd6;
}
.next-draw__countdown {
  font-size: 34px;
  font-weight: 600;
  line-height: 1.2;
}
.next-draw__meta {
  font-size: 13px;
  color: #c9cdd6;
}
.next-draw__sold {
  font-size: 13px;
  border-top: 1px solid #343a48;
  padding-top: 10px;
}

.attention__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: normal;
}
.attention__item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 14px;
}
.attention__dot {
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border-radius: 50%;
}
</style>
