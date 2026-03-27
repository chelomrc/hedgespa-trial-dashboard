import { afterEach, describe, expect, it } from 'vitest'
import { readPopupParams } from './queryParams'

describe('readPopupParams', () => {
  const originalHref = window.location.href

  afterEach(() => {
    window.history.replaceState({}, '', originalHref)
  })

  it('detects popup mode when popup=1 and widget is set', () => {
    window.history.replaceState({}, '', '/?popup=1&widget=news&portfolio=2&userType=back-office')
    expect(readPopupParams()).toEqual({
      widget: 'news',
      isPopup: true,
      userType: 'back-office',
      portfolio: '2',
    })
  })

  it('is not popup when popup flag is missing', () => {
    window.history.replaceState({}, '', '/?widget=summary')
    expect(readPopupParams().isPopup).toBe(false)
  })

  it('is not popup when widget is missing', () => {
    window.history.replaceState({}, '', '/?popup=1')
    expect(readPopupParams().isPopup).toBe(false)
  })
})
