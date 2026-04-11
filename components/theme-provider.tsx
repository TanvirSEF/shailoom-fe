"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      try {
        // Defensive check for event and key
        const key = event?.key;
        if (typeof key !== "string") return;

        // Early return if not the desired key (case-insensitive)
        if (key.toLowerCase() !== "d") return;

        // Skip if modifiers are pressed or it's a repeat event
        if (event.metaKey || event.ctrlKey || event.altKey || event.repeat || event.defaultPrevented) {
          return;
        }

        // Skip if the user is typing in an input/textarea
        if (isTypingTarget(event.target)) {
          return;
        }

        // Toggle theme
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      } catch (error) {
        // Absorb any errors to prevent the app from crashing due to a side-feature (hotkey)
        console.error("Theme toggle hotkey error:", error);
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
