import { get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";

function TransactionForm({ newTransaction, handleInputChange, handleSaveTransaction, handleCloseForm, database }) {
  const [stockNames, setStockNames] = useState([]);
  const [codeOptions, setCodeOptions] = useState([]);

  // Fetch stock names from the database when the component mounts or 'database' changes
  useEffect(() => {
    const fetchStockNames = async () => {
      const mainStocksRef = ref(database, 'main_stocks');
      const snapshot = await get(mainStocksRef);
      if (snapshot.exists()) {
        const stockNamesArray = Object.keys(snapshot.val());
        setStockNames(stockNamesArray);
      }
    };

    fetchStockNames();
  }, [database]);

  useEffect(() => {
    const fetchData = async () => {
      if (newTransaction.stock) {
        const stockRef = ref(database, `main_stocks/${newTransaction.stock}`);
        try {
          const snapshot = await get(stockRef);
          if (snapshot.exists()) {
            const decryptedData = [];
            snapshot.forEach(childSnapshot => {
              decryptedData.push(childSnapshot.key);
            });
            setCodeOptions(decryptedData);
          } else {
            console.log(`No data available for ${newTransaction.stock}`);
          }
        } catch (error) {
          console.error(`Error fetching data for ${newTransaction.stock}:`, error);
        }
      }
    };
    fetchData();
  }, [newTransaction.stock, database]);


  return (
    <div className="bg-black/40 flex items-center justify-center min-h-screen overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 mx-auto">
      <div className="absolute p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-white rounded-lg ">
          <div className="flex items-center justify-between p-4 md:p-5 rounded-t ">
            <h3 className="text-2xl font-semibold text-gray-900 max-w-sm">
              Add the transactions here! Kindly refresh to see the data.
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-red-500 hover:text-white rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={handleCloseForm}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close </span>
            </button>
          </div>
          <div className="p-4 md:p-5">
            <div className="mb-4">
              <label
                htmlFor="stock"
                className="block text-sm font-semibold text-gray-700"
              >
                Select Product
              </label>
              <select
                name="stock"
                value={newTransaction.stock}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Stock</option>
                {stockNames.map(stockName => (
                  <option key={stockName} value={stockName}>{stockName}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700">
                Code
              </label>
              <select
                name="code"
                value={newTransaction.code}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Code</option>
                {codeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700"
              >
                Date
              </label>
              <input
                type="text"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                placeholder="Date"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Product
              </label>
              <select
                name="product"
                value={newTransaction.product}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Confirm Product</option>
                <option value="door">Door</option>
                <option value="plywood">Plywood</option>
                <option value="sunmica">Sunmica</option>
                <option value="hardware">Hardware</option>
              </select>
            </div>
            <div className="flex items-center mb-2 gap-2">
              <div className="bg-blue-100 px-3 py-1 rounded-full items-center">
                <input
                  type="radio"
                  id="plus"
                  name="transactionType"
                  value="+"
                  checked={newTransaction.transactionType === "+"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="+" className="font-bold">+</label>
              </div>
              <div className="bg-blue-100 px-3 py-1 rounded-full items-center">
                <input
                  type="radio"
                  id="minus"
                  name="transactionType"
                  value="-"
                  checked={newTransaction.transactionType === "-"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="-" className=" font-bold">-</label>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700"
              >
                Transaction
              </label>
              <input
                type="text"
                name="transaction"
                value={newTransaction.transaction}
                onChange={handleInputChange}
                placeholder="Transaction"
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <button
              onClick={handleSaveTransaction}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionForm;


