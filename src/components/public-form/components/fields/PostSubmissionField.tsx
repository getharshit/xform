"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExtendedFormField } from "../../types";
import { useFormContext } from "../../providers/FormProvider";
import {
  CheckCircle,
  Download,
  Share2,
  Home,
  ExternalLink,
  Copy,
  Mail,
  MessageCircle,
  Star,
} from "lucide-react";

interface PostSubmissionFieldProps {
  field: ExtendedFormField;
  submissionData?: Record<string, any>;
  onAction?: (action: string, data?: any) => void;
  className?: string;
}

export const PostSubmissionField: React.FC<PostSubmissionFieldProps> = ({
  field,
  submissionData,
  onAction,
  className = "",
}) => {
  const { form } = useFormContext();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti animation on mount
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleAction = (actionType: string, data?: any) => {
    onAction?.(actionType, data);
  };

  // Extract configuration from field
  const showDownload = field.displayOptions?.showDownload ?? false;
  const showShare = field.displayOptions?.showShare ?? false;
  const showFeedback = field.displayOptions?.showFeedback ?? false;
  const redirectUrl = field.displayOptions?.redirectUrl;
  const redirectDelay = field.displayOptions?.redirectDelay || 5;
  const customActions = field.displayOptions?.customActions || [];

  // Safe access to nested theme properties with fallbacks
  const logoUrl =
    (form.theme as any)?.logoUrl ||
    (form.customization as any)?.branding?.logo?.url ||
    null;

  // Auto-redirect timer
  const [redirectCountdown, setRedirectCountdown] = useState(
    redirectUrl ? redirectDelay : 0
  );

  useEffect(() => {
    if (redirectUrl && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectUrl && redirectCountdown === 0) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl, redirectCountdown]);

  return (
    <div
      className={`post-submission-field min-h-screen relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, var(--form-color-background, #ffffff) 0%, var(--form-color-surface, #f9fafb) 100%)`,
      }}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `linear-gradient(45deg, var(--form-color-primary, #3B82F6), var(--form-color-accent, #8B5CF6))`,
              }}
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 800),
                y: -10,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y:
                  (typeof window !== "undefined" ? window.innerHeight : 600) +
                  10,
                rotate: 360,
                opacity: 0,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div
        className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center min-h-screen"
        style={{
          padding: `var(--form-spacing-xl, 48px) var(--form-spacing-md, 16px)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-8 w-full"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="flex justify-center"
          >
            <div className="relative">
              <CheckCircle
                className="w-24 h-24"
                style={{ color: "var(--form-color-success, #10B981)" }}
              />
              <motion.div
                className="absolute inset-0 w-24 h-24 border-4 rounded-full"
                style={{ borderColor: "var(--form-color-success, #10B981)33" }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Logo */}
          {logoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex justify-center"
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
            </motion.div>
          )}

          {/* Main Message */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                color: "var(--form-color-text, #111827)",
                fontSize: "var(--form-font-size-title, 30px)",
                fontWeight: "var(--form-font-weight-bold, 700)",
                fontFamily:
                  "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                marginBottom: "var(--form-spacing-md, 16px)",
              }}
            >
              {field.label || "Thank You!"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              style={{
                color: "var(--form-color-text-secondary, #6B7280)",
                fontSize: "var(--form-font-size-question, 16px)",
                fontFamily:
                  "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                lineHeight: "var(--form-line-height-normal, 1.5)",
                maxWidth: "32rem",
                margin: "0 auto",
              }}
            >
              {field.description ||
                "Your response has been submitted successfully. We appreciate your time and feedback."}
            </motion.p>
          </div>

          {/* Submission Summary */}
          {submissionData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                backgroundColor: "var(--form-color-surface, #ffffff)",
                border: `1px solid var(--form-color-border, #E5E7EB)`,
                borderRadius: "var(--form-border-radius, 8px)",
                padding: "var(--form-spacing-lg, 24px)",
                maxWidth: "28rem",
                margin: "0 auto",
                backdropFilter: "blur(8px)",
              }}
            >
              <h3
                style={{
                  color: "var(--form-color-text, #111827)",
                  fontSize: "var(--form-font-size-question, 16px)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                  marginBottom: "var(--form-spacing-sm, 12px)",
                }}
              >
                Submission Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--form-color-text-secondary, #6B7280)",
                    }}
                  >
                    Submitted at:
                  </span>
                  <span style={{ color: "var(--form-color-text, #111827)" }}>
                    {new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--form-color-text-secondary, #6B7280)",
                    }}
                  >
                    Response ID:
                  </span>
                  <span
                    style={{
                      color: "var(--form-color-text, #111827)",
                      fontFamily: "var(--form-font-mono, Monaco, monospace)",
                      fontSize: "var(--form-font-size-small, 12px)",
                    }}
                  >
                    {submissionData.id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--form-color-text-secondary, #6B7280)",
                    }}
                  >
                    Questions answered:
                  </span>
                  <span style={{ color: "var(--form-color-text, #111827)" }}>
                    {Object.keys(submissionData).length - 1} questions
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap justify-center"
            style={{ gap: "var(--form-spacing-md, 16px)" }}
          >
            {/* Download Response */}
            {showDownload && (
              <motion.button
                type="button"
                onClick={() => handleAction("download", submissionData)}
                style={{
                  backgroundColor: "var(--form-color-primary, #3B82F6)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--form-border-radius, 8px)",
                  padding: `var(--form-spacing-sm, 12px) var(--form-spacing-lg, 24px)`,
                  fontSize: "var(--form-font-size-input, 16px)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--form-spacing-xs, 8px)",
                  transition: "all 0.2s ease",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--form-color-primary-dark, #2563EB)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--form-color-primary, #3B82F6)";
                }}
              >
                <Download className="w-4 h-4" />
                Download Response
              </motion.button>
            )}

            {/* Share Form */}
            {showShare && (
              <motion.button
                type="button"
                onClick={handleCopyLink}
                style={{
                  backgroundColor: "var(--form-color-secondary, #6B7280)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--form-border-radius, 8px)",
                  padding: `var(--form-spacing-sm, 12px) var(--form-spacing-lg, 24px)`,
                  fontSize: "var(--form-font-size-input, 16px)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--form-spacing-xs, 8px)",
                  transition: "all 0.2s ease",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Share Form
                  </>
                )}
              </motion.button>
            )}

            {/* Custom Actions */}
            {customActions.map((action, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleAction(action.type, action.data)}
                style={{
                  backgroundColor:
                    action.style === "primary"
                      ? "var(--form-color-primary, #3B82F6)"
                      : "var(--form-color-surface, #F3F4F6)",
                  color:
                    action.style === "primary"
                      ? "white"
                      : "var(--form-color-text, #374151)",
                  border: "none",
                  borderRadius: "var(--form-border-radius, 8px)",
                  padding: `var(--form-spacing-sm, 12px) var(--form-spacing-lg, 24px)`,
                  fontSize: "var(--form-font-size-input, 16px)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--form-spacing-xs, 8px)",
                  transition: "all 0.2s ease",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {action.icon === "external" && (
                  <ExternalLink className="w-4 h-4" />
                )}
                {action.icon === "home" && <Home className="w-4 h-4" />}
                {action.icon === "mail" && <Mail className="w-4 h-4" />}
                {action.icon === "message" && (
                  <MessageCircle className="w-4 h-4" />
                )}
                {action.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Feedback Request */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                backgroundColor: "var(--form-color-warning, #FEF3C7)33",
                border: `1px solid var(--form-color-warning, #F59E0B)33`,
                borderRadius: "var(--form-border-radius, 8px)",
                padding: "var(--form-spacing-md, 16px)",
                maxWidth: "28rem",
                margin: "0 auto",
              }}
            >
              <h4
                style={{
                  color: "var(--form-color-warning, #F59E0B)",
                  fontSize: "var(--form-font-size-input, 16px)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                  marginBottom: "var(--form-spacing-xs, 8px)",
                }}
              >
                Help us improve
              </h4>
              <p
                style={{
                  color: "var(--form-color-text, #374151)",
                  fontSize: "var(--form-font-size-small, 14px)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                  marginBottom: "var(--form-spacing-sm, 12px)",
                }}
              >
                How was your experience with this form?
              </p>
              <div
                className="flex justify-center"
                style={{ gap: "var(--form-spacing-xs, 8px)" }}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    type="button"
                    onClick={() => handleAction("feedback", { rating })}
                    style={{
                      padding: "var(--form-spacing-xs, 4px)",
                      background: "transparent",
                      border: "none",
                      color: "var(--form-color-warning, #F59E0B)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star className="w-5 h-5" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Social Sharing */}
          {showShare && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="space-y-3"
            >
              <h4
                style={{
                  color: "var(--form-color-text, #374151)",
                  fontSize: "var(--form-font-size-small, 14px)",
                  fontWeight: "var(--form-font-weight-medium, 500)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                }}
              >
                Share this form
              </h4>
              <div
                className="flex justify-center"
                style={{ gap: "var(--form-spacing-sm, 12px)" }}
              >
                <motion.button
                  type="button"
                  onClick={() => handleAction("share", { platform: "twitter" })}
                  style={{
                    padding: "var(--form-spacing-xs, 8px)",
                    backgroundColor: "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--form-border-radius, 8px)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() =>
                    handleAction("share", { platform: "linkedin" })
                  }
                  style={{
                    padding: "var(--form-spacing-xs, 8px)",
                    backgroundColor: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--form-border-radius, 8px)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleAction("share", { platform: "email" })}
                  style={{
                    padding: "var(--form-spacing-xs, 8px)",
                    backgroundColor: "var(--form-color-secondary, #6B7280)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--form-border-radius, 8px)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Auto-redirect Notice */}
          {redirectUrl && redirectCountdown > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                backgroundColor: "var(--form-color-primary, #3B82F6)22",
                border: `1px solid var(--form-color-primary, #3B82F6)44`,
                borderRadius: "var(--form-border-radius, 8px)",
                padding: "var(--form-spacing-md, 16px)",
                maxWidth: "28rem",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  color: "var(--form-color-primary, #3B82F6)",
                  fontSize: "var(--form-font-size-small, 14px)",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                }}
              >
                Redirecting in {redirectCountdown} seconds...
              </div>
              <motion.button
                type="button"
                onClick={() => setRedirectCountdown(0)}
                style={{
                  marginTop: "var(--form-spacing-xs, 8px)",
                  fontSize: "var(--form-font-size-small, 12px)",
                  color: "var(--form-color-primary, #3B82F6)",
                  background: "transparent",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontFamily:
                    "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
                }}
                whileHover={{ scale: 1.02 }}
              >
                Go now
              </motion.button>
            </motion.div>
          )}

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            style={{
              color: "var(--form-color-text-secondary, #6B7280)",
              fontSize: "var(--form-font-size-small, 14px)",
              fontFamily:
                "var(--form-font-family-primary, Inter, system-ui, sans-serif)",
            }}
          >
            Thank you for taking the time to complete this form.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
