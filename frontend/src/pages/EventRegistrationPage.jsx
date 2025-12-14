// frontend/src/pages/EventRegistrationPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext'; 

const EventRegistrationPage = () => {
    const { id } = useParams(); // Event ID
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();

    // 1. State for data fetching
    const [event, setEvent] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. State for form and submission
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        // IDs are optional for database persistence but required for display
        studentId: '', 
        nationalId: '', 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    
    // --- Data Fetching: Event & User Profile ---
    useEffect(() => {
        if (!isAuthenticated || isAdmin) {
            // Redirect non-logged-in users or admins (Admins register differently, if at all)
            navigate('/login');
            return;
        }

        const fetchDetails = async () => {
            let fetchedEvent = null;
            let fetchedUser = null;
            let fetchError = null;

            try {
                // Fetch Event Details
                const eventResponse = await axiosInstance.get(`/api/events/${id}`);
                fetchedEvent = eventResponse.data;
                setEvent(fetchedEvent);

                // Fetch User Details for Pre-fill (Protected route /users/me)
                const userResponse = await axiosInstance.get('/api/users/me'); 
                fetchedUser = userResponse.data;
                setUserProfile(fetchedUser);

                // Pre-fill Form Data using the fetched profile
                setFormData({
                    fullName: fetchedUser.full_name || '',
                    email: fetchedUser.email || '',
                    phoneNumber: fetchedUser.phone_number || '',
                    
                    // Handle DUMMY values from the DB (set by your UserCreate schema logic)
                    studentId: fetchedUser.student_id && fetchedUser.student_id.startsWith('DS-') ? '' : fetchedUser.student_id || '',
                    nationalId: fetchedUser.national_id && fetchedUser.national_id.startsWith('DN-') ? '' : fetchedUser.national_id || '',
                });

            } catch (err) {
                console.error("Fetch Error:", err);
                fetchError = err.response?.data?.detail || "Failed to load event or user details.";
            } finally {
                setError(fetchError);
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, isAuthenticated, isAdmin, navigate]);

    // --- Form Handling ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic frontend validation (optional, but good practice)
        if (!formData.fullName || !formData.email) {
            setError("Full name and email are required.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        try {
            // 1. API Call: POST to the secure registration endpoint. 
            // The backend automatically uses the user ID from the JWT token.
            await axiosInstance.post('/api/registrations/', {
                event_id: parseInt(id),
            });

            // 2. Success Handling: Set success state.
            setRegistrationSuccess(true);
            
            // 3. Redirection: Navigate the user back to the event page.
            setTimeout(() => navigate(`/events/${id}`), 2000); // Redirect after a short delay

        } catch (err) {
            const message = err.response?.data?.detail || "Registration failed due to an unexpected server error.";
            setError(message);
            setIsSubmitting(false);
        }
    };
    
    // --- Conditional Rendering ---
    if (loading) {
        return <div className="text-center py-20">Loading event and user data for registration...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600">Error: {error}</div>;
    }
    
    if (registrationSuccess) {
        return (
            <div className="max-w-xl mx-auto py-20 px-4 text-center bg-green-50 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-green-700 mb-4">Registration Successful! 🎉</h2>
                <p className="text-gray-700 mb-6">You have been successfully registered for the event: **{event?.title}**.</p>
                {/* User is automatically redirected by the setTimeout above */}
                <p className="text-sm text-gray-500">Redirecting to event details...</p>
            </div>
        );
    }
    
    // Determine which ID field to show based on the user's profile type
    const showStudentId = userProfile?.is_university_student;
    const idFieldName = showStudentId ? 'studentId' : 'nationalId';
    const idFieldLabel = showStudentId ? 'University ID (Required)' : 'National ID (Required)';


    return (
        <div className="max-w-xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Register for:</h1>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-8">{event?.title}</h2>

            <form onSubmit={handleSubmit} className="p-8 bg-white border border-gray-200 rounded-lg shadow-xl space-y-6">
                
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled // Email should almost always be read-only/disabled
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Phone Number */}
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Student ID / National ID */}
                <div>
                    <label htmlFor={idFieldName} className="block text-sm font-medium text-gray-700">{idFieldLabel}</label>
                    <input
                        type="text"
                        name={idFieldName}
                        id={idFieldName}
                        value={formData[idFieldName]}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        *This ID is required based on your user profile type.
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-150 disabled:bg-indigo-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting Registration...' : 'Register Now'}
                </button>
                
                {/* Error Display */}
                {error && <div className="text-red-500 text-sm mt-3">{error}</div>}

                <div className="text-center pt-4">
                    <Link to={`/events/${id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                        ← Cancel and Return to Event
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EventRegistrationPage;