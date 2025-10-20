import { useState, FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, User, GraduationCap, DollarSign, FileText, Activity, Phone, Mail, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockStudents, mockPayments, Student, Payment } from '../lib/mockData';

interface PersonalDetails {
  name: string;
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
}

interface FinancialDetails {
  amount: string;
  reference_id: string;
  payment_method: 'cash' | 'momo';
  operator: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: '',
    email: '',
    student_id: '',
    gender: '',
    nationality: '',
    phone_number: '',
  });

  const [academicDetails, setAcademicDetails] = useState<AcademicDetails>({
    course: '',
    level: '',
    study_mode: 'regular',
    residential_status: 'resident',
  });

  const [financialDetails, setFinancialDetails] = useState<FinancialDetails>({
    amount: '',
    reference_id: '',
    payment_method: 'cash',
    operator: '',
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

  const levels = ['100', '200', '300', '400'];

  const nationalities = [
    'Ghanaian',
    'Nigerian',
    'Kenyan',
    'South African',
    'Other African',
    'International',
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create new student record
      const newStudent: Student = {
        id: (mockStudents.length + 1).toString(),
        student_id: personalDetails.student_id,
        name: personalDetails.name,
        email: personalDetails.email,
        gender: personalDetails.gender,
        nationality: personalDetails.nationality,
        phone_number: personalDetails.phone_number,
        course: academicDetails.course,
        level: academicDetails.level,
        study_mode: academicDetails.study_mode,
        residential_status: academicDetails.residential_status,
        registered_by: '1', // Current user ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Create payment record if amount is provided
      if (financialDetails.amount && parseFloat(financialDetails.amount) > 0) {
        const newPayment: Payment = {
          id: (mockPayments.length + 1).toString(),
          student_id: newStudent.id,
          student_name: newStudent.name,
          amount: parseFloat(financialDetails.amount),
          payment_method: financialDetails.payment_method,
          reference_id: financialDetails.reference_id,
          operator: financialDetails.operator || undefined,
          recorded_by: '1', // Current user ID
          payment_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        };

        // Add to mock data (in a real app, this would be API calls)
        mockPayments.unshift(newPayment);
      }

      // Add student to mock data
      mockStudents.unshift(newStudent);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      alert(`Student ${personalDetails.name} registered successfully!`);

      navigate('/students');
    } catch (err: any) {
      setError(err.message || 'Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return Object.values(personalDetails).every((val) => val.trim() !== '');
    }
    if (step === 2) {
      return Object.values(academicDetails).every((val) => val.trim() !== '');
    }
    if (step === 3) {
      return financialDetails.amount && financialDetails.reference_id;
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
                    className={`block text-sm font-semibold ${isAccessible
                      ? 'text-gray-800 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`block text-xs mt-1 ${isAccessible
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                      }`}
                  >
                    {item.desc}
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

          {/* Step Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 px-4 py-3 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                {step === 1 && <User className="w-3 h-3 text-white" />}
                {step === 2 && <GraduationCap className="w-3 h-3 text-white" />}
                {step === 3 && <DollarSign className="w-3 h-3 text-white" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  {step === 1 && 'Personal Details'}
                  {step === 2 && 'Academic Information'}
                  {step === 3 && 'Payment Information'}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {step === 1 && 'Enter the student\'s personal information'}
                  {step === 2 && 'Select course and academic preferences'}
                  {step === 3 && 'Provide payment and financial details'}
                </p>
              </div>
            </div>
          </div>

          {/* Form Content - Show Only Current Step */}
          <div className="p-4">

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-slide-in">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <User className="w-3 h-3" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={personalDetails.name}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, name: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <CreditCard className="w-3 h-3" />
                    Student ID *
                  </label>
                  <input
                    type="text"
                    value={personalDetails.student_id}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, student_id: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="e.g., 11*****8"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                      placeholder="Enter username"
                      required
                    />
                    {personalDetails.email.replace('@st.ug.edu.gh', '') && (
                      <div className="absolute inset-0 px-3 py-2.5 text-sm pointer-events-none flex items-center">
                        <span className="invisible">{personalDetails.email.replace('@st.ug.edu.gh', '')}</span>
                        <span className="text-gray-500 dark:text-gray-400">@st.ug.edu.gh</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Full email: <span className="font-medium text-blue-600 dark:text-blue-400">
                      {personalDetails.email || 'username@st.ug.edu.gh'}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gender *
                  </label>
                  <select
                    value={personalDetails.gender}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, gender: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nationality *
                  </label>
                  <select
                    value={personalDetails.nationality}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, nationality: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Nationality</option>
                    {nationalities.map((nat) => (
                      <option key={nat} value={nat}>
                        {nat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Phone className="w-3 h-3" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={personalDetails.phone_number}
                    onChange={(e) =>
                      setPersonalDetails({ ...personalDetails, phone_number: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
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
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <GraduationCap className="w-3 h-3" />
                    Course *
                  </label>
                  <select
                    value={academicDetails.course}
                    onChange={(e) =>
                      setAcademicDetails({ ...academicDetails, course: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Academic Level *
                  </label>
                  <select
                    value={academicDetails.level}
                    onChange={(e) =>
                      setAcademicDetails({ ...academicDetails, level: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Level</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        Level {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="distance">Distance</option>
                    <option value="city_campus">City Campus</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Residential Status *
                  </label>
                  <select
                    value={academicDetails.residential_status}
                    onChange={(e) =>
                      setAcademicDetails({
                        ...academicDetails,
                        residential_status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="resident">Resident</option>
                    <option value="non_resident">Non-Resident</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Financial Details */}
            {step === 3 && (
              <div className="space-y-4 animate-slide-in">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <DollarSign className="w-3 h-3" />
                    Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={financialDetails.amount}
                    onChange={(e) =>
                      setFinancialDetails({ ...financialDetails, amount: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reference ID *
                  </label>
                  <input
                    type="text"
                    value={financialDetails.reference_id}
                    onChange={(e) =>
                      setFinancialDetails({ ...financialDetails, reference_id: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Payment reference number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method *
                  </label>
                  <select
                    value={financialDetails.payment_method}
                    onChange={(e) =>
                      setFinancialDetails({
                        ...financialDetails,
                        payment_method: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="momo">Mobile Money</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Operator {financialDetails.payment_method === 'momo' && '(Required)'}
                  </label>
                  <input
                    type="text"
                    value={financialDetails.operator}
                    onChange={(e) =>
                      setFinancialDetails({ ...financialDetails, operator: e.target.value })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="e.g., MTN, Vodafone, AirtelTigo"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                Step {step} of 3
              </div>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
                >
                  Next
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStepValid()}
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
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

      {/* Help Section */}
      <div className="pt-11">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
              <User className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Need Help with Registration?
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-1 mb-1">
                <User className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-800 dark:text-green-300">Support Team</span>
              </div>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">Ready</p>
              <p className="text-xs text-green-600 dark:text-green-400">Here to assist you</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded p-3 border border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-1 mb-1">
                <FileText className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-medium text-teal-800 dark:text-teal-300">FAQ Available</span>
              </div>
              <p className="text-lg font-bold text-teal-900 dark:text-teal-100">50+</p>
              <p className="text-xs text-teal-600 dark:text-teal-400">Common questions</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded p-3 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Quick Help</span>
              </div>
              <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">Instant</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Get help now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};