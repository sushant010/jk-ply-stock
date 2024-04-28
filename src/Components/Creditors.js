import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import CryptoJS from 'crypto-js';
import CreditorForm from './CreditorForm';
import CreditorDetails from './CreditorDetails';

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

function Creditors() {
    const [creditors, setCreditors] = useState([]);
    const [showAddCreditor, setShowAddCreditor] = useState(false);
    const [newCreditor, setNewCreditor] = useState({
        name: "",
        credit: "",
        balance: "",
        phone: "",
    });

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [creditorToDeleteIndex, setCreditorToDeleteIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const database = getDatabase();

    useEffect(() => {
        const fetchCreditors = async () => {
            const creditorsRef = ref(database, 'creditor/Creditors');
            const snapshot = await get(creditorsRef);
            if (snapshot.exists()) {
                const creditorsData = Object.entries(snapshot.val()).map(([key, creditor]) => {
                    try {
                        return {
                            id: key,
                            name: CryptoJS.AES.decrypt(creditor.name, encryptionKey).toString(CryptoJS.enc.Utf8),
                            credit: CryptoJS.AES.decrypt(creditor.credit, encryptionKey).toString(CryptoJS.enc.Utf8),
                            balance: CryptoJS.AES.decrypt(creditor.balance, encryptionKey).toString(CryptoJS.enc.Utf8),
                            phone: CryptoJS.AES.decrypt(creditor.phone, encryptionKey).toString(CryptoJS.enc.Utf8),
                        };
                    } catch (error) {
                        console.error("Error decrypting creditor data:", error);
                        return null;
                    }
                }).filter(creditor => creditor !== null);
                setCreditors(creditorsData);
            }
        };

        fetchCreditors();
    }, [database]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCreditor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddCreditor = () => {
        setShowAddCreditor(true);
    };

    const handleSaveCreditor = () => {
        const newCreditorWithDefaultCredit = {
            ...newCreditor,
            credit: "0",
        };
        const encryptedCreditor = {
            ...newCreditorWithDefaultCredit,
            name: CryptoJS.AES.encrypt(newCreditorWithDefaultCredit.name, encryptionKey).toString(),
            credit: CryptoJS.AES.encrypt(newCreditorWithDefaultCredit.credit, encryptionKey).toString(),
            balance: CryptoJS.AES.encrypt(newCreditorWithDefaultCredit.balance, encryptionKey).toString(),
            phone: CryptoJS.AES.encrypt(newCreditorWithDefaultCredit.phone, encryptionKey).toString(),
        };


        const creditorsRef = ref(database, 'creditor/Creditors');
        push(creditorsRef, encryptedCreditor)
            .then(() => {
                setShowAddCreditor(false);
                setNewCreditor({
                    name: "",
                    credit: "",
                    balance: "",
                    phone: ""
                });
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding creditor: ", error);
            });
    };

    const handleCloseForm = () => {
        setShowAddCreditor(false);
    };

    // const handleDeleteCreditor = (creditorId) => {
    //     setShowConfirmationModal(true);
    //     setCreditorToDeleteIndex(creditorId);
    // };

    // const confirmDeleteCreditor = () => {
    //     const updatedCreditors = creditors.filter(creditor => creditor.id !== creditorToDeleteIndex);

    //     setCreditors(updatedCreditors);

    //     const encryptedCreditors = updatedCreditors.map(creditor => ({
    //         ...creditor,
    //         name: CryptoJS.AES.encrypt(creditor.name, encryptionKey).toString(),
    //         credit: CryptoJS.AES.encrypt(creditor.credit, encryptionKey).toString(),
    //         phone: CryptoJS.AES.encrypt(creditor.phone, encryptionKey).toString(),
    //     }));

    //     const creditorsRef = ref(database, 'creditor/Creditors');
    //     set(creditorsRef, encryptedCreditors)
    //         .then(() => {
    //             console.log("Creditor deleted successfully from the database.");
    //             setShowConfirmationModal(false);
    //             window.location.reload();
    //         })
    //         .catch((error) => {
    //             console.error("Error deleting creditor from the database: ", error);
    //         });
    // };

    const handleDeleteCreditor = (creditorId) => {
        const indexToDelete = creditors.findIndex(creditor => creditor.id === creditorId);
        if (indexToDelete !== -1) {
            setShowConfirmationModal(true);
            setCreditorToDeleteIndex(indexToDelete);
        } else {
            console.error("Creditor not found with ID:", creditorId);
        }
    };

    const confirmDeleteCreditor = () => {
        if (creditorToDeleteIndex !== null) {
            const creditorIdToDelete = creditors[creditorToDeleteIndex].id;
            const updatedCreditors = [...creditors];
            updatedCreditors.splice(creditorToDeleteIndex, 1);
            setCreditors(updatedCreditors);

            const creditorRefToDelete = ref(database, `creditor/Creditors/${creditorIdToDelete}`);
            set(creditorRefToDelete, null)
                .then(() => {
                    setShowConfirmationModal(false);
                    setCreditorToDeleteIndex(null);
                })
                .catch((error) => {
                    console.error("Error deleting creditor:", error);
                });
        } else {
            console.error("No creditor selected for deletion.");
        }
    };


    const cancelDeleteCreditor = () => {
        setShowConfirmationModal(false);
        setCreditorToDeleteIndex(null);
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedCreditorId, setSelectedCreditorId] = useState(null);

    const handleOpenModal = (creditorId) => {
        setSelectedCreditorId(creditorId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCreditorId(null);
    };

    const handleOtherFunction = (creditorId) => {
        console.log(`Performing other function for creditor with ID ${creditorId}`);
        handleOpenModal(creditorId);
    };

    const filteredCreditors = creditors.filter(creditor =>
        creditor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const [editingBalance, setEditingBalance] = useState("");
    const [editingCreditorIndex, setEditingCreditorIndex] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [balanceType, setBalanceType] = useState("+");


    const handleBalanceType = (event) => {
        const { name, value } = event.target;
        if (name === "balanceType") {
            setBalanceType(value);
        }
    };

    const handleSaveEditedBalance = () => {
        if (editingCreditorIndex !== null) {
            const editedCreditor = creditors[editingCreditorIndex];
            let newBalance;
            if (balanceType === "+") {
                newBalance = parseInt(editedCreditor.balance) + parseInt(editingBalance);
            } else if (balanceType === "-") {
                newBalance = parseInt(editedCreditor.balance) - parseInt(editingBalance);
            }
            const encryptedBalance = CryptoJS.AES.encrypt(newBalance.toString(), encryptionKey).toString();

            const creditorIdToUpdate = editedCreditor.id;
            const creditorBalanceRefToUpdate = ref(database, `creditor/Creditors/${creditorIdToUpdate}/balance`);
            set(creditorBalanceRefToUpdate, encryptedBalance)
                .then(() => {
                    console.log("Balance updated successfully in the database.");
                })
                .catch((error) => {
                    console.error("Error updating balance in the database:", error);
                });

            setEditModalOpen(false);
            setEditingCreditorIndex(null);
            setEditingBalance("");
            window.location.reload();
        }
    };


    const handleOpenEditModal = (creditorIndex, currentBalance) => {
        setEditingCreditorIndex(creditorIndex);
        setEditingBalance("");
        setEditModalOpen(true);
    };

    const handleEditBalanceChange = (e) => {
        setEditingBalance(e.target.value);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingCreditorIndex(null);
        setEditingBalance("");
    };

    return (
        <section className="min-h-screen bg-[#1e1e1e] min-w-screen">
            <div className='max-w-4xl mx-auto p-8'>
                <h2 className="text-2xl bg-gradient-radial bg-[#0098ff] font-bold mb-4 p-3 rounded-md text-gray-200">Creditor's Details</h2>
                <hr className='mt-4 opacity-40 py-2' />
                <div>
                    <input
                        type="text"
                        placeholder="Search by Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4 px-4 py-3 border-2 rounded w-full bg-[#3e3e42] border-none text-white"
                    />
                </div>

                <button onClick={handleAddCreditor} className="bg-[#0098ff] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Creditor</button>
                <hr className='mt-4 opacity-40' />
                {showAddCreditor && (
                    <CreditorForm
                        newCreditor={newCreditor}
                        handleInputChange={handleInputChange}
                        handleSaveCreditor={handleSaveCreditor}
                        handleCloseForm={handleCloseForm}
                        showAddCreditor={showAddCreditor}
                    />
                )}
                <table className="text-gray-700 border-separate space-y-4 text-sm table-auto w-full mt-4 rounded-lg">
                    <thead className='bg-[#3e3e42] text-gray-100 tracking-[1px]'>
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3 text-left">Credit</th>
                            <th className="p-3 text-left">Balance</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCreditors.slice().reverse().map((creditor, index) => (
                            <tr class="bg-[#3b3b3b]" key={index}>
                                <td className="px-4 py-2 capitalize text-gray-100">{creditor.name}</td>
                                <td className=" px-4 py-2 text-gray-100">{creditor.credit}</td>
                                <td className="px-4 py-2 text-gray-100 items-center flex justify-between">
                                    {creditor.balance}
                                    <button onClick={() => handleOpenEditModal(index, creditor.balance)} className='text-sm underline underline-offset-2 text-blue-500'>Edit</button>
                                </td>
                                <td className=" px-4 py-2 text-gray-100">{creditor.phone ? creditor.phone : "NA"}</td>
                                <td className=" px-4 py-2 md:space-y-0 space-y-1">

                                    <button onClick={() => handleDeleteCreditor(creditor.id)} className="bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-2 rounded mr-2 text-xs">Delete</button>
                                    <button onClick={() => handleOtherFunction(creditor.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded text-xs">Details</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {editModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-gray-800 opacity-75"></div>
                        <div className="modal absolute bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-lg font-semibold mb-4">Edit Balance</h2>

                            <div className="flex items-center mb-2 gap-2">
                                <div className="bg-blue-100 px-3 py-1 rounded-full items-center">
                                    <input
                                        type="radio"
                                        id="plus"
                                        name="balanceType"
                                        value="+"
                                        checked={balanceType === "+"}
                                        onChange={handleBalanceType}
                                        className="mr-2"
                                    />
                                    <label htmlFor="+" className="font-bold">+</label>
                                </div>
                                <div className="bg-blue-100 px-3 py-1 rounded-full items-center">
                                    <input
                                        type="radio"
                                        id="minus"
                                        name="balanceType"
                                        value="-"
                                        checked={balanceType === "-"}
                                        onChange={handleBalanceType}
                                        className="mr-2"
                                    />
                                    <label htmlFor="-" className=" font-bold">-</label>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={editingBalance}
                                onChange={handleEditBalanceChange}
                                className="w-full border border-gray-300 rounded-md p-2 mb-4"
                                placeholder="Enter new balance"
                            />
                            <div className="flex justify-between">
                                <button onClick={handleSaveEditedBalance} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                                <button onClick={handleCloseEditModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmationModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-gray-800 opacity-75"></div>
                        <div className="modal absolute bg-white rounded-lg shadow-lg p-8">
                            <p>Are you sure you want to delete this?</p>
                            <div className="flex justify-between mt-4">
                                <button onClick={confirmDeleteCreditor} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Yes</button>
                                <button onClick={cancelDeleteCreditor} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">No</button>
                            </div>
                        </div>
                    </div>
                )}

                {showModal && <CreditorDetails creditorId={selectedCreditorId} database={database} encryptionKey={encryptionKey} onClose={handleCloseModal} />}


            </div>
        </section>
    )
}

export default Creditors;
