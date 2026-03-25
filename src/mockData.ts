import type { LayoutItem } from './types'
import { buildDashboardPortfolios, DEFAULT_PORTFOLIO_ID } from './data/mapClientMockToDashboard'

export const BASE_PORTFOLIOS = buildDashboardPortfolios()

export { DEFAULT_PORTFOLIO_ID }

export const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: 'summary', x: 0, y: 0, w: 7, h: 8, minW: 4, minH: 5 },
  { i: 'allocation', x: 7, y: 0, w: 5, h: 8, minW: 4, minH: 5 },
  { i: 'news', x: 0, y: 8, w: 12, h: 7, minW: 6, minH: 5 },
]
