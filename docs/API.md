# API Documentation

This document provides detailed information about the API endpoints in the Groq Prompt Generator application.

## Base URL

All API endpoints are relative to the base URL of the application:

\`\`\`
https://your-domain.com/api
\`\`\`

## Authentication

Most API endpoints require authentication. Include the authentication cookie in your requests, which is automatically handled by the browser when using the application.

## Error Handling

All API endpoints return errors in the following format:

\`\`\`json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
\`\`\`

Common error codes:
- `UNAUTHORIZED`: User is not authenticated
- `FORBIDDEN`: User does not have permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `INTERNAL_ERROR`: Server error

## API Endpoints

### Prompt Generation

#### Generate Prompt

Generates an AI prompt based on the provided parameters.

**URL**: `/generate-prompt`

**Method**: `POST`

**Request Body**:
\`\`\`json
{
  "topic": "Climate change",
  "promptType": "writing",
  "tone": "professional",
  "length": 50,
  "additionalContext": "Focus on solutions",
  "model": "groq-llama-3.1-8b-instant",
  "userId": "user-id",
  "projectId": "project-id" // optional
}
\`\`\`

**Response**:
\`\`\`json
{
  "prompt": "Write a professional article about climate change, focusing on solutions. The article should be comprehensive but concise, highlighting the most effective approaches to mitigate climate change impacts."
}
\`\`\`

**Status Codes**:
- `200 OK`: Prompt generated successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

### Code Generation

#### Generate Code

Generates code based on a description.

**URL**: `/generate-code`

**Method**: `POST`

**Request Body**:
\`\`\`json
{
  "description": "Create a React component that displays a list of items with pagination",
  "language": "typescript",
  "framework": "react",
  "additionalContext": "Use Tailwind CSS for styling",
  "model": "groq-llama-3.1-70b-instant",
  "userId": "user-id",
  "projectId": "project-id" // optional
}
\`\`\`

**Response**:
\`\`\`json
{
  "code": "import React, { useState } from 'react';\n\ninterface PaginatedListProps {\n  items: any[];\n  itemsPerPage: number;\n}\n\nexport const PaginatedList: React.FC<PaginatedListProps> = ({ items, itemsPerPage }) => {\n  const [currentPage, setCurrentPage] = useState(1);\n  \n  // Calculate total pages\n  const totalPages = Math.ceil(items.length / itemsPerPage);\n  \n  // Get current items\n  const indexOfLastItem = currentPage * itemsPerPage;\n  const indexOfFirstItem = indexOfLastItem - itemsPerPage;\n  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);\n  \n  // Change page\n  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);\n  \n  return (\n    <div className=\"w-full max-w-4xl mx-auto\">\n      <ul className=\"divide-y divide-gray-200\">\n        {currentItems.map((item, index) => (\n          <li key={index} className=\"py-4 px-6 hover:bg-gray-50\">\n            {JSON.stringify(item)}\n          </li>\n        ))}\n      </ul>\n      \n      <div className=\"flex justify-center mt-6\">\n        <nav className=\"inline-flex rounded-md shadow\">\n          <button\n            onClick={() => paginate(currentPage - 1)}\n            disabled={currentPage === 1}\n            className=\"px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50\"\n          >\n            Previous\n          </button>\n          \n          {Array.from({ length: totalPages }).map((_, index) => (\n            <button\n              key={index}\n              onClick={() => paginate(index + 1)}\n              className={`px-3 py-1 border border-gray-300 text-sm font-medium ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}\n            >\n              {index + 1}\n            </button>\n          ))}\n          \n          <button\n            onClick={() => paginate(currentPage + 1)}\n            disabled={currentPage === totalPages}\n            className=\"px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50\"\n          >\n            Next\n          </button>\n        </nav>\n      </div>\n    </div>\n  );\n};"
}
\`\`\`

**Status Codes**:
- `200 OK`: Code generated successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

### Code Review

#### Review Code

Reviews code and provides feedback.

**URL**: `/review-code`

**Method**: `POST`

**Request Body**:
\`\`\`json
{
  "code": "function calculateTotal(items) {\n  let total = 0;\n  for (var i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}",
  "language": "javascript",
  "reviewType": "general",
  "model": "groq-llama-3.1-8b-instant",
  "userId": "user-id",
  "projectId": "project-id" // optional
}
\`\`\`

**Response**:
\`\`\`json
{
  "review": "# Code Review\n\n## Overview\nThe function `calculateTotal` calculates the sum of prices from an array of items. The code is simple and functional but has some areas for improvement.\n\n## Strengths\n- The function has a clear purpose and name\n- The logic is straightforward and easy to understand\n\n## Areas for Improvement\n\n### 1. Use `const` or `let` instead of `var`\nReplace `var i = 0` with `let i = 0` to use block scoping instead of function scoping.\n\n### 2. Consider using array methods\nThe function could be simplified using `reduce()` for better readability:\n\n```javascript\nfunction calculateTotal(items) {\n  return items.reduce((total, item) => total + item.price, 0);\n}\n```\n\n### 3. Add error handling\nThe function doesn't handle cases where `items` might be null/undefined or not an array, or where an item might not have a price property.\n\n### 4. Add type checking or JSDoc comments\nConsider adding JSDoc comments to document the expected input and output types.\n\n## Conclusion\nThe function works as expected but could be improved for better maintainability and robustness."
}
\`\`\`

**Status Codes**:
- `200 OK`: Review completed successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

### Code Optimization

#### Optimize Code

Optimizes code based on selected goals.

**URL**: `/optimize-code`

**Method**: `POST`

**Request Body**:
\`\`\`json
{
  "code": "function calculateTotal(items) {\n  let total = 0;\n  for (var i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}",
  "language": "javascript",
  "goals": ["performance", "readability", "modernize"],
  "model": "groq-llama-3.1-8b-instant",
  "userId": "user-id",
  "projectId": "project-id" // optional
}
\`\`\`

**Response**:
\`\`\`json
{
  "optimizedCode": "/**\n * Calculates the total price of all items\n * @param {Array<{price: number}>} items - Array of items with price property\n * @returns {number} - The total price\n */\nconst calculateTotal = (items) => {\n  if (!items || !Array.isArray(items)) {\n    return 0;\n  }\n  \n  return items.reduce((total, item) => {\n    return total + (item.price || 0);\n  }, 0);\n};",
  "explanation": "# Code Optimization Explanation\n\n## Changes Made\n\n1. **Modernized Syntax**\n   - Converted to arrow function syntax\n   - Changed function declaration from `function` to `const`\n   - Used parameter destructuring for cleaner code\n\n2. **Improved Readability**\n   - Added JSDoc comments to document parameters and return value\n   - Used more descriptive variable names\n   - Added proper spacing and formatting\n\n3. **Enhanced Performance**\n   - Replaced the for loop with `reduce()` which is more optimized for this use case\n   - Added early return for empty arrays to avoid unnecessary processing\n\n4. **Added Error Handling**\n   - Added null/undefined check for the items parameter\n   - Added type checking to ensure items is an array\n   - Added fallback to 0 if an item doesn't have a price property\n\n## Benefits\n\n- **Maintainability**: The code is now easier to understand and maintain\n- **Robustness**: Added error handling prevents runtime errors\n- **Performance**: Using `reduce()` is more efficient for summing values\n- **Modern Standards**: The code now follows modern JavaScript conventions"
}
\`\`\`

**Status Codes**:
- `200 OK`: Code optimized successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

### Test Generation

#### Generate Tests

Generates tests for provided code.

**URL**: `/generate-tests`

**Method**: `POST`

**Request Body**:
\`\`\`json
{
  "code": "function calculateTotal(items) {\n  let total = 0;\n  for (var i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}",
  "language": "javascript",
  "framework": "jest",
  "testTypes": ["unit", "edge"],
  "coverage": "high",
  "additionalContext": "This function calculates the total price of items in a shopping cart",
  "model": "groq-llama-3.1-8b-instant",
  "userId": "user-id",
  "projectId": "project-id" // optional
}
\`\`\`

**Response**:
\`\`\`json
{
  "tests": "/**\n * Tests for the calculateTotal function\n */\n\ndescribe('calculateTotal', () => {\n  // Test case for normal operation with valid items\n  test('should calculate the total price of all items', () => {\n    // Arrange\n    const items = [\n      { price: 10 },\n      { price: 20 },\n      { price: 30 }\n    ];\n    \n    // Act\n    const result = calculateTotal(items);\n    \n    // Assert\n    expect(result).toBe(60);\n  });\n  \n  // Test case for empty array\n  test('should return 0 for an empty array', () => {\n    // Arrange\n    const items = [];\n    \n    // Act\n    const result = calculateTotal(items);\n    \n    // Assert\n    expect(result).toBe(0);\n  });\n  \n  // Edge case: items with missing price property\n  test('should handle items with missing price property', () => {\n    // Arrange\n    const items = [\n      { price: 10 },\n      { name: 'Item without price' },\n      { price: 30 }\n    ];\n    \n    // Act & Assert\n    expect(() => calculateTotal(items)).toThrow();\n  });\n  \n  // Edge case: null or undefined input\n  test('should handle null or undefined input', () => {\n    // Act & Assert\n    expect(() => calculateTotal(null)).toThrow();\n    expect(() => calculateTotal(undefined)).toThrow();\n  });\n  \n  // Edge case: non-array input\n  test('should handle non-array input', () => {\n    // Act & Assert\n    expect(() => calculateTotal('not an array')).toThrow();\n    expect(() => calculateTotal(123)).toThrow();\n    expect(() => calculateTotal({})).toThrow();\n  });\n  \n  // Edge case: negative prices\n  test('should correctly sum negative prices', () => {\n    // Arrange\n    const items = [\n      { price: 10 },\n      { price: -5 },\n      { price: 30 }\n    ];\n    \n    // Act\n    const result = calculateTotal(items);\n    \n    // Assert\n    expect(result).toBe(35);\n  });\n  \n  // Performance test for large arrays\n  test('should handle large arrays efficiently', () => {\n    // Arrange\n    const items = Array(1000).fill().map(() => ({ price: 1 }));\n    \n    // Act\n    const startTime = performance.now();\n    const result = calculateTotal(items);\n    const endTime = performance.now();\n    \n    // Assert\n    expect(result).toBe(1000);\n    expect(endTime - startTime).toBeLessThan(50); // Should complete in under 50ms\n  });\n});"
}
\`\`\`

**Status Codes**:
- `200 OK`: Tests generated successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

### Projects

#### Create Project

Creates a new project.

**URL**: `/projects`

**Method**: `POST`

**Request Body**:
\`\`\`json
{
  "name": "My Project",
  "description": "A project for testing AI features"
}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "project-id",
  "name": "My Project",
  "description": "A project for testing AI features",
  "user_id": "user-id",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
\`\`\`

**Status Codes**:
- `201 Created`: Project created successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

#### Get Projects

Gets all projects for the authenticated user.

**URL**: `/projects`

**Method**: `GET`

**Response**:
\`\`\`json
{
  "projects": [
    {
      "id": "project-id-1",
      "name": "Project 1",
      "description": "Description 1",
      "user_id": "user-id",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    },
    {
      "id": "project-id-2",
      "name": "Project 2",
      "description": "Description 2",
      "user_id": "user-id",
      "created_at": "2023-01-02T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z"
    }
  ]
}
\`\`\`

**Status Codes**:
- `200 OK`: Projects retrieved successfully
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

#### Get Project

Gets a specific project by ID.

**URL**: `/projects/:id`

**Method**: `GET`

**Response**:
\`\`\`json
{
  "id": "project-id",
  "name": "My Project",
  "description": "A project for testing AI features",
  "user_id": "user-id",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "resources": {
    "prompts": 5,
    "code_generations": 3,
    "code_reviews": 2,
    "tests": 1
  }
}
\`\`\`

**Status Codes**:
- `200 OK`: Project retrieved successfully
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User does not have access to this project
- `404 Not Found`: Project not found
- `500 Internal Server Error`: Server error

#### Update Project

Updates a specific project by ID.

**URL**: `/projects/:id`

**Method**: `PUT`

**Request Body**:
\`\`\`json
{
  "name": "Updated Project Name",
  "description": "Updated project description"
}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "project-id",
  "name": "Updated Project Name",
  "description": "Updated project description",
  "user_id": "user-id",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Project updated successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User does not have access to this project
- `404 Not Found`: Project not found
- `500 Internal Server Error`: Server error

#### Delete Project

Deletes a specific project by ID.

**URL**: `/projects/:id`

**Method**: `DELETE`

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Project deleted successfully"
}
\`\`\`

**Status Codes**:
- `200 OK`: Project deleted successfully
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User does not have access to this project
- `404 Not Found`: Project not found
- `500 Internal Server Error`: Server error

### User Profile

#### Get Profile

Gets the profile of the authenticated user.

**URL**: `/profile`

**Method**: `GET`

**Response**:
\`\`\`json
{
  "id": "user-id",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Profile retrieved successfully
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

#### Update Profile

Updates the profile of the authenticated user.

**URL**: `/profile`

**Method**: `PUT`

**Request Body**:
\`\`\`json
{
  "full_name": "Updated Name",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "user-id",
  "email": "user@example.com",
  "full_name": "Updated Name",
  "avatar_url": "https://example.com/new-avatar.jpg",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z"
}
\`\`\`

**Status Codes**:
- `200 OK`: Profile updated successfully
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

### Activity Logs

#### Get Activity Logs

Gets activity logs for the authenticated user.

**URL**: `/activity-logs`

**Method**: `GET`

**Query Parameters**:
- `limit` (optional): Maximum number of logs to return (default: 10)
- `offset` (optional): Number of logs to skip (default: 0)
- `project_id` (optional): Filter logs by project ID

**Response**:
\`\`\`json
{
  "logs": [
    {
      "id": "log-id-1",
      "user_id": "user-id",
      "project_id": "project-id",
      "activity_type": "prompt_generation",
      "description": "Generated a prompt about climate change",
      "metadata": {
        "prompt_id": "prompt-id",
        "topic": "Climate change"
      },
      "created_at": "2023-01-03T00:00:00Z"
    },
    {
      "id": "log-id-2",
      "user_id": "user-id",
      "project_id": null,
      "activity_type": "code_review",
      "description": "Reviewed JavaScript code",
      "metadata": {
        "review_id": "review-id",
        "language": "javascript"
      },
      "created_at": "2023-01-02T00:00:00Z"
    }
  ],
  "total": 25
}
\`\`\`

**Status Codes**:
- `200 OK`: Logs retrieved successfully
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error
