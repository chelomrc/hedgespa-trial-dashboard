import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockPortfolio } from '../test/fixtures'
import { NewsWidget } from './NewsWidget'

describe('NewsWidget', () => {
  it('renders headlines and source', () => {
    const { container } = render(<NewsWidget portfolio={mockPortfolio} />)
    expect(container.querySelector('.news-list')).toBeInTheDocument()
    expect(screen.getByText('Fed holds rates steady')).toBeInTheDocument()
    expect(screen.getByText(/FT/)).toBeInTheDocument()
  })

  it('renders one row per news item', () => {
    const { container } = render(<NewsWidget portfolio={mockPortfolio} />)
    const list = container.querySelector('.news-list')
    expect(list).toBeTruthy()
    expect(list?.querySelectorAll('li')).toHaveLength(mockPortfolio.news.length)
  })
})
