<template>
  <q-page class="bo-page" style="gap: 20px">
    <PageHeading title="Partner sales report" :crumb="$route.meta.crumb">
      <q-btn unelevated no-caps class="bo-btn bo-btn--outline" label="Download CSV" />
      <q-btn unelevated no-caps color="primary" class="bo-btn" label="Export PDF" />
    </PageHeading>

    <q-form aria-label="Report filters" class="bo-card filters" @submit.prevent>
      <div class="filters__field" style="flex: 1 1 180px">
        <label for="f-from">From</label>
        <q-input v-model="filters.from" for="f-from" outlined dense class="bo-field" />
      </div>
      <div class="filters__field" style="flex: 1 1 180px">
        <label for="f-to">To</label>
        <q-input v-model="filters.to" for="f-to" outlined dense class="bo-field" />
      </div>
      <div class="filters__field" style="flex: 1 1 180px">
        <label for="f-region">Region</label>
        <q-select
          v-model="filters.region"
          for="f-region"
          :options="regionOptions"
          outlined
          dense
          class="bo-field"
        />
      </div>
      <div class="filters__field" style="flex: 1 1 180px">
        <label for="f-status">Balance status</label>
        <q-select
          v-model="filters.status"
          for="f-status"
          :options="statusOptions"
          outlined
          dense
          class="bo-field"
        />
      </div>
      <div class="filters__field" style="flex: 2 1 240px">
        <label for="f-search">Search partner</label>
        <q-input
          v-model="filters.search"
          for="f-search"
          type="search"
          placeholder="Name or partner ID"
          outlined
          dense
          clearable
          class="bo-field"
        />
      </div>
    </q-form>

    <section aria-label="Totals for this period" class="totals-grid">
      <KpiCard v-for="t in totals" :key="t.label" v-bind="t" compact />
    </section>

    <q-card flat class="bo-card" aria-labelledby="h-table">
      <h2 id="h-table" class="bo-h2 q-px-lg q-pt-md q-pb-sm">
        {{ shownCount }} partners · {{ store.reportPeriod }}
      </h2>
      <q-table
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        hide-pagination
        :pagination="{ rowsPerPage: 10 }"
        class="bo-table bo-table--head-tinted report-table"
        no-data-label="No partners match these filters"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <a href="#" class="partner-link" @click.prevent>{{ props.row.name }}</a>
            <div class="text-caption text-muted">{{ props.row.id }}</div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <StatusPill :status="props.row.status" />
          </q-td>
        </template>
      </q-table>
      <div class="row items-center justify-between q-px-lg q-py-md q-gutter-sm">
        <span class="text-muted" style="font-size: 13px">
          Showing 1–{{ Math.min(10, shownCount) }} of {{ shownCount }}
        </span>
        <q-pagination
          v-model="page"
          :max="pageCount"
          :max-pages="3"
          direction-links
          boundary-numbers
          unelevated
          color="white"
          text-color="dark"
          active-color="dark"
          active-text-color="white"
          icon-prev="sym_o_chevron_left"
          icon-next="sym_o_chevron_right"
          class="bo-pagination"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import PageHeading from 'components/PageHeading.vue'
import KpiCard from 'components/KpiCard.vue'
import StatusPill from 'components/StatusPill.vue'
import { useBackofficeStore, usd, num, COMMISSION_PCT } from 'stores/backoffice'

const store = useBackofficeStore()

const filters = reactive({
  from: '01 Nov 2026',
  to: '05 Nov 2026',
  region: 'All regions',
  status: 'Any status',
  search: '',
})
const regionOptions = [
  'All regions',
  'Phnom Penh',
  'Siem Reap',
  'Battambang',
  'Kampong Cham',
  'Sihanoukville',
]
const statusOptions = ['Any status', 'Settled', 'Due', 'Overdue']

const isFiltered = computed(
  () => filters.region !== 'All regions' || filters.status !== 'Any status' || !!filters.search,
)

const filteredRows = computed(() => {
  const q = (filters.search || '').trim().toLowerCase()
  return store.reportRows.filter(
    (r) =>
      (filters.region === 'All regions' || r.region === filters.region) &&
      (filters.status === 'Any status' || r.status === filters.status) &&
      (!q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)),
  )
})

// The sample only holds the first page; the unfiltered total comes from the report summary.
const shownCount = computed(() =>
  isFiltered.value ? filteredRows.value.length : store.activePartners,
)
const page = ref(1)
const pageCount = computed(() => Math.max(1, Math.ceil(shownCount.value / 10)))

const totals = computed(() => [
  { label: 'Active partners', value: num(store.activePartners) },
  { label: 'Gross sales', value: usd(store.reportTotals.gross) },
  { label: `Commission (${COMMISSION_PCT}%)`, value: usd(store.reportTotals.commission) },
  { label: 'Prizes paid by partners', value: usd(store.reportTotals.prizesPaid) },
  { label: 'Overdue balances', value: usd(store.reportTotals.overdue), valueClass: 'text-overdue' },
])

const money = { align: 'right', format: usd, classes: 'bo-mono' }
const columns = [
  { name: 'name', label: 'Partner', field: 'name', align: 'left' },
  { name: 'region', label: 'Region', field: 'region', align: 'left' },
  {
    name: 'tickets',
    label: 'Tickets',
    field: 'tickets',
    align: 'right',
    format: num,
    classes: 'bo-mono',
  },
  {
    name: 'sales',
    label: 'Gross sales',
    field: 'sales',
    ...money,
    classes: 'bo-mono text-weight-medium',
  },
  {
    name: 'commission',
    label: 'Commission',
    field: 'commission',
    ...money,
    classes: 'bo-mono text-ink-2',
  },
  {
    name: 'prizes',
    label: 'Prizes paid',
    field: 'prizes',
    ...money,
    classes: 'bo-mono text-ink-2',
  },
  { name: 'net', label: 'Net due', field: 'net', ...money, classes: 'bo-mono text-weight-bold' },
  { name: 'status', label: 'Balance', field: 'status', align: 'left' },
]
</script>

<style lang="scss" scoped>
.filters {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-end;
}
.filters__field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 600;
    color: var(--bo-ink-2);
  }
}
.bo-field :deep(.q-field__control) {
  min-height: 44px;
  border-radius: 8px;
}
.bo-field :deep(.q-field__control:before) {
  border-color: var(--bo-border-strong);
}

.totals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}
.totals-grid :deep(.text-overdue) {
  color: #a11e14;
}

.report-table :deep(table) {
  min-width: 940px;
}
.partner-link {
  color: var(--bo-ink);
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: $primary;
    text-decoration: underline;
  }
}

.bo-pagination :deep(.q-btn) {
  min-width: 44px;
  min-height: 44px;
  border-radius: 8px;
  border: 1px solid var(--bo-border-strong);
}
.bo-pagination :deep(.q-btn.bg-dark) {
  border-color: transparent;
}
</style>
