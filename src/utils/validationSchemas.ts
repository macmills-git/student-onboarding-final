import * as Yup from 'yup';

// Login Validation Schema
export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// User Creation Validation Schema
export const userCreateSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  
  full_name: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  
  email: Yup.string()
    .email('Please enter a valid email address')
    .nullable(),
  
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  role: Yup.string()
    .required('Role is required')
    .oneOf(['ADMIN', 'CLERK'], 'Please select a valid role'),
});

// Personal Details Validation Schema
export const personalDetailsSchema = Yup.object().shape({
  surname: Yup.string()
    .required('Surname is required')
    .min(2, 'Surname must be at least 2 characters')
    .max(50, 'Surname must not exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/, 'Surname can only contain letters, spaces, hyphens, and apostrophes'),
  
  first_name: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  other_name: Yup.string()
    .max(100, 'Other names must not exceed 100 characters')
    .matches(/^[a-zA-Z\s-']*$/, 'Other names can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  student_id: Yup.string()
    .required('Student ID is required')
    .matches(/^\d+$/, 'Must contain numbers only')
    .min(8, 'Student ID must be at least 8 characters')
    .max(8, 'Student ID must not exceed 8 characters'),
  
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['Male', 'Female'], 'Please select a valid gender'),
  
  nationality: Yup.string()
    .required('Nationality is required'),
  
  phone_number: Yup.string()
    .required('Phone number is required')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 digits')
    .matches(/^[0-9+\s()-]+$/, 'Phone number can only contain digits, +, spaces, parentheses, and hyphens'),
});

// Academic Details Validation Schema
export const academicDetailsSchema = Yup.object().shape({
  course: Yup.string()
    .required('Course is required'),
  
  level: Yup.string()
    .required('Level is required')
    .oneOf(['100', '200', '300', '400', '500', '600', '700'], 'Please select a valid level'),
  
  study_mode: Yup.string()
    .required('Study mode is required')
    .oneOf(['regular', 'distance', 'city_campus'], 'Please select a valid study mode'),
  
  residential_status: Yup.string()
    .required('Residential status is required')
    .oneOf(['resident', 'non_resident'], 'Please select a valid residential status'),
  
  hall: Yup.string()
    .when('residential_status', {
      is: 'resident',
      then: (schema) => schema.required('Hall selection is required for resident students'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

// Financial Details Validation Schema
export const financialDetailsSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Payment amount is required')
    .positive('Amount must be greater than 0')
    .min(0.01, 'Amount must be at least GH₵0.01')
    .max(100000, 'Amount must not exceed GH₵100,000'),
  
  reference_id: Yup.string()
    .required('Reference ID is required')
    .min(3, 'Reference ID must be at least 3 characters')
    .max(100, 'Reference ID must not exceed 100 characters'),
  
  payment_method: Yup.string()
    .required('Payment method is required')
    .oneOf(['cash', 'momo', 'bank'], 'Please select a valid payment method'),
  
  mobile_number: Yup.string()
    .notRequired(), // Mobile number is optional, not stored in backend
  
  operator: Yup.string()
    .when('payment_method', {
      is: 'momo',
      then: (schema) => schema.required('Mobile Money operator is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  bank_name: Yup.string()
    .when('payment_method', {
      is: 'bank',
      then: (schema) => schema.required('Bank name is required for Bank Transfer'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

// Helper function to extract error messages from Yup ValidationError
export const getValidationErrors = (error: Yup.ValidationError): string => {
  if (error.inner && error.inner.length > 0) {
    // Return the first error message
    return error.inner[0].message;
  }
  return error.message;
};

// Helper function to format API errors
export const formatApiError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.detail) {
    if (typeof error.detail === 'string') {
      return error.detail;
    }
    if (Array.isArray(error.detail)) {
      return error.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join(', ');
    }
    return JSON.stringify(error.detail);
  }
  
  if (error?.error) {
    return formatApiError(error.error);
  }
  
  return 'An unexpected error occurred';
};
