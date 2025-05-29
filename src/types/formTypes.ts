// Define types for form handling using nextjs server actions
// Desinged to be used with useActionState from react

export type FormActionState = {
  success: boolean;
  errors?: Record<string, string[]>;
};

// Previous State does not need to be used, but is included because useActionState expects it
export type FormAction = (
  previousState: FormActionState,
  formData: FormData
) => Promise<FormActionState>;
