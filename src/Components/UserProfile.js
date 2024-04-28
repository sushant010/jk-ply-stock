import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, where } from 'firebase/firestore';
import app from '../firebase';
import UserDetails from './UserDetails';
import { query } from 'firebase/database';
import ChangePassword from './ChangePassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserProfile() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [nextUserId, setNextUserId] = useState('');

    useEffect(() => {
        const fetchUserCount = async () => {
            const db = getFirestore(app);
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
            const userCount = querySnapshot.size;
            setNextUserId(`staff_${userCount + 1}`);
        };
        fetchUserCount();
    }, []);


    const handleSignup = async (e) => {
        e.preventDefault();

        const db = getFirestore(app);
        const usersRef = collection(db, 'users');

        const userQuery = query(usersRef, where('userId', '==', email));
        const existingUsers = await getDocs(userQuery);

        if (existingUsers.size > 0) {
            setError('User ID already exists. Please choose a different one.');
            return;
        }

        try {
            await addDoc(usersRef, {
                userId: email,
                password: password,
                master: 0
            }, nextUserId);

            toast.success('User created successfully');
            setError(null);

            setEmail('');
            setPassword('');

            window.location.reload();
        } catch (error) {
            toast.error('Error creating user');
        }
    };

    return (
        <div>
            <ToastContainer />
            <div class=" flex justify-center items-center w-full md:py-6 lg:py-8 xl:py-8 py-5">
                <form onSubmit={handleSignup}>
                    <div class="bg-[#2d2d30] px-7 py-8 rounded-xl w-screen max-w-sm">
                        <div class="space-y-4">

                            <h1 class="text-center text-2xl font-semibold text-[#0098ff]">Add Staffs Here</h1>
                            <hr />
                            <div class="flex items-center border py-2 px-3 rounded-md mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <input class="pl-2 outline-none border-none w-full bg-transparent text-gray-200" type="text"
                                    placeholder="User ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />

                            </div>
                            <div class="flex items-center border py-2 px-3 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                                </svg>
                                <input class="pl-2 outline-none border-none w-full bg-transparent text-gray-200" type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />

                            </div>
                        </div>

                        <button type="submit" value="Signup" id="Signup" class="mt-6 w-full shadow-xl bg-[#0098ff] text-indigo-100 font-bold py-2 rounded-md text-md tracking-wide transition duration-1000">Sign-up Staffs</button>

                    </div>

                </form>
            </div>

            <ChangePassword />
            {error && <p>{error}</p>}

            <div className='mt-5'>
                <UserDetails />
            </div>
        </div>
    );
}

export default UserProfile;
