/// <reference types="vite/client" />

declare global {
  interface Window {
    hedgespaDesktop?: {
      isElectron: boolean
      openWidgetWindow?: (payload: {
        widgetId: string
        userType: string
        selectedPortfolio: string
        portfolioName?: string
      }) => Promise<{ ok: boolean; reused?: boolean; error?: string }>
      updateWidgetTitles?: (payload: { portfolioName: string }) => void
    }
  }
}

export {}
