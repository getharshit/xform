// src/components/form-builder/types/drag-drop.ts

import { FormField } from '@/types'
import { FieldTemplate } from './builder'

// Drag item types
export type DragItemType = 'FIELD_TEMPLATE' | 'EXISTING_FIELD'

// Base drag item interface
export interface BaseDragItem {
  type: DragItemType
  id: string
}

// Field template being dragged from palette
export interface FieldTemplateDragItem extends BaseDragItem {
  type: 'FIELD_TEMPLATE'
  fieldTemplate: FieldTemplate
}

// Existing field being reordered
export interface ExistingFieldDragItem extends BaseDragItem {
  type: 'EXISTING_FIELD'
  field: FormField
  index: number
}

// Union type for all drag items
export type DragItem = FieldTemplateDragItem | ExistingFieldDragItem

// Drop zones
export interface DropZone {
  id: string
  type: 'FIELD_DROP' | 'REORDER_DROP'
  index: number
  accepts: DragItemType[]
  isActive: boolean
  isOver: boolean
}

// Drop result
export interface DropResult {
  dropZoneId: string
  index: number
  item: DragItem
}

// Drag and drop context
export interface DragDropContextValue {
  // Current drag state
  isDragging: boolean
  draggedItem: DragItem | null
  
  // Drop zones
  dropZones: DropZone[]
  activeDropZone: string | null
  
  // Handlers
  onDragStart: (item: DragItem) => void
  onDragEnd: () => void
  onDrop: (result: DropResult) => void
  
  // Drop zone management
  registerDropZone: (zone: DropZone) => void
  unregisterDropZone: (zoneId: string) => void
  setActiveDropZone: (zoneId: string | null) => void
}