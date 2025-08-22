// src/types/renderer.ts
import type { ExtendedForm } from './index';

// Renderer props interface
export interface PublicFormRendererProps {
  form: ExtendedForm;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onFieldChange?: (fieldId: string, value: any) => void;
  onStepChange?: (step: number) => void;
  initialData?: Record<string, any>;
  readonly?: boolean;
  showValidation?: boolean;
}

// Form question props
export interface FormQuestionProps {
  field: ExtendedForm['fields'][0];
  questionNumber?: number;
  showQuestionNumber?: boolean;
  showValidation?: boolean;
  className?: string;
}