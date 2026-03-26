import type { ReactNode } from 'react'

type Props = {
  title: string
  widgetId: string
  isPopup: boolean
  onTearOut: (id: string) => void
  children: ReactNode
}

export function WidgetShell({ title, widgetId, isPopup, onTearOut, children }: Props) {
  return (
    <section className={isPopup ? 'widget widget--tearout' : 'widget'}>
      {!isPopup && (
        <header className="widget-header">
          <h3>{title}</h3>
          <button onClick={() => onTearOut(widgetId)}>Tear out</button>
        </header>
      )}
      {isPopup && <h3 className="popup-title">{title}</h3>}
      <div className="widget-body">{children}</div>
    </section>
  )
}
