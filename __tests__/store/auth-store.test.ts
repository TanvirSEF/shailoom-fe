import { describe, it, expect, beforeEach } from "vitest"
import { useAuthStore } from "@/store/use-auth-store"
import { act } from "@testing-library/react"

describe("useAuthStore", () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.setState({
        token: null,
        refreshToken: null,
        role: null,
        isAuthenticated: false,
        _hasHydrated: true,
      })
    })
  })

  it("starts unauthenticated", () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.role).toBeNull()
  })

  it("sets auth state on login", () => {
    act(() => {
      useAuthStore.getState().setAuth("access-token-123", "admin", "refresh-token-123")
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe("access-token-123")
    expect(state.role).toBe("admin")
    expect(state.refreshToken).toBe("refresh-token-123")
  })

  it("clears auth state on logout", () => {
    act(() => {
      useAuthStore.getState().setAuth("token", "customer", "refresh")
    })

    act(() => {
      useAuthStore.getState().logout()
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.role).toBeNull()
    expect(state.refreshToken).toBeNull()
  })

  it("sets customer role", () => {
    act(() => {
      useAuthStore.getState().setAuth("token", "customer")
    })

    expect(useAuthStore.getState().role).toBe("customer")
  })

  it("sets hydration state", () => {
    act(() => {
      useAuthStore.getState().setHasHydrated(true)
    })

    expect(useAuthStore.getState()._hasHydrated).toBe(true)
  })
})
