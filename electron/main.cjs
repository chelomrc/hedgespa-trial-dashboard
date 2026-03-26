const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const widgetWindows = new Map()

const ALLOWED_WIDGETS = new Set(['summary', 'allocation', 'news'])
const WIDGET_TITLE = {
  summary: 'Summary',
  allocation: 'Allocation',
  news: 'News',
}
const ALLOWED_USER_TYPES = new Set(['front-office', 'back-office'])

function webPreferences() {
  return {
    preload: path.join(__dirname, 'preload.cjs'),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
  }
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 640,
    title: 'HedgeSPA Trial Dashboard',
    webPreferences: webPreferences(),
  })

  if (isDev) {
    win.loadURL('http://127.0.0.1:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
  return win
}

function openWidgetWindow(payload) {
  const widgetId = String(payload?.widgetId ?? '')
  const userType = String(payload?.userType ?? 'front-office')
  const portfolio = String(payload?.selectedPortfolio ?? '1')

  if (!ALLOWED_WIDGETS.has(widgetId)) {
    return { ok: false, error: 'invalid_widget' }
  }
  if (!ALLOWED_USER_TYPES.has(userType)) {
    return { ok: false, error: 'invalid_user_type' }
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(portfolio)) {
    return { ok: false, error: 'invalid_portfolio' }
  }

  const existing = widgetWindows.get(widgetId)
  if (existing && !existing.isDestroyed()) {
    existing.focus()
    return { ok: true, reused: true }
  }

  const child = new BrowserWindow({
    width: 720,
    height: 460,
    minWidth: 400,
    minHeight: 320,
    title: `HedgeSPA — ${WIDGET_TITLE[widgetId] ?? widgetId}`,
    webPreferences: webPreferences(),
  })

  widgetWindows.set(widgetId, child)
  child.on('closed', () => {
    widgetWindows.delete(widgetId)
  })

  const query = {
    popup: '1',
    widget: widgetId,
    userType,
    portfolio,
  }

  if (isDev) {
    const qs = new URLSearchParams(query).toString()
    child.loadURL(`http://127.0.0.1:5173/?${qs}`)
  } else {
    child.loadFile(path.join(__dirname, '../dist/index.html'), { query })
  }

  return { ok: true, reused: false }
}

app.whenReady().then(() => {
  ipcMain.handle('open-widget-window', (_event, payload) => {
    try {
      return openWidgetWindow(payload)
    } catch (err) {
      return { ok: false, error: String(err?.message ?? err) }
    }
  })

  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
