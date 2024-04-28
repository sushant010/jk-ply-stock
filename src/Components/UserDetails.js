import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from '../firebase';
import StarSVG from "./StarSVG";

function UserDetails() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const db = getFirestore(app);
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);
            const userData = [];
            querySnapshot.forEach(doc => {
                const user = doc.data();
                const hasMaster = user.master === 1;

                userData.push({ id: doc.id, ...user, hasMaster });
            });
            setUsers(userData);
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const handleDelete = async () => {
        if (selectedUserId) {
            const db = getFirestore(app);
            await deleteDoc(doc(db, 'users', selectedUserId));
            setSelectedUserId(null);
            setShowModal(false);
            setUsers(users.filter(user => user.id !== selectedUserId));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4 text-white bg-[#0098ff] p-2 w-fit rounded-md">User Details</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="max-w-2xl w-full divide-y divide-gray-200/60 rounded-md">
                    <thead className="bg-[#343434]">
                        <tr className=''>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Password</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#343434] divide-y divide-gray-200/60 ">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 text-gray-100 whitespace-nowrap flex gap-1">
                                    {user.hasMaster && <StarSVG />}
                                    {user.userId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-100 ">{user.password}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        className="text-red-500 hover:text-red-700 font-semibold underline underline-offset-2"
                                        onClick={() => {
                                            setSelectedUserId(user.id);
                                            setShowModal(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Modal for confirmation */}
            {showModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto bg-black/20">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="relative bg-white w-full max-w-md mx-auto rounded shadow-lg">
                            <div className="flex justify-between border-b border-gray-100 px-4 py-3">
                                <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="mb-4">Are you sure you want to delete this user?</p>
                                <div className="flex justify-end">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mr-2 rounded"
                                        onClick={handleDelete}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                                        onClick={() => setShowModal(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDetails;
