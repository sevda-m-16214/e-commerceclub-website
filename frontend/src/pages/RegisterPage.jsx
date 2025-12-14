// frontend/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; 
import { ArrowLeft, User, Key } from 'lucide-react'; // Example icons for UI

const initialFormData = {
  email: '',
  full_name: '',
  phone_number: '',
  is_university_student: true, // Default to true for the first radio button selection
  // --- CHANGE 1: Use the new backend field names ---
  student_id: '', // New field for University Student ID
  national_id: '', // New field for National ID (PIN)
  password: '',
};

const RegisterPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = (step) => {
    setError('');
    
    // Simple Step 1 Validation
    if (step === 1) {
        // PHONE NUMBER IS ALREADY INCLUDED IN STEP 1 RENDER BELOW
        if (!formData.email || !formData.full_name) {
            setError('Email and Full Name are required.');
            return;
        }
    }
    // Simple Step 2 Validation (ID Code)
    if (step === 2) {
        // Validation now checks the correct, specific ID field
        const idRequired = formData.is_university_student ? formData.student_id : formData.national_id;

        if (!idRequired) {
            setError(formData.is_university_student 
                ? 'Student ID Code is required.' 
                : 'National ID Code is required.');
            return;
        }
    }
    
    // Proceed to the next step
    setCurrentStep(step + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    // Simple Step 3 Validation (Password)
    if (!formData.password) {
        setError('Password is required.');
        setIsSubmitting(false);
        return;
    }

    // --- CHANGE 4: Conditional ID Logic for API Payload ---
    // Prepare data based on the status flag to match the backend's conditional validation
    let payload = {
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password,
        is_university_student: formData.is_university_student,
        phone_number: formData.phone_number || null,
        // The backend expects one ID field to be provided and the other to be null/omitted.
        // We send the correct ID and ensure the other is null or omitted (omitting is safer)
    };

    if (formData.is_university_student) {
        payload.student_id = formData.student_id;
        payload.national_id = null; // Ensure the other field is explicitly null/omitted if the backend expects it.
    } else {
        payload.national_id = formData.national_id;
        payload.student_id = null;
    }

    try {
      // API CALL to /auth/register
      const response = await axiosInstance.post('/api/auth/register', payload);

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); 
      }, 2000);

    } catch (err) {
      let message = 'Registration failed. Please try again.';
      // Enhanced error handling from FastAPI
      if (err.response && err.response.data && err.response.data.detail) {
        if (Array.isArray(err.response.data.detail)) {
            // Check for Pydantic validation errors
            if (err.response.data.detail[0].loc && err.response.data.detail[0].loc[1] === 'password') {
                message = `Password Error: ${err.response.data.detail[0].msg}`;
            } else {
                message = `Validation Error: ${err.response.data.detail[0].msg}`;
            }
        } else {
            message = err.response.data.detail; 
        }
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step 1: Basic Info (Phone Number is already here) ---
  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email address *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} 
              className="w-full px-3 py-2 border rounded-md" placeholder="e.g., jane@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Jane Doe" />
        </div>
        <div>
          {/* PHONE NUMBER FIELD - CONFIRMED TO BE HERE */}
          <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
          <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md" placeholder="e.g., +994 50 123 45 67" />
        </div>
      </div>
      <div className="pt-6">
        <button type="button" onClick={() => handleNext(1)}
          className="w-full py-2 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Next: Choose Status
        </button>
      </div>
    </>
  );

  // --- Step 2: Status and ID Code ---
  const renderStep2 = () => (
    <>
      <h3 className="text-xl font-semibold mb-4 text-center">Your Status</h3>
      <div className="space-y-4">
        {/* Radio buttons for Student status */}
        <div className="flex items-center space-x-4 justify-center mb-6">
            <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.is_university_student ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                <input type="radio" name="is_university_student" checked={formData.is_university_student === true} onChange={() => setFormData(prev => ({ ...prev, is_university_student: true, national_id: '' }))} className="hidden" />
                <span className="text-gray-800 font-medium">University Student</span>
            </label>
            <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${formData.is_university_student === false ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                <input type="radio" name="is_university_student" checked={formData.is_university_student === false} onChange={() => setFormData(prev => ({ ...prev, is_university_student: false, student_id: '' }))} className="hidden" />
                <span className="text-gray-800 font-medium">Non-Student / Other</span>
            </label>
        </div>

        {/* Dynamic ID Code Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {formData.is_university_student ? 'Student ID Code (5 digits) *' : 'National ID Code (7 chars) *'}
          </label>
          <input 
            type="text" 
            // --- CHANGE 3: Dynamic Name Assignment ---
            name={formData.is_university_student ? 'student_id' : 'national_id'}
            required 
            // --- CHANGE 3: Dynamic Value Assignment ---
            value={formData.is_university_student ? formData.student_id : formData.national_id} 
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md" 
            placeholder={formData.is_university_student ? 'e.g., 12345' : 'e.g., A1B2C3D'} 
          />
        </div>
      </div>
      <div className="pt-6 flex space-x-3">
        <button type="button" onClick={handleBack}
          className="w-1/3 py-2 px-4 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold flex items-center justify-center"
        >
          <ArrowLeft size={16} className="mr-2"/> Back
        </button>
        <button type="button" onClick={() => handleNext(2)}
          className="w-2/3 py-2 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Next: Set Password
        </button>
      </div>
    </>
  );

  // --- Step 3: Password and Submit ---
  const renderStep3 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 text-center">Security</h3>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
        <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange}
          className="w-full px-3 py-2 mt-1 border rounded-md" />
        <p className="mt-1 text-xs text-gray-500">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol.</p>
      </div>
      
      <div className="flex space-x-3">
        <button type="button" onClick={handleBack}
          className="w-1/3 py-2 px-4 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold flex items-center justify-center"
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} className="mr-2"/> Back
        </button>
        <button type="submit" disabled={isSubmitting}
          className={`w-2/3 flex justify-center py-2 px-4 rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          {isSubmitting ? 'Finalizing...' : 'Complete Registration'}
        </button>
      </div>
    </form>
  );

  // --- Main Render ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 flex items-center justify-center">
            <User size={28} className="mr-2 text-indigo-600"/> New Account
        </h2>
        
        {/* Progress Tracker */}
        <div className="flex justify-between items-center text-sm font-medium pt-2 pb-4">
            <span className={`flex-1 text-center ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>Step 1: Contact</span>
            <span className="w-10 h-0.5 bg-gray-300 mx-1"></span>
            <span className={`flex-1 text-center ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>Step 2: ID</span>
            <span className="w-10 h-0.5 bg-gray-300 mx-1"></span>
            <span className={`flex-1 text-center ${currentStep >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>Step 3: Password</span>
        </div>

        {/* Messages */}
        {successMessage && <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded">{successMessage}</div>}
        {error && <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>}

        {/* Conditional Step Rendering */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        
        <p className="text-sm text-center text-gray-600 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;