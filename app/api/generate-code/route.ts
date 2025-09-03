"use client"

import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

/**
 * Generates template code based on user inputs
 */
function generateTemplateCode(
  description: string,
  language: string,
  framework: string,
  additionalContext?: string,
): string {
  // Create a comment block with the user's inputs
  const commentBlock =
    language === "python"
      ? `"""
Description: ${description}
Framework: ${framework}
Additional Context: ${additionalContext || "None provided"}
"""`
      : `/**
 * Description: ${description}
 * Framework: ${framework}
 * Additional Context: ${additionalContext || "None provided"}
 */`

  // Generate different templates based on language and framework
  if (language === "typescript" && framework === "react") {
    return `${commentBlock}

import React, { useState, useEffect } from 'react';

interface DataItem {
  id: string | number;
  title: string;
  description?: string;
  [key: string]: any;
}

interface Props {
  title?: string;
  endpoint?: string;
  initialItems?: DataItem[];
}

const ${getComponentName(description)} = ({ 
  title = "Data List", 
  endpoint = "/api/data",
  initialItems = []
}: Props) => {
  const [items, setItems] = useState<DataItem[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    // Skip fetching if we have initial items
    if (initialItems.length > 0) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(\`Error: \${response.status} \${response.statusText}\`);
        }
        
        const data = await response.json();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint, initialItems]);

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort items based on sort order
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search items..."
            className="px-3 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={toggleSortOrder}
            className="px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            Sort {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && sortedItems.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No items found</p>
        </div>
      )}

      {!loading && !error && sortedItems.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              {item.description && <p className="text-gray-600">{item.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ${getComponentName(description)};
`
  } else if (language === "typescript" && framework === "nextjs") {
    return `${commentBlock}

'use client'

import { useState, useEffect } from 'react'

interface DataItem {
  id: string | number;
  title: string;
  description?: string;
  [key: string]: any;
}

interface PageProps {
  params: { id?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ${getPageName(description)}({ params, searchParams }: PageProps) {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get query parameters
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit) : 10;
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Use params.id if available for specific item fetching
        const endpoint = params.id 
          ? \`/api/items/\${params.id}\` 
          : \`/api/items?page=\${page}&limit=\${limit}\`;
          
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(\`Error: \${response.status} \${response.statusText}\`);
        }
        
        const result = await response.json();
        setData(Array.isArray(result) ? result : [result]);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, page, limit]);

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {params.id ? 'Item Details' : 'Items List'}
      </h1>
      
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && data.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No items found</p>
        </div>
      )}
      
      {!loading && !error && data.length > 0 && (
        <>
          {params.id ? (
            // Single item view
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">{data[0].title}</h2>
              {data[0].description && (
                <p className="text-gray-600 mb-4">{data[0].description}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data[0])
                  .filter(([key]) => !['id', 'title', 'description'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <span className="font-medium text-gray-700">{key}: </span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
              </div>
              <div className="mt-6">
                <a href="/" className="text-blue-500 hover:underline">
                  &larr; Back to list
                </a>
              </div>
            </div>
          ) : (
            // List view
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {data.map((item) => (
                <a 
                  key={item.id} 
                  href={\`/items/\${item.id}\`}
                  className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600">{item.description}</p>
                  )}
                </a>
              ))}
            </div>
          )}
          
          {!params.id && (
            <div className="flex justify-between items-center mt-8">
              <button 
                disabled={page <= 1}
                onClick={() => window.location.href = \`?page=\${page - 1}&limit=\${limit}\`}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button 
                onClick={() => window.location.href = \`?page=\${page + 1}&limit=\${limit}\`}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}`
  } else if (language === "javascript" && (framework === "react" || framework === "nextjs")) {
    return `${commentBlock}

import React, { useState, useEffect } from 'react';

function ${getComponentName(description)}({ title = "Data Dashboard", apiEndpoint = "/api/data" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(\`\${apiEndpoint}?filter=\${activeTab}\`);
        
        if (!response.ok) {
          throw new Error(\`Error: \${response.status} \${response.statusText}\`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to fetch data");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiEndpoint, activeTab]);

  // Group data by category if it exists
  const groupedData = data.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedData);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">
          Displaying {data.length} items across {categories.length} categories
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={\`inline-block p-4 \${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }\`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
          </li>
          {categories.map(category => (
            <li key={category} className="mr-2">
              <button
                className={\`inline-block p-4 \${
                  activeTab === category
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }\`}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No data found</h3>
          <p className="mt-1 text-gray-500">Try changing your filters or check back later.</p>
        </div>
      )}

      {/* Data display */}
      {!loading && !error && data.length > 0 && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {(activeTab === 'all' ? data : groupedData[activeTab] || []).map((item, index) => (
            <div key={item.id || index} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{item.title || \`Item \${index + 1}\`}</h3>
                  {item.category && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-2 text-gray-600">{item.description}</p>
                )}
                <div className="mt-4 flex justify-end">
                  <button className="text-blue-500 hover:text-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ${getComponentName(description)};
`
  } else if (language === "python") {
    return `${commentBlock}

class DataProcessor:
    """
    A class for processing and analyzing data.
    
    This class provides methods for loading, processing, and analyzing data
    from various sources. It includes functionality for data validation,
    transformation, and basic statistical analysis.
    """
    
    def __init__(self, config=None):
        """
        Initialize the DataProcessor with optional configuration.
        
        Args:
            config (dict, optional): Configuration options for the processor.
        """
        self.config = config or {}
        self.data = None
        self.processed_data = None
        self.results = {}
        self.errors = []
        
    def load_data(self, source, **kwargs):
        """
        Load data from the specified source.
        
        Args:
            source: The data source (file path, URL, or data object)
            **kwargs: Additional arguments for the loader
            
        Returns:
            bool: True if data was loaded successfully, False otherwise
        """
        try:
            # This is a placeholder for actual data loading logic
            # In a real implementation, this would handle different data sources
            if isinstance(source, str):
                if source.endswith('.csv'):
                    self.data = self._load_csv(source, **kwargs)
                elif source.endswith('.json'):
                    self.data = self._load_json(source, **kwargs)
                else:
                    self.data = self._load_text(source, **kwargs)
            else:
                self.data = source
                
            return True
        except Exception as e:
            self.errors.append(f"Error loading data: {str(e)}")
            return False
    
    def _load_csv(self, file_path, **kwargs):
        """Load data from a CSV file"""
        # Placeholder for CSV loading logic
        print(f"Loading CSV from {file_path}")
        return [{"row": i, "data": f"Sample data {i}"} for i in range(10)]
    
    def _load_json(self, file_path, **kwargs):
        """Load data from a JSON file"""
        # Placeholder for JSON loading logic
        print(f"Loading JSON from {file_path}")
        return {"items": [{"id": i, "value": f"Sample value {i}"} for i in range(10)]}
    
    def _load_text(self, file_path, **kwargs):
        """Load data from a text file"""
        # Placeholder for text loading logic
        print(f"Loading text from {file_path}")
        return "Sample text data with multiple lines\\nLine 2\\nLine 3"
    
    def process(self, steps=None):
        """
        Process the loaded data using the specified steps.
        
        Args:
            steps (list, optional): List of processing steps to apply
            
        Returns:
            dict: Processing results
        """
        if self.data is None:
            self.errors.append("No data loaded")
            return {"error": "No data loaded"}
        
        steps = steps or self.config.get('steps', ['validate', 'transform', 'analyze'])
        
        try:
            self.processed_data = self.data
            
            for step in steps:
                if step == 'validate':
                    self._validate_data()
                elif step == 'transform':
                    self._transform_data()
                elif step == 'analyze':
                    self._analyze_data()
                else:
                    self.errors.append(f"Unknown processing step: {step}")
            
            self.results = {
                "status": "success",
                "steps_completed": steps,
                "errors": self.errors,
                "summary": self._generate_summary()
            }
            
            return self.results
        except Exception as e:
            self.errors.append(f"Error during processing: {str(e)}")
            return {"error": str(e), "status": "failed"}
    
    def _validate_data(self):
        """Validate the loaded data"""
        # Placeholder for data validation logic
        print("Validating data")
        
    def _transform_data(self):
        """Transform the data"""
        # Placeholder for data transformation logic
        print("Transforming data")
        
    def _analyze_data(self):
        """Analyze the data"""
        # Placeholder for data analysis logic
        print("Analyzing data")
        
    def _generate_summary(self):
        """Generate a summary of the processed data"""
        # Placeholder for summary generation
        if isinstance(self.processed_data, list):
            return {
                "type": "list",
                "count": len(self.processed_data),
                "sample": self.processed_data[:3] if self.processed_data else []
            }
        elif isinstance(self.processed_data, dict):
            return {
                "type": "dict",
                "keys": list(self.processed_data.keys()),
                "sample": {k: self.processed_data[k] for k in list(self.processed_data.keys())[:3]} if self.processed_data else {}
            }
        else:
            return {
                "type": str(type(self.processed_data)),
                "sample": str(self.processed_data)[:100] + "..." if len(str(self.processed_data)) > 100 else str(self.processed_data)
            }
    
    def get_results(self):
        """Get the processing results"""
        return self.results
    
    def export_results(self, output_format="json"):
        """
        Export the results in the specified format.
        
        Args:
            output_format (str): The output format (json, csv, text)
            
        Returns:
            str: The formatted results
        """
        if not self.results:
            return "No results to export"
        
        if output_format == "json":
            # Placeholder for JSON export
            return str(self.results)
        elif output_format == "csv":
            # Placeholder for CSV export
            return "id,value\\n" + "\\n".join([f"{k},{v}" for k, v in self.results.items()])
        else:
            # Placeholder for text export
            return str(self.results)


# Example usage
if __name__ == "__main__":
    # Create a processor with configuration
    processor = DataProcessor({
        "steps": ["validate", "transform", "analyze"],
        "options": {
            "validate": {"strict": True},
            "transform": {"normalize": True},
            "analyze": {"detailed": True}
        }
    })
    
    # Load and process data
    processor.load_data("example.csv")
    results = processor.process()
    
    # Print results
    print("Processing Results:")
    print(results)
    
    # Export results
    exported = processor.export_results("json")
    print("\\nExported Results:")
    print(exported)`
  } else {
    // Generic fallback for other languages
    return `${commentBlock}

// A generic utility module for ${language}${framework ? ` with ${framework}` : ""}

/**
 * Main function that processes the input data according to specified options
 * 
 * @param {Object} data - The input data to process
 * @param {Object} options - Processing options
 * @returns {Object} - The processing results
 */
function processData(data, options = {}) {
  // Default options
  const defaultOptions = {
    validate: true,
    transform: true,
    format: "json",
    includeMetadata: true
  };
  
  // Merge default options with provided options
  const config = { ...defaultOptions, ...options };
  
  // Validate input
  if (!data) {
    return {
      success: false,
      error: "No data provided",
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    // Initialize result object
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      data: null
    };
    
    // Add metadata if requested
    if (config.includeMetadata) {
      result.metadata = {
        processedAt: new Date().toISOString(),
        options: config,
        dataType: Array.isArray(data) ? "array" : typeof data
      };
    }
    
    // Validate data if requested
    if (config.validate) {
      const validationResult = validateData(data);
      if (!validationResult.valid) {
        return {
          success: false,
          error: "Validation failed",
          validationErrors: validationResult.errors,
          timestamp: new Date().toISOString()
        };
      }
      result.validationPassed = true;
    }
    
    // Transform data if requested
    if (config.transform) {
      result.data = transformData(data, config);
    } else {
      result.data = data;
    }
    
    // Format output if needed
    if (config.format === "string") {
      result.formatted = JSON.stringify(result.data, null, 2);
    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message || "An error occurred during processing",
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Validates the input data
 * 
 * @param {any} data - The data to validate
 * @returns {Object} - Validation result
 */
function validateData(data) {
  const errors = [];
  
  // Check if data is null or undefined
  if (data === null || data === undefined) {
    errors.push("Data is null or undefined");
    return { valid: false, errors };
  }
  
  // Check data type
  if (Array.isArray(data)) {
    // Validate array
    if (data.length === 0) {
      errors.push("Array is empty");
    }
    
    // Check for null items
    const nullItems = data.filter(item => item === null || item === undefined);
    if (nullItems.length > 0) {
      errors.push(\`Array contains \${nullItems.length} null or undefined items\`);
    }
  } else if (typeof data === "object") {
    // Validate object
    if (Object.keys(data).length === 0) {
      errors.push("Object has no properties");
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Transforms the data according to the configuration
 * 
 * @param {any} data - The data to transform
 * @param {Object} config - Transformation configuration
 * @returns {any} - Transformed data
 */
function transformData(data, config) {
  // Handle different data types
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === "object" && item !== null) {
        // Transform object properties
        return Object.entries(item).reduce((acc, [key, value]) => {
          // Convert keys to camelCase if needed
          const transformedKey = config.camelCase ? toCamelCase(key) : key;
          
          // Transform values based on their type
          let transformedValue = value;
          if (typeof value === "string") {
            transformedValue = config.uppercase ? value.toUpperCase() : value;
          } else if (typeof value === "number") {
            transformedValue = config.roundNumbers ? Math.round(value) : value;
          }
          
          acc[transformedKey] = transformedValue;
          return acc;
        }, {});
      }
      return item;
    });
  } else if (typeof data === "object" && data !== null) {
    // Transform object
    return Object.entries(data).reduce((acc, [key, value]) => {
      const transformedKey = config.camelCase ? toCamelCase(key) : key;
      acc[transformedKey] = value;
      return acc;
    }, {});
  }
  
  // Return original data for primitive types
  return data;
}

/**
 * Converts a string to camelCase
 * 
 * @param {string} str - The input string
 * @returns {string} - The camelCase string
 */
function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, chr => chr.toLowerCase());
}

// Example usage
const sampleData = [
  { user_id: 1, first_name: "John", last_name: "Doe", age: 28.5 },
  { user_id: 2, first_name: "Jane", last_name: "Smith", age: 32.7 }
];

const result = processData(sampleData, {
  camelCase: true,
  roundNumbers: true
});

console.log(result);

// Export functions for module usage
module.exports = {
  processData,
  validateData,
  transformData
};`
  }
}

