/// <reference types="vite/client" />

declare global {
  interface Window {
    hedgespaDesktop?: { isElectron: boolean }
  }
}

export {}
