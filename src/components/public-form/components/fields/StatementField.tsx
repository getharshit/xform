"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExtendedFormField } from "@/types";
import { QuestionContainer } from "./QuestionContainer";
import { Eye, EyeOff, Image, ExternalLink } from "lucide-react";

interface StatementFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const StatementField: React.FC<StatementFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  // Check if content is lengthy (more than 300 characters)
  const isLongContent = (field.description?.length || 0) > 300;
  const hasImage = field.displayOptions?.imageUrl;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError("Failed to load image");
  };

  const renderRichContent = (content: string) => {
    // Basic rich text rendering - in production, you might want to use a library like DOMPurify
    return (
      <div
        className="prose prose-sm max-w-none leading-relaxed"
        style={{ color: "var(--form-text-color, #374151)" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Get variant-specific styles
  const getVariantStyles = () => {
    const variant = field.displayOptions?.variant;

    switch (variant) {
      case "highlighted":
        return {
          backgroundColor: "var(--form-color-warning-background, #FFFBEB)",
          borderColor: "var(--form-color-warning, #F59E0B)",
        };
      case "info":
        return {
          backgroundColor: "var(--form-color-primary-background, #EFF6FF)",
          borderColor: "var(--form-color-primary, #3B82F6)",
        };
      case "warning":
        return {
          backgroundColor: "var(--form-color-error-background, #FEF2F2)",
          borderColor: "var(--form-color-error, #EF4444)",
        };
      default:
        return {
          backgroundColor: "var(--form-background-secondary, #F8FAFC)",
          borderColor: "var(--form-border-color, #E2E8F0)",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="statement-field"
      >
        {/* Statement Card */}
        <div
          className="border rounded-xl p-6 shadow-sm"
          style={{
            backgroundColor: variantStyles.backgroundColor,
            borderColor: variantStyles.borderColor,
          }}
        >
          {/* Image Display */}
          {hasImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-6"
            >
              {imageLoading && (
                <div
                  className="w-full h-48 rounded-lg animate-pulse flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--form-border-color, #E5E7EB)",
                  }}
                >
                  <Image
                    className="w-8 h-8"
                    style={{ color: "var(--form-text-secondary, #6B7280)" }}
                  />
                </div>
              )}

              {!imageError ? (
                <img
                  src={field.displayOptions?.imageUrl}
                  alt={field.displayOptions?.imageAlt || ""}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`
                    w-full max-h-64 object-cover rounded-lg shadow-md
                    ${imageLoading ? "hidden" : "block"}
                  `}
                />
              ) : (
                <div
                  className="w-full h-48 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "var(--form-background-secondary, #F3F4F6)",
                    color: "var(--form-text-secondary, #6B7280)",
                  }}
                >
                  <div className="text-center">
                    <Image className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">{imageError}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Content */}
          <div className="statement-content">
            {field.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {isLongContent ? (
                  <div className="space-y-4">
                    {/* Collapsible Content */}
                    <motion.div
                      animate={{ height: isExpanded ? "auto" : "120px" }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden relative"
                    >
                      {renderRichContent(field.description)}

                      {/* Fade overlay when collapsed */}
                      {!isExpanded && (
                        <div
                          className="absolute bottom-0 left-0 right-0 h-8"
                          style={{
                            background: `linear-gradient(to top, ${variantStyles.backgroundColor}, transparent)`,
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Expand/Collapse Button */}
                    <motion.button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-2 font-medium text-sm transition-colors"
                      style={{
                        color: "var(--form-color-primary, #3B82F6)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          "var(--form-color-primary-hover, #2563EB)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color =
                          "var(--form-color-primary, #3B82F6)";
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Read More
                        </>
                      )}
                    </motion.button>
                  </div>
                ) : (
                  renderRichContent(field.description)
                )}
              </motion.div>
            )}

            {/* Call-to-Action Links */}
            {field.displayOptions?.links &&
              field.displayOptions.links.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-4 flex flex-wrap gap-3"
                >
                  {field.displayOptions.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target={link.external ? "_blank" : "_self"}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: "var(--form-color-primary, #3B82F6)",
                        color: "var(--form-background-color, #FFFFFF)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--form-color-primary-hover, #2563EB)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--form-color-primary, #3B82F6)";
                      }}
                    >
                      {link.text}
                      {link.external && <ExternalLink className="w-3 h-3" />}
                    </a>
                  ))}
                </motion.div>
              )}
          </div>
        </div>
      </motion.div>
    </QuestionContainer>
  );
};
