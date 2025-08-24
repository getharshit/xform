"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExtendedFormField } from "@/types";
import { useFormContext } from "../../providers/FormProvider";
import { Play, Clock, Users, Shield, ArrowRight } from "lucide-react";

interface StartingPageFieldProps {
  field: ExtendedFormField;
  onStart?: () => void;
  className?: string;
}

export const StartingPageField: React.FC<StartingPageFieldProps> = ({
  field,
  onStart,
  className = "",
}) => {
  const { form, totalSteps } = useFormContext();

  const handleStart = () => {
    onStart?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleStart();
    }
  };

  // Extract metadata from field configuration with safe access
  const estimatedTime = field.displayOptions?.estimatedTime || "5 minutes";
  const participantCount = field.displayOptions?.participantCount;
  const features = field.displayOptions?.features || [];

  // Safe access to nested theme properties with fallbacks
  const logoUrl =
    (form.theme as any)?.logoUrl ||
    (form.customization as any)?.branding?.logo?.url ||
    null;

  // Safe access to primary color with fallback
  const primaryColor =
    (form.customization as any)?.colors?.primary ||
    (form.theme as any)?.primaryColor ||
    "#3B82F6"; // Default blue color

  return (
    <div
      className={`starting-page-field  ${className}`}
      style={{
        background: `linear-gradient(135deg, var(--form-color-primary-background, #EFF6FF) 0%, var(--form-background-color, #FFFFFF) 50%, var(--form-color-primary-light, #DBEAFE) 100%)`,
      }}
    >
      {/* MOBILE-OPTIMIZED: Responsive container with mobile-first padding */}
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6 sm:space-y-8 w-full"
        >
          {/* Logo - MOBILE-OPTIMIZED: Smaller on mobile */}
          {logoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex justify-center"
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="h-12 sm:h-16 w-auto object-contain"
              />
            </motion.div>
          )}

          {/* Main Content - MOBILE-OPTIMIZED: Responsive typography */}
          <div className="space-y-4 sm:space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight px-2"
              style={{ color: "var(--form-text-color, #1F2937)" }}
            >
              {form.title}
            </motion.h1>

            {form.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-2"
                style={{ color: "var(--form-text-secondary, #6B7280)" }}
              >
                {form.description}
              </motion.p>
            )}

            {field.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="prose prose-sm sm:prose-base lg:prose-lg mx-auto px-2"
                style={{ color: "var(--form-text-color, #374151)" }}
                dangerouslySetInnerHTML={{ __html: field.description }}
              />
            )}
          </div>

          {/* Form Info Cards - MOBILE-OPTIMIZED: Stack on mobile, responsive grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className=" gap-3 sm:gap-4 max-w-2xl mx-auto"
          >
            {/* Time Estimate - MOBILE-OPTIMIZED: Larger touch targets */}
            <div
              className="backdrop-blur-sm rounded-lg p-4 sm:p-5 border min-h-[80px] flex items-center"
              style={{
                backgroundColor:
                  "var(--form-background-color, rgba(255, 255, 255, 0.8))",
                borderColor: "var(--form-border-color, #E5E7EB)",
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor:
                      "var(--form-color-primary-background, #EFF6FF)",
                  }}
                >
                  <Clock
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ color: "var(--form-color-primary, #3B82F6)" }}
                  />
                </div>
                <div className="text-left flex-1">
                  <div
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--form-text-secondary, #6B7280)" }}
                  >
                    Estimated time
                  </div>
                  <div
                    className="font-medium text-sm sm:text-base"
                    style={{ color: "var(--form-text-color, #1F2937)" }}
                  >
                    {estimatedTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Count - MOBILE-OPTIMIZED: Show on mobile if more than 1 step */}
            {totalSteps > 1 && (
              <div
                className="backdrop-blur-sm rounded-lg p-4 sm:p-5 border min-h-[80px] flex items-center"
                style={{
                  backgroundColor:
                    "var(--form-background-color, rgba(255, 255, 255, 0.8))",
                  borderColor: "var(--form-border-color, #E5E7EB)",
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor:
                        "var(--form-color-success-background, #F0FDF4)",
                    }}
                  >
                    <Play
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      style={{ color: "var(--form-color-success, #10B981)" }}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <div
                      className="text-xs sm:text-sm"
                      style={{ color: "var(--form-text-secondary, #6B7280)" }}
                    >
                      Total steps
                    </div>
                    <div
                      className="font-medium text-sm sm:text-base"
                      style={{ color: "var(--form-text-color, #1F2937)" }}
                    >
                      {totalSteps} sections
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Participant Count - MOBILE-OPTIMIZED: Responsive sizing */}
            {participantCount && (
              <div
                className="backdrop-blur-sm rounded-lg p-4 sm:p-5 border min-h-[80px] flex items-center sm:col-span-2 lg:col-span-1"
                style={{
                  backgroundColor:
                    "var(--form-background-color, rgba(255, 255, 255, 0.8))",
                  borderColor: "var(--form-border-color, #E5E7EB)",
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor:
                        "var(--form-color-secondary-background, #F3F4F6)",
                    }}
                  >
                    <Users
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      style={{ color: "var(--form-color-secondary, #6B7280)" }}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <div
                      className="text-xs sm:text-sm"
                      style={{ color: "var(--form-text-secondary, #6B7280)" }}
                    >
                      Participants
                    </div>
                    <div
                      className="font-medium text-sm sm:text-base"
                      style={{ color: "var(--form-text-color, #1F2937)" }}
                    >
                      {participantCount.toLocaleString()}+ responses
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Features List - MOBILE-OPTIMIZED: Responsive layout */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-3 sm:space-y-4"
            >
              <h3
                className="text-base sm:text-lg font-medium"
                style={{ color: "var(--form-text-color, #1F2937)" }}
              >
                What to expect:
              </h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={`feature-${index}-${feature}`} // Fix for potential duplicate keys
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-2 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border min-h-[44px]" // 44px minimum touch target
                    style={{
                      backgroundColor:
                        "var(--form-background-color, rgba(255, 255, 255, 0.8))",
                      borderColor: "var(--form-border-color, #E5E7EB)",
                    }}
                  >
                    <Shield
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "var(--form-color-success, #10B981)" }}
                    />
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: "var(--form-text-color, #374151)" }}
                    >
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Start Button - MOBILE-OPTIMIZED: Larger touch target, responsive text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-4 sm:pt-6"
          >
            <motion.button
              type="button"
              onClick={handleStart}
              onKeyDown={handleKeyDown}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-4 sm:py-5 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[56px] w-full sm:w-auto min-w-[450px]" // Minimum 56px height for touch
              style={
                {
                  backgroundColor:
                    primaryColor || "var(--form-color-primary, #3B82F6)",
                  color: "var(--form-background-color, #FFFFFF)",
                  "--tw-ring-color":
                    primaryColor || "var(--form-color-primary, #3B82F6)",
                  fontSize: "16px", // Prevent zoom on iOS
                } as React.CSSProperties
              }
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm sm:text-base font-semibold">Start</span>

              <motion.div
                className="flex items-center"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Privacy Notice - MOBILE-OPTIMIZED: Responsive text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-xs sm:text-sm max-w-md mx-auto px-4"
            style={{ color: "var(--form-text-secondary, #6B7280)" }}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">
                Your responses are secure and confidential
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
