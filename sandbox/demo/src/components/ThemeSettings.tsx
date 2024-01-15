import { useContext } from "kaioken"
import { ThemeContext, ThemeDispatchContext } from "../ThemeContext.jsx"
import { Button } from "./Button.jsx"

export function ThemeSettings() {
  const theme = useContext(ThemeContext)
  const dispatch = useContext(ThemeDispatchContext)

  return (
    <article>
      <div>
        <Button onclick={() => dispatch({ type: "toggle" })}>
          Toggle theme
        </Button>
        <p>Current theme: {theme.darkMode ? "dark" : "light"}</p>
      </div>
    </article>
  )
}
