// src/components/public-form/themes/upload/basicFileUpload.ts

import { LogoFile } from '../logos/types';
import { ImageConfig } from '../backgrounds/types';

/**
 * Basic File Upload Manager
 * Simple file handling for logos and background images
 */
export class BasicFileUploadManager {
  /**
   * Upload and process logo file
   */
  static async uploadLogo(file: File): Promise<LogoFile> {
    // Basic validation
    this.validateLogoFile(file);
    
    // Get image dimensions
    const dimensions = await this.getImageDimensions(file);
    
    // Convert to data URL
    const dataUrl = await this.fileToDataUrl(file);
    
    // Create LogoFile object
    const logoFile: LogoFile = {
      id: this.generateId(),
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      format: this.getLogoFormat(file.type),
      url: dataUrl,
      dataUrl: dataUrl,
      dimensions: {
        width: dimensions.width,
        height: dimensions.height,
        aspectRatio: dimensions.width / dimensions.height,
      },
      isOptimized: false,
      uploadedAt: new Date(),
      isValid: true,
    };

    return logoFile;
  }

  /**
   * Upload and process background image
   */
  static async uploadBackgroundImage(file: File): Promise<ImageConfig> {
    // Basic validation
    this.validateBackgroundFile(file);
    
    // Convert to data URL
    const dataUrl = await this.fileToDataUrl(file);
    
    // Create ImageConfig object
    const imageConfig: ImageConfig = {
      url: dataUrl,
      fileName: file.name,
      fileSize: file.size,
      position: 'center',
      size: 'cover',
      repeat: 'no-repeat',
      opacity: 1,
      focalPoint: {
        x: 50,
        y: 50,
      },
    };

    return imageConfig;
  }

  /**
   * Basic logo file validation
   */
  private static validateLogoFile(file: File): void {
    const errors: string[] = [];

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${this.formatFileSize(maxSize)}`);
    }

    // Check file type
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be SVG, PNG, JPEG, or WebP format');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('. '));
    }
  }

  /**
   * Basic background file validation
   */
  private static validateBackgroundFile(file: File): void {
    const errors: string[] = [];

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${this.formatFileSize(maxSize)}`);
    }

    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be PNG, JPEG, WebP, or GIF format');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('. '));
    }
  }

  /**
   * Get image dimensions
   */
  private static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        URL.revokeObjectURL(img.src);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert file to data URL
   */
  private static async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get logo format from MIME type
   */
  private static getLogoFormat(mimeType: string): 'svg' | 'png' | 'jpg' | 'webp' {
    const formatMap: Record<string, 'svg' | 'png' | 'jpg' | 'webp'> = {
      'image/svg+xml': 'svg',
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/webp': 'webp',
    };
    
    return formatMap[mimeType] || 'png';
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format file size for display
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if file is valid image
   */
  static isValidImageFile(file: File, type: 'logo' | 'background'): boolean {
    try {
      if (type === 'logo') {
        this.validateLogoFile(file);
      } else {
        this.validateBackgroundFile(file);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file validation errors
   */
  static getValidationErrors(file: File, type: 'logo' | 'background'): string[] {
    try {
      if (type === 'logo') {
        this.validateLogoFile(file);
      } else {
        this.validateBackgroundFile(file);
      }
      return [];
    } catch (error) {
      return [error instanceof Error ? error.message : 'Invalid file'];
    }
  }
}

/**
 * Simple File Upload Hook for React components
 */
export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  file: File | null;
  result: LogoFile | ImageConfig | null;
}

export class SimpleFileUploader {
  private state: FileUploadState = {
    isUploading: false,
    progress: 0,
    error: null,
    file: null,
    result: null,
  };

  private listeners: ((state: FileUploadState) => void)[] = [];

  /**
   * Add state change listener
   */
  onStateChange(callback: (state: FileUploadState) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<FileUploadState>): void {
    this.state = { ...this.state, ...updates };
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Upload logo file
   */
  async uploadLogo(file: File): Promise<LogoFile> {
    this.updateState({
      isUploading: true,
      progress: 0,
      error: null,
      file,
      result: null,
    });

    try {
      // Simulate progress
      this.updateState({ progress: 25 });
      
      // Process file
      const result = await BasicFileUploadManager.uploadLogo(file);
      
      this.updateState({ 
        progress: 100,
        isUploading: false,
        result,
      });

      return result;

    } catch (error) {
      this.updateState({
        isUploading: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        progress: 0,
      });
      throw error;
    }
  }

  /**
   * Upload background image
   */
  async uploadBackgroundImage(file: File): Promise<ImageConfig> {
    this.updateState({
      isUploading: true,
      progress: 0,
      error: null,
      file,
      result: null,
    });

    try {
      // Simulate progress
      this.updateState({ progress: 25 });
      
      // Process file
      const result = await BasicFileUploadManager.uploadBackgroundImage(file);
      
      this.updateState({ 
        progress: 100,
        isUploading: false,
        result,
      });

      return result;

    } catch (error) {
      this.updateState({
        isUploading: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        progress: 0,
      });
      throw error;
    }
  }

  /**
   * Reset upload state
   */
  reset(): void {
    this.updateState({
      isUploading: false,
      progress: 0,
      error: null,
      file: null,
      result: null,
    });
  }

  /**
   * Get current state
   */
  getState(): FileUploadState {
    return { ...this.state };
  }
}

/**
 * Utility functions for file handling
 */
export class FileUtils {
  /**
   * Create file input element
   */
  static createFileInput(
    accept: string,
    multiple: boolean = false
  ): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';
    return input;
  }

  /**
   * Trigger file selection
   */
  static selectFile(
    type: 'logo' | 'background',
    onSelect: (file: File) => void,
    onError: (error: string) => void
  ): void {
    const accept = type === 'logo' 
      ? 'image/svg+xml,image/png,image/jpeg,image/webp'
      : 'image/png,image/jpeg,image/webp,image/gif';
    
    const input = this.createFileInput(accept);
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file
      const errors = BasicFileUploadManager.getValidationErrors(file, type);
      if (errors.length > 0) {
        onError(errors[0]);
        return;
      }

      onSelect(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  /**
   * Setup drag and drop zone
   */
  static setupDropZone(
    element: HTMLElement,
    type: 'logo' | 'background',
    onDrop: (file: File) => void,
    onError: (error: string) => void
  ): () => void {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.add('drag-over');
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('drag-over');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('drag-over');

      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      const file = files[0];

      // Validate file
      const errors = BasicFileUploadManager.getValidationErrors(file, type);
      if (errors.length > 0) {
        onError(errors[0]);
        return;
      }

      onDrop(file);
    };

    // Add event listeners
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    // Return cleanup function
    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
      element.classList.remove('drag-over');
    };
  }

  /**
   * Get file type icon
   */
  static getFileTypeIcon(mimeType: string): string {
    if (mimeType.startsWith('image/svg')) return '🎨';
    if (mimeType.startsWith('image/png')) return '🖼️';
    if (mimeType.startsWith('image/jpeg')) return '📷';
    if (mimeType.startsWith('image/webp')) return '🌐';
    if (mimeType.startsWith('image/gif')) return '🎞️';
    return '📄';
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get recommended formats for different use cases
   */
  static getRecommendedFormats(type: 'logo' | 'background'): {
    primary: string[];
    description: string;
  } {
    if (type === 'logo') {
      return {
        primary: ['SVG', 'PNG'],
        description: 'SVG is best for scalability, PNG for images with transparency',
      };
    }

    return {
      primary: ['JPEG', 'WebP'],
      description: 'JPEG for photos, WebP for better compression',
    };
  }
}