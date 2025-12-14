import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance'; 
// NOTE: jwtDecode is still unnecessary, but kept for minimal changes

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(''); 
  //   setIsSubmitting(true);

  //   let jwtToken = null;

  //   try {
      
  //     // ----------------------------------------------------
  //     // PART 1: AUTHENTICATE AND GET TOKEN (Sending JSON Body)
  //     // ----------------------------------------------------
      
  //     // Removed: const formData = new URLSearchParams(); and formData.append(...)
      
  //     const tokenResponse = await axiosInstance.post(
  //         '/api/auth/login', 
  //         {
  //             // 💥 FIX: Send a JSON body matching the LoginRequest schema (assuming email/password)
  //             email: email, // Your Pydantic model is LoginRequest(email, password)
  //             password: password,
  //         }
  //         // Removed: The third argument { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  //     );
      
  //     // The rest of the logic remains valid, provided the user is successfully authenticated.
  //     jwtToken = tokenResponse.data.access_token; 
      
  //     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

  //     // ----------------------------------------------------
  //     // PART 2 & 3: FETCH USER PROFILE & LOG IN
  //     // ----------------------------------------------------
  //     const userResponse = await axiosInstance.get('/api/users/me'); 
  //     const userData = userResponse.data; 

  //     if (!userData) {
  //          throw new Error("Failed to fetch complete user data.");
  //     }
      
  //     login(userData, jwtToken); 

  //     // Redirect the User to the home page (where / is defined)
  //     navigate('/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsSubmitting(true);

    try {
      
      // ----------------------------------------------------
      // PART 1: AUTHENTICATE AND GET TOKEN (200 OK)
      // ----------------------------------------------------
      const tokenResponse = await axiosInstance.post(
          '/api/auth/login', 
          {
              email: email,
              password: password,
          }
      );
      
      const jwtToken = tokenResponse.data.access_token; 
      
      // 💥 CRITICAL CHANGE: 
      // Call login() first to store the token, which activates the interceptor.
      // We pass null/placeholder data temporarily just to store the token.
      login(null, jwtToken); 

      // ----------------------------------------------------
      // PART 2 & 3: FETCH USER PROFILE & FINAL LOG IN
      // ----------------------------------------------------
      // The interceptor will now automatically include the token in this call:
      const userResponse = await axiosInstance.get('/api/users/me'); 
      const userData = userResponse.data; 

      if (!userData) {
           throw new Error("Failed to fetch complete user data.");
      }
      
      // Now call login with the actual user data to finalize the context state
      // This is a re-login, but it ensures the context has the full user object.
      login(userData, jwtToken); 

      // Redirect the User
      navigate('/');

      

    } catch (err) {

      logout();
      // 5. Handle Errors (Clean up the temporary header if we failed after getting token)
      if (!jwtToken) { 
        delete axiosInstance.defaults.headers.common['Authorization']; 
      }
      
      let message = 'Login failed. Please check your credentials or network.';
      if (err.response && err.response.data && err.response.data.detail) {
        // If the error happens during the token call, the token is invalid
        message = err.response.data.detail.msg || err.response.data.detail; 
      }
      setError(message);

    } finally {
      // If Part 3 succeeded, the AuthContext.login function handles setting the header.
      // If it failed, the manual cleanup above runs.
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to E-Commerce Club</h2>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email" // Use 'text' if your backend allows username
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;