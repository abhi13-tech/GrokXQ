# Testing Documentation

This document provides detailed information about testing in the Groq Prompt Generator application.

## Testing Framework

The application uses the following testing tools:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking library

## Test Types

### Unit Tests

Unit tests focus on testing individual functions and components in isolation.

**Location**: `__tests__/unit/`

**Naming Convention**: `[component-or-function-name].test.tsx`

**Example**:

\`\`\`tsx
// __tests__/unit/utils/formatTime.test.ts
import { formatTime } from '@/utils/formatTime';

describe('formatTime', () => {
  it('formats milliseconds into MM:SS.MS format', () => {
    expect(formatTime(61000)).toBe('01:01.00');
    expect(formatTime(3661000)).toBe('61:01.00');
    expect(formatTime(1500)).toBe('00:01.50');
  });

  it('handles zero correctly', () => {
    expect(formatTime(0)).toBe('00:00.00');
  });
});
\`\`\`

### Component Tests

Component tests verify that React components render and behave correctly.

**Location**: `__tests__/components/`

**Naming Convention**: `[component-name].test.tsx`

**Example**:

\`\`\`tsx
// __tests__/components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('minimal-button');

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-minimal-accent3/20');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('applies additional className correctly', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/">Link</a>
      </Button>
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveClass('inline-flex');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
\`\`\`

### Integration Tests

Integration tests verify that multiple components work together correctly.

**Location**: `__tests__/integration/`

**Naming Convention**: `[feature-name].test.tsx`

**Example**:

\`\`\`tsx
// __tests__/integration/prompt-generation.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { PromptGenerator } from '@/components/prompt-generator';
import { AuthProvider } from '@/contexts/auth-context';

// Mock the API response
const server = setupServer(
  rest.post('/api/generate-prompt', (req, res, ctx) => {
    return res(
      ctx.json({
        prompt: 'This is a generated prompt about climate change.'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PromptGenerator Integration', () => {
  it('generates a prompt when form is submitted', async () => {
    render(
      <AuthProvider>
        <PromptGenerator />
      </AuthProvider>
    );

    // Fill out the form
    await userEvent.type(
      screen.getByPlaceholderText(/climate change/i),
      'Global warming'
    );
    
    // Select options from dropdowns
    fireEvent.click(screen.getByText(/select a prompt type/i));
    fireEvent.click(screen.getByText(/writing/i));
    
    fireEvent.click(screen.getByText(/select a tone/i));
    fireEvent.click(screen.getByText(/professional/i));
    
    // Submit the form
    fireEvent.click(screen.getByText(/generate prompt/i));
    
    // Wait for the result
    await waitFor(() => {
      expect(screen.getByText('This is a generated prompt about climate change.')).toBeInTheDocument();
    });
  });

  it('displays an error message when API call fails', async () => {
    // Override the default mock to return an error
    server.use(
      rest.post('/api/generate-prompt', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    render(
      <AuthProvider>
        <PromptGenerator />
      </AuthProvider>
    );

    // Fill out the form
    await userEvent.type(
      screen.getByPlaceholderText(/climate change/i),
      'Global warming'
    );
    
    // Submit the form
    fireEvent.click(screen.getByText(/generate prompt/i));
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/failed to generate prompt/i)).toBeInTheDocument();
    });
  });
});
\`\`\`

### API Tests

API tests verify that API endpoints work correctly.

**Location**: `__tests__/api/`

**Naming Convention**: `[endpoint-name].test.ts`

**Example**:

\`\`\`tsx
// __tests__/api/generate-prompt.test.ts
import { createMocks } from 'node-mocks-http';
import { handler } from '@/app/api/generate-prompt/route';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    then: jest.fn().mockImplementation((callback) => {
      callback({ data: { id: 'mock-id' }, error: null });
      return { catch: jest.fn() };
    }),
  },
}));

jest.mock('@ai-sdk/groq', () => ({
  groq: jest.fn().mockReturnValue('groq-model'),
}));

jest.mock('ai', () => ({
  generateText: jest.fn().mockResolvedValue({
    text: 'This is a generated prompt about climate change.',
  }),
}));

describe('/api/generate-prompt', () => {
  it('generates a prompt successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        topic: 'Climate change',
        promptType: 'writing',
        tone: 'professional',
        length: 50,
        additionalContext: 'Focus on solutions',
        model: 'groq-llama-3.1-8b-instant',
        userId: 'user-123',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      prompt: 'This is a generated prompt about climate change.',
    });
  });

  it('returns 400 for invalid input', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        // Missing required fields
        topic: 'Climate change',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toHaveProperty('error');
  });

  it('returns 401 when user is not authenticated', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        topic: 'Climate change',
        promptType: 'writing',
        tone: 'professional',
        length: 50,
        model: 'groq-llama-3.1-8b-instant',
        // No userId
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toHaveProperty('error');
  });
});
\`\`\`

## Test Utilities

### Custom Render Function

A custom render function is provided to wrap components with necessary providers:

\`\`\`tsx
// __tests__/test-utils.tsx
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';

function render(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render method
export { render };
\`\`\`

### Mock Hooks

Mock implementations of custom hooks are provided for testing:

\`\`\`tsx
// __tests__/mocks/hooks.ts
export const useAuthMock = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
  },
  profile: {
    id: 'user-123',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: null,
  },
  session: {
    user: {
      id: 'user-123',
      email: 'test@example.com',
    },
  },
  isLoading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  updatePassword: jest.fn(),
};

export const useApiMock = {
  execute: jest.fn(),
  isLoading: false,
  error: null,
};
\`\`\`

## Running Tests

### Running All Tests

\`\`\`bash
npm test
\`\`\`

### Running Tests in Watch Mode

\`\`\`bash
npm run test:watch
\`\`\`

### Running Tests with Coverage

\`\`\`bash
npm test -- --coverage
\`\`\`

## Test Coverage

The project aims for at least 80% test coverage across all files. Coverage reports are generated when running tests with the `--coverage` flag.

### Coverage Thresholds

\`\`\`json
// jest.config.js
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
\`\`\`

## Mocking

### Mocking API Calls

API calls are mocked using Mock Service Worker (MSW):

\`\`\`tsx
// __tests__/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/generate-prompt', (req, res, ctx) => {
    return res(
      ctx.json({
        prompt: 'This is a generated prompt about climate change.',
      })
    );
  }),

  rest.post('/api/generate-code', (req, res, ctx) => {
    return res(
      ctx.json({
        code: 'function example() { return "Hello, World!"; }',
      })
    );
  }),

  rest.post('/api/review-code', (req, res, ctx) => {
    return res(
      ctx.json({
        review: '# Code Review\n\nThe code looks good!',
      })
    );
  }),

  rest.post('/api/optimize-code', (req, res, ctx) => {
    return res(
      ctx.json({
        optimizedCode: 'function optimizedExample() { return "Hello, World!"; }',
        explanation: 'The code was optimized for readability.',
      })
    );
  }),

  rest.post('/api/generate-tests', (req, res, ctx) => {
    return res(
      ctx.json({
        tests: 'test("example", () => { expect(true).toBe(true); });',
      })
    );
  }),
];
\`\`\`

### Mocking Supabase

Supabase is mocked for testing:

\`\`\`tsx
// __tests__/mocks/supabase.ts
export const supabaseMock = {
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
        },
      },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
        session: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
        },
      },
      error: null,
    }),
    signUp: jest.fn().mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
        session: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
        },
      },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({
      error: null,
    }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({
      error: null,
    }),
    updateUser: jest.fn().mockResolvedValue({
      error: null,
    }),
    onAuthStateChange: jest.fn().mockReturnValue({
      subscription: {
        unsubscribe: jest.fn(),
      },
    }),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  then: jest.fn().mockImplementation((callback) => {
    callback({ data: [], error: null });
    return { catch: jest.fn() };
  }),
};
\`\`\`

## Best Practices

### Writing Effective Tests

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it.
2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested.
3. **Follow the AAA Pattern**: Arrange, Act, Assert.
4. **Keep Tests Independent**: Tests should not depend on each other.
5. **Mock External Dependencies**: Use mocks for external dependencies like APIs.
6. **Test Edge Cases**: Test boundary conditions and error cases.
7. **Keep Tests Simple**: Each test should test one thing.
8. **Use Setup and Teardown**: Use `beforeEach`, `afterEach`, `beforeAll`, and `afterAll` for setup and teardown.

### Example of a Well-Written Test

\`\`\`tsx
// __tests__/components/prompt-display.test.tsx
import { render, screen, fireEvent } from '../test-utils';
import { PromptDisplay } from '@/components/prompt-display';

describe('PromptDisplay', () => {
  // Arrange - Setup the test
  const mockPrompt = 'This is a test prompt';
  
  it('displays the provided prompt', () => {
    // Act - Render the component
    render(<PromptDisplay prompt={mockPrompt} />);
    
    // Assert - Check the result
    expect(screen.getByText(mockPrompt)).toBeInTheDocument();
  });
  
  it('displays a message when no prompt is provided', () => {
    // Act - Render the component with no prompt
    render(<PromptDisplay prompt="" />);
    
    // Assert - Check the result
    expect(screen.getByText(/no prompt generated yet/i)).toBeInTheDocument();
  });
  
  it('copies the prompt to clipboard when copy button is clicked', () => {
    // Arrange - Mock clipboard API
    const clipboardWriteTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: clipboardWriteTextMock,
      },
    });
    
    // Act - Render the component and click the copy button
    render(<PromptDisplay prompt={mockPrompt} />);
    fireEvent.click(screen.getByRole('button', { name: /copy to clipboard/i }));
    
    // Assert - Check the result
    expect(clipboardWriteTextMock).toHaveBeenCalledWith(mockPrompt);
    expect(screen.getByText(/copied/i)).toBeInTheDocument();
  });
});
\`\`\`

## Continuous Integration

Tests are run automatically on each pull request and push to the main branch using GitHub Actions.

### GitHub Actions Workflow

\`\`\`yaml
# .github/workflows/test.yml
name: Run Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --coverage
        
      - name: Upload coverage report
        uses: codecov/codecov-action@v2
\`\`\`

## Conclusion

This testing strategy ensures that the Groq Prompt Generator application is thoroughly tested at all levels, from individual components to API endpoints. By following these testing practices, we can maintain high code quality and catch issues early in the development process.
