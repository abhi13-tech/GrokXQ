import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

describe("Card Components", () => {
  it("renders Card correctly", () => {
    render(<Card data-testid="card">Card Content</Card>)
    const card = screen.getByTestId("card")
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent("Card Content")
    expect(card).toHaveClass("minimal-card")
  })

  it("renders CardHeader correctly", () => {
    render(<CardHeader data-testid="card-header">Header Content</CardHeader>)
    const header = screen.getByTestId("card-header")
    expect(header).toBeInTheDocument()
    expect(header).toHaveTextContent("Header Content")
    expect(header).toHaveClass("flex flex-col space-y-1.5 p-6")
  })

  it("renders CardTitle correctly", () => {
    render(<CardTitle data-testid="card-title">Card Title</CardTitle>)
    const title = screen.getByTestId("card-title")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Card Title")
    expect(title).toHaveClass("text-2xl font-semibold leading-none tracking-tight")
  })

  it("renders CardDescription correctly", () => {
    render(<CardDescription data-testid="card-description">Card Description</CardDescription>)
    const description = screen.getByTestId("card-description")
    expect(description).toBeInTheDocument()
    expect(description).toHaveTextContent("Card Description")
    expect(description).toHaveClass("text-sm")
  })

  it("renders CardContent correctly", () => {
    render(<CardContent data-testid="card-content">Content</CardContent>)
    const content = screen.getByTestId("card-content")
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent("Content")
    expect(content).toHaveClass("p-6 pt-0")
  })

  it("renders CardFooter correctly", () => {
    render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>)
    const footer = screen.getByTestId("card-footer")
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveTextContent("Footer Content")
    expect(footer).toHaveClass("flex items-center p-6 pt-0")
  })

  it("renders a complete card with all components", () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Complete Card Title</CardTitle>
          <CardDescription>Complete Card Description</CardDescription>
        </CardHeader>
        <CardContent>Complete Card Content</CardContent>
        <CardFooter>Complete Card Footer</CardFooter>
      </Card>,
    )

    const card = screen.getByTestId("complete-card")
    expect(card).toBeInTheDocument()
    expect(screen.getByText("Complete Card Title")).toBeInTheDocument()
    expect(screen.getByText("Complete Card Description")).toBeInTheDocument()
    expect(screen.getByText("Complete Card Content")).toBeInTheDocument()
    expect(screen.getByText("Complete Card Footer")).toBeInTheDocument()
  })
})
