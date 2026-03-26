import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import GridLayout from 'react-grid-layout/legacy'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { BASE_PORTFOLIOS } from './mockData'
import { fetchMockPortfolios } from './mockFeed'
import { subscribeStorageSync, useDashboardStore } from './store/dashboardStore'
import type { LayoutItem, UserType } from './types'
import { openTearOutWindow } from './utils/popup'
import { readPopupParams } from './utils/queryParams'
import { SelectMenu } from './components/SelectMenu'
import { AllocationWidget } from './widgets/AllocationWidget'
import { NewsWidget } from './widgets/NewsWidget'
import { SummaryWidget } from './widgets/SummaryWidget'
import { WidgetShell } from './widgets/WidgetShell'

const GRID_ROW_HEIGHT = 32

function App() {
  const popupParams = readPopupParams()
  const popupWidget = popupParams.widget
  const isPopup = popupParams.isPopup
  const popupUserType = popupParams.userType
  const popupPortfolio = popupParams.portfolio
  const [portfolios, setPortfolios] = useState(BASE_PORTFOLIOS)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const {
    userType,
    setUserType,
    selectedPortfolio,
    setSelectedPortfolio,
    layout,
    setLayout,
    resetLayoutForCurrentUser,
  } = useDashboardStore()

  const portfolioQuery = useQuery({
    queryKey: ['mock-portfolios'],
    queryFn: async () => fetchMockPortfolios(portfolios),
    initialData: BASE_PORTFOLIOS,
    refetchInterval: 5000,
  })

  const current = useMemo(
    () =>
      portfolios.find((portfolio) => portfolio.id === selectedPortfolio) ??
      portfolios[0],
    [portfolios, selectedPortfolio],
  )

  useEffect(() => {
    if (!portfolioQuery.data) return
    setPortfolios(portfolioQuery.data)
  }, [portfolioQuery.data])

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const unsubscribeStorage = subscribeStorageSync()
    return () => unsubscribeStorage()
  }, [])

  useEffect(() => {
    if (!portfolios.some((portfolio) => portfolio.id === selectedPortfolio)) {
      setSelectedPortfolio(portfolios[0].id)
    }
  }, [portfolios, selectedPortfolio, setSelectedPortfolio])

  useEffect(() => {
    if (!isPopup) return
    if (popupUserType === 'front-office' || popupUserType === 'back-office') {
      setUserType(popupUserType)
    }
    if (popupPortfolio) setSelectedPortfolio(popupPortfolio)
  }, [isPopup, popupPortfolio, popupUserType, setSelectedPortfolio, setUserType])

  function openTearOut(widgetId: string) {
    openTearOutWindow({ widgetId, userType, selectedPortfolio })
  }

  const isCompact = viewportWidth < 1100
  const gridWidth = Math.max(320, viewportWidth - 36)
  const layoutForRender = isCompact
    ? layout.map((item, index) => ({ ...item, x: 0, w: 1, y: index * 8 }))
    : layout

  const summaryWidget = (
    <WidgetShell title="Summary" widgetId="summary" isPopup={isPopup} onTearOut={openTearOut}>
      <SummaryWidget portfolio={current} />
    </WidgetShell>
  )

  const allocationWidget = (
    <WidgetShell
      title="Allocation"
      widgetId="allocation"
      isPopup={isPopup}
      onTearOut={openTearOut}
    >
      <AllocationWidget portfolio={current} isPopup={isPopup} />
    </WidgetShell>
  )

  const newsWidget = (
    <WidgetShell title="News" widgetId="news" isPopup={isPopup} onTearOut={openTearOut}>
      <NewsWidget portfolio={current} />
    </WidgetShell>
  )

  if (isPopup) {
    if (popupWidget === 'summary') return summaryWidget
    if (popupWidget === 'allocation') return allocationWidget
    return newsWidget
  }

  return (
    <main className="app-shell">
      <header className="topbar-panel">
        <div className="min-w-56">
          <h1 className="topbar-title">HedgeSPA Trial Dashboard</h1>
          <p className="topbar-subtitle">Bloomberg-style mock portfolio experience</p>
        </div>
        <SelectMenu
          label="User Type:"
          value={userType}
          onChange={(nextValue) => setUserType(nextValue as UserType)}
          options={[
            { value: 'front-office', label: 'Front Office' },
            { value: 'back-office', label: 'Back Office' },
          ]}
        />
        <SelectMenu
          label="Portfolio:"
          value={selectedPortfolio}
          onChange={setSelectedPortfolio}
          options={portfolios.map((portfolio) => ({
            value: portfolio.id,
            label: portfolio.name,
          }))}
        />
        <button className="ui-btn" onClick={resetLayoutForCurrentUser}>
          Reset layout
        </button>
      </header>

      <GridLayout
        className="[&>div]:overflow-hidden"
        layout={layoutForRender}
        cols={isCompact ? 1 : 12}
        rowHeight={GRID_ROW_HEIGHT}
        width={gridWidth}
        onLayoutChange={(next) => {
          if (!isCompact) setLayout(next as LayoutItem[])
        }}
        draggableHandle=".widget-header"
        isDraggable={!isCompact}
        isResizable={!isCompact}
      >
        <div key="summary">{summaryWidget}</div>
        <div key="allocation">{allocationWidget}</div>
        <div key="news">{newsWidget}</div>
      </GridLayout>
    </main>
  )
}

export default App
