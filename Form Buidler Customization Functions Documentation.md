# Customization Functions Documentation for SDE Integration

## Overview

The FormBuilder now includes specialized functions for handling theme and customization changes with optimized save strategies. These functions provide instant UI feedback while preventing server overload through intelligent debouncing.

## Available Customization Functions

### Core Functions

```typescript
const {
  updateTheme,           // Basic theme properties
  updateCustomization,   // Advanced customization
  updateColors,          // Color-specific updates  
  updateTypography,      // Typography updates
  updateSpacing,         // Spacing/layout updates
  applyThemePreset       // Complete theme application
} = useBuilder();
```

## Function Reference

### 1. updateTheme()
**Purpose**: Update basic theme properties (legacy compatibility)
**Save Strategy**: 1.5s debounced database save + instant localStorage

```typescript
updateTheme(themeUpdates: Partial<FormTheme>): void

// Example Usage:
updateTheme({
  primaryColor: '#3B82F6',
  fontFamily: 'Inter, sans-serif',
  borderRadius: 8
});
```

### 2. updateCustomization()
**Purpose**: Update advanced customization properties
**Save Strategy**: 1.5s debounced database save + instant localStorage

```typescript
updateCustomization(customizationUpdates: Partial<FormCustomization>): void

// Example Usage:
updateCustomization({
  colors: { primary: '#3B82F6', secondary: '#6B7280' },
  typography: { fontSize: { title: 24, body: 16 } }
});
```

### 3. updateColors()
**Purpose**: Update color properties specifically (most frequent changes)
**Save Strategy**: Optimized for color pickers - heavy debouncing

```typescript
updateColors(colorUpdates: Record<string, string>): void

// Example Usage:
updateColors({
  primary: '#3B82F6',
  secondary: '#6B7280',
  background: '#FFFFFF',
  text: '#1F2937'
});
```

### 4. updateTypography()
**Purpose**: Update typography-related properties
**Save Strategy**: 1.5s debounced for font sliders/pickers

```typescript
updateTypography(typographyUpdates: Record<string, any>): void

// Example Usage:
updateTypography({
  fontFamily: 'Roboto, sans-serif',
  fontSize: { title: 28, body: 16 },
  fontWeight: { normal: 400, bold: 700 },
  lineHeight: { normal: 1.5, tight: 1.2 }
});
```

### 5. updateSpacing()
**Purpose**: Update spacing/layout properties
**Save Strategy**: 1.5s debounced for spacing controls

```typescript
updateSpacing(spacingUpdates: Record<string, number>): void

// Example Usage:
updateSpacing({
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
});
```

### 6. applyThemePreset()
**Purpose**: Apply complete theme presets immediately
**Save Strategy**: Immediate database save (user expects instant application)

```typescript
applyThemePreset(themePreset: Partial<FormTheme & FormCustomization>): Promise<void>

// Example Usage:
await applyThemePreset({
  // Theme properties
  primaryColor: '#3B82F6',
  fontFamily: 'Inter',
  
  // Customization properties
  colors: { primary: '#3B82F6', secondary: '#6B7280' },
  typography: { fontSize: { title: 24 } },
  spacing: { md: 16 }
});
```

## Data Structure Reference

### FormTheme (Basic Theme)
```typescript
interface FormTheme {
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  fontFamily: string;
  fontSize?: {
    title?: number;
    question?: number;
    input?: number;
    small?: number;
  };
  fontWeight?: {
    normal?: number;
    medium?: number;
    bold?: number;
  };
  borderRadius?: number;
  spacing?: number;
  shadowLevel?: 'none' | 'sm' | 'md' | 'lg';
  buttonStyle?: 'rounded' | 'square' | 'pill';
  inputStyle?: 'outlined' | 'filled' | 'underline';
  showQuestionNumbers?: boolean;
  showProgressBar?: boolean;
  centerForm?: boolean;
  logoUrl?: string;
}
```

### FormCustomization (Advanced)
```typescript
interface FormCustomization {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    error?: string;
    success?: string;
    warning?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: Record<string, number>;
    fontWeight?: Record<string, number>;
    lineHeight?: Record<string, number>;
  };
  spacing?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  borders?: {
    radius?: number;
    width?: number;
  };
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  buttons?: Record<string, any>;
  inputs?: Record<string, any>;
  layout?: Record<string, any>;
  animations?: Record<string, any>;
  branding?: Record<string, any>;
}
```

## Implementation Patterns

### Pattern 1: Color Picker Integration
```typescript
// For continuous color changes (sliders, pickers)
const ColorPicker = ({ colorKey, currentColor }) => {
  const { updateColors } = useBuilder();

  const handleColorChange = (newColor: string) => {
    // This triggers instant UI update + debounced save
    updateColors({ [colorKey]: newColor });
  };

  return (
    <input 
      type="color" 
      value={currentColor}
      onChange={(e) => handleColorChange(e.target.value)}
    />
  );
};
```

