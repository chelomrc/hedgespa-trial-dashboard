export type PopupParams = {
  widget: string | null
  isPopup: boolean
  userType: string | null
  portfolio: string | null
}

export function readPopupParams(): PopupParams {
  const params = new URLSearchParams(window.location.search)
  const widget = params.get('widget')
  return {
    widget,
    isPopup: params.get('popup') === '1' && !!widget,
    userType: params.get('userType'),
    portfolio: params.get('portfolio'),
  }
}
