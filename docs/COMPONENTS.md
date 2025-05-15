# Component Documentation

This document provides detailed information about the key components in the Groq Prompt Generator application.

## Table of Contents

1. [UI Components](#ui-components)
2. [Feature Components](#feature-components)
3. [Layout Components](#layout-components)
4. [Form Components](#form-components)
5. [Utility Components](#utility-components)

## UI Components

### Button

**File**: `components/ui/button.tsx`

**Description**: A versatile button component with various styles and sizes.

**Props**:
- `variant`: Appearance style ('default', 'destructive', 'outline', 'secondary', 'ghost', 'link')
- `size`: Size variant ('default', 'sm', 'lg', 'icon')
- `asChild`: Whether to render as a child component
- Standard button props (onClick, disabled, etc.)

**Usage**:
\`\`\`tsx
<Button variant="default" size="default" onClick={handleClick}>
  Click Me
</Button>
\`\`\`

### Card

**File**: `components/ui/card.tsx`

**Description**: A card component for displaying content in a contained box.

**Subcomponents**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title element
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Usage**:
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
\`\`\`

### Input

**File**: `components/ui/input.tsx`

**Description**: A styled input component.

**Props**: Standard input props (value, onChange, placeholder, etc.)

**Usage**:
\`\`\`tsx
<Input 
  placeholder="Enter your name" 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
/>
\`\`\`

### Select

**File**: `components/ui/select.tsx`

**Description**: A dropdown select component.

**Subcomponents**:
- `Select`: Main container
- `SelectTrigger`: Clickable trigger element
- `SelectValue`: Display value
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option

**Usage**:
\`\`\`tsx
<Select onValueChange={setValue} defaultValue="option1">
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
\`\`\`

### Checkbox

**File**: `components/ui/checkbox.tsx`

**Description**: A styled checkbox component.

**Props**:
- `checked`: Whether the checkbox is checked
- `onCheckedChange`: Function called when checked state changes
- Standard checkbox props (disabled, required, etc.)

**Usage**:
\`\`\`tsx
<Checkbox 
  checked={isChecked} 
  onCheckedChange={setIsChecked} 
  id="terms" 
/>
<label htmlFor="terms">Accept terms</label>
\`\`\`

## Feature Components

### PromptGenerator

**File**: `components/prompt-generator.tsx`

**Description**: A component for generating AI prompts based on user parameters.

**State**:
- `generatedPrompt`: The generated prompt text
- `promptHistory`: Array of previous prompts
- `isGenerating`: Loading state

**Functions**:
- `onSubmit`: Handles form submission
- `refreshPromptHistory`: Refreshes prompt history
- `selectPrompt`: Selects a prompt from history

**Usage**:
\`\`\`tsx
<PromptGenerator />
\`\`\`

### CodeReviewer

**File**: `components/code-reviewer.tsx`

**Description**: A component for reviewing code and providing feedback.

**State**:
- `reviewResult`: The review feedback
- `isReviewing`: Loading state
- `copied`: Whether the review has been copied

**Functions**:
- `onSubmit`: Handles form submission
- `copyToClipboard`: Copies review to clipboard
- `downloadReview`: Downloads review as a file

**Usage**:
\`\`\`tsx
<CodeReviewer />
\`\`\`

### CodeOptimizer

**File**: `components/code-optimizer.tsx`

**Description**: A component for optimizing code based on selected goals.

**State**:
- `optimizedCode`: The optimized code
- `explanation`: Explanation of optimizations
- `isOptimizing`: Loading state
- `copied`: Whether the code has been copied

**Functions**:
- `onSubmit`: Handles form submission
- `copyToClipboard`: Copies code to clipboard
- `downloadCode`: Downloads code as a file

**Usage**:
\`\`\`tsx
<CodeOptimizer />
\`\`\`

### TestGenerator

**File**: `components/testing/test-generator.tsx`

**Description**: A component for generating tests for provided code.

**State**:
- `generatedTests`: The generated test code
- `isGenerating`: Loading state
- `copied`: Whether the tests have been copied

**Functions**:
- `onSubmit`: Handles form submission
- `copyToClipboard`: Copies tests to clipboard
- `downloadTests`: Downloads tests as a file

**Usage**:
\`\`\`tsx
<TestGenerator />
\`\`\`

### ModelSelector

**File**: `components/model-selector.tsx`

**Description**: A component for selecting AI models.

**Props**:
- `value`: Currently selected model
- `onChange`: Function called when selection changes

**State**:
- `open`: Whether the dropdown is open

**Usage**:
\`\`\`tsx
<ModelSelector 
  value={selectedModel} 
  onChange={setSelectedModel} 
/>
\`\`\`

## Layout Components

### SiteHeader

**File**: `components/site-header.tsx`

**Description**: The main header component for the application.

**Subcomponents**:
- `MainNav`: Main navigation links
- `ModeToggle`: Theme toggle button
- `UserNav`: User navigation dropdown

**Usage**:
\`\`\`tsx
<SiteHeader />
\`\`\`

### SiteFooter

**File**: `components/site-footer.tsx`

**Description**: The footer component for the application.

**Usage**:
\`\`\`tsx
<SiteFooter />
\`\`\`

### MainNav

**File**: `components/main-nav.tsx`

**Description**: The main navigation component.

**Props**:
- `items`: Navigation items to display

**Usage**:
\`\`\`tsx
<MainNav items={[
  { title: "Home", href: "/" },
  { title: "Dashboard", href: "/dashboard" }
]} />
\`\`\`

### DashboardShell

**File**: `components/dashboard/dashboard-shell.tsx`

**Description**: A layout shell for dashboard pages.

**Props**:
- `children`: Content to display
- `heading`: Page heading
- `description`: Page description
- `headerAction`: Optional action button in header

**Usage**:
\`\`\`tsx
<DashboardShell 
  heading="Dashboard" 
  description="Overview of your activity"
>
  <DashboardContent />
</DashboardShell>
\`\`\`

## Form Components

### Form

**File**: `components/ui/form.tsx`

**Description**: A form component with validation support.

**Subcomponents**:
- `Form`: Main form container
- `FormField`: Individual form field
- `FormItem`: Container for form elements
- `FormLabel`: Label for form elements
- `FormControl`: Control wrapper
- `FormDescription`: Description text
- `FormMessage`: Validation message

**Usage**:
\`\`\`tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>Enter your email address</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
\`\`\`

### SignInForm

**File**: `components/auth/sign-in-form.tsx`

**Description**: A form for user sign-in.

**State**:
- `isLoading`: Loading state

**Functions**:
- `onSubmit`: Handles form submission

**Usage**:
\`\`\`tsx
<SignInForm />
\`\`\`

### SignUpForm

**File**: `components/auth/sign-up-form.tsx`

**Description**: A form for user sign-up.

**State**:
- `isLoading`: Loading state

**Functions**:
- `onSubmit`: Handles form submission

**Usage**:
\`\`\`tsx
<SignUpForm />
\`\`\`

## Utility Components

### CodeEditor

**File**: `components/code-editor.tsx`

**Description**: A simple code editor component.

**Props**:
- `value`: Code content
- `onChange`: Function called when code changes
- `language`: Programming language
- `height`: Editor height
- `readOnly`: Whether editor is read-only

**Usage**:
\`\`\`tsx
<CodeEditor
  value={code}
  onChange={setCode}
  language="javascript"
  height="300px"
/>
\`\`\`

### PromptDisplay

**File**: `components/prompt-display.tsx`

**Description**: A component for displaying generated prompts.

**Props**:
- `prompt`: The prompt text to display

**State**:
- `copied`: Whether the prompt has been copied

**Functions**:
- `copyToClipboard`: Copies prompt to clipboard

**Usage**:
\`\`\`tsx
<PromptDisplay prompt={generatedPrompt} />
\`\`\`

### CodeReviewDisplay

**File**: `components/code-review-display.tsx`

**Description**: A component for displaying code review results.

**Props**:
- `review`: The review text to display

**Usage**:
\`\`\`tsx
<CodeReviewDisplay review={reviewResult} />
\`\`\`

### ModeToggle

**File**: `components/mode-toggle.tsx`

**Description**: A toggle button for switching between light and dark modes.

**Usage**:
\`\`\`tsx
<ModeToggle />
\`\`\`

### UserNav

**File**: `components/user-nav.tsx`

**Description**: A dropdown navigation for user-related actions.

**Usage**:
\`\`\`tsx
<UserNav />
\`\`\`

### PromptHistory

**File**: `components/prompt-history.tsx`

**Description**: A component for displaying prompt history.

**Props**:
- `prompts`: Array of prompt history items
- `onSelectPrompt`: Function called when a prompt is selected
- `isLoading`: Loading state

**Usage**:
\`\`\`tsx
<PromptHistory 
  prompts={promptHistory} 
  onSelectPrompt={selectPrompt}
  isLoading={isLoadingHistory}
/>
