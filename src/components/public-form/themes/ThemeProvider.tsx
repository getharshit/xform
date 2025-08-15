/* eslint-disable @typescript-eslint/no-empty-object-type */
// src/components/public-form/themes/ThemeProvider.tsx - Updated with Button & Color Customization

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  Theme,
  ThemeState,
  ThemeContextValue,
  ThemeValidationResult,
  CSSCustomProperties,
} from "./types";
import { LogoConfig } from "./logos/types";
import { BackgroundConfig } from "./backgrounds/types";
import {
  themeReducer,
  initialThemeState,
  themeValidation,
  themePersistence,
  themeActions,
} from "./themeReducer";
import { cssPropertyUtils, DebouncedCSSManager } from "./cssProperties";
import { defaultTheme } from "./defaultTheme";
import { TypographyConfig } from "./typography/types";
import { ButtonCustomization } from "./buttons/types";
import { ColorPalette } from "./colors/types";
import { fontLoader } from "./typography/fontLoader";
import { typographyCSSManager } from "./typography/cssGenerator";
import { ButtonColorCSSGenerator } from "./css/buttonColorGenerator";
import { BasicFileUploadManager } from "./upload/basicFileUpload";

// Theme context
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Custom hook to use theme context
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Error boundary for theme-related errors
interface ThemeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ThemeErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ThemeErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ThemeErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Theme system error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="theme-error-boundary p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">Theme System Error</h3>
          <p className="text-red-600 text-sm mb-3">
            The theme system encountered an error. Using default theme.
          </p>
          <button
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reset Theme
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced theme provider props with typography support
interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
  persistenceKey?: string;
  enablePersistence?: boolean;
  enablePreview?: boolean;
  enableTypographySystem?: boolean;
  enableButtonCustomization?: boolean; // NEW
  enableColorManagement?: boolean; // NEW
  onThemeChange?: (theme: Theme) => void;
  onTypographyChange?: (typography: TypographyConfig) => void;
  onButtonCustomizationChange?: (buttons: ButtonCustomization) => void; // NEW
  onColorPaletteChange?: (colors: ColorPalette) => void; // NEW
  onError?: (error: string) => void;
}

