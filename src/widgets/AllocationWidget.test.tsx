import type { ReactElement } from 'react'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { mockPortfolio } from '../test/fixtures'
import { AllocationWidget } from './AllocationWidget'

const warn = console.warn
beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('width') && msg.includes('chart')) return
    warn.call(console, msg, ...args)
  })
})
afterAll(() => {
  vi.restoreAllMocks()
})

/** Recharts measures container; fixed box avoids 0×0 warnings in jsdom */
function renderAllocation(ui: ReactElement) {
  return render(<div style={{ width: 400, height: 360 }}>{ui}</div>)
}

describe('AllocationWidget', () => {
  it('renders legend with weights and an accessible chart title', () => {
    renderAllocation(<AllocationWidget portfolio={mockPortfolio} isPopup={false} />)

    expect(
      screen.getByRole('heading', { name: /portfolio allocation chart and percentages/i }),
    ).toBeInTheDocument()

    const list = screen.getByRole('list', { name: /allocation breakdown/i })
    expect(within(list).getByText('Stocks')).toBeInTheDocument()
    expect(within(list).getByText('Bonds')).toBeInTheDocument()
    expect(within(list).getByText('Cash')).toBeInTheDocument()
    expect(within(list).getByText('60%')).toBeInTheDocument()
    expect(within(list).getByText('30%')).toBeInTheDocument()
    expect(within(list).getByText('10%')).toBeInTheDocument()
  })

  it('uses taller chart min height when torn out (popup)', () => {
    const { container: docked } = renderAllocation(
      <AllocationWidget portfolio={mockPortfolio} isPopup={false} />,
    )
    expect(docked.querySelector('[class*="min-h-[120px]"]')).toBeInTheDocument()
    expect(docked.querySelector('[class*="min-h-[240px]"]')).not.toBeInTheDocument()

    cleanup()

    const { container: popup } = renderAllocation(<AllocationWidget portfolio={mockPortfolio} isPopup />)
    expect(popup.querySelector('[class*="min-h-[240px]"]')).toBeInTheDocument()
  })
})
