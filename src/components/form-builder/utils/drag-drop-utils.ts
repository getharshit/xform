// Drag and drop utilities
import { DragItem, DropResult } from '../types/drag-drop'
import { FormField } from '@/types/form'

export const canDropItem = (item: DragItem, targetIndex: number, fields: FormField[]): boolean => {
  // Prevent dropping on itself
  if (item.type === 'EXISTING_FIELD') {
    return item.index !== targetIndex && item.index !== targetIndex - 1
  }
  
  return true
}

export const calculateDropIndex = (
  dropZoneIndex: number,
  draggedItem: DragItem,
  fields: FormField[]
): number => {
  if (draggedItem.type === 'EXISTING_FIELD') {
    // Account for removing the dragged item
    return draggedItem.index < dropZoneIndex ? dropZoneIndex - 1 : dropZoneIndex
  }
  
  return dropZoneIndex
}

export const reorderFields = (
  fields: FormField[],
  fromIndex: number,
  toIndex: number
): FormField[] => {
  const result = Array.from(fields)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}
