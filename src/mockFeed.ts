import { BASE_PORTFOLIOS } from './mockData'
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

export function simulatePortfolioTick(portfolios: Portfolio[]): Portfolio[] {
  return portfolios.map((portfolio) => {
    const baseNews = BASE_PORTFOLIOS.find((p) => p.id === portfolio.id)?.news ?? portfolio.news
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
      news: baseNews,
    }
  })
}

export async function fetchMockPortfolios(portfolios: Portfolio[]): Promise<Portfolio[]> {
  await new Promise((resolve) => setTimeout(resolve, 120))
  return simulatePortfolioTick(portfolios)
}
