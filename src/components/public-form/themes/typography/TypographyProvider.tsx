// src/components/public-form/themes/typography/TypographyProvider.tsx

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  TypographyConfig,
  FontFamilyConfig,
  TypographyValidationResult,
  FontLoadingState,
} from "./types";
import { fontLoader, FontLoader } from "./fontLoader";
import {
  typographyCSSManager,
  TypographyCSSManager,
  defaultFormTypographyMapping,
} from "./cssGenerator";
import { typographyScales } from "./scales";
import { TypographyValidator } from "./scales";
import { systemFonts, defaultFonts } from "./fontPresets";

// Typography context
interface TypographyContextValue {
  // Current configuration
  config: TypographyConfig;

  // Font loading state
  fontLoadingStates: FontLoadingState[];
  isLoadingFonts: boolean;

  // Configuration updates
  updateConfig: (updates: Partial<TypographyConfig>) => void;
  updateFontFamily: (
    type: "primary" | "secondary" | "mono",
    font: FontFamilyConfig
  ) => void;
  updateScale: (scale: "small" | "medium" | "large") => void;

  // Font management
  loadFont: (font: FontFamilyConfig) => Promise<FontLoadingState>;
  preloadFonts: (fonts: FontFamilyConfig[]) => Promise<void>;

  // Validation
  validateConfig: () => TypographyValidationResult;

  // Utilities
  resetToDefaults: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => boolean;
}

const TypographyContext = createContext<TypographyContextValue | null>(null);

export const useTypography = () => {
  const context = useContext(TypographyContext);
  if (!context) {
    throw new Error("useTypography must be used within a TypographyProvider");
  }
  return context;
};

// Default typography configuration
const createDefaultTypographyConfig = (): TypographyConfig => ({
  scale: "medium",
  primary: defaultFonts.primary,
  secondary: defaultFonts.secondary,
  mono: defaultFonts.mono,
  mapping: defaultFormTypographyMapping,
  responsive: {
    enableScaling: true,
    breakpoints: {
      sm: 0.875,
      md: 1.0,
      lg: 1.125,
    },
  },
  accessibility: {
    enforceMinSize: true,
    minBodySize: 16,
    maxLineLength: 75,
    contrastRatio: 4.5,
  },
  performance: {
    preloadFonts: true,
    fontDisplay: "swap",
    loadTimeout: 3000,
  },
});

interface TypographyProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<TypographyConfig>;
  onConfigChange?: (config: TypographyConfig) => void;
  enablePersistence?: boolean;
}

