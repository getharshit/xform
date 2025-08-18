// src/components/form-builder/steps/design/tabs/colors/colorHarmonyUtils.ts

// Color conversion utilities
export const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

export const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Calculate contrast ratio for WCAG compliance
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ].map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Generate WCAG AA compliant text color
export const getAccessibleTextColor = (backgroundColor: string): string => {
  const contrastWithWhite = getContrastRatio(backgroundColor, "#ffffff");
  const contrastWithBlack = getContrastRatio(backgroundColor, "#000000");

  return contrastWithWhite >= 4.5 ? "#ffffff" : "#000000";
};

// Enhanced color harmony generators with improved variety and dark mode support
export const generateColorHarmonies = (primaryHex: string) => {
  const [h, s, l] = hexToHsl(primaryHex);

  const lightHarmonies = [
    {
      name: "Vibrant Monochromatic",
      type: "monochromatic",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex(h, Math.max(s - 40, 15), Math.min(l + 25, 85)),
        background: hslToHex(h, Math.max(s - 70, 3), 97),
        text: hslToHex(h, Math.min(s + 20, 70), 15),
        accent: hslToHex(h, Math.min(s + 30, 90), Math.max(l - 35, 25)),
        border: hslToHex(h, Math.max(s - 50, 8), 88),
      },
    },
    {
      name: "Warm Analogous",
      type: "analogous",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex((h + 45) % 360, Math.max(s - 15, 40), Math.min(l + 10, 80)),
        background: "#FFFBF7",
        text: "#2D1B0E",
        accent: hslToHex((h - 20 + 360) % 360, Math.min(s + 25, 85), Math.max(l - 15, 35)),
        border: hslToHex((h + 30) % 360, Math.max(s - 60, 5), 92),
      },
    },
    {
      name: "Cool Analogous", 
      type: "analogous",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex((h - 45 + 360) % 360, Math.max(s - 15, 40), Math.min(l + 10, 80)),
        background: "#F7FBFF",
        text: "#0E1B2D",
        accent: hslToHex((h + 20) % 360, Math.min(s + 25, 85), Math.max(l - 15, 35)),
        border: hslToHex((h - 30 + 360) % 360, Math.max(s - 60, 5), 92),
      },
    },
    {
      name: "Bold Complementary",
      type: "complementary", 
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex((h + 180) % 360, Math.max(s - 10, 45), Math.min(l + 20, 75)),
        background: "#FFFFFF",
        text: "#1A1A1A",
        accent: hslToHex((h + 180) % 360, Math.min(s + 20, 90), Math.max(l - 20, 30)),
        border: hslToHex(h, Math.max(s - 55, 5), 90),
      },
    },
    {
      name: "Dynamic Triadic",
      type: "triadic",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex((h + 120) % 360, Math.max(s - 10, 45), Math.min(l + 15, 80)),
        background: "#FEFEFE", 
        text: "#212121",
        accent: hslToHex((h + 240) % 360, Math.min(s + 15, 85), Math.max(l - 10, 35)),
        border: hslToHex((h + 60) % 360, Math.max(s - 50, 10), 90),
      },
    },
    {
      name: "Split Complement",
      type: "split-complementary",
      isDark: false,
      colors: {
        primary: primaryHex,
        secondary: hslToHex((h + 150) % 360, Math.max(s - 15, 35), Math.min(l + 18, 78)),
        background: "#FDFDFD",
        text: "#1D1D1D", 
        accent: hslToHex((h + 210) % 360, Math.min(s + 20, 80), Math.max(l - 12, 32)),
        border: hslToHex((h + 180) % 360, Math.max(s - 60, 8), 89),
      },
    },
  ];

  // Generate dark variants for each harmony
  const darkHarmonies = lightHarmonies.map(harmony => ({
    ...harmony,
    name: `${harmony.name} Dark`,
    type: `${harmony.type}-dark`,
    isDark: true,
    colors: {
      // Keep primary and accent similar but adjust for dark theme
      primary: harmony.colors.primary,
      secondary: adjustColorForDarkTheme(harmony.colors.secondary),
      background: generateDarkBackground(h, s),
      text: generateDarkText(),
      accent: adjustAccentForDarkTheme(harmony.colors.accent),
      border: generateDarkBorder(h, s),
    },
  }));

  // Combine light and dark harmonies
  const allHarmonies = [...lightHarmonies, ...darkHarmonies];

  // Enhanced filtering for better variety and accessibility
  return allHarmonies
    .filter((harmony) => {
      const bgContrast = getContrastRatio(harmony.colors.text, harmony.colors.background);
      const primaryContrast = getContrastRatio("#ffffff", harmony.colors.primary);
      const accentContrast = getContrastRatio(
        harmony.isDark ? "#ffffff" : "#000000", 
        harmony.colors.accent
      );
      
      return bgContrast >= 4.5 && primaryContrast >= 3.0 && accentContrast >= 3.0;
    })
    .slice(0, 12); // Return more variety (6 light + 6 dark variants)
};

// Helper functions for dark theme generation
const adjustColorForDarkTheme = (lightColor: string): string => {
  const [h, s, l] = hexToHsl(lightColor);
  // Make colors lighter and more vibrant for dark theme
  return hslToHex(h, Math.min(s + 20, 90), Math.min(l + 30, 80));
};

const adjustAccentForDarkTheme = (lightAccent: string): string => {
  const [h, s, l] = hexToHsl(lightAccent);
  // Make accent colors more vibrant and lighter for dark theme
  return hslToHex(h, Math.min(s + 30, 95), Math.min(l + 40, 85));
};

const generateDarkBackground = (primaryH: number, primaryS: number): string => {
  // Generate dark backgrounds with subtle primary color influence
  return hslToHex(primaryH, Math.max(primaryS - 80, 5), 8);
};

const generateDarkText = (): string => {
  return "#F5F5F5"; // Light text for dark backgrounds
};

const generateDarkBorder = (primaryH: number, primaryS: number): string => {
  // Generate borders that work well in dark theme
  return hslToHex(primaryH, Math.max(primaryS - 60, 10), 25);
};

// Color usage descriptions for tooltips
export const getColorUsage = (colorKey: string): string => {
  const usageMap: Record<string, string> = {
    primary: "Primary buttons, links, main brand color",
    secondary: "Secondary buttons, subtle accents",
    background: "Form background, page background", 
    text: "Main text color, headings",
    accent: "Highlights, success states, call-to-action",
    border: "Input borders, dividers, separators"
  };
  return usageMap[colorKey] || "Color usage";
};