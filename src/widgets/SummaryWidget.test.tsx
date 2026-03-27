import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { formatCurrency } from '../format'
import { mockPortfolio, mockPortfolioPositiveDay } from '../test/fixtures'
import type { Portfolio } from '../types'
import { SummaryWidget } from './SummaryWidget'

function renderSummary(portfolio: Portfolio) {
  return render(
    <div style={{ width: 520 }}>
      <SummaryWidget portfolio={portfolio} />
    </div>,
  )
}

describe('SummaryWidget', () => {
  it('renders total value and today P/L labels with formatted figures', () => {
    renderSummary(mockPortfolio)

    expect(screen.getByText('Total Value')).toBeInTheDocument()
    expect(screen.getByText(formatCurrency(mockPortfolio.summary.totalValue, 'USD'))).toBeInTheDocument()

    expect(screen.getByText('Today P/L')).toBeInTheDocument()
    const pl = screen.getByText(
      (content) =>
        content.includes(formatCurrency(mockPortfolio.summary.todayGainLoss, 'USD')) &&
        content.includes('-0.27%'),
    )
    expect(pl).toBeInTheDocument()
    expect(pl).toHaveClass('summary-metric-negative')
  })

  it('uses positive styling when today P/L is >= 0', () => {
    renderSummary(mockPortfolioPositiveDay)

    const pl = screen.getByText(
      (content) =>
        content.includes(formatCurrency(mockPortfolioPositiveDay.summary.todayGainLoss, 'USD')) &&
        content.includes('0.42%'),
    )
    expect(pl).toHaveClass('summary-metric-positive')
  })

  it('renders the chart container', () => {
    const { container } = renderSummary(mockPortfolio)
    expect(container.querySelector('.summary-chart-card')).toBeInTheDocument()
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('lists summary metrics in reading order', () => {
    renderSummary(mockPortfolio)
    const grid = document.querySelector('.summary-grid')
    expect(grid).toBeTruthy()
    const labels = within(grid as HTMLElement).getAllByText(/Total Value|Today P\/L/)
    expect(labels.map((el) => el.textContent)).toEqual(['Total Value', 'Today P/L'])
  })
})
