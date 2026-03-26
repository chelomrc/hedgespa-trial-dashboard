/// <reference types="vite/client" />

declare global {
  interface Window {
    hedgespaDesktop?: {
      isElectron: boolean
      openWidgetWindow?: (payload: {
        widgetId: string
        userType: string
        selectedPortfolio: string
      }) => Promise<{ ok: boolean; reused?: boolean; error?: string }>
    }
  }
}

export {}