### Pattern 2: Typography Controls
```typescript
// For font family selectors
const FontSelector = ({ currentFont }) => {
  const { updateTypography } = useBuilder();

  const handleFontChange = (fontFamily: string) => {
    updateTypography({ fontFamily });
  };

  return (
    <select onChange={(e) => handleFontChange(e.target.value)}>
      <option value="Inter">Inter</option>
      <option value="Roboto">Roboto</option>
      <option value="Open Sans">Open Sans</option>
    </select>
  );
};
```

### Pattern 3: Spacing Controls
```typescript
// For spacing sliders/inputs
const SpacingControl = ({ spacingKey, currentValue }) => {
  const { updateSpacing } = useBuilder();

  const handleSpacingChange = (value: number) => {
    updateSpacing({ [spacingKey]: value });
  };

  return (
    <input
      type="range"
      min="0"
      max="64"
      value={currentValue}
      onChange={(e) => handleSpacingChange(Number(e.target.value))}
    />
  );
};
```

### Pattern 4: Theme Preset Application
```typescript
// For theme preset buttons/cards
const ThemePresetCard = ({ preset }) => {
  const { applyThemePreset } = useBuilder();

  const handleApplyPreset = async () => {
    try {
      await applyThemePreset(preset);
      toast.success('Theme applied successfully!');
    } catch (error) {
      toast.error('Failed to apply theme');
    }
  };

  return (
    <button onClick={handleApplyPreset}>
      Apply {preset.name}
    </button>
  );
};
```

### Pattern 5: Bulk Updates
```typescript
// For complex customization panels
const CustomizationPanel = () => {
  const { updateCustomization } = useBuilder();

  const handleBulkUpdate = () => {
    // Update multiple properties at once
    updateCustomization({
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280'
      },
      typography: {
        fontSize: { title: 24, body: 16 }
      },
      spacing: {
        md: 16,
        lg: 24
      }
    });
  };

  return <button onClick={handleBulkUpdate}>Apply Changes</button>;
};
```

## Performance Considerations

### Save Strategy Timing
- **updateColors()**: Optimized for rapid changes (color pickers)
- **updateTypography()**: Balanced for font controls
- **updateSpacing()**: Balanced for spacing controls
- **applyThemePreset()**: Immediate save for user expectation

### Best Practices
1. **Use specific functions**: Use `updateColors()` for colors, not `updateCustomization()`
2. **Batch related changes**: Use `updateCustomization()` for multiple property types
3. **Theme presets**: Use `applyThemePreset()` for complete theme switches
4. **Avoid over-calling**: Functions are already optimized, don't add additional debouncing

### State Management
- All functions provide **instant UI feedback** via localStorage
- Database saves are **automatically debounced** to prevent server overload
- **Conflict detection** prevents unnecessary API calls
- **Error handling** is built-in with console logging

## Error Handling

### Built-in Protection
- Null safety checks for all functions
- Automatic conflict detection
- Server error handling with fallbacks
- Console logging for debugging

### Usage in Components
```typescript
const CustomizationComponent = () => {
  const { updateColors } = useBuilder();
  
  const handleChange = (color: string) => {
    try {
      updateColors({ primary: color });
      // Function handles all error cases internally
    } catch (error) {
      // Additional error handling if needed
      console.error('Customization update failed:', error);
    }
  };
};
```

## Integration Checklist

### Before Implementation
- ✅ Ensure FormTheme and FormCustomization types are imported
- ✅ Verify database schema supports customization (already confirmed)
- ✅ Test basic updateColors() function with a simple color picker

### During Implementation
- ✅ Use appropriate function for each customization type
- ✅ Test save performance with rapid changes
- ✅ Verify UI feedback is immediate
- ✅ Check console logs for save operations

### After Implementation
- ✅ Test theme preset application
- ✅ Verify no database overload with rapid changes
- ✅ Confirm localStorage backup is working
- ✅ Test form customization persistence

## Examples for Common UI Components

### Complete Color Panel
```typescript
const ColorPanel = () => {
  const { updateColors, state } = useBuilder();
  const colors = state.form?.customization?.colors || {};

  return (
    <div className="color-panel">
      <div>
        <label>Primary Color</label>
        <input 
          type="color" 
          value={colors.primary || '#3B82F6'}
          onChange={(e) => updateColors({ primary: e.target.value })}
        />
      </div>
      <div>
        <label>Secondary Color</label>
        <input 
          type="color" 
          value={colors.secondary || '#6B7280'}
          onChange={(e) => updateColors({ secondary: e.target.value })}
        />
      </div>
    </div>
  );
};
```

### Typography Panel
```typescript
const TypographyPanel = () => {
  const { updateTypography, state } = useBuilder();
  const typography = state.form?.customization?.typography || {};

  return (
    <div className="typography-panel">
      <select 
        value={typography.fontFamily || 'Inter'}
        onChange={(e) => updateTypography({ fontFamily: e.target.value })}
      >
        <option value="Inter">Inter</option>
        <option value="Roboto">Roboto</option>
      </select>
      
      <input
        type="range"
        min="12"
        max="32"
        value={typography.fontSize?.title || 24}
        onChange={(e) => updateTypography({ 
          fontSize: { ...typography.fontSize, title: Number(e.target.value) }
        })}
      />
    </div>
  );
};
```

This documentation provides everything needed to implement customization UI components that work efficiently with the enhanced save system.