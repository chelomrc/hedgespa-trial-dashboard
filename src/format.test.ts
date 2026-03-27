import { describe, expect, it } from 'vitest'
import { formatCurrency } from './format'

describe('formatCurrency', () => {
  it('formats USD with no fraction digits', () => {
    expect(formatCurrency(5_310_648)).toBe('$5,310,648')
  })

  it('respects currency code', () => {
    expect(formatCurrency(1000, 'SGD')).toMatch(/1,000/)
  })
})
