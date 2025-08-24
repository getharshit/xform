// Field Editor Types
import { FormField } from '@/types'

export interface FieldEditorProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onDelete: () => void
}

export interface PropertyInputProps {
  label: string
  value: any
  onChange: (value: any) => void
  description?: string
  required?: boolean
}
