import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, User, GraduationCap, DollarSign, Phone, Mail, CreditCard, X } from 'lucide-react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useData, Payment } from '../contexts/DataContext';
import { countries } from '../data/countries';
import { formatApiError } from '../utils/validationSchemas';
import { ErrorMessage } from '../components/ErrorMessage';

interface RegistrationFormValues {
  // Personal Details
  surname: string;
  first_name: string;
  other_name: string;
  email: string;
  student_id: string;
  gender: string;
  nationality: string;
  phone_number: string;
  // Academic Details
  course: string;
  level: string;
  study_mode: 'regular' | 'distance' | 'city_campus';
  residential_status: 'resident' | 'non_resident';
  hall: string;
  // Financial Details
  amount: string;
  reference_id: string;
  payment_method: 'cash' | 'momo' | 'bank';
  mobile_number: string;
  bank_name: string;
  operator: string;
}

// Validation schemas for each step
const step1ValidationSchema = Yup.object().shape({
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

const step2ValidationSchema = Yup.object().shape({
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

const step3ValidationSchema = Yup.object().shape({
  amount: Yup.string()
    .required('Payment amount is required')
    .test('is-positive', 'Amount must be greater than 0', (value) => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  
  reference_id: Yup.string()
    .required('Reference ID is required')
    .min(3, 'Reference ID must be at least 3 characters')
    .max(100, 'Reference ID must not exceed 100 characters'),
  
  payment_method: Yup.string()
    .required('Payment method is required')
    .oneOf(['cash', 'momo', 'bank'], 'Please select a valid payment method'),
  
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

// Get the validation schema for the current step
const getValidationSchemaForStep = (step: number) => {
  switch (step) {
    case 1:
      return step1ValidationSchema;
    case 2:
      return step2ValidationSchema;
    case 3:
      return step3ValidationSchema;
    default:
      return Yup.object().shape({});
  }
};

export const RegisterPage = () => {
  const { addStudent, addPayment } = useData();
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredStudentName, setRegisteredStudentName] = useState('');
  const [registeredStudentId, setRegisteredStudentId] = useState('');

  // Initial form values
  const initialValues: RegistrationFormValues = {
    // Personal Details
    surname: '',
    first_name: '',
    other_name: '',
    email: '',
    student_id: '',
    gender: 'Male',
    nationality: 'Ghana',
    phone_number: '',
    // Academic Details
    course: 'Computer Science',
    level: '100',
    study_mode: 'regular',
    residential_status: 'resident',
    hall: '',
    // Financial Details
    amount: '',
    reference_id: '',
    payment_method: 'cash',
    mobile_number: '',
    bank_name: 'GCB Bank',
    operator: '',
  };

  const courses = [
    'Computer Science',
    'Information Technology',
    'Mathematical Science',
    'Physical Science',
    'Actuarial Science',
    'Education',
    'Allied Health'
  ];

  const levels = ['100', '200', '300', '400', '500', '600', '700'];

  const halls = [
    'Mensah Sarbah Hall',
    'Legon Hall',
    'Volta Hall',
    'Commonwealth Hall',
    'Akuafo Hall',
    'Pentagon Hostel',
    'Evandy Hostel',
    "Bani Hostel",
    'Limann', 
    'Kwapong', 
    'Elizabeth Sey', 
    'Jean Nelson',
    'Valco', 
    'Vikings',
    'International Hostels', 
    'Jubilee', 
    'Diamond Jubilee',
    "JAMES TOP NELSON YANKAH HALL (TF)",
    "Other"
  ];

  // Load saved form data on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('registration_form_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.step) setStep(data.step);
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, []);

  const handleSubmit = async (
    values: RegistrationFormValues,
    { setSubmitting, setErrors }: FormikHelpers<RegistrationFormValues>
  ) => {
    try {
      // Create full name from parts for display
      const fullName = `${values.surname} ${values.first_name} ${values.other_name}`.trim();

      // Create new student record with separate name fields
      const newStudent = {
        student_id: values.student_id,
        surname: values.surname,
        first_name: values.first_name,
        other_names: values.other_name || '',
        email: values.email,
        phone: values.phone_number,
        gender: values.gender,
        nationality: values.nationality,
        course: values.course,
        level: values.level,
        study_mode: values.study_mode,
        residential_status: values.residential_status,
        hall: values.residential_status === 'resident' ? values.hall : undefined,
      };

      // Add student via API
      const createdStudent = await addStudent(newStudent as any);

      // Create payment record if amount is provided
      if (values.amount && parseFloat(values.amount) > 0) {
        const studentFullName = `${createdStudent.surname} ${createdStudent.first_name} ${createdStudent.other_names || ''}`.trim();
        const newPayment: Payment = {
          id: '',
          student_id: createdStudent.id,
          student_name: studentFullName,
          amount: parseFloat(values.amount),
          // @ts-ignore
          payment_method: values.payment_method.toUpperCase(),
          reference_id: values.reference_id,
          operator: values.operator || '',
          recorded_by: '',
          payment_date: '',
          created_at: ''
        };

        // Add payment via API
        await addPayment(newPayment);
      }

      // Clear saved data and show success
      localStorage.removeItem('registration_form_data');
      setRegisteredStudentName(fullName);
      setRegisteredStudentId(values.student_id);
      setShowSuccessModal(true);
    } catch (err: any) {
      const errorMessage = formatApiError(err);
      setErrors({ student_id: errorMessage });
      console.error('Registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async (validateForm: () => Promise<any>) => {
    const errors = await validateForm();
    
    // If there are no validation errors, proceed to the next step
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    }
    // If there are errors, they're already displayed by Formik
  };

  return (
    <div className="animate-fade-in pb-6 max-w-2xl mx-auto space-y-4">
      {/* Enhanced Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full -z-10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>

          {[
            { num: 1, label: 'Personal Details', icon: User, desc: 'Basic information' },
            { num: 2, label: 'Academic Info', icon: GraduationCap, desc: 'Course & level' },
            { num: 3, label: 'Payment', icon: DollarSign, desc: 'Financial details' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = step === item.num;
            const isCompleted = step > item.num;
            const isAccessible = step >= item.num;

            return (
              <div key={item.num} className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-lg ${isCompleted
                    ? 'bg-green-500 text-white scale-110'
                    : isActive
                      ? 'bg-blue-500 text-white scale-110 ring-4 ring-blue-200 dark:ring-blue-800'
                      : isAccessible
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <span
                    className={`block text-lg font-semibold ${isAccessible
                      ? 'text-gray-800 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchemaForStep(step)}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting, validateForm, setFieldValue, setErrors }) => {
          // Auto-save functionality
          useEffect(() => {
            const timeoutId = setTimeout(() => {
              const formData = {
                step,
                ...values,
                timestamp: new Date().toISOString()
              };
              localStorage.setItem('registration_form_data', JSON.stringify(formData));
            }, 1000);

            return () => clearTimeout(timeoutId);
          }, [step, values]);

          return (
            <Form>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4">
                  {/* Step 1: Personal Details */}
                  {step === 1 && (
                    <div className="space-y-4 animate-slide-in">
                      {/* Name Fields */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                          <User className="w-3 h-3" />
                          Student Name *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Field
                              name="surname"
                              type="text"
                              className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                              placeholder="Surname *"
                            />
                            {touched.surname && errors.surname && (
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.surname}</div>
                            )}
                          </div>
                          <div>
                            <Field
                              name="first_name"
                              type="text"
                              className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                              placeholder="First Name *"
                            />
                            {touched.first_name && errors.first_name && (
                              <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.first_name}</div>
                            )}
                          </div>
                          <div>
                            <Field
                              name="other_name"
                              type="text"
                              className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                              placeholder="Other Name (Optional)"
                            />
                          </div>
                        </div>
                        {(values.surname || values.first_name || values.other_name) && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Full name: <span className="font-medium text-blue-600 dark:text-blue-400">
                              {`${values.surname} ${values.first_name} ${values.other_name}`.trim() || 'Enter name above'}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Student ID */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                          <CreditCard className="w-3 h-3" />
                          Student ID *
                        </label>
                        <Field
                          name="student_id"
                          type="text"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                          placeholder="e.g., 11*****8"
                        />
                        {touched.student_id && errors.student_id && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.student_id}</div>
                        )}
                      </div>

                      {/* Student Email */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                          <Mail className="w-3 h-3" />
                          Student Email *
                        </label>
                        <div className="relative">
                          <Field
                            name="email"
                            type="email"
                            className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            placeholder="Enter email"
                          />
                        </div>
                        {touched.email && errors.email && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</div>
                        )}
                        <p className="text-base text-gray-500 dark:text-gray-400">
                          Email: <span className="font-medium text-blue-600 dark:text-blue-400">
                            {values.email || 'email@st.ug.edu.gh'}
                          </span>
                        </p>
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                          Gender *
                        </label>
                        <Field
                          as="select"
                          name="gender"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Field>
                      </div>

                      {/* Nationality */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                          Nationality *
                        </label>
                        <Field
                          as="select"
                          name="nationality"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                          <Phone className="w-3 h-3" />
                          Phone Number *
                        </label>
                        <Field
                          name="phone_number"
                          type="tel"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                          placeholder="+233 XX XXX XXXX"
                        />
                        {touched.phone_number && errors.phone_number && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.phone_number}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Academic Details */}
                  {step === 2 && (
                    <div className="space-y-4 animate-slide-in">
                      {/* Course */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                          <GraduationCap className="w-3 h-3" />
                          Course *
                        </label>
                        <Field
                          as="select"
                          name="course"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          {courses.map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Level */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                          Academic Level *
                        </label>
                        <Field
                          as="select"
                          name="level"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          {levels.map((level) => (
                            <option key={level} value={level}>
                              Level {level}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Study Mode */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                          Study Mode *
                        </label>
                        <Field
                          as="select"
                          name="study_mode"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="regular">Regular</option>
                          <option value="distance">Distance</option>
                          <option value="city_campus">City Campus</option>
                        </Field>
                      </div>

                      {/* Residential Status */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                          Residential Status *
                        </label>
                        <Field
                          as="select"
                          name="residential_status"
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue('residential_status', e.target.value);
                            if (e.target.value === 'non_resident') {
                              setFieldValue('hall', '');
                            }
                          }}
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="resident">Resident</option>
                          <option value="non_resident">Non-Resident</option>
                        </Field>
                      </div>

                      {/* Hall/Hostel */}
                      {values.residential_status === 'resident' && (
                        <div className="space-y-2 animate-slide-in">
                          <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            Hall/Hostel *
                          </label>
                          <Field
                            as="select"
                            name="hall"
                            className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select Hall/Hostel</option>
                            {halls.map((hall) => (
                              <option key={hall} value={hall}>
                                {hall}
                              </option>
                            ))}
                          </Field>
                          {touched.hall && errors.hall && (
                            <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.hall}</div>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Required for resident students
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Financial Details */}
                  {step === 3 && (
                    <div className="space-y-4 animate-slide-in">
                      {/* Amount */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                          <DollarSign className="w-3 h-3" />
                          Amount (GHS) *
                        </label>
                        <Field
                          name="amount"
                          type="text"
                          step="0.01"
                          list="amount-options"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                          placeholder="Select or enter amount"
                        />
                        <datalist id="amount-options">
                          <option value="20">20</option>
                          <option value="100">100</option>
                          <option value="120">120</option>
                        </datalist>
                        {touched.amount && errors.amount && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.amount}</div>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Common amounts: GH₵20, GH₵100 or enter custom amount
                        </p>
                      </div>

                      {/* Reference ID */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                          Reference ID *
                        </label>
                        <Field
                          name="reference_id"
                          type="text"
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                          placeholder="Payment reference number"
                        />
                        {touched.reference_id && errors.reference_id && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.reference_id}</div>
                        )}
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                          Payment Method *
                        </label>
                        <Field
                          as="select"
                          name="payment_method"
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const newPaymentMethod = e.target.value;
                            setFieldValue('payment_method', newPaymentMethod);
                            // Clear operator when switching away from momo
                            if (newPaymentMethod !== 'momo') {
                              setFieldValue('operator', '');
                            }
                          }}
                          className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="cash">Cash Payment</option>
                          <option value="momo">Mobile Money</option>
                          <option value="bank">Bank Transfer</option>
                        </Field>
                      </div>

                      {/* Mobile Money Operator */}
                      {values.payment_method === 'momo' && (
                        <div className="space-y-2 animate-slide-in">
                          <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                            Mobile Money Operator *
                          </label>
                          <Field
                            as="select"
                            name="operator"
                            className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="">Select operator</option>
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="Telecel">Telecel Cash</option>
                            <option value="AirtelTigo">AirtelTigo Money</option>
                          </Field>
                          {touched.operator && errors.operator && (
                            <div className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.operator}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Display */}
                  {Object.keys(errors).length > 0 && touched && (
                    <ErrorMessage 
                      message={Object.values(errors)[0] as string} 
                      onClose={() => setErrors({})} 
                      className="mt-4" 
                    />
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex items-center gap-1 px-4 py-2 text-base bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Previous
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <div className="flex items-center gap-2 text-base text-gray-500 dark:text-gray-400">
                      Step {step} of 3
                    </div>

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={() => handleNext(validateForm)}
                        className="flex items-center gap-1 px-4 py-2 text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-all font-medium shadow-lg"
                      >
                        Next
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-1 px-4 py-2 text-base bg-green-500 text-white rounded hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                      >
                        {isSubmitting ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        Complete Registration
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full animate-fade-in-up">
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setStep(1);
                  window.location.reload(); // Reload to reset form
                }}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="px-8 pb-8 pt-2 relative overflow-hidden">
              {/* Minimal sparkles */}
              <div className="absolute top-8 right-12 text-yellow-400 text-xl animate-pulse">✨</div>
              <div className="absolute bottom-12 left-12 text-green-400 text-xl animate-pulse animation-delay-500">✨</div>

              <div className="flex flex-col items-center text-center relative z-10">
                {/* Checkmark with subtle glow */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                  </div>
                </div>

                {/* Main message */}
                <p className="text-2xl text-gray-800 dark:text-white font-semibold mb-2">
                  Student <span className="text-green-500 dark:text-green-400">{registeredStudentId}</span>
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  Successfully Registered
                </p>

                {/* Happy emoji */}
                <p className="text-3xl">🎉</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
