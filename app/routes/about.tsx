import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {

  return (
    <>
      <nav style={{
        "display": "flex",
        "gap": "4px"
      }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <h1>About</h1>
      <p>TanStack router is dope</p>
    </>
  )
}
