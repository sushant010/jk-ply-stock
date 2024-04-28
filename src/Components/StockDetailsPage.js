import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get, set, remove } from 'firebase/database';
import CryptoJS, { AES } from 'crypto-js';
import AddStockModal from './AddStockModal';
import DeleteConfirmationModal from './DeleteConfrimationModal';

const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY;

function StockDetailsPage() {
    const [showInputForm, setShowInputForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { category } = useParams();
    const [stockData, setStockData] = useState(null);
    const [newStock, setNewStock] = useState({
        id: '',
        stocks: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const database = getDatabase();
            const stockRef = ref(database, `main_stocks/${category}`);

            try {
                const snapshot = await get(stockRef);
                if (snapshot.exists()) {
                    const decryptedData = {};
                    snapshot.forEach((childSnapshot) => {
                        const decryptedStocks = AES.decrypt(childSnapshot.val().stocks, encryptionKey).toString(
                            CryptoJS.enc.Utf8
                        );
                        decryptedData[childSnapshot.key] = {
                            ...childSnapshot.val(),
                            stocks: decryptedStocks,
                        };
                    });
                    setStockData(decryptedData);
                } else {
                    console.log(`No data available for ${category}`);
                }
            } catch (error) {
                console.error(`Error fetching data for ${category}:`, error);
            }
        };

        fetchData();
    }, [category]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewStock({ ...newStock, [name]: value });
    };

    const handleSaveStock = () => {
        const database = getDatabase();
        const encryptedStocks = AES.encrypt(newStock.stocks, encryptionKey).toString();
        const stockRef = ref(database, `main_stocks/${category}/${newStock.id}`);
        set(stockRef, { ...newStock, stocks: encryptedStocks });
        setShowInputForm(false);
        window.location.reload();
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    const handleDeleteStock = (id) => {
        setDeleteId(id);
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
        const database = getDatabase();
        const stockRef = ref(database, `main_stocks/${category}/${deleteId}`);
        remove(stockRef);
        setShowDeleteConfirmation(false);
        window.location.reload();
    };

    const handleAddStock = () => {
        setShowInputForm(true);
    };

    const handleCloseForm = () => {
        setShowInputForm(false);
    };

    const filteredStockData = stockData && Object.fromEntries(
        Object.entries(stockData).filter(([id, data]) => {
            return id.toLowerCase().includes(searchQuery.toLowerCase()) || data.stocks.toLowerCase().includes(searchQuery.toLowerCase());
        })
    );

    return (
        <section className="min-h-screen bg-[#1e1e1e]">
            <div className="max-w-4xl mx-auto p-8">
                <h2 className="text-2xl bg-gradient-radial bg-[#0098ff] font-bold mb-4 p-3 rounded-md text-gray-200">Stock Details: {category}</h2>

                <hr className='mt-4 opacity-40 py-2' />

                <input
                    type="text"
                    placeholder="Search by ID or Stocks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 px-4 py-3 border-2 rounded w-full bg-[#3e3e42] border-none text-white"
                />

                <button onClick={handleAddStock} className='bg-[#0098ff] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Add New Stock</button>
                <hr className='mt-4 opacity-40' />
                <table class="text-gray-700 border-separate space-y-4 text-sm table-auto w-full mt-4 rounded-lg">

                    <thead class="bg-[#3e3e42] text-gray-100 tracking-[1px]">
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2 text-left">Stocks</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStockData && Object.entries(filteredStockData).slice().reverse().map(([id, data]) => (
                            <tr key={id} class="bg-[#3b3b3b]">
                                <td className=" px-4 py-3 capitalize text-gray-50">{id}</td>
                                <td className=" px-4 py-2 capitalize text-gray-100">{data.stocks}</td>
                                <td className=" px-4 py-2">
                                    <button onClick={() => handleDeleteStock(id)} className='text-red-500 hover:text-red-700 ml-2 underline underline-offset-4 italic'>Delete</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showInputForm && <AddStockModal newStock={newStock} handleInputChange={handleInputChange} handleSaveStock={handleSaveStock} onClose={handleCloseForm} />}

                {showDeleteConfirmation && (
                    <DeleteConfirmationModal
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}

            </div>
        </section>
    );
}

export default StockDetailsPage;
