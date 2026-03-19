"use client";

import { useState, useCallback } from "react";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.trim() === "")) {
      return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === "") return null;

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((data: { [key: string]: string }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName, data[fieldName] || "");
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const validateSingleField = useCallback((name: string, value: string) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ""
    }));
    return !error;
  }, [validateField]);

  const setFieldTouched = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  }, []);

  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    setFieldTouched,
    clearFieldError,
    resetValidation,
    isFieldValid: (name: string) => !errors[name],
    isFieldTouched: (name: string) => touched[name],
    hasErrors: Object.keys(errors).some(key => errors[key])
  };
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, // More permissive phone
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, // Simplified password
  name: /^[a-zA-Z0-9\s\.\-\']+$/, // Support dots, dashes, numbers in names
  zipCode: /^[0-9\s\-]{5,8}$/, // Support spaces/dashes in zip
};

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    pattern: validationPatterns.email,
    message: "Please enter a valid email address"
  },
  password: {
    required: true,
    minLength: 8,
    pattern: validationPatterns.password,
    message: "Password must be at least 8 characters with uppercase, lowercase, number and special character"
  },
  confirmPassword: (password: string) => ({
    required: true,
    custom: (value: string) => value !== password ? "Passwords do not match" : null,
    message: "Passwords do not match"
  }),
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: validationPatterns.name,
    message: "Please enter a valid name (letters only)"
  },
  phone: {
    required: true,
    pattern: validationPatterns.phone,
    message: "Please enter a valid phone number"
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200,
    message: "Please enter a complete address"
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Please enter a valid city name"
  },
  state: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Please enter a valid state"
  },
  zipCode: {
    required: true,
    pattern: validationPatterns.zipCode,
    message: "Please enter a valid zip code"
  }
};