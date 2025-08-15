// Field manipulation utilities
import { FormField } from '@/types/form'

export const duplicateField = (field: FormField, existingFields: FormField[]): FormField => {
  const existingIds = existingFields.map(f => f.id)
  let counter = 1
  let newId = `${field.id}-copy`
  
  while (existingIds.includes(newId)) {
    newId = `${field.id}-copy-${counter}`
    counter++
  }
  
  return {
    ...field,
    id: newId,
    label: `${field.label} (Copy)`
  }
}

export const validateField = (field: FormField): string[] => {
  const errors: string[] = []
  
  if (!field.label?.trim()) {
    errors.push('Field label is required')
  }
  
  if (field.type === 'multipleChoice' || field.type === 'dropdown') {
    if (!field.options || field.options.length === 0) {
      errors.push('Choice fields must have at least one option')
    }
  }
  
  if (field.type === 'numberRating') {
    if (!field.maxRating || field.maxRating < 1) {
      errors.push('Rating fields must have a valid maximum rating')
    }
  }
  
  return errors
}
