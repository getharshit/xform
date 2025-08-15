"use client";

import React, { useState, useRef, useEffect } from "react";
import { useController } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedFormField } from "../../types";
import { useFormContext } from "../../providers/FormProvider";
import { QuestionContainer } from "./QuestionContainer";
import { AnimatedErrorMessage } from "../../animation/components";
import { AlertCircle, ChevronDown, Check, Search } from "lucide-react";

interface DropdownFieldProps {
  field: ExtendedFormField;
  questionNumber?: number;
  showQuestionNumber?: boolean;
  className?: string;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
  field,
  questionNumber,
  showQuestionNumber = false,
  className = "",
}) => {
  const { formMethods } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    field: controllerField,
    fieldState: { error, isTouched },
  } = useController({
    name: field.id,
    control: formMethods.control,
    rules: {
      required: field.required ? `${field.label} is required` : false,
    },
  });

  const hasError = !!error && isTouched;
  const options = field.options || [];
  const isSearchable = options.length > 5; // Enable search for long lists

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, isSearchable]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleOptionSelect = (option: string) => {
    controllerField.onChange(option);
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;

      case "Enter":
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleOptionSelect(filteredOptions[focusedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;

      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
        break;

      case " ":
        if (!isSearchable) {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (focusedIndex >= 0) {
            handleOptionSelect(filteredOptions[focusedIndex]);
          }
        }
        break;
    }
  };

  const selectedOption = options.find(
    (option) => option === controllerField.value
  );

  return (
    <QuestionContainer
      field={field}
      questionNumber={questionNumber}
      showQuestionNumber={showQuestionNumber}
      className={className}
    >
      <div className="dropdown-field space-y-2">
        {/* Dropdown Container */}
        <div ref={dropdownRef} className="relative">
          {/* Dropdown Trigger */}
          <motion.button
            type="button"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            className={`
              w-full px-4 py-3 text-left border-2 rounded-lg flex items-center justify-between
              focus:outline-none focus:ring-2 focus:border-transparent
              transition-colors duration-200
              ${isOpen ? "ring-2" : "focus:ring-2"}
            `}
            style={
              {
                borderColor: isOpen
                  ? "var(--form-color-primary, #3B82F6)"
                  : hasError
                  ? "var(--form-color-error, #EF4444)"
                  : "var(--form-border-color, #D1D5DB)",
                backgroundColor: isOpen
                  ? "var(--form-color-primary-background, #EFF6FF)"
                  : hasError
                  ? "var(--form-color-error-background, #FEF2F2)"
                  : "var(--form-background-color, #FFFFFF)",
                color: selectedOption
                  ? "var(--form-text-color, #1F2937)"
                  : "var(--form-text-secondary, #6B7280)",
                "--tw-ring-color": isOpen
                  ? "var(--form-color-primary, #3B82F6)"
                  : hasError
                  ? "var(--form-color-error, #EF4444)"
                  : "var(--form-color-primary, #3B82F6)",
              } as React.CSSProperties
            }
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={`question-${field.id}`}
            aria-describedby={hasError ? `error-${field.id}` : undefined}
          >
            <span>
              {selectedOption || field.placeholder || "Select an option..."}
            </span>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown
                className="w-5 h-5"
                style={{ color: "var(--form-text-secondary, #6B7280)" }}
              />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden"
                style={{
                  backgroundColor: "var(--form-background-color, #FFFFFF)",
                  border: "1px solid var(--form-border-color, #E5E7EB)",
                }}
              >
                {/* Search Input */}
                {isSearchable && (
                  <div
                    className="p-3"
                    style={{
                      borderBottom:
                        "1px solid var(--form-border-color, #F3F4F6)",
                    }}
                  >
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--form-text-secondary, #6B7280)" }}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search options..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setFocusedIndex(-1);
                        }}
                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:border-transparent text-sm"
                        style={
                          {
                            borderColor: "var(--form-border-color, #E5E7EB)",
                            backgroundColor:
                              "var(--form-background-color, #FFFFFF)",
                            color: "var(--form-text-color, #1F2937)",
                            "--tw-ring-color":
                              "var(--form-color-primary, #3B82F6)",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Options List */}
                <div
                  className="overflow-y-auto max-h-48"
                  role="listbox"
                  aria-labelledby={`question-${field.id}`}
                >
                  {filteredOptions.length === 0 ? (
                    <div
                      className="px-3 py-2 text-sm"
                      style={{ color: "var(--form-text-secondary, #6B7280)" }}
                    >
                      No options found
                    </div>
                  ) : (
                    filteredOptions.map((option, index) => {
                      const isSelected = option === controllerField.value;
                      const isFocused = index === focusedIndex;

                      return (
                        <motion.button
                          key={option}
                          type="button"
                          onClick={() => handleOptionSelect(option)}
                          className={`
                            w-full px-3 py-2 text-left flex items-center justify-between
                            transition-colors duration-150
                          `}
                          style={{
                            backgroundColor: isFocused
                              ? "var(--form-color-primary-background, #EFF6FF)"
                              : isSelected
                              ? "var(--form-color-primary-light, #DBEAFE)"
                              : "transparent",
                            color: isFocused
                              ? "var(--form-color-primary, #3B82F6)"
                              : isSelected
                              ? "var(--form-color-primary, #3B82F6)"
                              : "var(--form-text-color, #1F2937)",
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.1,
                            delay: index * 0.02,
                          }}
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => setFocusedIndex(index)}
                        >
                          <span>{option}</span>

                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.15 }}
                              >
                                <Check
                                  className="w-4 h-4"
                                  style={{
                                    color: "var(--form-color-primary, #3B82F6)",
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        <AnimatedErrorMessage isVisible={hasError}>
          <div
            id={`error-${field.id}`}
            className="flex items-start gap-2 text-sm"
            style={{ color: "var(--form-color-error, #EF4444)" }}
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error?.message}</span>
          </div>
        </AnimatedErrorMessage>
      </div>
    </QuestionContainer>
  );
};
