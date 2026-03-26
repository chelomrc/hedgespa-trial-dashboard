import type { Portfolio } from '../types'

type Props = {
  portfolio: Portfolio
}

export function NewsWidget({ portfolio }: Props) {
  return (
    <ul className="news-list">
      {portfolio.news.map((news) => (
        <li key={news.id} className="news-item">
          <p className="news-title">{news.headline}</p>
          <small className="news-meta">
            {news.source} - {new Date(news.timestamp).toLocaleTimeString()}
          </small>
        </li>
      ))}
    </ul>
  )
}
