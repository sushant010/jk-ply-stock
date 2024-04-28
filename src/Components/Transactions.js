/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, push, remove, set } from 'firebase/database';
import TransactionForm from './TransactionForm';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        code: "",
        date: "",
        product: "",
        transaction: ""
    });

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const database = getDatabase();

    const [stocksData, setStocksData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const database = getDatabase();
            const stocksRef = ref(database, 'main_stocks');

            try {
                const snapshot = await get(stocksRef);
                if (snapshot.exists()) {
                    // Transforming and decrypting data
                    const decryptedData = {};
                    snapshot.forEach(categorySnapshot => {
                        decryptedData[categorySnapshot.key] = {};
                        categorySnapshot.forEach(stockSnapshot => {
                            const decryptedStocks = CryptoJS.AES.decrypt(stockSnapshot.val().stocks, encryptionKey).toString(CryptoJS.enc.Utf8);
                            decryptedData[categorySnapshot.key][stockSnapshot.key] = {
                                id: stockSnapshot.val().id,
                                stocks: decryptedStocks
                            };
                        });
                    });
                    setStocksData(decryptedData);
                } else {
                    console.log("No data available for main_stocks");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);



    useEffect(() => {
        const fetchTransactions = async () => {
            const transactionsRef = ref(database, 'transaction_stocks/Transactions');
            const snapshot = await get(transactionsRef);
            if (snapshot.exists()) {
                const transactionsData = Object.entries(snapshot.val()).map(([key, transaction]) => ({
                    id: key,
                    ...transaction,
                    date: CryptoJS.AES.decrypt(transaction.date, encryptionKey).toString(CryptoJS.enc.Utf8),
                    product: CryptoJS.AES.decrypt(transaction.product, encryptionKey).toString(CryptoJS.enc.Utf8),
                    transaction: CryptoJS.AES.decrypt(transaction.transaction, encryptionKey).toString(CryptoJS.enc.Utf8),
                }));
                setTransactions(transactionsData);
            }
        };

        fetchTransactions();
    }, [database]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTransaction(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddTransaction = () => {
        setShowAddTransaction(true);
    };

    // const handleSaveTransaction = () => {
    //     const encryptedTransaction = {
    //         ...newTransaction,
    //         date: CryptoJS.AES.encrypt(newTransaction.date, encryptionKey).toString(),
    //         product: CryptoJS.AES.encrypt(newTransaction.product, encryptionKey).toString(),
    //         transaction: CryptoJS.AES.encrypt(newTransaction.transaction, encryptionKey).toString()
    //     };

    //     const transactionsRef = ref(database, 'transaction_stocks/Transactions');
    //     push(transactionsRef, encryptedTransaction)
    //         .then(() => {
    //             setShowAddTransaction(false);
    //             setNewTransaction({
    //                 code: "",
    //                 date: "",
    //                 product: "",
    //                 transaction: ""
    //             });
    //         })
    //         .catch((error) => {
    //             console.error("Error adding transaction: ", error);
    //         });
    // };

    // const handleSaveTransaction = () => {
    //     const encryptedTransaction = {
    //         ...newTransaction,
    //         date: CryptoJS.AES.encrypt(newTransaction.date, encryptionKey).toString(),
    //         product: CryptoJS.AES.encrypt(newTransaction.product, encryptionKey).toString(),
    //         transaction: CryptoJS.AES.encrypt(newTransaction.transaction, encryptionKey).toString()
    //     };

    //     const transactionsRef = ref(database, 'transaction_stocks/Transactions');
    //     push(transactionsRef, encryptedTransaction)
    //         .then(() => {
    //             setShowAddTransaction(false);
    //             setNewTransaction({
    //                 code: "",
    //                 date: "",
    //                 product: "",
    //                 transaction: ""
    //             });

    //             // Update stocks
    //             const { product, transactionType, transaction: transactionAmount, code: transactionCode } = newTransaction;

    //             // Find the category of the product in stocksData
    //             const productCategory = Object.keys(stocksData).find(category => category.toLowerCase() === product.toLowerCase());
    //             if (productCategory) {
    //                 const categoryStocks = stocksData[productCategory];
    //                 const productToUpdate = Object.keys(categoryStocks).find(stockId => categoryStocks[stockId].id === transactionCode);

    //                 if (productToUpdate) {
    //                     const currentStock = parseFloat(categoryStocks[productToUpdate].stocks);
    //                     let updatedStock;

    //                     if (transactionType === "+") {
    //                         updatedStock = currentStock + parseFloat(transactionAmount);
    //                     } else if (transactionType === "-") {
    //                         updatedStock = currentStock - parseFloat(transactionAmount);
    //                     }

    //                     // Update the stock in the database
    //                     const stockRef = ref(database, `main_stocks/${productCategory}/${productToUpdate}/stocks`);
    //                     set(stockRef, CryptoJS.AES.encrypt(updatedStock.toString(), encryptionKey).toString());
    //                 }
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Error adding transaction: ", error);
    //         });
    // };

    const handleSaveTransaction = () => {
        const encryptedTransaction = {
            ...newTransaction,
            date: CryptoJS.AES.encrypt(newTransaction.date, encryptionKey).toString(),
            product: CryptoJS.AES.encrypt(newTransaction.product, encryptionKey).toString(),
            transaction: CryptoJS.AES.encrypt(newTransaction.transaction, encryptionKey).toString()
        };

        const transactionsRef = ref(database, 'transaction_stocks/Transactions');
        push(transactionsRef, encryptedTransaction)
            .then((newTransactionRef) => {
                setShowAddTransaction(false);
                setNewTransaction({
                    code: "",
                    date: "",
                    product: "",
                    transaction: ""
                });

                const { product, transactionType, transaction: transactionAmount, code: transactionCode } = newTransaction;

                const productCategory = Object.keys(stocksData).find(category => category.toLowerCase() === product.toLowerCase());
                if (productCategory) {
                    const categoryStocks = stocksData[productCategory];
                    const productToUpdate = Object.keys(categoryStocks).find(stockId => categoryStocks[stockId].id === transactionCode);

                    if (productToUpdate) {
                        const currentStock = parseFloat(categoryStocks[productToUpdate].stocks);
                        let updatedStock;

                        if (transactionType === "+") {
                            updatedStock = currentStock + parseFloat(transactionAmount);
                        } else if (transactionType === "-") {
                            updatedStock = currentStock - parseFloat(transactionAmount);
                        }

                        // Update the stock in the database
                        const stockRef = ref(database, `main_stocks/${productCategory}/${productToUpdate}/stocks`);
                        return set(stockRef, CryptoJS.AES.encrypt(updatedStock.toString(), encryptionKey).toString());
                    } else {
                        throw new Error("Product not found in stocks data");
                    }
                } else {
                    throw new Error("Product category not found in stocks data");
                }
            })
            .catch((error) => {
                console.error("Error adding transaction or updating stocks: ", error);
            });
    };


    const handleCloseForm = () => {
        setShowAddTransaction(false);
    };

    const handleDeleteTransaction = (id) => {
        setTransactionToDeleteId(id);
        setShowConfirmationModal(true);
    };

    const confirmDeleteTransaction = () => {
        const transactionRef = ref(database, `transaction_stocks/Transactions/${transactionToDeleteId}`);
        remove(transactionRef)
            .then(() => {
                toast.success("Transaction deleted successfully from the database.");
                setShowConfirmationModal(false);
                setTransactions(transactions.filter(transaction => transaction.id !== transactionToDeleteId));
                window.location.reload();
            })
            .catch((error) => {
                toast.error("Error deleting transaction from the database: ", error);
            });
    };

    const cancelDeleteTransaction = () => {
        setShowConfirmationModal(false);
        setTransactionToDeleteId(null);
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.date.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().split('T')[0];

    const formattedTime = currentDate.toLocaleTimeString();

    const transactionElement = document.getElementById('transaction-details');

    return (
        <div>
            <ToastContainer />
            <section className="min-h-screen bg-[#1e1e1e]">

                <div className='max-w-4xl mx-auto p-8'>
                    <h2 className="text-2xl bg-gradient-radial bg-[#0098ff] font-bold mb-4 p-3 rounded-md text-gray-200">Transaction's Details</h2>
                    <hr className='mt-4 opacity-40 py-2' />
                    <div>
                        <input
                            type="text"
                            placeholder="Search by Code / Date"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mb-4 px-4 py-3 border-2 rounded w-full bg-[#3e3e42] border-none text-white"
                        />
                    </div>

                    <button onClick={handleAddTransaction} className="bg-[#0098ff] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Transaction</button>
                    <hr className='mt-4 opacity-40' />
                    {showAddTransaction && (
                        <TransactionForm
                            database={database}
                            newTransaction={newTransaction}
                            handleInputChange={handleInputChange}
                            handleSaveTransaction={handleSaveTransaction}
                            handleCloseForm={handleCloseForm}
                            showAddTransaction={showAddTransaction}
                        />
                    )}

                    <table class="text-gray-700 border-separate space-y-4 text-sm table-auto w-full mt-4 rounded-lg">
                        <thead class="bg-[#3e3e42] text-gray-100 rounded-md tracking-[1px]">
                            <tr>
                                <th class="p-3">Code</th>
                                <th class="p-3 text-left">Product</th>
                                <th class="p-3 text-left">Transaction</th>
                                <th class="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.slice().reverse().map((transaction, index) => (
                                <tr key={index} class="bg-[#3b3b3b]">
                                    <td class="p-2">
                                        <div class="flex align-items-center">
                                            <div class="ml-3">
                                                <div class="tracking-[1px] font-semibold text-gray-50">{transaction.code}</div>
                                                <div class="text-[#0098ff] text-xs underline">{transaction.date} <span className='ml-4'>{formattedTime}</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-3 capitalize text-gray-100">
                                        {transaction.product}
                                    </td>
                                    <td class="p-3 font-medium tracking-[0.5px] text-gray-100">
                                        {transaction.transactionType}{transaction.transaction}
                                    </td>

                                    <td>
                                        <button className="p-3 flex items-center">
                                            <p className="text-red-500 hover:text-red-600 ml-2 hover:underline-offset-2 hover:underline" onClick={() => handleDeleteTransaction(transaction.id)}>
                                                <i className="material-icons-round text-sm">Delete</i>
                                            </p> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2 text-red-500">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Confirmation modal */}
                    {showConfirmationModal && (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-lg">
                                <p className="text-lg font-semibold mb-4">Are you sure you want to delete this transaction?</p>
                                <div className="flex justify-end">
                                    <button onClick={confirmDeleteTransaction} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4">Delete</button>
                                    <button onClick={cancelDeleteTransaction} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <table className=" bg-gray-200/60">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Code</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Transaction</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td className="px-4 border rounded-md py-3">{transaction.code}</td>
                            <td className="px-4 border rounded-md py-3"></td>
                            <td className="px-4 border rounded-md py-3"></td>
                            <td className="px-4 border rounded-md py-3"></td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
                </div>
            </section>
        </div>
    )
}

export default Transactions;
