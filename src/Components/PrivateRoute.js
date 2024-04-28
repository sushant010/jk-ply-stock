import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContextProvider';

export function PrivateRoute({ element, ...rest }) {
    const { isAuthenticated } = useAuth();
    return (
        <Route
            {...rest}
            element={isAuthenticated ? element : <Navigate to="/login" />}
        />
    );
}
