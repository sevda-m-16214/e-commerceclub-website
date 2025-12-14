// frontend/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your authentication context

const AdminRoute = ({ element: Element }) => {
    // 1. Get the authentication state
    const { isAuthenticated, isAdmin, loading } = useAuth(); // Make sure loading is provided too

    // If the context is still loading user state (e.g., checking token), display a spinner
    if (loading) {
        return <div className="text-center py-20">Loading authentication status...</div>;
    }

    // 2. Check if the user is authenticated AND if they are an admin
    if (isAuthenticated && isAdmin) {
        // If they are an admin, render the component passed as 'element'
        return <Element />;
    }
    
    // 3. If not an admin or not logged in, redirect them
    // If not logged in, send to login page. If logged in but not admin, send to home page.
    const redirectPath = isAuthenticated ? '/' : '/login';

    return <Navigate to={redirectPath} replace />;
};

export default AdminRoute;