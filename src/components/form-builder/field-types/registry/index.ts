// src/components/form-builder/field-types/registry/index.ts

export {
  FIELD_TYPE_REGISTRY,
  getFieldConfig,
  getFieldPropertySchema,
  getFieldDefaultValues,
  getAllFieldTypes,
  getFieldsByCategory,
  type FieldPropertySchema,
  type FieldTypeConfig,
} from './fieldRegistry';

export { PropertyRenderer } from '../shared/PropertyRenderer';
export { DynamicFieldProperties } from '../../panels/right-panel/DynamicFieldProperties';
export { OptionsManager } from '../choice-fields/OptionsManager';