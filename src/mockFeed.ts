import type { Portfolio } from './types'

function jitter(value: number, scale: number) {
  return value + (Math.random() - 0.5) * scale
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function nextAllocation(portfolio: Portfolio) {
  const stocks = clamp(portfolio.allocation.stocks + Math.round((Math.random() - 0.5) * 2), 15, 85)
  const bonds = clamp(portfolio.allocation.bonds + Math.round((Math.random() - 0.5) * 2), 10, 80)
  const cash = Math.max(0, 100 - stocks - bonds)
  const normalizedBonds = bonds + (100 - (stocks + bonds + cash))
  return { stocks, bonds: normalizedBonds, cash }
}

function nextNews(portfolio: Portfolio, tickMs: number) {
  const pool = portfolio.news
  if (pool.length === 0) return portfolio.news
  const index = Math.floor(tickMs / 5000) % pool.length
  const selected = pool[index]!
  const freshItem = {
    id: `${portfolio.id}-live-${tickMs}`,
    headline: selected.headline,
    source: selected.source,
    timestamp: new Date(tickMs).toISOString(),
  }
  return [freshItem, ...portfolio.news.slice(0, 4)]
}

export function simulatePortfolioTick(portfolios: Portfolio[]): Portfolio[] {
  const tickMs = Date.now()
  return portfolios.map((portfolio) => {
    const move = (Math.random() - 0.5) * 9000
    const percentMove = (move / portfolio.summary.totalValue) * 100
    const previousPoint =
      portfolio.summary.performanceData[portfolio.summary.performanceData.length - 1]
    const nextPoint = jitter(previousPoint, 0.8)
    const nextSeries = [...portfolio.summary.performanceData.slice(1), nextPoint]

    return {
      ...portfolio,
      summary: {
        ...portfolio.summary,
        totalValue: Math.max(100000, portfolio.summary.totalValue + move),
        todayGainLoss: portfolio.summary.todayGainLoss + move,
        todayGainLossPercent: portfolio.summary.todayGainLossPercent + percentMove,
        performanceData: nextSeries,
      },
      allocation: nextAllocation(portfolio),
      news: nextNews(portfolio, tickMs),
    }
  })
}

export async function fetchMockPortfolios(portfolios: Portfolio[]): Promise<Portfolio[]> {
  await new Promise((resolve) => setTimeout(resolve, 120))
  return simulatePortfolioTick(portfolios)
}
