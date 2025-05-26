import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        if (role && decoded.role !== role) {
            return <Navigate to="/login" replace />;
        }
        return children;
    } catch (err) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;