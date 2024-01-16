import { Router, Route } from "kaioken"
import { Todos } from "./components/ToDos"
import { Counter } from "./components/Counter"
import { ThemeContextProvider } from "./ThemeContext"
import { ProductPage } from "./components/Product"
import { Messages } from "./components/Messages"
import { MemoCounter } from "./components/MemoCounter"
import { ModalDemo } from "./components/Modal"
import { DrawerDemo } from "./components/Drawer"
import { H1 } from "./components/atoms/Heading"
import { Link } from "./components/atoms/Link"

export function App() {
  return (
    <ThemeContextProvider>
      <H1 className="mb-5">App</H1>
      <nav className="flex flex-wrap gap-2 justify-center mb-5">
        <Link to="/">Home</Link>
        <Link to="/todos">Todos</Link>
        <Link to="/counter">Counter</Link>
        <Link to="/memo">Memo</Link>
        <Link to="/query?id=1">Query</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/modal">Modal</Link>
      </nav>
      <main>
        <Router>
          <Route path="/" element={() => <h2>Home</h2>} />
          <Route path="/todos" element={Todos} />
          <Route path="/counter" element={Counter} />
          <Route path="/memo" element={MemoCounter} />
          <Route path="/query" element={ProductPage} />
          <Route path="/messages" element={Messages} />
          <Route
            path="/modal"
            element={() => (
              <>
                <ModalDemo />
                <DrawerDemo />
              </>
            )}
          />
        </Router>
      </main>
    </ThemeContextProvider>
  )
}
