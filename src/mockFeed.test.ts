import { afterEach, describe, expect, it, vi } from 'vitest'
import { BASE_PORTFOLIOS } from './mockData'
import { simulatePortfolioTick } from './mockFeed'
import type { Portfolio } from './types'

describe('simulatePortfolioTick', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the same output for the same time bucket (deterministic)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-27T12:34:56.000Z'))

    const a = simulatePortfolioTick(BASE_PORTFOLIOS)
    const b = simulatePortfolioTick(BASE_PORTFOLIOS)

    expect(a).toEqual(b)
    expect(a).toHaveLength(BASE_PORTFOLIOS.length)
  })

  it('keeps allocation percentages summing to 100', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T00:00:00.000Z'))

    const [first] = simulatePortfolioTick(BASE_PORTFOLIOS)
    const { stocks, bonds, cash } = first.allocation
    expect(stocks + bonds + cash).toBe(100)
  })

  it('preserves news from base portfolio', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T08:00:00.000Z'))

    const ticked = simulatePortfolioTick(BASE_PORTFOLIOS)
    for (let i = 0; i < BASE_PORTFOLIOS.length; i++) {
      expect(ticked[i].news).toEqual(BASE_PORTFOLIOS[i].news)
    }
  })

  it('never drops total value below the trial floor', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-31T23:59:59.000Z'))

    const tiny: Portfolio = {
      ...BASE_PORTFOLIOS[0],
      summary: {
        ...BASE_PORTFOLIOS[0].summary,
        totalValue: 50_000,
      },
    }

    const [out] = simulatePortfolioTick([tiny])
    expect(out.summary.totalValue).toBeGreaterThanOrEqual(100_000)
  })
})
