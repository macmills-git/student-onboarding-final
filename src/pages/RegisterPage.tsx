import { useState, FormEvent, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, User, GraduationCap, DollarSign, FileText, Activity, Phone, Mail, CreditCard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData, Payment } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { countries } from '../data/countries';
import { 
  personalDetailsSchema, 
  academicDetailsSchema, 
  financialDetailsSchema,
  getValidationErrors,
  formatApiError 
} from '../utils/validationSchemas';
import { ErrorMessage } from '../components/ErrorMessage';

interface PersonalDetails {
  surname: string;
  first_name: string;
  other_name: string;
  email: string;
  student_id: string;
  gender: string;
  nationality: string;
  phone_number: string;
}

interface AcademicDetails {
  course: string;
  level: string;
  study_mode: 'regular' | 'distance' | 'city_campus';
  residential_status: 'resident' | 'non_resident';
  hall: string;
}

interface FinancialDetails {
  amount: string;
  reference_id: string;
  payment_method: 'cash' | 'momo' | 'bank';
  mobile_number: string;
  bank_name: string;
  operator?: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { students, addStudent, addPayment } = useData();
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredStudentName, setRegisteredStudentName] = useState('');
  const [registeredStudentId, setRegisteredStudentId] = useState('');


  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    surname: '',
    first_name: '',
    other_name: '',
    email: '',
    student_id: '',
    gender: 'Male',
    nationality: 'Ghana',
    phone_number: '',
  });

  const [academicDetails, setAcademicDetails] = useState<AcademicDetails>({
    course: 'Computer Science',
    level: '100',
    study_mode: 'regular',
    residential_status: 'resident',
    hall: '',
  });

  const [financialDetails, setFinancialDetails] = useState<FinancialDetails>({
    amount: '',
    reference_id: '',
    payment_method: 'cash',
    mobile_number: '',
    bank_name: 'GCB Bank',
  });

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

  // Form validation using Yup
  const validatePersonalDetails = async () => {
    try {
      await personalDetailsSchema.validate(personalDetails, { abortEarly: false });
      return null;
    } catch (error: any) {
      return getValidationErrors(error);
    }
  };

  const validateAcademicDetails = async () => {
    try {
      await academicDetailsSchema.validate(academicDetails, { abortEarly: false });
      return null;
    } catch (error: any) {
      return getValidationErrors(error);
    }
  };

  const validateFinancialDetails = async () => {
    try {
      const validationData = {
        ...financialDetails,
        amount: financialDetails.amount ? parseFloat(financialDetails.amount) : 0,
      };
      await financialDetailsSchema.validate(validationData, { abortEarly: false });
      return null;
    } catch (error: any) {
      return getValidationErrors(error);
    }
  };

  // Clear saved data function
  const clearSavedData = () => {
    localStorage.removeItem('registration_form_data');
  };

  // Load saved form data on component mount (simplified)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('registration_form_data');
      if (saved) {
        const data = JSON.parse(saved);
        console.log('Loading saved data:', data); // Debug log

        if (data.personalDetails) setPersonalDetails(data.personalDetails);
        if (data.academicDetails) setAcademicDetails(data.academicDetails);
        if (data.financialDetails) setFinancialDetails(data.financialDetails);
        if (data.step) setStep(data.step);
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, []);

  // Simple auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const formData = {
        step,
        personalDetails,
        academicDetails,
        financialDetails,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('registration_form_data', JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [step, personalDetails, academicDetails, financialDetails]);

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

  const handleNext = async () => {
    // Validate current step before proceeding
    let error = null;
    if (step === 1) {
      error = await validatePersonalDetails();
    } else if (step === 2) {
      error = await validateAcademicDetails();
    }
    
    if (error) {
      setError(error);
      return;
    }
    
    setError('');
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submission
    const personalError = await validatePersonalDetails();
    const academicError = await validateAcademicDetails();
    const financialError = await validateFinancialDetails();
    
    if (personalError || academicError || financialError) {
      setError(personalError || academicError || financialError || 'Please fill all required fields');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Create full name from parts for display
      const fullName = `${personalDetails.surname} ${personalDetails.first_name} ${personalDetails.other_name}`.trim();

      // Create new student record with separate name fields
      const newStudent = {
        student_id: personalDetails.student_id,
        surname: personalDetails.surname,
        first_name: personalDetails.first_name,
        other_names: personalDetails.other_name || '',
        email: personalDetails.email,
        phone: personalDetails.phone_number,
        gender: personalDetails.gender,
        nationality: personalDetails.nationality,
        course: academicDetails.course,
        level: academicDetails.level,
        study_mode: academicDetails.study_mode,
        residential_status: academicDetails.residential_status,
        hall: academicDetails.residential_status === 'resident' ? academicDetails.hall : undefined,
      };

      // Add student via API
      const createdStudent = await addStudent(newStudent as any);

      // Create payment record if amount is provided
      if (financialDetails.amount && parseFloat(financialDetails.amount) > 0) {
        const studentFullName = `${createdStudent.surname} ${createdStudent.first_name} ${createdStudent.other_names || ''}`.trim();
        const newPayment: Payment = {
          id: '',
          student_id: createdStudent.id,
          student_name: studentFullName,
          amount: parseFloat(financialDetails.amount),
          // @ts-ignore
          payment_method: financialDetails.payment_method.toUpperCase(),
          reference_id: financialDetails.reference_id,
          operator: financialDetails.operator || '',
          recorded_by: '',
          payment_date: '',
          created_at: ''
        };

        // Add payment via API
        await addPayment(newPayment);
      }

      // Show success modal and clear saved data
      setRegisteredStudentName(fullName);
      setRegisteredStudentId(personalDetails.student_id);
      setShowSuccessModal(true);
      clearSavedData(); // Clear saved form data after successful submission
    } catch (err: any) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      // Require surname, first_name, email, student_id, gender, nationality, phone_number
      // other_name is optional
      return personalDetails.surname.trim() !== '' &&
        personalDetails.first_name.trim() !== '' &&
        personalDetails.email.trim() !== '' &&
        personalDetails.student_id.trim() !== '' &&
        personalDetails.gender.trim() !== '' &&
        personalDetails.nationality.trim() !== '' &&
        personalDetails.phone_number.trim() !== '';
    }
    if (step === 2) {
      // Check if all required fields are filled
      const requiredFields = [academicDetails.course, academicDetails.level, academicDetails.study_mode, academicDetails.residential_status];
      const allFieldsFilled = requiredFields.every((val) => val.trim() !== '');
      
      // If residential_status is 'resident', hall must be specified
      if (academicDetails.residential_status === 'resident') {
        return allFieldsFilled && academicDetails.hall.trim() !== '';
      }
      
      return allFieldsFilled;
    }
    if (step === 3) {
      const baseValid = financialDetails.amount && financialDetails.reference_id;
      if (financialDetails.payment_method === 'momo') {
        return baseValid && financialDetails.operator && financialDetails.operator.trim() !== '';
      }
      if (financialDetails.payment_method === 'bank') {
        return baseValid && financialDetails.bank_name.trim() !== '';
      }
      return baseValid;
    }
    return false;
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

      {/* Step-by-Step Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">



          {/* Form Content - Show Only Current Step */}
          <div className="p-4">

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-slide-in">
                {/* Name Fields - Side by Side */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                    <User className="w-3 h-3" />
                    Student Name *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        value={personalDetails.surname}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, surname: e.target.value })
                        }
                        className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                        placeholder="Surname *"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={personalDetails.first_name}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, first_name: e.target.value })
                        }
                        className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                        placeholder="First Name *"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={personalDetails.other_name}
                        onChange={(e) =>
                          setPersonalDetails({ ...personalDetails, other_name: e.target.value })
                        }
                        className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                        placeholder="Other Name (Optional)"
                      />
                    </div>
                  </div>
                  {(personalDetails.surname || personalDetails.first_name || personalDetails.other_name) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Full name: <span className="font-medium text-blue-600 dark:text-blue-400">
                        {`${personalDetails.surname} ${personalDetails.first_name} ${personalDetails.other_name}`.trim() || 'Enter name above'}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                    <CreditCard className="w-3 h-3" />
                    Student ID *
                  </label>
                  <input
                    type="text"
                    value={personalDetails.student_id}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, student_id: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="e.g., 11*****8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                    <Mail className="w-3 h-3" />
                    Student Email *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={personalDetails.email.replace('@st.ug.edu.gh', '')}
                      onChange={(e) => {
                        const username = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
                        setPersonalDetails({
                          ...personalDetails,
                          email: username + '@st.ug.edu.gh'
                        });
                      }}
                      className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                      placeholder="Enter username"
                      required
                    />
                    {personalDetails.email.replace('@st.ug.edu.gh', '') && (
                      <div className="absolute inset-0 px-3 py-2.5 text-base pointer-events-none flex items-center">
                        <span className="invisible">{personalDetails.email.replace('@st.ug.edu.gh', '')}</span>
                        <span className="text-gray-500 dark:text-gray-400">@st.ug.edu.gh</span>
                      </div>
                    )}
                  </div>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    Full email: <span className="font-medium text-blue-600 dark:text-blue-400">
                      {personalDetails.email || 'username@st.ug.edu.gh'}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Gender *
                  </label>
                  <select
                    value={personalDetails.gender}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, gender: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Nationality *
                  </label>
                  <select
                    value={personalDetails.nationality}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, nationality: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                    <Phone className="w-3 h-3" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={personalDetails.phone_number}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, phone_number: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="+233 XX XXX XXXX"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academic Details */}
            {step === 2 && (
              <div className="space-y-4 animate-slide-in">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                    <GraduationCap className="w-3 h-3" />
                    Course *
                  </label>
                  <select
                    value={academicDetails.course}
                    onChange={(e) =>
                      setAcademicDetails({ ...academicDetails, course: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Academic Level *
                  </label>
                  <select
                    value={academicDetails.level}
                    onChange={(e) =>
                      setAcademicDetails({ ...academicDetails, level: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        Level {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Study Mode *
                  </label>
                  <select
                    value={academicDetails.study_mode}
                    onChange={(e) =>
                      setAcademicDetails({
                        ...academicDetails,
                        study_mode: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="distance">Distance</option>
                    <option value="city_campus">City Campus</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Residential Status *
                  </label>
                  <select
                    value={academicDetails.residential_status}
                    onChange={(e) =>
                      setAcademicDetails({
                        ...academicDetails,
                        residential_status: e.target.value as any,
                        hall: e.target.value === 'non_resident' ? '' : academicDetails.hall,
                      })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="resident">Resident</option>
                    <option value="non_resident">Non-Resident</option>
                  </select>
                </div>

                {/* Hall/Hostel - Only for Residents */}
                {academicDetails.residential_status === 'resident' && (
                  <div className="space-y-2 animate-slide-in">
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                      Hall/Hostel *
                    </label>
                    <select
                      value={academicDetails.hall}
                      onChange={(e) =>
                        setAcademicDetails({
                          ...academicDetails,
                          hall: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Hall/Hostel</option>
                      {halls.map((hall) => (
                        <option key={hall} value={hall}>
                          {hall}
                        </option>
                      ))}
                    </select>
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
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-base font-medium text-gray-700 dark:text-gray-300">
                    <DollarSign className="w-3 h-3" />
                    Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    list="amount-options"
                    value={financialDetails.amount}
                    onChange={(e) =>
                      setFinancialDetails({ ...financialDetails, amount: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Select or enter amount"
                    required
                  />
                  <datalist id="amount-options">
                    <option value="30">30</option>
                    <option value="100">100</option>
                    <option value="130">130</option>
                    <option value="150">150</option>
                  </datalist>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Common amounts: GH₵30, GH₵100, GH₵130, GH₵150 or enter custom amount
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Reference ID *
                  </label>
                  <input
                    type="text"
                    value={financialDetails.reference_id}
                    onChange={(e) =>
                      setFinancialDetails({ ...financialDetails, reference_id: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Payment reference number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                    Payment Method *
                  </label>
                  <select
                    value={financialDetails.payment_method}
                    onChange={(e) => {
                      const newPaymentMethod = e.target.value as any;
                      setFinancialDetails({
                        ...financialDetails,
                        payment_method: newPaymentMethod,
                        // Clear operator when switching away from momo
                        operator: newPaymentMethod === 'momo' ? financialDetails.operator : '',
                      });
                    }}
                    className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="momo">Mobile Money</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                {financialDetails.payment_method === 'momo' && (
                  <div className="space-y-2">
                    <label className="block text-base font-medium text-gray-700 dark:text-gray-300">
                      Mobile Money Operator *
                    </label>
                    <select
                      value={financialDetails.operator}
                      onChange={(e) =>
                        setFinancialDetails({ ...financialDetails, operator: e.target.value })
                      }
                      className="w-full px-3 py-2.5 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select operator</option>
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="Telecel">Telecel Cash</option>
                      <option value="AirtelTigo">AirtelTigo Money</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <ErrorMessage message={error} onClose={() => setError('')} className="mt-4" />



            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
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
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-1 px-4 py-2 text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  Next
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStepValid()}
                  className="flex items-center gap-1 px-4 py-2 text-base bg-green-500 text-white rounded hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  {loading ? (
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
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full animate-fade-in-up">
            <div className="flex items-center justify-end p-4">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setStep(1);
                  setPersonalDetails({
                    surname: '',
                    first_name: '',
                    other_name: '',
                    email: '',
                    student_id: '',
                    gender: 'Male',
                    nationality: 'Ghanaian',
                    phone_number: '',
                  });
                  setAcademicDetails({
                    course: 'Computer Science',
                    level: '100',
                    study_mode: 'regular',
                    residential_status: 'resident',
                    hall: '',
                  });
                  setFinancialDetails({
                    amount: '',
                    reference_id: '',
                    payment_method: 'cash',
                    mobile_number: '',
                    bank_name: 'GCB Bank',
                  });
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
