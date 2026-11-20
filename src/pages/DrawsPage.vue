<template>
  <q-page class="bo-page" style="gap: 20px">
    <PageHeading title="Draw results & payouts" :crumb="$route.meta.crumb">
      <q-btn unelevated no-caps color="primary" class="bo-btn" label="Enter draw result" />
    </PageHeading>

    <div class="bo-row items-start">
      <q-card flat class="bo-card draw-list" aria-labelledby="h-today">
        <h2 id="h-today" class="draw-list__title">Today · 5 Nov</h2>
        <q-btn
          v-for="d in store.draws"
          :key="d.id"
          unelevated
          no-caps
          align="between"
          class="draw-list__item"
          :class="{ 'draw-list__item--selected': d.id === selectedId }"
          :aria-pressed="d.id === selectedId ? 'true' : 'false'"
          @click="selectedId = d.id"
        >
          <span class="column items-start text-left">
            <span class="text-weight-bold" style="font-size: 14px">{{ d.name }}</span>
            <span class="text-caption text-muted">{{ usd(d.sales) }} sold</span>
          </span>
          <StatusPill :status="d.status" />
        </q-btn>
      </q-card>

      <div class="column q-gutter-y-md" style="flex: 999 1 560px; min-width: 0">
        <q-card flat class="bo-card result" aria-labelledby="h-result">
          <div class="column q-gutter-y-sm">
            <h2 id="h-result" class="result__title">{{ result.title }} · Winning number</h2>
            <div
              class="row q-gutter-x-sm"
              role="img"
              :aria-label="`Winning number ${result.digits.join(' ')}`"
            >
              <span
                v-for="(n, i) in result.digits"
                :key="i"
                aria-hidden="true"
                class="result__digit bo-mono"
              >
                {{ n }}
              </span>
            </div>
            <span class="text-muted" style="font-size: 13px">{{ result.meta }}</span>
          </div>
          <div class="result__stats">
            <div class="result__stat">
              <span>Ticket sales</span>
              <strong class="bo-mono">{{ usd(result.ticketSales) }}</strong>
            </div>
            <div class="result__stat">
              <span>Total prizes</span>
              <strong class="bo-mono">{{ usd(result.totalPrizes) }}</strong>
            </div>
            <div class="result__stat">
              <span>Payout ratio</span>
              <strong class="bo-mono">{{ result.payoutRatio }}</strong>
            </div>
          </div>
        </q-card>

        <q-card flat class="bo-card q-pb-sm" aria-labelledby="h-tiers">
          <h2 id="h-tiers" class="bo-h2 q-px-lg q-pt-md q-pb-xs">Prize tiers</h2>
          <q-markup-table flat class="bo-table bo-table--head-tinted tiers-table">
            <thead>
              <tr>
                <th class="text-left">Tier</th>
                <th class="text-left">Match</th>
                <th class="text-right">Prize</th>
                <th class="text-right">Winners</th>
                <th class="text-right">Total</th>
                <th class="text-left">Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in store.prizeTiers" :key="t.tier">
                <td class="text-weight-bold">{{ t.tier }}</td>
                <td class="text-ink-2">{{ t.rule }}</td>
                <td class="text-right bo-mono">{{ usd(t.prize) }}</td>
                <td class="text-right bo-mono">{{ t.winners }}</td>
                <td class="text-right bo-mono text-weight-bold">{{ usd(t.prize * t.winners) }}</td>
                <td style="width: 18%">
                  <div class="text-caption text-muted q-mb-xs">
                    {{ t.paid ? `${t.paid} of ${t.winners} paid` : 'Awaiting approval' }}
                  </div>
                  <q-linear-progress
                    :value="t.paid / t.winners"
                    size="6px"
                    rounded
                    color="positive"
                    aria-hidden="true"
                    class="paid-bar"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>

        <q-card flat class="bo-card q-pb-sm" aria-labelledby="h-approve">
          <div class="row items-center justify-between q-px-lg q-pt-sm q-pb-xs q-gutter-sm">
            <h2 id="h-approve" class="bo-h2">
              Large prizes awaiting approval
              <span class="text-weight-medium" style="color: #8a4f00"
                >· {{ store.pendingClaimsTotal }}</span
              >
            </h2>
            <q-btn
              unelevated
              no-caps
              class="bo-btn bo-btn--outline"
              label="Approve all checked"
              :disable="!checked.length"
              @click="approve(checked)"
            />
          </div>
          <div class="claims">
            <div class="claims__inner">
              <div v-for="c in store.pendingClaims" :key="c.ticket" class="claims__row">
                <q-checkbox
                  v-model="checked"
                  :val="c.ticket"
                  color="primary"
                  :aria-label="`Select ticket ${c.ticket}`"
                />
                <span class="bo-mono text-weight-medium">{{ c.ticket }}</span>
                <span class="column">
                  <span>{{ c.partner }}</span>
                  <span class="text-caption text-muted">{{ c.pid }}</span>
                </span>
                <span>{{ c.tier }}</span>
                <span class="bo-mono text-weight-bold">{{ usd(c.amount) }}</span>
                <span class="text-muted">{{ c.time }}</span>
                <q-btn
                  unelevated
                  no-caps
                  color="positive"
                  class="claims__approve"
                  label="Approve"
                  @click="approve([c.ticket])"
                />
              </div>
              <div v-if="!store.pendingClaims.length" class="claims__empty text-muted">
                All listed claims approved.
              </div>
            </div>
          </div>
          <q-btn
            flat
            no-caps
            color="primary"
            class="bo-btn q-ml-sm"
            :label="`Show all ${store.pendingClaimsTotal} claims`"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import PageHeading from 'components/PageHeading.vue'
