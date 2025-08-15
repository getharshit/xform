// Main exports
export { FormBuilderLayout } from './layout/FormBuilderLayout'

// State Management - NEW comprehensive provider system
export { BuilderProvider, useBuilder } from './providers/BuilderProvider'
export type { BuilderState, BuilderAction, BuilderContextValue } from './providers/types'

// Legacy Provider (for backward compatibility)
export { FormBuilderProvider, useFormBuilder } from './providers/FormBuilderProvider'
export type { FormBuilderState, FormBuilderAction } from './providers/FormBuilderProvider'

// Panel exports
export { LeftPanel } from './panels/left-panel/LeftPanel'
export { CenterPanel } from './panels/center-panel/CenterPanel'
export { RightPanel } from './panels/right-panel/RightPanel'

// Field editors
export { ShortTextEditor } from './field-types/text-fields/ShortTextEditor'
export { MultipleChoiceEditor } from './field-types/choice-fields/MultipleChoiceEditor'
export { NumberRatingEditor } from './field-types/rating-fields/NumberRatingEditor'

// Floating elements
export { FloatingAddQuestionToolbar } from './floating-elements/FloatingAddQuestionToolbar'

// Utilities
export { storage, isStorageAvailable, getStorageUsage } from './utils/storage'
export { FIELD_TEMPLATES, getTemplateByType, createFieldFromTemplate } from './utils/field-templates'