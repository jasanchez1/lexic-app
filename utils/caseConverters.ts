// utils/caseConverters.ts

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item))
  }

  return Object.keys(obj).reduce((acc: any, key: string) => {
    // Convert key from snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

    // Apply recursively to values
    acc[camelKey] = snakeToCamel(obj[key])

    return acc
  }, {})
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item))
  }

  return Object.keys(obj).reduce((acc: any, key: string) => {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`)

    // Apply recursively to values
    acc[snakeKey] = camelToSnake(obj[key])

    return acc
  }, {})
}

/**
 * Type-safe conversion from snake_case API response to camelCase model
 */
export function mapApiResponseToModel<T>(apiResponse: any): T {
  return snakeToCamel(apiResponse) as T
}

/**
 * Type-safe conversion from camelCase model to snake_case API request
 */
export function mapModelToApiRequest<T>(model: any): T {
  return camelToSnake(model) as T
}
