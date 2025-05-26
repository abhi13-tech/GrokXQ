# GrokXQ Development Suite

## Overview

**GrokXQ Development Suite** is a comprehensive AI-powered platform designed to streamline and enhance the software development workflow. By leveraging the speed and intelligence of **Groq** and **XAI (Grok)** models, this suite provides powerful tools for:

- Code generation  
- Automated code review  
- Code optimization  
- Test suite creation  
- Prompt engineering   

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Features

### 🚀 Code Generation
- Generate high-quality code snippets, functions, and components  
- Support for multiple programming languages and frameworks  
- Customizable generation parameters  

### 🔍 Code Review
- AI-powered analysis and improvement suggestions  
- Bug detection, security scanning, and performance insights  
- Actionable feedback for cleaner, better code  

### ⚡ Code Optimization
- Refactor and modernize codebases  
- Improve code readability and maintainability  
- Enhance performance through AI-driven insights  

### 🧪 Test Generation
- Auto-generate test cases and full test suites  
- Target edge cases and potential failure points  
- Supports major testing libraries and frameworks  

### 📝 Prompt Engineering
- Create, save, and reuse AI prompts  
- Customize prompts for specific development needs  
- Share prompts across your team  

## Technologies Used

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui  
- **Backend**: Next.js API Routes, Server Actions  
- **Database**: Supabase (PostgreSQL)  
- **Authentication**: Supabase Auth  
- **AI Models**: Groq (LLaMA 3, Mixtral, Gemma), XAI (Grok)  

## Getting Started

### Prerequisites

- Node.js 18.x or higher  
- npm or yarn  
- Supabase account  
- Groq API key  
- XAI (Grok) API key  

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abhi13-tech/GrokXQ.git
   cd grokxq-development-suite

	2.	Install dependencies

npm install
# or
yarn install


	3.	Configure environment variables
Create a .env.local file in the root directory:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
XAI_API_KEY=your_xai_api_key
ADMIN_SECRET_KEY=your_admin_secret_key


	4.	Initialize the database
Run the SQL scripts from docs/DATABASE.md.
	5.	Start the development server

npm run dev
# or
yarn dev


	6.	Open http://localhost:3000 in your browser.

Project Structure

├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── (auth)/           # Auth pages
│   ├── dashboard/        # Dashboard
│   ├── code-generation/  # Code generation UI
│   ├── code-review/      # Code review UI
│   ├── code-optimizer/   # Optimization tools
│   ├── testing/          # Testing UI
│   └── documentation/    # Docs pages
├── components/           # React components
│   ├── ui/               # UI components
│   ├── auth/             # Auth-related components
│   ├── dashboard/        # Dashboard-specific components
│   └── ...               # Others by feature
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── docs/                 # Markdown docs
└── types/                # TypeScript types

Usage Examples

Code Generation

const response = await fetch('/api/generate-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Create a React component that displays a list of items with pagination',
    language: 'typescript',
    framework: 'react',
    additionalContext: 'Use Tailwind CSS for styling',
    model: 'groq-llama-3.1-70b-instant',
  }),
});

const data = await response.json();
console.log(data.code);

Code Review

const response = await fetch('/api/review-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'function calculateTotal(items) { let total = 0; for (var i = 0; i < items.length; i++) { total += items[i].price; } return total; }',
    language: 'javascript',
    reviewType: 'general',
    model: 'groq-llama-3.1-8b-instant',
  }),
});

const data = await response.json();
console.log(data.review);

Contributing

Everyone is welcome to contribute! To get started:
	1.	Fork the repository
	2.	Create a new branch
	3.	Make your changes
	4.	Commit and push (git commit -m 'Your message')
	5.	Open a Pull Request

Please ensure your code follows the project’s standards and includes appropriate tests.

Acknowledgments
	•	Groq — AI hardware and models
	•	XAI — Grok conversational model
	•	Supabase — Backend and authentication
	•	Next.js — Frontend framework
	•	Tailwind CSS — Utility-first styling
	•	shadcn/ui — UI components

Contact

For questions, issues, or support, open a GitHub issue or email:
adunooriabhishekreddy@gmail.com
