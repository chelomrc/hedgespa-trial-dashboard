import { create } from 'zustand'
import { DEFAULT_LAYOUT, DEFAULT_PORTFOLIO_ID } from '../mockData'
import type { LayoutItem, UserType } from '../types'

const STORAGE_PREFIX = 'hedgespa-trial-state'

type SavedState = {
  selectedPortfolio?: string
  layout?: LayoutItem[]
  updatedAt?: number
}

type DashboardState = {
  userType: UserType
  selectedPortfolio: string
  layout: LayoutItem[]
  setUserType: (userType: UserType) => void
  setSelectedPortfolio: (id: string) => void
  setLayout: (layout: LayoutItem[]) => void
  resetLayoutForCurrentUser: () => void
  hydrateForUserType: (userType: UserType) => void
}

function storageKey(userType: UserType) {
  return `${STORAGE_PREFIX}:${userType}`
}

function readSavedState(userType: UserType): SavedState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKey(userType))
    if (!raw) return null
    return JSON.parse(raw) as SavedState
  } catch {
    return null
  }
}

function writeSavedState(userType: UserType, payload: SavedState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(userType), JSON.stringify(payload))
}

function persistCurrentState(userType: UserType, selectedPortfolio: string, layout: LayoutItem[]) {
  writeSavedState(userType, { selectedPortfolio, layout, updatedAt: Date.now() })
}

const initialUserType: UserType = 'front-office'
const initialSavedState = readSavedState(initialUserType)

export const useDashboardStore = create<DashboardState>((set, get) => ({
  userType: initialUserType,
  selectedPortfolio: initialSavedState?.selectedPortfolio ?? DEFAULT_PORTFOLIO_ID,
  layout: initialSavedState?.layout ?? DEFAULT_LAYOUT,
  setUserType: (userType) => {
    set({ userType })
    get().hydrateForUserType(userType)
  },
  setSelectedPortfolio: (selectedPortfolio) => {
    set({ selectedPortfolio })
    const { layout, userType } = get()
    persistCurrentState(userType, selectedPortfolio, layout)
  },
  setLayout: (layout) => {
    set({ layout })
    const { selectedPortfolio, userType } = get()
    persistCurrentState(userType, selectedPortfolio, layout)
  },
  resetLayoutForCurrentUser: () => {
    const { userType } = get()
    const selectedPortfolio = DEFAULT_PORTFOLIO_ID
    const layout = DEFAULT_LAYOUT
    set({ selectedPortfolio, layout })
    persistCurrentState(userType, selectedPortfolio, layout)
  },
  hydrateForUserType: (userType) => {
    const saved = readSavedState(userType)
    set({
      userType,
      selectedPortfolio: saved?.selectedPortfolio ?? DEFAULT_PORTFOLIO_ID,
      layout: saved?.layout ?? DEFAULT_LAYOUT,
    })
  },
}))

export function subscribeStorageSync() {
  const handler = (event: StorageEvent) => {
    if (!event.key || !event.key.startsWith(STORAGE_PREFIX) || !event.newValue) return
    const { userType } = useDashboardStore.getState()
    if (event.key !== storageKey(userType)) return
    try {
      const parsed = JSON.parse(event.newValue) as SavedState
      useDashboardStore.setState((state) => ({
        ...state,
        selectedPortfolio: parsed.selectedPortfolio ?? state.selectedPortfolio,
        layout: parsed.layout ?? state.layout,
      }))
    } catch {
      // Ignore malformed storage payloads.
    }
  }

  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