// Enhanced theme provider component with button and color customization
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
  persistenceKey = "form-theme",
  enablePersistence = true,
  enablePreview = true,
  enableTypographySystem = true,
  enableButtonCustomization = true,
  enableColorManagement = true,
  onThemeChange,
  onTypographyChange,
  onButtonCustomizationChange,
  onColorPaletteChange,
  onError,
}) => {
  // State management
  const [state, dispatch] = useReducer(themeReducer, initialThemeState);

  // CSS manager with debouncing
  const cssManager = useRef<DebouncedCSSManager | null>(null);
  const isInitialized = useRef(false);

  // Initialize CSS manager
  useEffect(() => {
    cssManager.current = new DebouncedCSSManager(16); // 60fps updates
  }, []);

  // Load persisted theme on mount
  useEffect(() => {
    if (!isInitialized.current && enablePersistence) {
      try {
        const persistedTheme = themePersistence.loadTheme(persistenceKey);
        if (persistedTheme) {
          dispatch(themeActions.setTheme(persistedTheme));
        } else if (initialTheme) {
          dispatch(themeActions.setTheme(initialTheme));
        }
      } catch (error) {
        console.error("Failed to load persisted theme:", error);
        onError?.("Failed to load saved theme");
        if (initialTheme) {
          dispatch(themeActions.setTheme(initialTheme));
        }
      }
      isInitialized.current = true;
    }
  }, [enablePersistence, persistenceKey, initialTheme, onError]);

  // Apply CSS properties when theme changes
  useEffect(() => {
    const activeTheme =
      state.previewMode && state.previewTheme
        ? state.previewTheme
        : state.currentTheme;

    if (cssManager.current && activeTheme) {
      try {
        const cssProperties = cssPropertyUtils.themeToCSS(activeTheme);
        cssManager.current.applyProperties(cssProperties);

        // Apply typography CSS if advanced typography is enabled
        if (enableTypographySystem && activeTheme.advancedTypography) {
          typographyCSSManager.applyConfiguration(
            activeTheme.advancedTypography
          );
        }

        // Apply button customization CSS if enabled
        if (
          enableButtonCustomization &&
          activeTheme.buttonCustomization &&
          activeTheme.colorPalette
        ) {
          ButtonColorCSSGenerator.injectCSS(
            activeTheme.buttonCustomization,
            activeTheme.colorPalette
          );
        }

        // Notify parent of changes
        onThemeChange?.(activeTheme);
        if (activeTheme.advancedTypography) {
          onTypographyChange?.(activeTheme.advancedTypography);
        }
        if (activeTheme.buttonCustomization) {
          onButtonCustomizationChange?.(activeTheme.buttonCustomization);
        }
        if (activeTheme.colorPalette) {
          onColorPaletteChange?.(activeTheme.colorPalette);
        }
      } catch (error) {
        console.error("Failed to apply theme CSS:", error);
        onError?.("Failed to apply theme styles");
      }
    }
  }, [
    state.currentTheme,
    state.previewMode,
    state.previewTheme,
    enableTypographySystem,
    enableButtonCustomization,
    enableColorManagement,
    onThemeChange,
    onTypographyChange,
    onButtonCustomizationChange,
    onColorPaletteChange,
    onError,
  ]);

  // Handle font loading when typography changes
  useEffect(() => {
    if (!enableTypographySystem || !state.currentTheme.advancedTypography) {
      return;
    }

    const { primary, secondary, mono, performance } =
      state.currentTheme.advancedTypography;

    if (performance.preloadFonts) {
      const fontsToLoad = [primary, secondary, mono].filter(
        (font) => font.googleFont
      );

      if (fontsToLoad.length > 0) {
        dispatch(themeActions.setTypographyLoading(true));

        // Load fonts and track their states
        fontsToLoad.forEach(async (font) => {
          try {
            dispatch(themeActions.setFontLoadingState(font.family, "loading"));
            await fontLoader.loadFont(font);
            dispatch(themeActions.setFontLoadingState(font.family, "loaded"));
          } catch (error) {
            console.error(`Failed to load font ${font.family}:`, error);
            dispatch(themeActions.setFontLoadingState(font.family, "error"));
          }
        });

        // Wait for all fonts or timeout
        Promise.allSettled(
          fontsToLoad.map((font) => fontLoader.loadFont(font))
        ).finally(() => {
          dispatch(themeActions.setTypographyLoading(false));
        });
      }
    }
  }, [enableTypographySystem, state.currentTheme.advancedTypography]);

  // Save theme when it changes (debounced)
  const saveThemeToStorage = useCallback(
    (theme: Theme) => {
      if (!enablePersistence) return;

      try {
        themePersistence.saveTheme(theme, persistenceKey);
      } catch (error) {
        console.error("Failed to save theme:", error);
        onError?.("Failed to save theme");
      }
    },
    [enablePersistence, persistenceKey, onError]
  );

  // Debounced save effect
  useEffect(() => {
    if (state.hasUnsavedChanges && !state.previewMode) {
      const timeoutId = setTimeout(() => {
        saveThemeToStorage(state.currentTheme);
        dispatch(themeActions.saveTheme());
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    state.hasUnsavedChanges,
    state.previewMode,
    state.currentTheme,
    saveThemeToStorage,
  ]);

  // Theme management functions
  const setTheme = useCallback(
    (theme: Theme) => {
      const validation = themeValidation.validateTheme(theme);
      if (!validation.isValid) {
        const errorMessage = `Invalid theme: ${validation.errors
          .map((e) => e.message)
          .join(", ")}`;
        dispatch(themeActions.setError(errorMessage));
        onError?.(errorMessage);
        return;
      }

      dispatch(themeActions.setTheme(theme));
    },
    [onError]
  );

  const updateTheme = useCallback(
    (updates: Partial<Theme>) => {
      const updatedTheme = { ...state.currentTheme, ...updates };
      const validation = themeValidation.validateTheme(updatedTheme);

      if (!validation.isValid) {
        const errorMessage = `Invalid theme update: ${validation.errors
          .map((e) => e.message)
          .join(", ")}`;
        dispatch(themeActions.setError(errorMessage));
        onError?.(errorMessage);
        return;
      }

      dispatch(themeActions.updateTheme(updates));
    },
    [state.currentTheme, onError]
  );

  // Typography management functions
  const updateTypography = useCallback(
    (updates: Partial<TypographyConfig>) => {
      if (!enableTypographySystem) {
        console.warn("Typography system is disabled");
        return;
      }

      const currentTypography = state.currentTheme.advancedTypography;
      if (!currentTypography) {
        console.warn("No advanced typography configuration found");
        return;
      }

      const updatedTypography = { ...currentTypography, ...updates };

      // Validate typography updates
      try {
        dispatch(themeActions.updateTypography(updatedTypography));
      } catch (error) {
        const errorMessage = `Failed to update typography: ${error}`;
        dispatch(themeActions.setError(errorMessage));
        onError?.(errorMessage);
      }
    },
    [enableTypographySystem, state.currentTheme.advancedTypography, onError]
  );

  const resetTypography = useCallback(() => {
    if (!enableTypographySystem) return;

    const defaultTypography = defaultTheme.advancedTypography;
    if (defaultTypography) {
      updateTypography(defaultTypography);
    }
  }, [enableTypographySystem, updateTypography]);

  // NEW: Button customization management functions
  const updateButtonCustomization = useCallback(
    (updates: Partial<ButtonCustomization>) => {
      if (!enableButtonCustomization) {
        console.warn("Button customization is disabled");
        return;
      }

      try {
        dispatch(themeActions.updateButtonCustomization(updates));
      } catch (error) {
        const errorMessage = `Failed to update button customization: ${error}`;
        dispatch(themeActions.setError(errorMessage));
        onError?.(errorMessage);
      }
    },
    [enableButtonCustomization, onError]
  );

  const resetButtonCustomization = useCallback(() => {
    if (!enableButtonCustomization) return;

    const defaultButtonCustomization: ButtonCustomization = {
      variant: "filled",
      size: "medium",
      borderRadius: 8,
      borderWidth: 1,
      paddingMultiplier: 1,
      fontWeight: 500,
      hoverScale: 1.02,
      transitionDuration: 200,
      minHeight: 44,
      focusRingWidth: 2,
      hoverOpacity: 0.9,
      activeOpacity: 0.95,
      disabledOpacity: 0.5,
    };

    updateButtonCustomization(defaultButtonCustomization);
  }, [enableButtonCustomization, updateButtonCustomization]);

  // NEW: Color palette management functions
  const updateColorPalette = useCallback(
    (updates: Partial<ColorPalette>) => {
      if (!enableColorManagement) {
        console.warn("Color management is disabled");
        return;
      }

      try {
        dispatch(themeActions.updateColorPalette(updates));
      } catch (error) {
        const errorMessage = `Failed to update color palette: ${error}`;
        dispatch(themeActions.setError(errorMessage));
        onError?.(errorMessage);
      }
    },
    [enableColorManagement, onError]
  );

  const resetColorPalette = useCallback(() => {
    if (!enableColorManagement) return;

    const defaultColorPalette: ColorPalette = {
      primary: "#3B82F6",
      secondary: "#6B7280",
      tertiary: "#E5E7EB",
      textPrimary: "#111827",
      textSecondary: "#6B7280",
      textTertiary: "#9CA3AF",
      textInverse: "#FFFFFF",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      surfaceElevated: "#FFFFFF",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
      focus: "#3B82F6",
      selection: "rgba(59, 130, 246, 0.1)",
      overlay: "rgba(0, 0, 0, 0.5)",
    };

    updateColorPalette(defaultColorPalette);
  }, [enableColorManagement, updateColorPalette]);

  const resetTheme = useCallback(() => {
    dispatch(themeActions.resetTheme());
    if (enablePersistence) {
      themePersistence.removeTheme(persistenceKey);
    }
  }, [enablePersistence, persistenceKey]);

  // Preview mode functions
  const enablePreviewMode = useCallback(
    (theme: Theme) => {
      if (!enablePreview) return;

      const validation = themeValidation.validateTheme(theme);
      if (!validation.isValid) {
        const errorMessage = `Invalid preview theme: ${validation.errors
          .map((e) => e.message)
          .join(", ")}`;
        onError?.(errorMessage);
        return;
      }

      dispatch(themeActions.setPreviewTheme(theme));
      dispatch(themeActions.setPreviewMode(true));
    },
    [enablePreview, onError]
  );

  const disablePreviewMode = useCallback(() => {
    dispatch(themeActions.setPreviewMode(false));
    dispatch(themeActions.setPreviewTheme(null));
  }, []);

  const commitPreview = useCallback(() => {
    if (state.previewTheme) {
      dispatch(themeActions.setTheme(state.previewTheme));
      dispatch(themeActions.setPreviewMode(false));
      dispatch(themeActions.setPreviewTheme(null));
    }
  }, [state.previewTheme]);

  // Persistence functions
  const saveTheme = useCallback(async () => {
    if (!enablePersistence) return;

    dispatch(themeActions.setLoading(true));
    try {
      saveThemeToStorage(state.currentTheme);
      dispatch(themeActions.saveTheme());
    } catch (error) {
      const errorMessage = "Failed to save theme";
      dispatch(themeActions.setError(errorMessage));
      onError?.(errorMessage);
    } finally {
      dispatch(themeActions.setLoading(false));
    }
  }, [enablePersistence, state.currentTheme, saveThemeToStorage, onError]);

  const loadTheme = useCallback(
    async (themeId: string) => {
      if (!enablePersistence) return;

      dispatch(themeActions.setLoading(true));
      try {
        const theme = themePersistence.loadThemeById(themeId);
        if (theme) {
          dispatch(themeActions.setTheme(theme));
        } else {
          throw new Error(`Theme with ID "${themeId}" not found`);
        }
      } catch (error) {
        const errorMessage = `Failed to load theme: ${error}`;
        dispatch(themeActions.setError(errorMessage));
        onError?.(errorMessage);
      } finally {
        dispatch(themeActions.setLoading(false));
      }
    },
    [enablePersistence, onError]
  );

  // Utility functions
  const validateTheme = useCallback(
    (theme: Partial<Theme>): ThemeValidationResult => {
      return themeValidation.validateTheme(theme);
    },
    []
  );

  const generateCSSProperties = useCallback(
    (theme: Theme): CSSCustomProperties => {
      return cssPropertyUtils.themeToCSS(theme);
    },
    []
  );

  const clearError = useCallback(() => {
    dispatch(themeActions.setError(null));
  }, []);

  const uploadLogo = useCallback(
    async (file: File) => {
      try {
        const logoFile = await BasicFileUploadManager.uploadLogo(file);

        // Create complete LogoConfig object
        const logoConfig: LogoConfig = {
          enabled: true,
          file: logoFile,
          display: {
            position: "header-left",
            alignment: "left",
            size: "md",
            opacity: 1,
            padding: { top: 8, right: 8, bottom: 8, left: 8 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
          },
          responsive: {
            mobile: { enabled: true },
            tablet: { enabled: true },
            desktop: { enabled: true },
            breakpoints: { mobile: 768, tablet: 1024, desktop: 1200 },
          },
          accessibility: {
            altText: logoFile.fileName || "Logo",
            focusable: true,
          },
          performance: {
            lazy: false,
            preload: true,
            optimizeForRetina: true,
            showPlaceholder: false,
          },
        };

        updateTheme({ logoConfig });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : "Unknown error";
        dispatch(themeActions.setError(`Logo upload failed: ${message}`));
      }
    },
    [updateTheme]
  );

  const uploadBackground = useCallback(
    async (file: File) => {
      try {
        const imageConfig = await BasicFileUploadManager.uploadBackgroundImage(
          file
        );

        // Create complete BackgroundConfig object
        const backgroundConfig: BackgroundConfig = {
          type: "image",
          image: imageConfig,
          accessibility: {
            contrastRatio: 4.5,
            isReadable: true,
            wcagLevel: "AA",
          },
          performance: {
            isOptimized: false,
            fileSize: imageConfig.fileSize,
          },
        };

        updateTheme({ backgroundConfig });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : "Unknown error";
        dispatch(themeActions.setError(`background upload failed: ${message}`));
      }
    },
    [updateTheme]
  );
  // Enhanced context value with button and color customization support
  const contextValue: ThemeContextValue = useMemo(
    () => ({
      // Current state
      state,

      // Theme management
      setTheme,
      updateTheme,
      resetTheme,

      // Typography management
      updateTypography,
      resetTypography,

      // Button customization management (NEW)
      updateButtonCustomization,
      resetButtonCustomization,

      // Color palette management (NEW)
      updateColorPalette,
      resetColorPalette,

      // Preview mode
      enablePreviewMode,
      disablePreviewMode,
      commitPreview,

      //logo & background
      uploadLogo,
      uploadBackground,

      // Persistence
      saveTheme,
      loadTheme,

      // Utilities
      validateTheme,
      generateCSSProperties,

      // Error handling
      clearError,
    }),
    [
      state,
      setTheme,
      updateTheme,
      resetTheme,
      updateTypography,
      resetTypography,
      updateButtonCustomization,
      resetButtonCustomization,
      updateColorPalette,
      resetColorPalette,
      enablePreviewMode,
      disablePreviewMode,
      commitPreview,
      saveTheme,
      loadTheme,
      validateTheme,
      generateCSSProperties,
      clearError,
      uploadLogo,
      uploadBackground,
    ]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cssManager.current) {
        cssManager.current.flush();
      }
      // Cleanup typography CSS if enabled
      if (enableTypographySystem) {
        typographyCSSManager.reset();
      }
    };
  }, [enableTypographySystem]);

  return (
    <ThemeErrorBoundary>
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    </ThemeErrorBoundary>
  );
};

// Enhanced higher-order component for theme injection with button and color support
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: Theme }>
) => {
  const WithThemeComponent = (props: P) => {
    const { state } = useTheme();
    const activeTheme =
      state.previewMode && state.previewTheme
        ? state.previewTheme
        : state.currentTheme;

    return <Component {...props} theme={activeTheme} />;
  };

  WithThemeComponent.displayName = `withTheme(${
    Component.displayName || Component.name
  })`;
  return WithThemeComponent;
};

