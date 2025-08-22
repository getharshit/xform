// Validation utilities
import { Form, FormField } from '@/types'

export const validateForm = (form: Form): string[] => {
  const errors: string[] = []
  
  if (!form.title?.trim()) {
    errors.push('Form title is required')
  }
  
  if (!form.fields || form.fields.length === 0) {
    errors.push('Form must have at least one field')
  }
  
  return errors
}

export const validateFormFields = (fields: FormField[]): string[] => {
  const errors: string[] = []
  const fieldIds = new Set<string>()
  
  fields.forEach((field, index) => {
    // Check for duplicate IDs
    if (fieldIds.has(field.id)) {
      errors.push(`Duplicate field ID: ${field.id}`)
    }
    fieldIds.add(field.id)
    
    // Validate individual field
    const fieldErrors = validateField(field)
    fieldErrors.forEach(error => {
      errors.push(`Field "${field.label}": ${error}`)
    })
  })
  
  return errors
}

const validateField = (field: FormField): string[] => {
  // Implementation from field-utils.ts
  return []
}
