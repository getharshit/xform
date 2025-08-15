"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Lock, AlertCircle } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
  isAccessible: boolean;
  hasError: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  variant?: "horizontal" | "vertical" | "dots";
  showLabels?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  variant = "horizontal",
  showLabels = true,
  className = "",
  style,
}) => {
  const renderHorizontalSteps = () => (
    <div
      className={`flex items-center justify-between w-full ${className}`}
      style={style}
    >
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Step Circle */}
          <motion.button
            type="button"
            onClick={() => step.isAccessible && onStepClick(index)}
            disabled={!step.isAccessible}
            style={{
              position: "relative",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: step.isCompleted
                ? "var(--form-color-success, #10b981)"
                : step.isActive
                ? "var(--form-color-primary, #3b82f6)"
                : step.hasError
                ? "var(--form-color-error, #dc2626)"
                : step.isAccessible
                ? "var(--form-color-border, #d1d5db)"
                : "var(--form-color-border-disabled, #e5e7eb)",
              backgroundColor: step.isCompleted
                ? "var(--form-color-success, #10b981)"
                : step.isActive
                ? "var(--form-color-primary, #3b82f6)"
                : step.hasError
                ? "var(--form-color-error, #dc2626)"
                : step.isAccessible
                ? "var(--form-color-surface, #ffffff)"
                : "var(--form-color-secondary, #f3f4f6)",
              color:
                step.isCompleted || step.isActive || step.hasError
                  ? "var(--form-color-text-inverse, #ffffff)"
                  : step.isAccessible
                  ? "var(--form-color-text-primary, #374151)"
                  : "var(--form-color-text-muted, #9ca3af)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: step.isAccessible ? "pointer" : "not-allowed",
              outline: "none",
              transitionDuration:
                "var(--form-transition-duration-normal, 200ms)",
              transitionTimingFunction:
                "var(--form-transition-easing-ease-in-out, ease-in-out)",
              fontFamily:
                "var(--form-font-primary, var(--form-font-family, Inter, system-ui, sans-serif))",
              fontSize: "var(--form-font-size-sm, 0.875rem)",
              fontWeight: "var(--form-font-weight-medium, 500)",
            }}
            whileHover={step.isAccessible ? { scale: 1.05 } : {}}
            whileTap={step.isAccessible ? { scale: 0.95 } : {}}
            onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
              e.currentTarget.style.outline =
                "2px solid var(--form-color-border-focus, var(--form-color-primary, #3b82f6))";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
              e.currentTarget.style.outline = "none";
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (step.isAccessible && !step.isActive && !step.isCompleted) {
                e.currentTarget.style.borderColor =
                  "var(--form-color-border-hover, var(--form-color-primary, #3b82f6))";
              }
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (step.isAccessible && !step.isActive && !step.isCompleted) {
                e.currentTarget.style.borderColor =
                  "var(--form-color-border, #d1d5db)";
              }
            }}
          >
            {step.isCompleted ? (
              <Check className="w-5 h-5" />
            ) : step.hasError ? (
              <AlertCircle className="w-5 h-5" />
            ) : !step.isAccessible ? (
              <Lock className="w-4 h-4" />
            ) : (
              <span>{index + 1}</span>
            )}

            {/* Active indicator */}
            {step.isActive && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  border: `2px solid var(--form-color-primary, #3b82f6)33`,
                  borderRadius: "50%",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Step Label */}
          {showLabels && (
            <div
              style={{
                marginLeft: "var(--form-spacing-sm, 0.75rem)",
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize:
                    "var(--form-font-size-caption, var(--form-font-size-sm, 0.875rem))",
                  fontWeight:
                    "var(--form-font-weight-caption, var(--form-font-weight-medium, 500))",
                  fontFamily:
                    "var(--form-font-primary, var(--form-font-family, Inter, system-ui, sans-serif))",
                  color: step.isActive
                    ? "var(--form-color-primary, #3b82f6)"
                    : step.isCompleted
                    ? "var(--form-color-success, #10b981)"
                    : step.hasError
                    ? "var(--form-color-error, #dc2626)"
                    : "var(--form-color-text-secondary, #6b7280)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {step.title}
              </div>
              {step.description && (
                <div
                  style={{
                    fontSize:
                      "var(--form-font-size-caption, var(--form-font-size-xs, 0.75rem))",
                    color: "var(--form-color-text-muted, #9ca3af)",
                    fontFamily:
                      "var(--form-font-primary, var(--form-font-family, Inter, system-ui, sans-serif))",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: "var(--form-spacing-xs, 0.25rem)",
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>
          )}

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className="flex-1"
              style={{ margin: `0 var(--form-spacing-md, 1rem)` }}
            >
              <div
                style={{
                  height: "2px",
                  backgroundColor: step.isCompleted
                    ? "var(--form-color-success, #10b981)"
                    : "var(--form-color-border, #e5e7eb)",
                  transitionDuration:
                    "var(--form-transition-duration-normal, 200ms)",
                  transitionProperty: "background-color",
                  transitionTimingFunction:
                    "var(--form-transition-easing-ease-in-out, ease-in-out)",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderVerticalSteps = () => (
    <div
      className={`flex flex-col ${className}`}
      style={{
        gap: "var(--form-spacing-md, 1rem)",
        ...style,
      }}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex items-start"
          style={{ position: "relative" }}
        >
          {/* Step Circle */}
          <motion.button
            type="button"
            onClick={() => step.isAccessible && onStepClick(index)}
            disabled={!step.isAccessible}
            style={{
              position: "relative",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: step.isCompleted
                ? "var(--form-color-success, #10b981)"
                : step.isActive
                ? "var(--form-color-primary, #3b82f6)"
                : step.hasError
                ? "var(--form-color-error, #dc2626)"
                : step.isAccessible
                ? "var(--form-color-border, #d1d5db)"
                : "var(--form-color-border-disabled, #e5e7eb)",
              backgroundColor: step.isCompleted
                ? "var(--form-color-success, #10b981)"
                : step.isActive
                ? "var(--form-color-primary, #3b82f6)"
                : step.hasError
                ? "var(--form-color-error, #dc2626)"
                : step.isAccessible
                ? "var(--form-color-surface, #ffffff)"
                : "var(--form-color-secondary, #f3f4f6)",
              color:
                step.isCompleted || step.isActive || step.hasError
                  ? "var(--form-color-text-inverse, #ffffff)"
                  : step.isAccessible
                  ? "var(--form-color-text-primary, #374151)"
                  : "var(--form-color-text-muted, #9ca3af)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: step.isAccessible ? "pointer" : "not-allowed",
              outline: "none",
              transitionDuration:
                "var(--form-transition-duration-normal, 200ms)",
              transitionTimingFunction:
                "var(--form-transition-easing-ease-in-out, ease-in-out)",
              flexShrink: 0,
              fontFamily:
                "var(--form-font-primary, var(--form-font-family, Inter, system-ui, sans-serif))",
              fontSize: "var(--form-font-size-xs, 0.75rem)",
              fontWeight: "var(--form-font-weight-medium, 500)",
            }}
            whileHover={step.isAccessible ? { scale: 1.05 } : {}}
            whileTap={step.isAccessible ? { scale: 0.95 } : {}}
            onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
              e.currentTarget.style.outline =
                "2px solid var(--form-color-border-focus, var(--form-color-primary, #3b82f6))";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            {step.isCompleted ? (
              <Check className="w-4 h-4" />
            ) : step.hasError ? (
              <AlertCircle className="w-4 h-4" />
            ) : !step.isAccessible ? (
              <Lock className="w-3 h-3" />
            ) : (
              <span>{index + 1}</span>
            )}
          </motion.button>

          {/* Step Content */}
          {showLabels && (
            <div
              style={{
                marginLeft: "var(--form-spacing-sm, 0.75rem)",
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize:
                    "var(--form-font-size-caption, var(--form-font-size-sm, 0.875rem))",
                  fontWeight:
                    "var(--form-font-weight-caption, var(--form-font-weight-medium, 500))",
                  fontFamily:
                    "var(--form-font-primary, var(--form-font-family, Inter, system-ui, sans-serif))",
                  color: step.isActive
                    ? "var(--form-color-primary, #3b82f6)"
                    : step.isCompleted
                    ? "var(--form-color-success, #10b981)"
                    : step.hasError
                    ? "var(--form-color-error, #dc2626)"
                    : "var(--form-color-text-secondary, #6b7280)",
                }}
              >
                {step.title}
              </div>
              {step.description && (
                <div
                  style={{
                    fontSize:
                      "var(--form-font-size-caption, var(--form-font-size-xs, 0.75rem))",
                    color: "var(--form-color-text-muted, #9ca3af)",
                    fontFamily:
                      "var(--form-font-primary, var(--form-font-family, Inter, system-ui, sans-serif))",
                    marginTop: "var(--form-spacing-xs, 0.25rem)",
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>
          )}

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              style={{
                position: "absolute",
                left: "15px", // Half of button width (32px) - 1px for centering
                top: "32px",
                width: "2px",
                height: "var(--form-spacing-md, 1rem)",
                backgroundColor: step.isCompleted
                  ? "var(--form-color-success, #10b981)"
                  : "var(--form-color-border, #e5e7eb)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderDotSteps = () => (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        gap: "var(--form-spacing-xs, 0.5rem)",
        ...style,
      }}
    >
      {steps.map((step, index) => (
        <motion.button
          key={step.id}
          type="button"
          onClick={() => step.isAccessible && onStepClick(index)}
          disabled={!step.isAccessible}
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: step.isCompleted
              ? "var(--form-color-success, #10b981)"
              : step.isActive
              ? "var(--form-color-primary, #3b82f6)"
              : step.hasError
              ? "var(--form-color-error, #dc2626)"
              : step.isAccessible
              ? "var(--form-color-border, #d1d5db)"
              : "var(--form-color-border-disabled, #e5e7eb)",
            cursor: step.isAccessible ? "pointer" : "not-allowed",
            outline: "none",
            transitionDuration: "var(--form-transition-duration-normal, 200ms)",
            transitionTimingFunction:
              "var(--form-transition-easing-ease-in-out, ease-in-out)",
            transitionProperty: "all",
            transform: step.isActive ? "scale(1.25)" : "scale(1)",
          }}
          whileHover={
            step.isAccessible ? { scale: step.isActive ? 1.4 : 1.2 } : {}
          }
          whileTap={step.isAccessible ? { scale: 0.9 } : {}}
          title={step.title}
          onFocus={(e: React.FocusEvent<HTMLButtonElement>) => {
            e.currentTarget.style.outline =
              "2px solid var(--form-color-border-focus, var(--form-color-primary, #3b82f6))";
            e.currentTarget.style.outlineOffset = "2px";
          }}
          onBlur={(e: React.FocusEvent<HTMLButtonElement>) => {
            e.currentTarget.style.outline = "none";
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (step.isAccessible && !step.isActive && !step.isCompleted) {
              e.currentTarget.style.backgroundColor =
                "var(--form-color-primary-hover, var(--form-color-primary, #3b82f6))";
              e.currentTarget.style.opacity = "0.6";
            }
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (step.isAccessible && !step.isActive && !step.isCompleted) {
              e.currentTarget.style.backgroundColor =
                "var(--form-color-border, #d1d5db)";
              e.currentTarget.style.opacity = "1";
            }
          }}
        />
      ))}
    </div>
  );

  switch (variant) {
    case "vertical":
      return renderVerticalSteps();
    case "dots":
      return renderDotSteps();
    default:
      return renderHorizontalSteps();
  }
};