// Hook for accessing current theme
export const useCurrentTheme = (): Theme => {
  const { state } = useTheme();
  return state.previewMode && state.previewTheme
    ? state.previewTheme
    : state.currentTheme;
};

// Enhanced hook for theme updates with validation
export const useThemeUpdates = () => {
  const { updateTheme, validateTheme, state } = useTheme();

  const updateWithValidation = useCallback(
    (updates: Partial<Theme>) => {
      const mergedTheme = { ...state.currentTheme, ...updates };
      const validation = validateTheme(mergedTheme);

      if (validation.isValid) {
        updateTheme(updates);
        return { success: true, errors: [] };
      } else {
        return { success: false, errors: validation.errors };
      }
    },
    [updateTheme, validateTheme, state.currentTheme]
  );

  return {
    updateTheme: updateWithValidation,
    hasUnsavedChanges: state.hasUnsavedChanges,
    isLoading: state.isLoading,
    error: state.error,
  };
};

// Typography management hook
export const useTypographyUpdates = () => {
  const { state, updateTypography } = useTheme();

  const currentTypography = state.currentTheme.advancedTypography;
  const isLoading = state.typographyLoading;
  const fontLoadingStates = state.fontLoadingStates;

  const updateTypographyWithValidation = useCallback(
    (updates: Partial<TypographyConfig>) => {
      try {
        updateTypography(updates);
        return { success: true, errors: [] };
      } catch (error) {
        return {
          success: false,
          errors: [
            {
              field: "typography",
              message: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    },
    [updateTypography]
  );

  const getFontLoadingState = useCallback(
    (fontFamily: string) => {
      return fontLoadingStates.get(fontFamily) || "loaded";
    },
    [fontLoadingStates]
  );

  const hasLoadingFonts = useMemo(() => {
    return Array.from(fontLoadingStates.values()).some(
      (state) => state === "loading"
    );
  }, [fontLoadingStates]);

  return {
    currentTypography,
    updateTypography: updateTypographyWithValidation,
    isLoading,
    fontLoadingStates,
    getFontLoadingState,
    hasLoadingFonts,
    hasUnsavedChanges: state.hasUnsavedChanges,
    error: state.error,
  };
};

export const useButtonCustomization = () => {
  const { state, updateButtonCustomization, resetButtonCustomization } =
    useTheme();

  const currentButtonCustomization = state.currentTheme.buttonCustomization;

  const updateWithValidation = useCallback(
    (updates: Partial<ButtonCustomization>) => {
      try {
        updateButtonCustomization(updates);
        return { success: true, errors: [] };
      } catch (error) {
        return {
          success: false,
          errors: [
            {
              field: "buttonCustomization",
              message: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    },
    [updateButtonCustomization]
  );

  return {
    currentButtonCustomization,
    updateButtonCustomization: updateWithValidation,
    resetButtonCustomization,
    hasUnsavedChanges: state.hasUnsavedChanges,
    error: state.error,
  };
};

// NEW: Color palette management hook
export const useColorPalette = () => {
  const { state, updateColorPalette, resetColorPalette } = useTheme();

  const currentColorPalette = state.currentTheme.colorPalette;

  const updateWithValidation = useCallback(
    (updates: Partial<ColorPalette>) => {
      try {
        updateColorPalette(updates);
        return { success: true, errors: [] };
      } catch (error) {
        return {
          success: false,
          errors: [
            {
              field: "colorPalette",
              message: error instanceof Error ? error.message : "Unknown error",
            },
          ],
        };
      }
    },
    [updateColorPalette]
  );

  return {
    currentColorPalette,
    updateColorPalette: updateWithValidation,
    resetColorPalette,
    hasUnsavedChanges: state.hasUnsavedChanges,
    error: state.error,
  };
};

// Hook for preview mode
export const useThemePreview = () => {
  const { state, enablePreviewMode, disablePreviewMode, commitPreview } =
    useTheme();

  return {
    isPreviewMode: state.previewMode,
    previewTheme: state.previewTheme,
    enablePreview: enablePreviewMode,
    disablePreview: disablePreviewMode,
    commitPreview,
  };
};

// Hook for CSS properties
export const useCSSProperties = (): CSSCustomProperties => {
  const theme = useCurrentTheme();
  return useMemo(() => cssPropertyUtils.themeToCSS(theme), [theme]);
};

// Enhanced hook for responsive design with theme breakpoints
export const useThemeBreakpoints = () => {
  const theme = useCurrentTheme();

  return useMemo(
    () => ({
      breakpoints: theme.breakpoints,
      isMobile:
        typeof window !== "undefined"
          ? window.matchMedia(`(max-width: ${theme.breakpoints.sm})`).matches
          : false,
      isTablet:
        typeof window !== "undefined"
          ? window.matchMedia(
              `(min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.lg})`
            ).matches
          : false,
      isDesktop:
        typeof window !== "undefined"
          ? window.matchMedia(`(min-width: ${theme.breakpoints.lg})`).matches
          : false,
    }),
    [theme.breakpoints]
  );
};

// Typography-specific utilities hook
export const useTypographyUtils = () => {
  const theme = useCurrentTheme();
  const { state } = useTheme();

  const getElementStyles = useCallback(
    (elementType: string) => {
      if (!theme.advancedTypography) return {};

      // Return CSS custom properties for the element type
      return {
        fontFamily: `var(--form-font-primary)`,
        fontSize: `var(--form-font-size-${elementType
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()})`,
        fontWeight: `var(--form-font-weight-${elementType
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()})`,
        lineHeight: `var(--form-line-height-${elementType
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()})`,
        letterSpacing: `var(--form-letter-spacing-${elementType
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()})`,
      };
    },
    [theme.advancedTypography]
  );

  const isTypographyLoaded = useMemo(() => {
    if (!theme.advancedTypography) return true;

    const fonts = [
      theme.advancedTypography.primary,
      theme.advancedTypography.secondary,
      theme.advancedTypography.mono,
    ].filter((font) => font.googleFont);

    if (fonts.length === 0) return true;

    return fonts.every(
      (font) => state.fontLoadingStates.get(font.family) === "loaded"
    );
  }, [theme.advancedTypography, state.fontLoadingStates]);

  return {
    getElementStyles,
    isTypographyLoaded,
    hasAdvancedTypography: !!theme.advancedTypography,
    currentScale: theme.advancedTypography?.scale || "medium",
  };
};

// Performance monitoring hook with new features
export const useThemePerformance = () => {
  const performanceRef = useRef({
    themeChanges: 0,
    typographyChanges: 0,
    buttonChanges: 0, // NEW
    colorChanges: 0, // NEW
    fontLoads: 0,
    lastChangeTime: Date.now(),
    averageChangeTime: 0,
  });

  const { state } = useTheme();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastChange = now - performanceRef.current.lastChangeTime;

    performanceRef.current.themeChanges++;
    performanceRef.current.averageChangeTime =
      (performanceRef.current.averageChangeTime + timeSinceLastChange) / 2;
    performanceRef.current.lastChangeTime = now;

    // Log performance warning if theme changes are too frequent
    if (timeSinceLastChange < 16) {
      // Less than one frame at 60fps
      console.warn(
        "Theme changes are happening too frequently, consider debouncing"
      );
    }
  }, [state.currentTheme, state.previewTheme]);
};
