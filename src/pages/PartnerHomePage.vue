<template>
  <q-page class="partner-home">
    <header class="partner-home__header">
      <div class="row items-center justify-between">
        <span class="partner-home__date">Thu 5 Nov · {{ partner.id }}</span>
        <q-btn
          round
          unelevated
          class="partner-home__bell"
          icon="sym_o_notifications"
          aria-label="Notifications"
        />
      </div>
      <h1 class="partner-home__name">{{ partner.name }}</h1>
    </header>

    <main class="partner-home__body">
      <q-card flat class="mine" aria-labelledby="h-mytoday">
        <div class="row items-baseline justify-between">
          <h2 id="h-mytoday" class="mine__title">My sales today</h2>
          <span class="text-caption text-muted">Sample data</span>
        </div>
        <span class="bo-mono mine__total">{{ usd(partner.salesToday) }}</span>
        <div class="mine__stats">
          <div>
            <span>Tickets</span>
            <strong class="bo-mono">{{ num(partner.ticketsToday) }}</strong>
          </div>
          <div>
            <span>I earned</span>
            <strong class="bo-mono" style="color: #0b6640">{{ usd(partner.earnedToday) }}</strong>
          </div>
          <div>
            <span>To deposit</span>
            <strong class="bo-mono">{{ usd(partner.toDeposit) }}</strong>
          </div>
        </div>
      </q-card>

      <q-btn
        unelevated
        no-caps
        color="accent"
        text-color="dark"
        icon="sym_o_confirmation_number"
        label="Sell ticket"
        class="sell-btn"
      />

      <div class="quick-actions">
        <q-btn
          unelevated
          no-caps
          icon="sym_o_qr_code_scanner"
          label="Check ticket"
          class="quick-btn"
        />
        <q-btn unelevated no-caps icon="sym_o_payments" label="Pay a winner" class="quick-btn" />
      </div>

      <q-card flat class="today" aria-labelledby="h-draws">
        <h2 id="h-draws" class="today__title">Today's draws</h2>
        <div v-for="d in draws" :key="d.name" class="today__row">
          <span class="column q-gutter-y-xs">
            <span class="text-weight-bold" style="font-size: 14px">{{ d.name }}</span>
            <span class="text-caption text-muted">{{ d.note }}</span>
          </span>
          <StatusPill v-if="!d.result" status="Selling" />
          <span v-else class="bo-mono today__result" :class="{ 'today__result--won': d.won }">
            {{ d.result }}
          </span>
        </div>
      </q-card>
    </main>
  </q-page>
</template>

<script setup>
import StatusPill from 'components/StatusPill.vue'
import { useBackofficeStore, usd, num } from 'stores/backoffice'

const store = useBackofficeStore()
const partner = store.partner

const draws = [
  { name: 'Draw D · 19:00', note: 'Sales close in 13 min', result: null },
  { name: 'Draw C · 16:00', note: '4 winners at my shop', result: '4729', won: true },
  { name: 'Draw B · 13:00', note: 'No winners at my shop', result: '0815', won: false },
]
</script>

<style lang="scss" scoped>
.partner-home__header {
  background: $dark;
  color: #fff;
  padding: 22px 20px 64px;
}
.partner-home__date {
  font-size: 13px;
  color: #c9cdd6;
}
.partner-home__bell {
  width: 44px;
  height: 44px;
  background: #2a2f3d;
  color: #fff;
}
.partner-home__name {
  margin: 4px 0 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: normal;
}
.partner-home__body {
  margin-top: -48px;
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mine {
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 10px rgba(21, 24, 33, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.mine__title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: normal;
  color: var(--bo-muted);
}
.mine__total {
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.mine__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  border-top: 1px solid var(--bo-line);
  padding-top: 12px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  span {
    font-size: 12px;
    color: var(--bo-muted);
  }
  strong {
    font-size: 15px;
    font-weight: 600;
  }
}

.sell-btn {
  min-height: 60px;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 700;
}
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.quick-btn {
  min-height: 52px;
  border-radius: 12px;
  border: 1px solid var(--bo-border-strong);
  background: #fff;
  color: var(--bo-ink);
  font-size: 15px;
  font-weight: 600;

  :deep(.q-icon) {
    font-size: 20px;
  }
}

.today {
  border-radius: 16px;
  padding: 6px 16px;
}
.today__title {
  margin: 0;
  padding: 10px 0 4px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: normal;
}
.today__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;

  & + & {
    border-top: 1px solid var(--bo-line);
  }
}
.today__result {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.12em;
  background: var(--bo-page);
  padding: 4px 10px;
  border-radius: 8px;
}
.today__result--won {
  background: var(--bo-gold-soft);
}
</style>
