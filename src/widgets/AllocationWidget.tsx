import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '../lib/utils'
import type { Portfolio } from '../types'

type Props = {
  portfolio: Portfolio
  isPopup: boolean
  className?: string
}

const ALLOCATION_COLORS = {
  Stocks: 'var(--ui-chart-stocks)',
  Bonds: 'var(--ui-chart-bonds)',
  Cash: 'var(--ui-chart-cash)',
} as const

export function AllocationWidget({ portfolio, isPopup, className }: Props) {
  const allocationData = useMemo(
    () => [
      { name: 'Stocks', value: portfolio.allocation.stocks, color: ALLOCATION_COLORS.Stocks },
      { name: 'Bonds', value: portfolio.allocation.bonds, color: ALLOCATION_COLORS.Bonds },
      { name: 'Cash', value: portfolio.allocation.cash, color: ALLOCATION_COLORS.Cash },
    ],
    [portfolio.allocation.bonds, portfolio.allocation.cash, portfolio.allocation.stocks],
  )

  return (
    <section className={cn('flex h-full min-h-0 flex-col', className)} aria-labelledby="allocation-chart-title">
      <h4 id="allocation-chart-title" className="sr-only">
        Portfolio allocation chart and percentages
      </h4>
      <div
        className={cn(
          'min-h-[120px] transition-all duration-300',
          isPopup ? 'h-[240px] min-h-[240px] flex-none' : 'flex-1',
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={4}
              isAnimationActive
              animationDuration={750}
              animationEasing="ease-out"
            >
              {allocationData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, item) => [
                `${value}%`,
                String(item?.payload?.name ?? 'Allocation'),
              ]}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#0e1d31',
                color: '#dbe7ff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-3" aria-label="Allocation breakdown">
        {allocationData.map((item) => (
          <li key={item.name} className="mb-0 flex min-w-0 items-center gap-2 text-sm font-medium text-[var(--ui-muted-foreground)]">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="truncate">{item.name}</span>
            <span className="tabular-nums opacity-85">{item.value}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
