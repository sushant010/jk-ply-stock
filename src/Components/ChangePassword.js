import React, { useState } from 'react';
import { getFirestore, collection, query, where, updateDoc, doc, getDocs } from 'firebase/firestore';
import app from '../firebase';

function ChangePassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const db = getFirestore(app);
        const usersRef = collection(db, 'users');

        const userQuery = query(usersRef, where('userId', '==', email));
        const existingUsers = await getDocs(userQuery);

        if (existingUsers.size === 0) {
            setError('User not found');
            return;
        }

        try {
            const userDoc = existingUsers.docs[0];
            await updateDoc(doc(usersRef, userDoc.id), {
                password: password
            });

            console.log('Password changed successfully');
            setError(null);
            setEmail('');
            setPassword('');
        } catch (error) {
            setError('Error changing password');
            console.error('Change password error:', error);
        }
    };

    return (
        <div class="bg-[#343434] rounded-lg">
            <div class="pt-8 md:pt-10">
                <div class="p-4 md:p-6">
                    <form class="flex flex-col items-center" onSubmit={handleChangePassword}>
                        <h1 className='mb-2 items-center justify-center mx-auto flex gap-2 text-xl text-gray-200'>
                            Change your password
                        </h1>

                        <div class="md:w-3/4 lg:w-2/3 xl:w-1/2">
                            <hr className='border-b border-gray-400 mt-2 mb-2 max-w-md mx-auto' />
                            <div class="flex flex-col md:flex-row">
                                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    class="my-2 py-2 px-4 rounded-md bg-[#1e1e1e] text-gray-300 w-full md:w-1/2 md:mr-2 outline-none focus:ring-2 focus:ring-blue-600"
                                />
                                <input
                                    class="my-2 py-2 px-4 rounded-md bg-[#1e1e1e] text-gray-300 w-full md:w-1/2 md:ml-2 outline-none focus:ring-2 focus:ring-blue-600"

                                    type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                        </div>
                        <button
                            type="submit"
                            class="inline-flex items-center rounded-md bg-[#0098ff] px-6 py-2 text-md font-bold text-white hover:bg-600/80 mt-4"
                        >
                            Submit
                        </button>

                    </form>

                    {error && <p>{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