export const TypographyProvider: React.FC<TypographyProviderProps> = ({
  children,
  initialConfig,
  onConfigChange,
  enablePersistence = true,
}) => {
  const [config, setConfig] = useState<TypographyConfig>(() => {
    const defaultConfig = createDefaultTypographyConfig();
    return { ...defaultConfig, ...initialConfig };
  });

  const [fontLoadingStates, setFontLoadingStates] = useState<
    FontLoadingState[]
  >([]);
  const [isLoadingFonts, setIsLoadingFonts] = useState(false);

  // Load persisted configuration on mount
  useEffect(() => {
    if (enablePersistence) {
      const saved = loadPersistedConfig();
      if (saved) {
        setConfig(saved);
      }
    }
  }, [enablePersistence]);

  // Apply configuration changes to CSS
  useEffect(() => {
    typographyCSSManager.applyConfiguration(config);
    onConfigChange?.(config);

    if (enablePersistence) {
      persistConfig(config);
    }
  }, [config, onConfigChange, enablePersistence]);

  // Subscribe to font loading updates
  useEffect(() => {
    const unsubscribe = fontLoader.subscribe((state) => {
      setFontLoadingStates((prev) => {
        const filtered = prev.filter((s) => s.family !== state.family);
        return [...filtered, state];
      });
    });

    return unsubscribe;
  }, []);

  // Load fonts when configuration changes
  useEffect(() => {
    const fontsToLoad = [config.primary, config.secondary, config.mono].filter(
      (font) => font.googleFont
    ); // Only load Google Fonts

    if (fontsToLoad.length > 0 && config.performance.preloadFonts) {
      setIsLoadingFonts(true);
      fontLoader.preloadFonts(fontsToLoad).finally(() => {
        setIsLoadingFonts(false);
      });
    }
  }, [
    config.primary,
    config.secondary,
    config.mono,
    config.performance.preloadFonts,
  ]);

  // Configuration update functions
  const updateConfig = useCallback((updates: Partial<TypographyConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateFontFamily = useCallback(
    (type: "primary" | "secondary" | "mono", font: FontFamilyConfig) => {
      setConfig((prev) => ({ ...prev, [type]: font }));
    },
    []
  );

  const updateScale = useCallback((scale: "small" | "medium" | "large") => {
    setConfig((prev) => ({
      ...prev,
      scale,
      customScale: typographyScales[scale],
    }));
  }, []);

  // Font management functions
  const loadFont = useCallback(
    async (font: FontFamilyConfig): Promise<FontLoadingState> => {
      return fontLoader.loadFont(font);
    },
    []
  );

  const preloadFonts = useCallback(
    async (fonts: FontFamilyConfig[]): Promise<void> => {
      setIsLoadingFonts(true);
      try {
        await fontLoader.preloadFonts(fonts);
      } finally {
        setIsLoadingFonts(false);
      }
    },
    []
  );

  // Validation
  const validateConfig = useCallback((): TypographyValidationResult => {
    const scale = config.customScale || typographyScales[config.scale];
    const scaleValidation = TypographyValidator.validateScale(scale);

    const errors = [...scaleValidation.errors];
    const warnings = [...scaleValidation.warnings];

    // Additional validations
    if (config.accessibility.minBodySize < 14) {
      errors.push({
        type: "accessibility",
        field: "accessibility.minBodySize",
        message: "Minimum body size should be at least 14px for accessibility",
      });
    }

    if (config.accessibility.contrastRatio < 3.0) {
      warnings.push({
        type: "accessibility",
        field: "accessibility.contrastRatio",
        message: "Contrast ratio below 3.0 may not meet WCAG guidelines",
      });
    }

    return {
      isValid: errors.length === 0,
      errors, // ADD THIS
      warnings,
    };
  }, [config]);

  // Utility functions
  const resetToDefaults = useCallback(() => {
    setConfig(createDefaultTypographyConfig());
  }, []);

  const exportConfig = useCallback((): string => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const importConfig = useCallback((configJson: string): boolean => {
    try {
      const imported = JSON.parse(configJson);
      // Basic validation
      if (imported && typeof imported === "object") {
        setConfig({ ...createDefaultTypographyConfig(), ...imported });
        return true;
      }
    } catch (error) {
      console.error("Failed to import typography config:", error);
    }
    return false;
  }, []);

  // Context value
  const contextValue = useMemo(
    (): TypographyContextValue => ({
      config,
      fontLoadingStates,
      isLoadingFonts,
      updateConfig,
      updateFontFamily,
      updateScale,
      loadFont,
      preloadFonts,
      validateConfig,
      resetToDefaults,
      exportConfig,
      importConfig,
    }),
    [
      config,
      fontLoadingStates,
      isLoadingFonts,
      updateConfig,
      updateFontFamily,
      updateScale,
      loadFont,
      preloadFonts,
      validateConfig,
      resetToDefaults,
      exportConfig,
      importConfig,
    ]
  );

  return (
    <TypographyContext.Provider value={contextValue}>
      {children}
    </TypographyContext.Provider>
  );
};

// Helper functions for persistence
function persistConfig(config: TypographyConfig): void {
  try {
    localStorage.setItem("form-typography-config", JSON.stringify(config));
  } catch (error) {
    console.error("Failed to persist typography config:", error);
  }
}

function loadPersistedConfig(): TypographyConfig | null {
  try {
    const saved = localStorage.getItem("form-typography-config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...createDefaultTypographyConfig(), ...parsed };
    }
  } catch (error) {
    console.error("Failed to load persisted typography config:", error);
  }
  return null;
}

// Hooks for specific typography features
export const useFontLoader = () => {
  const { loadFont, preloadFonts, fontLoadingStates, isLoadingFonts } =
    useTypography();

  const getFontState = useCallback(
    (font: FontFamilyConfig) => {
      return fontLoadingStates.find((state) => state.family === font.family);
    },
    [fontLoadingStates]
  );

  const isFontLoaded = useCallback(
    (font: FontFamilyConfig) => {
      const state = getFontState(font);
      return state?.status === "loaded";
    },
    [getFontState]
  );

  return {
    loadFont,
    preloadFonts,
    fontLoadingStates,
    isLoadingFonts,
    getFontState,
    isFontLoaded,
  };
};

export const useTypographyScale = () => {
  const { config, updateScale } = useTypography();

  const currentScale = useMemo(() => {
    return config.customScale || typographyScales[config.scale];
  }, [config]);

  return {
    currentScale,
    scaleType: config.scale,
    updateScale,
    availableScales: Object.keys(typographyScales) as (
      | "small"
      | "medium"
      | "large"
    )[],
  };
};

export const useTypographyValidation = () => {
  const { validateConfig } = useTypography();

  const [validationResult, setValidationResult] =
    useState<TypographyValidationResult>({
      isValid: true,
      errors: [],
      warnings: [],
    });

  useEffect(() => {
    setValidationResult(validateConfig());
  }, [validateConfig]);

  return validationResult;
};

// HOC for typography-aware components
export const withTypography = <P extends object>(
  Component: React.ComponentType<P & { typography: TypographyConfig }>
) => {
  const WithTypographyComponent = (props: P) => {
    const { config } = useTypography();
    return <Component {...props} typography={config} />;
  };

  WithTypographyComponent.displayName = `withTypography(${
    Component.displayName || Component.name
  })`;
  return WithTypographyComponent;
};
