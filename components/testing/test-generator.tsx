"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelSelector } from "@/components/model-selector"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string(),
  framework: z.string(),
  testTypes: z.array(z.string()).min(1, "Select at least one test type"),
  coverage: z.string(),
  model: z.string(),
  additionalContext: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const TEST_TYPES = [
  { id: "unit", label: "Unit Tests" },
  { id: "integration", label: "Integration Tests" },
  { id: "e2e", label: "End-to-End Tests" },
  { id: "performance", label: "Performance Tests" },
]

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
]

const FRAMEWORKS = [
  { value: "jest", label: "Jest" },
  { value: "mocha", label: "Mocha" },
  { value: "pytest", label: "PyTest" },
  { value: "junit", label: "JUnit" },
  { value: "xunit", label: "xUnit" },
  { value: "cypress", label: "Cypress" },
  { value: "playwright", label: "Playwright" },
  { value: "none", label: "None" },
]

export function TestGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTests, setGeneratedTests] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      language: "javascript",
      framework: "jest",
      testTypes: ["unit"],
      coverage: "medium",
      model: "groq-llama-3.1-8b-instant",
      additionalContext: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsGenerating(true)
    try {
      // In a real implementation, this would be an API call
      setTimeout(() => {
        const sampleTests = generateSampleTests(data)
        setGeneratedTests(sampleTests)
        toast({
          title: "Tests generated successfully",
          description: "Your tests have been generated.",
        })
        setIsGenerating(false)
      }, 2000)
    } catch (error) {
      console.error("Error generating tests:", error)
      toast({
        title: "Error generating tests",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTests)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  // This is a placeholder function to generate sample tests based on the form data
  function generateSampleTests(data: FormValues): string {
    if (data.language === "javascript" || data.language === "typescript") {
      if (data.framework === "jest") {
        return `// Generated ${data.language} tests using Jest
import { DataDisplay } from './DataDisplay';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('DataDisplay Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders loading state initially', () => {
    render(<DataDisplay />);
    expect(screen.getByText(/loading data/i)).toBeInTheDocument();
  });

  test('renders data when fetch is successful', async () => {
    const mockData = [
      { id: 1, name: 'Item 1', value: 100 },
      { id: 2, name: 'Item 2', value: 200 },
    ];
    
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    
    render(<DataDisplay />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading data/i)).not.toBeInTheDocument();
    });
    
    // Check if data is rendered
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  test('renders error message when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch data'));
    
    render(<DataDisplay />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading data/i)).not.toBeInTheDocument();
    });
    
    // Check if error message is rendered
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
  });

  test('handles empty data array', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    
    render(<DataDisplay />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading data/i)).not.toBeInTheDocument();
    });
    
    // Check if empty state is rendered
    expect(screen.getByText(/no items found/i)).toBeInTheDocument();
  });
});`
      } else if (data.framework === "cypress") {
        return `// Generated ${data.language} tests using Cypress
describe('DataDisplay Component', () => {
  beforeEach(() => {
    // Visit the page where the component is rendered
    cy.visit('/data-display');
    
    // Intercept API calls
    cy.intercept('GET', '/api/data', { fixture: 'data.json' }).as('getData');
  });

  it('displays loading state initially', () => {
    cy.contains(/loading data/i).should('be.visible');
  });

  it('displays data after successful API call', () => {
    // Wait for the API call to complete
    cy.wait('@getData');
    
    // Check if data is displayed
    cy.contains('Item 1').should('be.visible');
    cy.contains('Item 2').should('be.visible');
    cy.contains('100').should('be.visible');
    cy.contains('200').should('be.visible');
  });

  it('displays error message when API call fails', () => {
    // Mock a failed API call
    cy.intercept('GET', '/api/data', {
      statusCode: 500,
      body: 'Server error'
    }).as('getDataError');
    
    // Reload the page
    cy.reload();
    
    // Wait for the API call to complete
    cy.wait('@getDataError');
    
    // Check if error message is displayed
    cy.contains(/error/i).should('be.visible');
  });

  it('handles empty data response', () => {
    // Mock an empty data response
    cy.intercept('GET', '/api/data', { body: [] }).as('getEmptyData');
    
    // Reload the page
    cy.reload();
    
    // Wait for the API call to complete
    cy.wait('@getEmptyData');
    
    // Check if empty state message is displayed
    cy.contains(/no items found/i).should('be.visible');
  });
});`
      }
    } else if (data.language === "python") {
      return `# Generated Python tests using PyTest
import pytest
from unittest.mock import patch, MagicMock
from your_module import fetch_data, display_data

@pytest.fixture
def mock_data():
    return [
        {"id": 1, "name": "Item 1", "value": 100},
        {"id": 2, "name": "Item 2", "value": 200}
    ]

def test_fetch_data_success(mock_data):
    # Mock the API response
    with patch('your_module.requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = mock_data
        mock_get.return_value = mock_response
        
        # Call the function
        result = fetch_data()
        
        # Assert the result
        assert result == mock_data
        assert mock_get.called
        assert mock_get.call_args[0][0] == 'https://api.example.com/data'

def test_fetch_data_error():
    # Mock a failed API response
    with patch('your_module.requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_get.return_value = mock_response
        
        # Call the function and expect an exception
        with pytest.raises(Exception) as excinfo:
            fetch_data()
        
        # Assert the exception message
        assert "Failed to fetch data" in str(excinfo.value)

def test_display_data(mock_data, capsys):
    # Call the function
    display_data(mock_data)
    
    # Capture the stdout
    captured = capsys.readouterr()
    
    # Assert the output
    assert "Item 1: 100" in captured.out
    assert "Item 2: 200" in captured.out

def test_display_data_empty(capsys):
    # Call the function with empty data
    display_data([])
    
    # Capture the stdout
    captured = capsys.readouterr()
    
    # Assert the output
    assert "No items found" in captured.out
`
    }

    return `// Generated tests for ${data.language} using ${data.framework}
// This is a placeholder. In a real implementation, the AI would generate
// actual tests based on the provided code and parameters.`
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Generator</CardTitle>
          <CardDescription>Generate comprehensive tests for your code</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Programming language of your code</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testing Framework</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select framework" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FRAMEWORKS.map((framework) => (
                            <SelectItem key={framework.value} value={framework.value}>
                              {framework.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the testing framework</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Coverage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Basic (70%)</SelectItem>
                          <SelectItem value="medium">Standard (85%)</SelectItem>
                          <SelectItem value="high">Comprehensive (95%+)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Desired test coverage level</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="testTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Test Types</FormLabel>
                    <FormDescription>Select the types of tests to generate</FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {TEST_TYPES.map((type) => (
                        <FormField
                          key={type.id}
                          control={form.control}
                          name="testTypes"
                          render={({ field }) => {
                            return (
                              <FormItem key={type.id} className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, type.id])
                                        : field.onChange(field.value?.filter((value) => value !== type.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">{type.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Code</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste your code here..." className="font-mono min-h-[300px]" {...field} />
                    </FormControl>
                    <FormDescription>Paste the code you want to test</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any specific requirements, edge cases, or additional information"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Provide any additional details to make the tests more specific</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <FormControl>
                      <ModelSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>Select the AI model to generate your tests</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Tests...
                  </>
                ) : (
                  "Generate Tests"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedTests && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Tests</CardTitle>
            <CardDescription>Review and copy the generated test code</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code">
              <TabsList className="mb-4">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Documentation</TabsTrigger>
              </TabsList>
              <TabsContent value="code">
                <div className="relative">
                  <pre className="max-h-[500px] overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
                    {generatedTests}
                  </pre>
                  <Button size="sm" variant="ghost" className="absolute right-4 top-4" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-2">Test Coverage</h3>
                  <p className="mb-4">The generated tests cover the following scenarios:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Initial loading state</li>
                    <li>Successful data fetching and rendering</li>
                    <li>Error handling</li>
                    <li>Empty data handling</li>
                  </ul>
                  <h3 className="text-lg font-semibold mb-2">Usage Instructions</h3>
                  <p>
                    Place these tests in a file adjacent to your component code. Run them using your testing framework's
                    CLI or integration with your IDE.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Save Tests</Button>
            <Button variant="outline">Run Tests</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