/**
 * Generate a component name from the description
 */
function getComponentName(description: string): string {
  // Extract key words from the description
  const words = description
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  // If no words were extracted, use a default name
  if (words.length === 0) {
    return "GeneratedComponent"
  }

  // Join the words and add "Component" suffix
  return words.join("") + "Component"
}

/**
 * Generate a page name from the description
 */
function getPageName(description: string): string {
  // Extract key words from the description
  const words = description
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  // If no words were extracted, use a default name
  if (words.length === 0) {
    return "GeneratedPage"
  }

  // Join the words and add "Page" suffix
  return words.join("") + "Page"
}

export async function POST(req: Request) {
  try {
    const { description, language, framework, model, additionalContext } = await req.json()

    // Log the request for debugging
    console.log("Generating code for:", { description, language, framework })

    // Create a system message that instructs the model how to generate code
    const systemMessage = `You are an expert software engineer specializing in ${language} development.
    ${framework !== "none" ? `You are using the ${framework} framework.` : ""}
    
    Your task is to:
    1. Generate high-quality, production-ready code based on the user's description
    2. Follow best practices for ${language}${framework !== "none" ? ` and ${framework}` : ""}
    3. Include appropriate error handling, comments, and type definitions (if applicable)
    4. Ensure the code is efficient, readable, and maintainable
    
    Additional context from the user: ${additionalContext || "None provided"}
    
    Return only the code without any explanations or markdown formatting.`

    // Generate the code using Groq
    const { text } = await generateText({
      model: groq(model),
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `Please generate ${language} code${
            framework !== "none" ? ` using ${framework}` : ""
          } for: ${description}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 3000,
    })

    return NextResponse.json({
      code: text,
      model: model,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating code:", error)

    // Provide a more helpful error message
    let errorMessage = "Failed to generate code"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
