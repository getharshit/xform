// src/components/form-builder/utils/storage.ts

import { Form } from '@/types'

export interface StorageData {
  timestamp: number
  data: any
  version: string
}

export interface BuilderStorageData {
  form: Form | null
  uiPreferences: {
    leftPanelCollapsed: boolean
    rightPanelCollapsed: boolean
    leftPanelWidth: number
    rightPanelWidth: number
    activePanelTab: 'field' | 'form'
    builderStep: 'build' | 'design' | 'integrate' | 'share'
    previewMode: boolean
    viewportMode: 'desktop' | 'tablet' | 'mobile'
  }
  selectedFieldId: string | null
  lastSaved: number
}

const STORAGE_VERSION = '1.0.0'
const STORAGE_KEYS = {
  BUILDER_STATE: 'form-builder-state',
  AUTO_SAVE: 'form-builder-autosave',
  UI_PREFERENCES: 'form-builder-ui-prefs',
  FORM_HISTORY: 'form-builder-history'
} as const

class StorageManager {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  private createStorageData<T>(data: T): StorageData {
    return {
      timestamp: Date.now(),
      data,
      version: STORAGE_VERSION
    }
  }

  private parseStorageData<T>(stored: string | null): T | null {
    if (!stored) return null

    try {
      const parsed: StorageData = JSON.parse(stored)
      
      // Version compatibility check
      if (parsed.version !== STORAGE_VERSION) {
        console.warn(`Storage version mismatch. Expected ${STORAGE_VERSION}, got ${parsed.version}`)
        return null
      }

      return parsed.data as T
    } catch (error) {
      console.error('Failed to parse storage data:', error)
      return null
    }
  }

  // Generic storage methods
  setItem<T>(key: string, data: T): boolean {
    if (!this.isAvailable()) return false

    try {
      const storageData = this.createStorageData(data)
      localStorage.setItem(key, JSON.stringify(storageData))
      return true
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      return false
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isAvailable()) return null

    const stored = localStorage.getItem(key)
    return this.parseStorageData<T>(stored)
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
      return false
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) return false

    try {
      // Only clear form builder related items
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  // Builder-specific methods
  saveBuilderState(state: BuilderStorageData): boolean {
    return this.setItem(STORAGE_KEYS.BUILDER_STATE, state)
  }

  loadBuilderState(): BuilderStorageData | null {
    return this.getItem<BuilderStorageData>(STORAGE_KEYS.BUILDER_STATE)
  }

  saveAutoSaveData(form: Form, fieldId: string | null = null): boolean {
    const autoSaveData = {
      form,
      selectedFieldId: fieldId,
      timestamp: Date.now()
    }
    return this.setItem(STORAGE_KEYS.AUTO_SAVE, autoSaveData)
  }

  loadAutoSaveData(): { form: Form; selectedFieldId: string | null; timestamp: number } | null {
    return this.getItem(STORAGE_KEYS.AUTO_SAVE)
  }

  saveUIPreferences(preferences: BuilderStorageData['uiPreferences']): boolean {
    return this.setItem(STORAGE_KEYS.UI_PREFERENCES, preferences)
  }

  loadUIPreferences(): BuilderStorageData['uiPreferences'] | null {
    return this.getItem(STORAGE_KEYS.UI_PREFERENCES)
  }

  // Form history for undo/redo (last 50 actions)
  saveFormHistory(history: Form[], currentIndex: number): boolean {
    const historyData = {
      history: history.slice(-50), // Keep only last 50
      currentIndex: Math.min(currentIndex, 49) // Adjust index if truncated
    }
    return this.setItem(STORAGE_KEYS.FORM_HISTORY, historyData)
  }

  loadFormHistory(): { history: Form[]; currentIndex: number } | null {
    return this.getItem(STORAGE_KEYS.FORM_HISTORY)
  }

  // Utility methods
  getStorageInfo(): {
    isAvailable: boolean
    usedSpace: number
    totalSpace: number
    keys: string[]
  } {
    if (!this.isAvailable()) {
      return {
        isAvailable: false,
        usedSpace: 0,
        totalSpace: 0,
        keys: []
      }
    }

    const keys = Object.values(STORAGE_KEYS).filter(key => 
      localStorage.getItem(key) !== null
    )

    let usedSpace = 0
    keys.forEach(key => {
      const value = localStorage.getItem(key)
      if (value) {
        usedSpace += new Blob([value]).size
      }
    })

    return {
      isAvailable: true,
      usedSpace,
      totalSpace: 5 * 1024 * 1024, // 5MB typical limit
      keys
    }
  }

  // Check if auto-save data exists and is recent
  hasRecentAutoSave(maxAgeMinutes: number = 30): boolean {
    const autoSave = this.loadAutoSaveData()
    if (!autoSave) return false

    const ageInMinutes = (Date.now() - autoSave.timestamp) / (1000 * 60)
    return ageInMinutes <= maxAgeMinutes
  }

  // Clean up old data
  cleanup(): void {
    const info = this.getStorageInfo()
    if (!info.isAvailable) return

    // Remove auto-save data older than 24 hours
    const autoSave = this.loadAutoSaveData()
    if (autoSave) {
      const ageInHours = (Date.now() - autoSave.timestamp) / (1000 * 60 * 60)
      if (ageInHours > 24) {
        this.removeItem(STORAGE_KEYS.AUTO_SAVE)
      }
    }

    // Truncate history if it's too large
    const history = this.loadFormHistory()
    if (history && history.history.length > 50) {
      this.saveFormHistory(history.history, history.currentIndex)
    }
  }
}

// Export singleton instance
export const storage = new StorageManager()

// Export constants for external use
export { STORAGE_KEYS }

// Utility functions
export const isStorageAvailable = (): boolean => {
  return storage['isAvailable']()
}

export const getStorageUsage = (): string => {
  const info = storage.getStorageInfo()
  if (!info.isAvailable) return 'Storage not available'
  
  const usedMB = (info.usedSpace / (1024 * 1024)).toFixed(2)
  const totalMB = (info.totalSpace / (1024 * 1024)).toFixed(2)
  
  return `${usedMB}MB / ${totalMB}MB used`
}