# Groq Prompt Generator

## Project Overview

Groq Prompt Generator is a comprehensive AI development suite designed to streamline the process of working with AI models, particularly focusing on Groq's LLM offerings. The application provides tools for prompt engineering, code generation, code review, code optimization, and test generation, all within a unified interface.

## Features

### 1. Prompt Generation
- Create customized prompts for various AI models
- Configure parameters like topic, type, tone, and length
- Save and manage prompt history
- Associate prompts with specific projects

### 2. Code Generation
- Generate code based on natural language descriptions
- Support for multiple programming languages and frameworks
- Customizable generation parameters
- Save and organize generated code

### 3. Code Review
- Submit code for AI-powered review
- Multiple review types (general, security, performance, readability, bugs)
- Detailed feedback and suggestions
- Export review results

### 4. Code Optimization
- Optimize existing code for various goals
- Performance, readability, security, and maintainability improvements
- Side-by-side comparison of original and optimized code
- Detailed explanation of optimizations

### 5. Test Generation
- Generate comprehensive test suites for your code
- Support for multiple testing frameworks
- Configurable test types and coverage levels
- Export generated tests

## Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **UI Library**: React
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **API Routes**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Groq API, XAI (Grok) API

### Testing
- **Unit Testing**: Jest
- **Component Testing**: React Testing Library
- **E2E Testing**: Not implemented yet

## Setup and Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account
- Groq API key
- XAI (Grok) API key

