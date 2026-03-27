import type { Portfolio } from '../types'

/** Full mock portfolio for widget tests */
export const mockPortfolio: Portfolio = {
  id: '1',
  name: 'Test Portfolio',
  currency: 'USD',
  summary: {
    totalValue: 5_310_648,
    todayGainLoss: -14_352,
    todayGainLossPercent: -0.27,
    performanceData: [210, 215, 212, 218, 223, 233.64],
  },
  allocation: { stocks: 60, bonds: 30, cash: 10 },
  news: [
    {
      id: 'n1',
      headline: 'Fed holds rates steady',
      source: 'FT',
      timestamp: '2026-03-14T09:30:00.000Z',
    },
  ],
}

export const mockPortfolioPositiveDay: Portfolio = {
  ...mockPortfolio,
  summary: {
    ...mockPortfolio.summary,
    todayGainLoss: 12_000,
    todayGainLossPercent: 0.42,
  },
}
