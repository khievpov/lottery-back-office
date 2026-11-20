import { defineStore, acceptHMRUpdate } from 'pinia'

// Sample data for the lottery back office. Replace with API calls when the backend is ready.

const COMMISSION_RATE = 0.12

export const usd = (n) => '$' + Math.round(n).toLocaleString('en-US')
export const num = (n) => n.toLocaleString('en-US')

export const STATUS_TONES = {
  Settled: 'positive',
  Due: 'warning',
  Overdue: 'negative',
  'Paying out': 'warning',
  Selling: 'primary',
}

export const useBackofficeStore = defineStore('backoffice', {
  state: () => ({
    today: 'Thursday, 5 Nov 2026',
    updatedAt: '18:46',
    currency: 'USD',

    kpis: [
      { label: 'Gross sales', value: '$48,620', delta: '+6.2% vs last Thursday', trend: 'up' },
      { label: 'Tickets sold', value: '97,240', delta: '+4.8% vs last Thursday', trend: 'up' },
      { label: 'Partner commission', value: '$5,834', delta: '12% of gross sales' },
      { label: 'Prizes paid', value: '$21,380', delta: '3 of 4 draws settled' },
    ],

    draws: [
      { id: 'A', name: 'Draw A · 10:30', sales: 9800, status: 'Settled', result: '3150' },
      { id: 'B', name: 'Draw B · 13:00', sales: 12450, status: 'Settled', result: '0815' },
      { id: 'C', name: 'Draw C · 16:00', sales: 11920, status: 'Paying out', result: '4729' },
      { id: 'D', name: 'Draw D · 19:00', sales: 14450, status: 'Selling', result: null },
    ],

    nextDraw: {
      name: 'Draw D',
      countdown: '00:13:40',
      closesAt: '18:59',
      drawAt: '19:00',
      soldSoFar: 14450,
    },

    regions: [
      { name: 'Phnom Penh', sales: 21400 },
      { name: 'Siem Reap', sales: 7900 },
      { name: 'Battambang', sales: 6300 },
      { name: 'Kampong Cham', sales: 5120 },
      { name: 'Sihanoukville', sales: 4200 },
      { name: 'Other provinces', sales: 3700 },
    ],

    topPartnersToday: [
      { name: 'Lucky Star Kiosk', id: 'P-1042', region: 'Phnom Penh', tickets: 6820, sales: 3410 },
      { name: 'Golden River Mart', id: 'P-0877', region: 'Phnom Penh', tickets: 5940, sales: 2970 },
      { name: 'Angkor Corner Shop', id: 'P-1310', region: 'Siem Reap', tickets: 4760, sales: 2380 },
      {
        name: 'Riverside Phone & Lotto',
        id: 'P-0552',
        region: 'Battambang',
        tickets: 4120,
        sales: 2060,
      },
      {
        name: 'Market Gate Stall 14',
        id: 'P-1198',
        region: 'Kampong Cham',
        tickets: 3680,
        sales: 1840,
      },
    ],

    // Partner sales report, 1–5 Nov 2026
    reportPeriod: '1–5 Nov 2026',
    activePartners: 248,
    reportTotals: {
      gross: 231480,
      commission: 27778,
      prizesPaid: 98620,
      overdue: 9316,
    },
    reportRows: [
      ['Lucky Star Kiosk', 'P-1042', 'Phnom Penh', 31240, 15620, 7480, 'Settled'],
      ['Golden River Mart', 'P-0877', 'Phnom Penh', 27560, 13780, 6910, 'Due'],
      ['Angkor Corner Shop', 'P-1310', 'Siem Reap', 22180, 11090, 4820, 'Settled'],
      ['Riverside Phone & Lotto', 'P-0552', 'Battambang', 19400, 9700, 5130, 'Overdue'],
      ['Market Gate Stall 14', 'P-1198', 'Kampong Cham', 17020, 8510, 3640, 'Settled'],
      ['Mekong View Store', 'P-0921', 'Phnom Penh', 15880, 7940, 4210, 'Due'],
      ['Coastline Mini Mart', 'P-1405', 'Sihanoukville', 14260, 7130, 2980, 'Settled'],
      ['Old Market Lotto Desk', 'P-0310', 'Siem Reap', 12900, 6450, 3360, 'Overdue'],
      ['Highway 5 Fuel Stop', 'P-1277', 'Battambang', 11540, 5770, 2410, 'Settled'],
      ['Sunrise Mobile Agent', 'P-1533', 'Kampong Cham', 9820, 4910, 2950, 'Overdue'],
    ].map(([name, id, region, tickets, sales, prizes, status]) => {
      const commission = Math.round(sales * COMMISSION_RATE)
      return {
        name,
        id,
        region,
        tickets,
        sales,
        commission,
        prizes,
        net: sales - commission - prizes,
        status,
      }
    }),

    // Draw C results
    drawResult: {
      drawId: 'C',
      title: 'Draw C · 16:00',
      digits: ['4', '7', '2', '9'],
      meta: 'Drawn 16:00:12 · Verified by 2 officers · Published to partners 16:03',
      ticketSales: 11920,
      totalPrizes: 7450,
      payoutRatio: '62.5%',
    },
    prizeTiers: [
      { tier: 'First prize', rule: 'All 4 digits · 4729', prize: 2500, winners: 1, paid: 0 },
      { tier: 'Second prize', rule: 'Last 3 digits · 729', prize: 250, winners: 11, paid: 0 },
      { tier: 'Third prize', rule: 'Last 2 digits · 29', prize: 25, winners: 88, paid: 61 },
    ],
    pendingClaimsTotal: 12,
    claims: [
      {
        ticket: 'C-0418-22917',
        partner: 'Lucky Star Kiosk',
        pid: 'P-1042',
        tier: 'First',
        amount: 2500,
        time: '16:41',
        approved: false,
      },
      {
        ticket: 'C-0877-10342',
        partner: 'Golden River Mart',
        pid: 'P-0877',
        tier: 'Second',
        amount: 250,
        time: '16:52',
        approved: false,
      },
      {
        ticket: 'C-1310-04711',
        partner: 'Angkor Corner Shop',
        pid: 'P-1310',
        tier: 'Second',
        amount: 250,
        time: '17:05',
        approved: false,
      },
      {
        ticket: 'C-0552-30088',
        partner: 'Riverside Phone & Lotto',
        pid: 'P-0552',
        tier: 'Second',
        amount: 250,
        time: '17:18',
        approved: false,
      },
    ],

    // Partner mobile app (signed-in partner)
    partner: {
      id: 'P-1042',
      name: 'Lucky Star Kiosk',
      salesToday: 3410,
      ticketsToday: 6820,
      earnedToday: 409,
      toDeposit: 2221,
    },
  }),

  getters: {
    totalSalesToday: (state) => state.draws.reduce((sum, d) => sum + d.sales, 0),
    regionsWithShare(state) {
      const total = this.totalSalesToday
      const max = Math.max(...state.regions.map((r) => r.sales))
      return state.regions.map((r) => ({
        ...r,
        pct: Math.round((r.sales / total) * 100),
        ratio: r.sales / max,
      }))
    },
    pendingClaims: (state) => state.claims.filter((c) => !c.approved),
  },

  actions: {
    approveClaims(tickets) {
      this.claims.forEach((c) => {
        if (tickets.includes(c.ticket)) c.approved = true
      })
      this.pendingClaimsTotal = Math.max(0, this.pendingClaimsTotal - tickets.length)
    },
  },
})

export const COMMISSION_PCT = Math.round(COMMISSION_RATE * 100)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBackofficeStore, import.meta.hot))
}
