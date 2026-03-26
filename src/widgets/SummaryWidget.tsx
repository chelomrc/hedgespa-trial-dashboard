import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../format'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { cn } from '../lib/utils'
import type { Portfolio } from '../types'

type Props = { portfolio: Portfolio }

export function SummaryWidget({ portfolio }: Props) {
  const animatedTotalValue = useAnimatedNumber(portfolio.summary.totalValue)
  const animatedDayPL = useAnimatedNumber(portfolio.summary.todayGainLoss)
  const animatedDayPercent = useAnimatedNumber(portfolio.summary.todayGainLossPercent)
  const summaryChartData = portfolio.summary.performanceData.map((value, idx) => ({
    idx,
    value: Number(value.toFixed(2)),
  }))

  return (
    <div className="summary-grid">
      <div>
        <p className="summary-label">Total Value</p>
        <p className="summary-metric">
          {formatCurrency(animatedTotalValue, portfolio.currency ?? 'USD')}
        </p>
      </div>
      <div>
        <p className="summary-label">Today P/L</p>
        <p
          className={cn(
            'summary-metric',
            portfolio.summary.todayGainLoss >= 0 ? 'summary-metric-positive' : 'summary-metric-negative',
          )}
        >
          {formatCurrency(animatedDayPL, portfolio.currency ?? 'USD')} ({animatedDayPercent.toFixed(2)}%)
        </p>
      </div>
      <div className="summary-chart-card">
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={summaryChartData}>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--ui-chart-stocks)"
              fill="var(--ui-chart-fill-stocks)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={700}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
