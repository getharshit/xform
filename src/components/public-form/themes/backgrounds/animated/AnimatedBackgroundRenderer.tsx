import React from "react";
import { AnimatedBackgroundConfig } from "../types";
import Aurora from "./Aurora";
import DarkVeil from "./DarkVeil";
import LightRays from "./LightRays";

interface AnimatedBackgroundRendererProps {
  config: AnimatedBackgroundConfig;
  className?: string;
}

export const AnimatedBackgroundRenderer: React.FC<
  AnimatedBackgroundRendererProps
> = ({ config, className = "" }) => {
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  };

  const renderAnimatedBackground = () => {
    switch (config.type) {
      case "aurora":
        return (
          <Aurora
            colorStops={
              config.aurora?.colorStops || ["#5227FF", "#7cff67", "#5227FF"]
            }
            amplitude={config.aurora?.amplitude || 1.0}
            blend={config.aurora?.blend || 0.5}
            speed={config.aurora?.speed || 1.0}
          />
        );

      case "darkVeil":
        return (
          <DarkVeil
            hueShift={config.darkVeil?.hueShift || 0}
            noiseIntensity={config.darkVeil?.noiseIntensity || 0}
            scanlineIntensity={config.darkVeil?.scanlineIntensity || 0}
            speed={config.darkVeil?.speed || 0.5}
            scanlineFrequency={config.darkVeil?.scanlineFrequency || 0}
            warpAmount={config.darkVeil?.warpAmount || 0}
          />
        );

      case "lightRays":
        return (
          <LightRays
            raysOrigin={config.lightRays?.raysOrigin || "top-center"}
            raysColor={config.lightRays?.raysColor || "#ffffff"}
            raysSpeed={config.lightRays?.raysSpeed || 1}
            lightSpread={config.lightRays?.lightSpread || 1}
            rayLength={config.lightRays?.rayLength || 2}
            pulsating={config.lightRays?.pulsating || false}
            fadeDistance={config.lightRays?.fadeDistance || 1.0}
            saturation={config.lightRays?.saturation || 1.0}
            followMouse={config.lightRays?.followMouse || true}
            mouseInfluence={config.lightRays?.mouseInfluence || 0.1}
            noiseAmount={config.lightRays?.noiseAmount || 0.0}
            distortion={config.lightRays?.distortion || 0.0}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={containerStyle} className={className}>
      {renderAnimatedBackground()}
    </div>
  );
};

export default AnimatedBackgroundRenderer;
