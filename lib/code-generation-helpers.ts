/**
 * Generate a component name from a description
 * @param description The description to generate a name from
 * @returns A PascalCase component name
 */
export function generateComponentName(description: string): string {
  // Extract key words from the description
  const words = description
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !["the", "and", "for", "with"].includes(word.toLowerCase()))
    .slice(0, 3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  // If no words were extracted, use a default name
  if (words.length === 0) {
    return "GeneratedComponent"
  }

  // Join the words and add "Component" suffix if not already present
  const baseName = words.join("")
  return baseName.endsWith("Component") ? baseName : baseName + "Component"
}

/**
 * Generate a function name from a description
 * @param description The description to generate a name from
 * @returns A camelCase function name
 */
export function generateFunctionName(description: string): string {
  // Extract key words from the description
  const words = description
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !["the", "and", "for", "with"].includes(word.toLowerCase()))
    .slice(0, 3)

  // If no words were extracted, use a default name
  if (words.length === 0) {
    return "processData"
  }

  // Join the words in camelCase
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
  )
}
