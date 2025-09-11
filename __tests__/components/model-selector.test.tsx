import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ModelSelector } from "@/components/model-selector"

// Mock the component's props
const mockProps = {
  value: "gpt-4",
  onChange: jest.fn(),
  models: [
    { id: "gpt-4", name: "GPT-4", description: "Most powerful model" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and efficient" },
  ],
}

describe("ModelSelector Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders correctly with initial value", () => {
    render(<ModelSelector {...mockProps} />)

    // Check if the component renders with the correct initial value
    expect(screen.getByText(mockProps.models[0].name)).toBeInTheDocument()
  })

  it("displays model descriptions", () => {
    render(<ModelSelector {...mockProps} />)

    // Check if descriptions are rendered
    expect(screen.getByText(mockProps.models[0].description)).toBeInTheDocument()
  })

  it("calls onChange when a different model is selected", async () => {
    render(<ModelSelector {...mockProps} />)

    // Open the dropdown
    const trigger = screen.getByRole("combobox")
    await userEvent.click(trigger)

    // Select a different model
    const option = screen.getByText(mockProps.models[1].name)
    await userEvent.click(option)

    // Check if onChange was called with the correct value
    expect(mockProps.onChange).toHaveBeenCalledWith(mockProps.models[1].id)
  })
})
