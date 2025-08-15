// NEW comprehensive state management system
export { BuilderProvider, useBuilder } from './BuilderProvider'
export type { 
  BuilderState, 
  BuilderAction, 
  BuilderContextValue,
  UIPreferences,
  AutoSaveState,
  HistoryState,
  LoadingState
} from './types'

// Legacy provider (backward compatibility)
export { FormBuilderProvider, useFormBuilder } from './FormBuilderProvider'
export type { FormBuilderState, FormBuilderAction } from './FormBuilderProvider'

// Reducer and utilities
export { builderReducer } from './builderReducer'