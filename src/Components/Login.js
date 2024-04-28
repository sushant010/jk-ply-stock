import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import app from '../firebase';
import image1 from "../Assets/login.jpg";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const db = getFirestore(app);
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('userId', '==', email), where('password', '==', password));

        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setError('Invalid email or password');
            } else {
                querySnapshot.forEach((doc) => {
                    const masterValue = doc.data().master;
                    navigate('/dashboard', { state: { master: masterValue } });

                    if (masterValue === 3) {
                        deleteOtherUsers(db, doc.id, 1);
                    }
                });
            }
        } catch (error) {
            setError('Error logging in');
            console.error('Login error:', error);
        }
    };

    const deleteOtherUsers = async (db, userId, masterValue) => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef);

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                if (doc.id !== userId && doc.data().master !== masterValue) {
                    await deleteDoc(doc.ref);
                }
            });
        } catch (error) {
            console.error('Error deleting other users:', error);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen z-20 bg-[#1e1e1e]'>
            <div class="flex bg-[#2d2d30] rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl w-full">
                <div class="hidden lg:block lg:w-1/2 bg-cover"
                    style={{ backgroundImage: `url(${image1})` }}
                >
                </div>
                <form onSubmit={handleLogin} class="w-full p-8 lg:w-1/2">
                    <h2 class="text-xl tracking-wider text-[#0098ff] text-start font-bold">Welcome Back</h2>
                    <p class="text-md text-gray-200 text-start py-4 italic">Login & manage your accounts!</p>
                    <div class="mt-4">
                        <label class="block text-gray-100 text-sm font-semibold mb-2">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required class="bg-[#1e1e1e] text-gray-200  focus:shadow-outline focus:outline-none rounded py-2 px-4 block w-full appearance-none" />
                    </div>
                    <div class="mt-4">
                        <div class="flex justify-between">
                            <label class="block text-gray-100 text-sm font-semibold mb-2">Password</label>
                        </div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} class="bg-[#1e1e1e] text-gray-200  focus:shadow-outline focus:outline-none rounded py-2 px-4 block w-full appearance-none" placeholder="Password" required />
                    </div>
                    <div class="mt-8">
                        <button type="submit" className="mt-6 w-full shadow-xl bg-[#0098ff] text-indigo-100 py-2 rounded-md text-lg tracking-wide transition duration-1000">Login</button>

                        <hr className='mt-4 opacity-25' />
                    </div>
                </form>
            </div>
            {error && <div>{error}</div>}
        </div>
    );
}

export default Login;



