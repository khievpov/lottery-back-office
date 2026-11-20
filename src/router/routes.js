const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'overview', component: () => import('pages/OverviewPage.vue') },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('pages/PartnersPage.vue'),
        meta: { crumb: 'Sales reports' },
      },
      {
        path: 'partners',
        name: 'partners',
        component: () => import('pages/PartnersPage.vue'),
        meta: { crumb: 'Partners' },
      },
      {
        path: 'draws',
        name: 'draws',
        component: () => import('pages/DrawsPage.vue'),
        meta: { crumb: 'Draws & results' },
      },
      {
        path: 'payouts',
        name: 'payouts',
        component: () => import('pages/DrawsPage.vue'),
        meta: { crumb: 'Payouts' },
      },
    ],
  },

  // Partner-facing mobile app
  {
    path: '/partner',
    component: () => import('layouts/PartnerAppLayout.vue'),
    children: [
      { path: '', name: 'partner-home', component: () => import('pages/PartnerHomePage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
