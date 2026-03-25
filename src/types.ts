export type Allocation = { stocks: number; bonds: number; cash: number }

export type NewsItem = {
  id: string
  headline: string
  source: string
  timestamp: string
}

export type Portfolio = {
  id: string
  name: string
  /** ISO 4217, from client mock */
  currency?: string
  summary: {
    totalValue: number
    todayGainLoss: number
    todayGainLossPercent: number
    performanceData: number[]
  }
  allocation: Allocation
  news: NewsItem[]
}

export type UserType = 'front-office' | 'back-office'

export type LayoutItem = {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}