import StatusPill from 'components/StatusPill.vue'
import { useBackofficeStore, usd } from 'stores/backoffice'

const store = useBackofficeStore()
const result = store.drawResult

const selectedId = ref(result.drawId)
const checked = ref([])

function approve(tickets) {
  store.approveClaims(tickets)
  checked.value = checked.value.filter((t) => !tickets.includes(t))
}
</script>

<style lang="scss" scoped>
.draw-list {
  flex: 1 1 260px;
  min-width: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.draw-list__title {
  margin: 0 4px 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: normal;
}
.draw-list__item {
  min-height: 64px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--bo-border);
  background: #fff;
  color: var(--bo-ink);

  :deep(.q-btn__content) {
    width: 100%;
    gap: 10px;
    flex-wrap: nowrap;
  }
}
.draw-list__item--selected {
  border: 2px solid $primary;
  background: #f3f5fc;
}

.result {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
}
.result__title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: normal;
  color: var(--bo-muted);
}
.result__digit {
  width: 60px;
  height: 72px;
  border-radius: 12px;
  background: var(--bo-gold-soft);
  border: 2px solid $accent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: 600;
}
.result__stats {
  flex: 1 1 360px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.result__stat {
  border: 1px solid var(--bo-border);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    font-size: 12px;
    color: var(--bo-muted);
  }
  strong {
    font-size: 20px;
    font-weight: 600;
  }
}

.tiers-table :deep(table) {
  min-width: 620px;
}
.paid-bar :deep(.q-linear-progress__track) {
  background: var(--bo-line);
  opacity: 1;
}

.claims {
  overflow-x: auto;
}
.claims__inner {
  min-width: 680px;
}
.claims__row {
  display: grid;
  grid-template-columns: 44px 1.3fr 1.8fr 1fr 1fr 1fr 120px;
  gap: 12px;
  align-items: center;
  padding: 10px 20px;
  font-size: 14px;
  border-top: 1px solid var(--bo-line);
}
.claims__approve {
  min-height: 40px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
.claims__empty {
  padding: 16px 20px;
  border-top: 1px solid var(--bo-line);
}
</style>
