import parse from 'html-react-parser'
import ErrorBoundary from '../ErrorBoundary'

export default function RenderHtml({ html }) {
  try {
    return (
      <ErrorBoundary resetKey={html}>
        {parse(html)}
      </ErrorBoundary>
    )
  } catch (_) {
    return html
  }
}
