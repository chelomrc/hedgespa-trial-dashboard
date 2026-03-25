import type { Portfolio } from '../types'
import {
  portfolioHoldings,
  portfolioNews,
  portfolioPerformance,
  portfolios as clientPortfolios,
} from './clientMock'

const MINI_CHART_POINTS = 30

function holdingsForPortfolio(portfolioId: number) {
  return portfolioHoldings.filter((h) => h.portfolioId === portfolioId)
}

function totalMarketValueFromHoldings(portfolioId: number): number {
  return holdingsForPortfolio(portfolioId).reduce((sum, h) => sum + h.position, 0)
}

function allocationPercentages(portfolioId: number) {
  const holdings = holdingsForPortfolio(portfolioId)
  let equity = 0
  let fixedIncome = 0
  let cashValue = 0
  for (const h of holdings) {
    const v = h.position
    if (h.assetClass === 'Equity') equity += v
    else if (h.assetClass === 'Fixed Income') fixedIncome += v
    else if (h.assetClass === 'Cash') cashValue += v
    else equity += v
  }
  const total = equity + fixedIncome + cashValue
  if (total <= 0) return { stocks: 34, bonds: 33, cash: 33 }
  const stocks = Math.round((equity / total) * 100)
  const bonds = Math.round((fixedIncome / total) * 100)
  const cashPct = Math.max(0, 100 - stocks - bonds)
  return { stocks, bonds, cash: cashPct }
}

function performanceRowsForPortfolio(portfolioId: number) {
  return portfolioPerformance
    .filter((r) => r.portfolioId === portfolioId)
    .sort((a, b) => a.cobDate.localeCompare(b.cobDate))
}

function normalizedSeriesForPortfolio(portfolioId: number): number[] {
  const rows = performanceRowsForPortfolio(portfolioId)
  if (rows.length >= MINI_CHART_POINTS) {
    return rows.slice(-MINI_CHART_POINTS).map((r) => r.normalizedNav)
  }

  const fallback = performanceRowsForPortfolio(1)
    .sort((a, b) => a.cobDate.localeCompare(b.cobDate))
    .slice(-MINI_CHART_POINTS)
    .map((r) => r.normalizedNav)
  if (fallback.length === 0) return Array.from({ length: MINI_CHART_POINTS }, (_, i) => 100 + i * 0.1)

  const total = totalMarketValueFromHoldings(portfolioId)
  const anchor = total > 0 ? total / (fallback[fallback.length - 1]! / 100) : 100
  return fallback.map((v) => (anchor * v) / 100)
}

function summaryFromPerformance(portfolioId: number, totalFromHoldings: number) {
  const rows = performanceRowsForPortfolio(portfolioId)
  if (rows.length < 2) {
    return {
      totalValue: totalFromHoldings,
      todayGainLoss: 0,
      todayGainLossPercent: 0,
    }
  }
  const last = rows[rows.length - 1]!
  const prev = rows[rows.length - 2]!
  return {
    totalValue: last.nav,
    todayGainLoss: last.nav - prev.nav,
    todayGainLossPercent: last.dtdChange * 100,
  }
}

function newsForPortfolio(portfolioId: number) {
  return portfolioNews
    .filter((n) => n.portfolioId === portfolioId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .map((n) => ({
      id: String(n.id),
      headline: n.headline,
      source: n.source,
      timestamp: n.timestamp,
    }))
}

export function buildDashboardPortfolios(): Portfolio[] {
  return clientPortfolios.map((cp) => {
    const id = String(cp.portfolioId)
    const holdingsValue = totalMarketValueFromHoldings(cp.portfolioId)
    const perf = summaryFromPerformance(cp.portfolioId, holdingsValue)
    const allocation = allocationPercentages(cp.portfolioId)
    const performanceData = normalizedSeriesForPortfolio(cp.portfolioId)

    return {
      id,
      name: cp.portfolioName,
      currency: cp.currency,
      summary: {
        ...perf,
        performanceData:
          performanceData.length >= MINI_CHART_POINTS
            ? performanceData.slice(-MINI_CHART_POINTS)
            : [
                ...Array.from({ length: MINI_CHART_POINTS - performanceData.length }, () => performanceData[0] ?? 100),
                ...performanceData,
              ].slice(-MINI_CHART_POINTS),
      },
      allocation,
      news: newsForPortfolio(cp.portfolioId),
    }
  })
}

export const DEFAULT_PORTFOLIO_ID =
  clientPortfolios[0] != null ? String(clientPortfolios[0].portfolioId) : '1'
