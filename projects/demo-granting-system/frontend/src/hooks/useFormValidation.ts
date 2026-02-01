import { useState, useCallback, useMemo } from 'react';

type ValidationRule<T> = {
  validate: (value: T[keyof T], values: T) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormValidationReturn<T> {
  values: T;
  errors: ValidationErrors<T>;
  touched: Set<keyof T>;
  isValid: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  clearError: <K extends keyof T>(field: K) => void;
  clearAllErrors: () => void;
  touch: <K extends keyof T>(field: K) => void;
  validate: () => boolean;
  validateField: <K extends keyof T>(field: K) => boolean;
  reset: () => void;
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    error?: string;
  };
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T> = {}
): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Set<keyof T>>(new Set());
  const [initialState] = useState<T>(initialValues);

  const isDirty = useMemo(() => {
    return Object.keys(values).some(
      (key) => values[key as keyof T] !== initialState[key as keyof T]
    );
  }, [values, initialState]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      const fieldRules = rules[field];
      if (!fieldRules) return true;

      for (const rule of fieldRules) {
        if (!rule.validate(values[field], values)) {
          setErrors((prev) => ({ ...prev, [field]: rule.message }));
          return false;
        }
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    },
    [rules, values]
  );

  const validate = useCallback((): boolean => {
    let isValid = true;
    const newErrors: ValidationErrors<T> = {};

    for (const field of Object.keys(rules) as (keyof T)[]) {
      const fieldRules = rules[field];
      if (!fieldRules) continue;

      for (const rule of fieldRules) {
        if (!rule.validate(values[field], values)) {
          newErrors[field] = rule.message;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [rules, values]);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback(<K extends keyof T>(field: K) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const touch = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => new Set(prev).add(field));
  }, []);

  const reset = useCallback(() => {
    setValuesState(initialState);
    setErrors({});
    setTouched(new Set());
  }, [initialState]);

  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
        setValue(field, value as T[K]);
      },
      onBlur: () => {
        touch(field);
        validateField(field);
      },
      error: touched.has(field) ? errors[field] : undefined,
    }),
    [values, errors, touched, setValue, touch, validateField]
  );

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setValue,
    setValues,
    setError,
    clearError,
    clearAllErrors,
    touch,
    validate,
    validateField,
    reset,
    getFieldProps,
  };
}

// Pre-built validation rules
export const validators = {
  required: (message = 'กรุณากรอกข้อมูล'): ValidationRule<any> => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message = 'อีเมลไม่ถูกต้อง'): ValidationRule<any> => ({
    validate: (value) => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<any> => ({
    validate: (value) => {
      if (!value) return true;
      return String(value).length >= min;
    },
    message: message || `ต้องมีอย่างน้อย ${min} ตัวอักษร`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<any> => ({
    validate: (value) => {
      if (!value) return true;
      return String(value).length <= max;
    },
    message: message || `ต้องไม่เกิน ${max} ตัวอักษร`,
  }),

  min: (min: number, message?: string): ValidationRule<any> => ({
    validate: (value) => {
      if (value === '' || value === null || value === undefined) return true;
      return Number(value) >= min;
    },
    message: message || `ต้องมากกว่าหรือเท่ากับ ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<any> => ({
    validate: (value) => {
      if (value === '' || value === null || value === undefined) return true;
      return Number(value) <= max;
    },
    message: message || `ต้องน้อยกว่าหรือเท่ากับ ${max}`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<any> => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(String(value));
    },
    message,
  }),

  custom: <T>(fn: (value: any, values: T) => boolean, message: string): ValidationRule<T> => ({
    validate: fn,
    message,
  }),
};

export default useFormValidation;
