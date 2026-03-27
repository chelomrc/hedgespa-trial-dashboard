import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('resolves conflicting tailwind padding with tailwind-merge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('drops falsy inputs', () => {
    expect(cn('base', false, null, undefined, 'extra')).toBe('base extra')
  })
})