### Installation Steps

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/groq-prompt-generator.git
   cd groq-prompt-generator
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   GROQ_API_KEY=your_groq_api_key
   XAI_API_KEY=your_xai_api_key
   \`\`\`

4. Initialize the database:
   Run the SQL scripts in the `supabase/migrations` directory to set up your database schema.

5. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Authentication

1. **Sign Up**: Create a new account using your email and password.
2. **Sign In**: Log in with your credentials.
3. **Reset Password**: Use the "Forgot Password" link if needed.

### Dashboard

The dashboard provides an overview of:
- Recent activity
- Project statistics
- Quick access to key features
- AI insights based on your usage

### Projects

Projects help you organize your work:
1. Create a new project with a name and description
2. View all your projects on the projects page
3. Click on a project to see all associated resources
4. Edit or delete projects as needed

### Prompt Generation

1. Navigate to the Prompt Generator
2. Configure your prompt parameters:
   - Topic
   - Prompt type
   - Tone
   - Length
   - Additional context
   - AI model
3. Click "Generate Prompt"
4. View, copy, or save the generated prompt
5. Access your prompt history

### Code Generation

1. Navigate to the Code Generation page
2. Describe what you want to generate
3. Select language, framework, and model
4. Add any additional context
5. Click "Generate Code"
6. View, copy, or save the generated code

### Code Review

1. Navigate to the Code Review page
2. Paste your code
3. Select language and review type
4. Choose the AI model
5. Click "Review Code"
6. Review the feedback and suggestions
7. Download or copy the review

### Code Optimization

1. Navigate to the Code Optimizer
2. Paste your code
3. Select language and optimization goals
4. Choose the AI model
5. Click "Optimize Code"
6. Compare original and optimized code
7. View the explanation of changes
8. Download or copy the optimized code

### Test Generation

1. Navigate to the Test Generator
2. Paste your code
3. Select language, framework, and test types
4. Set desired coverage level
5. Add any additional context
6. Choose the AI model
7. Click "Generate Tests"
8. View, copy, or download the generated tests

## API Documentation

### Authentication Endpoints

- **POST /api/auth/sign-up**
  - Creates a new user account
  - Body: `{ email, password, fullName }`

- **POST /api/auth/sign-in**
  - Authenticates a user
  - Body: `{ email, password }`

- **POST /api/auth/reset-password**
  - Sends a password reset email
  - Body: `{ email }`

### Prompt Generation

- **POST /api/generate-prompt**
  - Generates a prompt based on parameters
  - Body: `{ topic, promptType, tone, length, additionalContext, model, userId, projectId }`
  - Returns: `{ prompt }`

### Code Generation

- **POST /api/generate-code**
  - Generates code based on description
  - Body: `{ description, language, framework, additionalContext, model, userId, projectId }`
  - Returns: `{ code }`

### Code Review

- **POST /api/review-code**
  - Reviews code and provides feedback
  - Body: `{ code, language, reviewType, model, userId, projectId }`
  - Returns: `{ review }`

### Code Optimization

- **POST /api/optimize-code**
  - Optimizes code based on goals
  - Body: `{ code, language, goals, model, userId, projectId }`
  - Returns: `{ optimizedCode, explanation }`

### Test Generation

- **POST /api/generate-tests**
  - Generates tests for provided code
  - Body: `{ code, language, framework, testTypes, coverage, additionalContext, model, userId, projectId }`
  - Returns: `{ tests }`

## Component Documentation

### Core Components

#### PromptGenerator
- **Purpose**: Generates AI prompts based on user parameters
- **Props**: None
- **State**: 
  - `generatedPrompt`: The generated prompt text
  - `promptHistory`: Array of previous prompts
  - `isGenerating`: Loading state

#### CodeGenerator
- **Purpose**: Generates code based on descriptions
- **Props**: None
- **State**:
  - `generatedCode`: The generated code
  - `isGenerating`: Loading state

#### CodeReviewer
- **Purpose**: Reviews code and provides feedback
- **Props**: None
- **State**:
  - `reviewResult`: The review feedback
  - `isReviewing`: Loading state

#### CodeOptimizer
- **Purpose**: Optimizes code based on selected goals
- **Props**: None
- **State**:
  - `optimizedCode`: The optimized code
  - `explanation`: Explanation of optimizations
  - `isOptimizing`: Loading state

#### TestGenerator
- **Purpose**: Generates tests for provided code
- **Props**: None
- **State**:
  - `generatedTests`: The generated test code
  - `isGenerating`: Loading state

### UI Components

#### ModelSelector
- **Purpose**: Allows selection of AI models
- **Props**:
  - `value`: Currently selected model
  - `onChange`: Function called when selection changes

#### CodeEditor
- **Purpose**: Simple code editor component
- **Props**:
  - `value`: Code content
  - `onChange`: Function called when code changes
  - `language`: Programming language
  - `height`: Editor height
  - `readOnly`: Whether editor is read-only

#### PromptDisplay
- **Purpose**: Displays generated prompts
- **Props**:
  - `prompt`: The prompt text to display

#### PromptHistory
- **Purpose**: Displays prompt history
- **Props**:
  - `prompts`: Array of prompt history items
  - `onSelectPrompt`: Function called when a prompt is selected
  - `isLoading`: Loading state

## Database Schema

### Tables

#### profiles
- `id`: UUID (PK)
- `email`: String
- `full_name`: String (nullable)
- `avatar_url`: String (nullable)
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### projects
- `id`: UUID (PK)
- `name`: String
- `description`: String (nullable)
- `user_id`: UUID (FK to profiles)
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### prompts
- `id`: UUID (PK)
- `topic`: String
- `prompt_type`: String
- `tone`: String
- `length`: Integer
- `additional_context`: String (nullable)
- `model`: String
- `generated_prompt`: String
- `user_id`: UUID (FK to profiles)
- `project_id`: UUID (FK to projects, nullable)
- `created_at`: Timestamp

#### code_generations
- `id`: UUID (PK)
- `description`: String
- `language`: String
- `framework`: String
- `model`: String
- `additional_context`: String (nullable)
- `generated_code`: String
- `user_id`: UUID (FK to profiles)
- `project_id`: UUID (FK to projects, nullable)
- `created_at`: Timestamp

#### code_reviews
- `id`: UUID (PK)
- `code`: String
- `language`: String
- `review_type`: String
- `model`: String
- `review_result`: String
- `user_id`: UUID (FK to profiles)
- `project_id`: UUID (FK to projects, nullable)
- `created_at`: Timestamp

#### tests
- `id`: UUID (PK)
- `code`: String
- `language`: String
- `framework`: String
- `test_types`: String[]
- `coverage`: String
- `model`: String
- `additional_context`: String (nullable)
- `generated_tests`: String
- `user_id`: UUID (FK to profiles)
- `project_id`: UUID (FK to projects, nullable)
- `created_at`: Timestamp

#### activity_logs
- `id`: UUID (PK)
- `user_id`: UUID (FK to profiles)
- `project_id`: UUID (FK to projects, nullable)
- `activity_type`: String
- `description`: String
- `metadata`: JSON (nullable)
- `created_at`: Timestamp

## Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
\`\`\`

### Test Structure

Tests are organized in the `__tests__` directory, mirroring the structure of the source code:

- `__tests__/components/`: Tests for React components
- `__tests__/hooks/`: Tests for custom hooks
- `__tests__/lib/`: Tests for utility functions
- `__tests__/pages/`: Tests for page components

### Writing Tests

When writing tests:

1. Use descriptive test names
2. Follow the Arrange-Act-Assert pattern
3. Mock external dependencies
4. Test both success and error cases
5. Use the provided test utilities for consistent testing

Example:

\`\`\`tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button', { name: /click me/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
\`\`\`

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [Groq](https://groq.com/)
- [Framer Motion](https://www.framer.com/motion/)
