import { describe, it, expect } from "vitest"
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth.schema"

describe("signupSchema", () => {
  it("validates correct data", () => {
    const result = signupSchema.safeParse({
      username: "tanvir",
      email: "tanvir@test.com",
      password: "123456",
      phone_number: "01712345678",
    })
    expect(result.success).toBe(true)
  })

  it("rejects short username", () => {
    const result = signupSchema.safeParse({
      username: "ab",
      email: "test@test.com",
      password: "123456",
      phone_number: "01712345678",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({
      username: "tanvir",
      email: "not-an-email",
      password: "123456",
      phone_number: "01712345678",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = signupSchema.safeParse({
      username: "tanvir",
      email: "test@test.com",
      password: "123",
      phone_number: "01712345678",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty phone number", () => {
    const result = signupSchema.safeParse({
      username: "tanvir",
      email: "test@test.com",
      password: "123456",
      phone_number: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("loginSchema", () => {
  it("validates correct data", () => {
    const result = loginSchema.safeParse({
      email: "test@test.com",
      password: "mypassword",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "bad-email",
      password: "mypassword",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@test.com",
      password: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("forgotPasswordSchema", () => {
  it("validates correct email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "test@test.com" })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "not-email" })
    expect(result.success).toBe(false)
  })
})

describe("resetPasswordSchema", () => {
  it("validates matching passwords", () => {
    const result = resetPasswordSchema.safeParse({
      email: "test@test.com",
      token: "abc123",
      new_password: "newpass123",
      confirm_password: "newpass123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      email: "test@test.com",
      token: "abc123",
      new_password: "newpass123",
      confirm_password: "different",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short new password", () => {
    const result = resetPasswordSchema.safeParse({
      email: "test@test.com",
      token: "abc123",
      new_password: "123",
      confirm_password: "123",
    })
    expect(result.success).toBe(false)
  })
})
