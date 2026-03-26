import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

type Props = {
  title: string
  widgetId: string
  isPopup: boolean
  onTearOut: (id: string) => void
  children: ReactNode
}

export function WidgetShell({ title, widgetId, isPopup, onTearOut, children }: Props) {
  return (
    <section className={cn('widget-shell', isPopup && 'widget-shell-popup')}>
      {!isPopup && (
        <header className="widget-header">
          <h3 className="widget-title">{title}</h3>
          <button className="ui-btn" onClick={() => onTearOut(widgetId)}>
            Tear out
          </button>
        </header>
      )}
      {isPopup && <h3 className="widget-popup-title">{title}</h3>}
      <div className="widget-body">{children}</div>
    </section>
  )
}
