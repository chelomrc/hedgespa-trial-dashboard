import { BASE_PORTFOLIOS } from './mockData'
import type { Portfolio } from './types'

const POLL_INTERVAL_MS = 5000

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function seedFromPortfolioId(portfolioId: string) {
  return Array.from(portfolioId).reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

function deterministicWave(seed: number, tick: number, phase = 1) {
  return Math.sin((tick + seed * 0.17) * 0.45 * phase) * 0.6 + Math.cos((tick + seed) * 0.2 * phase) * 0.4
}

function nextAllocation(base: Portfolio, tick: number, seed: number) {
  const stocks = clamp(base.allocation.stocks + Math.round(deterministicWave(seed, tick, 1) * 4), 15, 85)
  const bonds = clamp(base.allocation.bonds + Math.round(deterministicWave(seed, tick, 1.8) * 3), 10, 80)
  const cash = Math.max(0, 100 - stocks - bonds)
  const normalizedBonds = bonds + (100 - (stocks + bonds + cash))
  return { stocks, bonds: normalizedBonds, cash }
}

export function simulatePortfolioTick(portfolios: Portfolio[]): Portfolio[] {
  const tick = Math.floor(Date.now() / POLL_INTERVAL_MS)
  return portfolios.map((portfolio) => {
    const base = BASE_PORTFOLIOS.find((p) => p.id === portfolio.id) ?? portfolio
    const seed = seedFromPortfolioId(base.id)
    const valueWave = deterministicWave(seed, tick, 1.15)
    const valueMove = base.summary.totalValue * valueWave * 0.003
    const totalValue = Math.max(100000, base.summary.totalValue + valueMove)
    const todayGainLoss = totalValue - base.summary.totalValue
    const todayGainLossPercent = (todayGainLoss / base.summary.totalValue) * 100
    const performanceData = base.summary.performanceData.map((point, idx) => {
      const drift = deterministicWave(seed + idx, tick, 0.9) * 0.35
      return Number((point + drift).toFixed(2))
    })

    return {
      ...base,
      summary: {
        ...base.summary,
        totalValue,
        todayGainLoss,
        todayGainLossPercent,
        performanceData,
      },
      allocation: nextAllocation(base, tick, seed),
      news: base.news,
    }
  })
}

export async function fetchMockPortfolios(portfolios: Portfolio[]): Promise<Portfolio[]> {
  await new Promise((resolve) => setTimeout(resolve, 120))
  return simulatePortfolioTick(portfolios)
}
