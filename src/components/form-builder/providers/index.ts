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


// Reducer and utilities
export { builderReducer } from './builderReducer'