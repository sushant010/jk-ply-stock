import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import CryptoJS from 'crypto-js';
import DebitorForm from './DebitorForm';

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

function Debitors() {
    const [debitors, setDebitors] = useState([]);
    const [showAddDebitor, setShowAddDebitor] = useState(false);
    const [newDebitor, setNewDebitor] = useState({
        name: "",
        debit: "",
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedDebitorIndex, setEditedDebitorIndex] = useState(null);
    const [newDebitValue, setNewDebitValue] = useState("");

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [debitorToDeleteIndex, setDebitorToDeleteIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const database = getDatabase();

    useEffect(() => {
        const fetchDebits = async () => {
            const debitorsRef = ref(database, 'debitor/Debitors');
            const snapshot = await get(debitorsRef);
            if (snapshot.exists()) {
                const debitorsData = Object.values(snapshot.val()).map(debitor => {
                    try {
                        return {
                            ...debitor,
                            name: CryptoJS.AES.decrypt(debitor.name, encryptionKey).toString(CryptoJS.enc.Utf8),
                            debit: CryptoJS.AES.decrypt(debitor.debit, encryptionKey).toString(CryptoJS.enc.Utf8)
                        };
                    } catch (error) {
                        console.error("Error decrypting debit data:", error);
                        return null;
                    }
                }).filter(debits => debits !== null);
                setDebitors(debitorsData);
            }
        };

        fetchDebits();
    }, [database]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDebitor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddTransaction = () => {
        setShowAddDebitor(true);
    };

    const handleSaveDebitor = () => {
        const encryptedDebit = {
            ...newDebitor,
            name: CryptoJS.AES.encrypt(newDebitor.name, encryptionKey).toString(),
            debit: CryptoJS.AES.encrypt(newDebitor.debit, encryptionKey).toString()
        };

        const debitorsRef = ref(database, 'debitor/Debitors');
        push(debitorsRef, encryptedDebit)
            .then(() => {
                setShowAddDebitor(false);
                setNewDebitor({
                    name: "",
                    debit: ""
                });
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding Debit: ", error);
            });
    };

    const handleCloseForm = () => {
        setShowAddDebitor(false);
    };

    const handleEditDebitor = (index) => {
        setEditedDebitorIndex(index);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        const editedDebitor = { ...debitors[editedDebitorIndex] };
        const currentDebitValue = parseFloat(editedDebitor.debit);
        const newValue = parseFloat(newDebitValue);
        if (!isNaN(newValue)) {
            editedDebitor.debit = (currentDebitValue + newValue).toString();
            const updatedDebitors = [...debitors];
            updatedDebitors[editedDebitorIndex] = editedDebitor;
            setDebitors(updatedDebitors);

            const encryptedDebitors = updatedDebitors.map(debitor => ({
                ...debitor,
                name: CryptoJS.AES.encrypt(debitor.name, encryptionKey).toString(),
                debit: CryptoJS.AES.encrypt(debitor.debit, encryptionKey).toString()
            }));

            const debitorsRef = ref(database, 'debitor/Debitors');
            set(debitorsRef, encryptedDebitors)
                .then(() => {
                    console.log("Debitor updated successfully in the database.");
                    setShowEditModal(false);
                })
                .catch((error) => {
                    console.error("Error updating debitor in the database: ", error);
                });
        }
    };


    const handleDeleteDebitor = (index) => {
        setShowConfirmationModal(true);
        setDebitorToDeleteIndex(index);
    };

    const confirmDeleteDebitor = () => {
        const updatedDebitors = [...debitors];
        updatedDebitors.splice(debitorToDeleteIndex, 1);

        setDebitors(updatedDebitors);

        const encryptedDebitors = updatedDebitors.map(debitor => ({
            ...debitor,
            name: CryptoJS.AES.encrypt(debitor.name, encryptionKey).toString(),
            debit: CryptoJS.AES.encrypt(debitor.debit, encryptionKey).toString()
        }));

        const debitorsRef = ref(database, 'debitor/Debitors');
        set(debitorsRef, encryptedDebitors)
            .then(() => {
                console.log("Debitor deleted successfully from the database.");
                setShowConfirmationModal(false);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting debitor from the database: ", error);
            });
    };

    const cancelDeleteDebitor = () => {
        setShowConfirmationModal(false);
        setDebitorToDeleteIndex(null);
    };

    const filteredDebitors = debitors.filter(debitor =>
        debitor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>

            <section className="min-h-screen bg-[#1e1e1e]" >
                <div className='max-w-4xl mx-auto p-8'>
                    <h2 className="text-2xl bg-[#0098ff] font-bold mb-4 p-3 rounded-md text-gray-100">Debitor's Details</h2>
                    <hr className='mt-4 opacity-40 py-2' />
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4 px-4 py-3 border-2 rounded w-full  bg-[#3e3e42] border-none text-white"
                    />

                    <button onClick={handleAddTransaction} className="bg-[#0098ff] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Debit</button>
                    <hr className='mt-4 opacity-40' />
                    {showAddDebitor && (
                        <DebitorForm
                            newDebitor={newDebitor}
                            handleInputChange={handleInputChange}
                            handleSaveDebitor={handleSaveDebitor}
                            handleCloseForm={handleCloseForm}
                            showAddDebitor={showAddDebitor}
                        />
                    )}
                    <table className="text-gray-700 border-separate space-y-4 text-sm table-auto w-full mt-4 rounded-lg">
                        <thead class="bg-[#3e3e42] text-gray-100 tracking-[1px]">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2 text-left">Debit</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDebitors.slice().reverse().map((debitor, index) => (
                                <tr key={index} class="bg-[#3b3b3b]">
                                    <td className=" px-4 py-2  capitalize text-gray-50">{debitor.name}</td>
                                    <td className=" px-4 py-2 text-gray-100">{debitor.debit}</td>
                                    <td className="px-4 py-2 capitalize text-gray-100">
                                        <button onClick={() => handleEditDebitor(index)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                                        <button onClick={() => handleDeleteDebitor(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showConfirmationModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-gray-800 opacity-75"></div>
                            <div className="modal absolute bg-white rounded-lg shadow-lg p-8">
                                <p>Are you sure you want to delete this?</p>
                                <div className="flex justify-between mt-4">
                                    <button onClick={confirmDeleteDebitor} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Yes</button>
                                    <button onClick={cancelDeleteDebitor} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">No</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showEditModal && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-gray-800 opacity-75"></div>
                            <div className="modal absolute bg-white rounded-lg shadow-lg p-8">
                                <div className="flex justify-end">
                                    <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowEditModal(false)}>
                                        <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                                        </svg>
                                    </button>
                                </div>
                                <h2 className="text-2xl font-semibold mb-4">Edit Credit</h2>
                                <input
                                    type="number"
                                    value={newDebitValue}
                                    onChange={(e) => setNewDebitValue(e.target.value)}
                                    className="w-full border rounded-lg py-2 px-4 mb-4"
                                />
                                <button onClick={handleSaveEdit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Debitors;
