import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Portfolio } from '../types'

type Props = {
  portfolio: Portfolio
}

export function AllocationWidget({ portfolio }: Props) {
  const allocationData = [
    { name: 'Stocks', value: portfolio.allocation.stocks, color: '#26c6da' },
    { name: 'Bonds', value: portfolio.allocation.bonds, color: '#8bc34a' },
    { name: 'Cash', value: portfolio.allocation.cash, color: '#ffb74d' },
  ]

  return (
    <div className="allocation-wrap">
      <div className="allocation-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={80}
              isAnimationActive
              animationDuration={750}
              animationEasing="ease-out"
            >
              {allocationData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="legend-list">
        {allocationData.map((item) => (
          <li key={item.name}>
            <span style={{ backgroundColor: item.color }} />
            {item.name}: {item.value}%
          </li>
        ))}
      </ul>
    </div>
  )
}
