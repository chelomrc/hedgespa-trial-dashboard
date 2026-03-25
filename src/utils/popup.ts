type PopupContext = {
  widgetId: string
  userType: string
  selectedPortfolio: string
}

export function buildPopupUrl(context: PopupContext) {
  const params = new URLSearchParams({
    popup: '1',
    widget: context.widgetId,
    userType: context.userType,
    portfolio: context.selectedPortfolio,
  })
  return `${window.location.pathname}?${params.toString()}`
}

export function openPopupWindow(url: string, widgetId: string) {
  window.open(url, `${widgetId}-window`, 'width=720,height=460,left=100,top=100')
}
