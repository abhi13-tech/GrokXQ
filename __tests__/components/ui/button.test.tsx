"use client"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"

describe("Button Component", () => {
  it("renders correctly", () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole("button", { name: /test button/i })).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    const button = screen.getByRole("button", { name: /click me/i })
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("applies the correct variant class", () => {
    render(<Button variant="destructive">Destructive Button</Button>)
    const button = screen.getByRole("button", { name: /destructive button/i })
    expect(button).toHaveClass("bg-destructive")
  })

  it("applies the correct size class", () => {
    render(<Button size="sm">Small Button</Button>)
    const button = screen.getByRole("button", { name: /small button/i })
    expect(button).toHaveClass("h-9")
  })

  it("renders as a child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="https://example.com">Link Button</a>
      </Button>,
    )
    expect(screen.getByRole("link", { name: /link button/i })).toBeInTheDocument()
  })

  it("is disabled when the disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>)
    expect(screen.getByRole("button", { name: /disabled button/i })).toBeDisabled()
  })
})
