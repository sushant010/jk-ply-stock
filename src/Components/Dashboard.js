import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardAdmin from './DashboardAdmin';
import DashboardStaff from './DashboardStaffs';
import DashboardMultiple from './DashboardMultiple';

function Dashboard() {
    const [masterAccess, setMasterAccess] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const { state } = location;
        if (state && state.master !== undefined) {
            if (state.master === 1) {
                setMasterAccess('admin');
            } else if (state.master === 0) {
                setMasterAccess('staff');
            } else if (state.master === 3) {
                setMasterAccess('super');
            }
        } else {
            navigate('/login');
        }
    }, [location, navigate]);


    const handleSignOut = () => {
        setMasterAccess(null);
        navigate('/login', { replace: true });

        window.history.pushState({}, document.title, '/login');
        window.addEventListener('popstate', () => {
            window.history.pushState({}, document.title, '/login');
        });
    };

    useEffect(() => {
        const handleUnauthorizedAccess = () => {
            if (!masterAccess) {
                navigate('/login', { replace: true });
            }
        };

        window.addEventListener('popstate', handleUnauthorizedAccess);

        return () => {
            window.removeEventListener('popstate', handleUnauthorizedAccess);
        };
    }, [masterAccess, navigate]);

    // useEffect(() => {
    //     if (location.pathname === '/login' && masterAccess === null) {
    //         const handleForwardNavigation = () => {
    //             navigate('/login', { replace: true });
    //         };
    //         handleForwardNavigation();
    //     }
    // }, [location.pathname, masterAccess, navigate]);

    return (
        <div>
            {masterAccess === 'admin' && (
                <div>
                    <DashboardAdmin handleSignOut={handleSignOut} />
                </div>
            )}
            {masterAccess === 'staff' && (
                <div>
                    <DashboardStaff handleSignOut={handleSignOut} />
                </div>
            )}

            {masterAccess === 'super' && (
                <div>
                    <DashboardMultiple handleSignOut={handleSignOut} />
                </div>
            )}
        </div>
    );
}

export default Dashboard;
