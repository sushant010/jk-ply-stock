// import React, { useEffect, useState } from 'react';
// import { get, push, ref, set } from 'firebase/database';
// import CryptoJS from 'crypto-js';

// const CreditorDetails = ({ creditorId, database, encryptionKey, onClose }) => {
//     const [formData, setFormData] = useState({
//         amount: '',
//         date: '',
//         product: '',
//         stock: ''
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: value
//         }));
//     };

//     const [creditorDetails, setCreditorDetails] = useState([]);
//     const [creditorCredit, setCreditorCredit] = useState('');


//     useEffect(() => {
//         const fetchCreditorDetails = async () => {
//             try {
//                 const creditorDetailsRef = ref(database, `creditor/Creditors/${creditorId}/details`);
//                 const snapshot = await get(creditorDetailsRef);

//                 if (snapshot.exists()) {
//                     const decryptedData = snapshot.val();
//                     const decryptedDetails = Object.entries(decryptedData).map(([key, value]) => ({
//                         id: key,
//                         amount: CryptoJS.AES.decrypt(value.amount, encryptionKey).toString(CryptoJS.enc.Utf8),
//                         date: CryptoJS.AES.decrypt(value.date, encryptionKey).toString(CryptoJS.enc.Utf8),
//                         product: CryptoJS.AES.decrypt(value.product, encryptionKey).toString(CryptoJS.enc.Utf8),
//                         stock: CryptoJS.AES.decrypt(value.stock, encryptionKey).toString(CryptoJS.enc.Utf8)
//                     }));
//                     setCreditorDetails(decryptedDetails);
//                 }

//                 const creditorCreditRef = ref(database, `creditor/Creditors/${creditorId}/credit`);
//                 const creditSnapshot = await get(creditorCreditRef);
//                 if (creditSnapshot.exists()) {
//                     const decryptedCredit = CryptoJS.AES.decrypt(creditSnapshot.val(), encryptionKey).toString(CryptoJS.enc.Utf8);
//                     setCreditorCredit(decryptedCredit);
//                 }
//             } catch (error) {
//                 console.error('Error fetching details:', error);
//             }
//         };

//         fetchCreditorDetails();
//     }, [creditorId, database, encryptionKey]);

//     const handleSubmit = async () => {
//         try {
//             const newCredit = parseInt(creditorCredit) + parseInt(formData.amount);

//             const encryptedCredit = CryptoJS.AES.encrypt(newCredit.toString(), encryptionKey).toString();

//             const creditorCreditRef = ref(database, `creditor/Creditors/${creditorId}/credit`);
//             await set(creditorCreditRef, encryptedCredit);

//             const encryptedData = {
//                 amount: CryptoJS.AES.encrypt(formData.amount, encryptionKey).toString(),
//                 date: CryptoJS.AES.encrypt(formData.date, encryptionKey).toString(),
//                 product: CryptoJS.AES.encrypt(formData.product, encryptionKey).toString(),
//                 stock: CryptoJS.AES.encrypt(formData.stock, encryptionKey).toString()
//             };

//             const creditorDetailsRef = ref(database, `creditor/Creditors/${creditorId}/details`);
//             await push(creditorDetailsRef, encryptedData);

//             console.log('Data saved successfully.');
//             onClose();
//         } catch (error) {
//             console.error('Error saving data:', error);
//         }
//     };


//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">

//             <div className="modal bg-white rounded-lg shadow-lg p-5">
//                 <div className="flex justify-end">
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//                         <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                             <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
//                         </svg>
//                     </button>
//                 </div>
//                 <div>
//                     <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
//                     <div className='flex-none md:flex xl:flex lg:flex gap-2'>
//                         <input
//                             type="text"
//                             name="amount"
//                             value={formData.amount}
//                             onChange={handleInputChange}
//                             placeholder="Amount"
//                             className="w-full border rounded-lg py-2 px-4 mb-4"
//                         />
//                         <input
//                             type="text"
//                             name="date"
//                             value={formData.date}
//                             onChange={handleInputChange}
//                             placeholder="Date"
//                             className="w-full border rounded-lg py-2 px-4 mb-4"
//                         />
//                     </div>
//                     <div className='flex-none md:flex xl:flex lg:flex gap-2'>
//                         <input
//                             type="text"
//                             name="product"
//                             value={formData.product}
//                             onChange={handleInputChange}
//                             placeholder="Product"
//                             className="w-full border rounded-lg py-2 px-4 mb-4"
//                         />
//                         <input
//                             type="text"
//                             name="stock"
//                             value={formData.stock}
//                             onChange={handleInputChange}
//                             placeholder="Stock"
//                             className="w-full border rounded-lg py-2 px-4 mb-4"
//                         />
//                     </div>
//                     <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white md:font-bold font-normal md:py-2 md:px-4 py-1 px-2 md:text-md text-sm rounded">Submit</button>
//                 </div>
//                 <div>
//                     <h2 className="text-xl font-semibold mb-2 mt-4">Details</h2>
//                     <div className="h-64 overflow-auto">
//                         {creditorDetails.map(detail => (
//                             <div key={detail.id} className="border-b border-gray-300 py-2 space-y-1 text-sm">
//                                 <div className="px-4"><span className='text-gray-700 font-bold'>Amount: </span> {detail.amount}</div>
//                                 <div className="px-4"><span className='text-gray-700 font-bold'>Date: </span> {detail.date}</div>
//                                 <div className="px-4"><span className='text-gray-700 font-bold'>Product: </span> {detail.product}</div>
//                                 <div className="px-4"><span className='text-gray-700 font-bold'>Stocks: </span> {detail.stock}</div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>


//             </div>
//         </div>

//     );
// };

// export default CreditorDetails;


import React, { useEffect, useState } from 'react';
import { get, push, ref, set } from 'firebase/database';
import CryptoJS from 'crypto-js';

const CreditorDetails = ({ creditorId, database, encryptionKey, onClose }) => {
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        product: '',
        stock: '',
        codeId: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [creditorDetails, setCreditorDetails] = useState([]);
    const [creditorCredit, setCreditorCredit] = useState('');

    useEffect(() => {
        const fetchCreditorDetails = async () => {
            try {
                const creditorDetailsRef = ref(database, `creditor/Creditors/${creditorId}/details`);
                const snapshot = await get(creditorDetailsRef);

                if (snapshot.exists()) {
                    const decryptedData = snapshot.val();
                    const decryptedDetails = Object.entries(decryptedData).map(([key, value]) => ({
                        id: key,
                        ...value,
                        amount: CryptoJS.AES.decrypt(value.amount, encryptionKey).toString(CryptoJS.enc.Utf8),
                        date: CryptoJS.AES.decrypt(value.date, encryptionKey).toString(CryptoJS.enc.Utf8),
                        product: CryptoJS.AES.decrypt(value.product, encryptionKey).toString(CryptoJS.enc.Utf8),
                        stock: CryptoJS.AES.decrypt(value.stock, encryptionKey).toString(CryptoJS.enc.Utf8),
                        codeId: CryptoJS.AES.decrypt(value.codeId, encryptionKey).toString(CryptoJS.enc.Utf8)
                    }));
                    setCreditorDetails(decryptedDetails);
                }

                const creditorCreditRef = ref(database, `creditor/Creditors/${creditorId}/credit`);
                const creditSnapshot = await get(creditorCreditRef);
                if (creditSnapshot.exists()) {
                    const decryptedCredit = CryptoJS.AES.decrypt(creditSnapshot.val(), encryptionKey).toString(CryptoJS.enc.Utf8);
                    setCreditorCredit(decryptedCredit);
                }
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };

        fetchCreditorDetails();
    }, [creditorId, database, encryptionKey]);


    const handleSubmit = async () => {
        try {
            const newCredit = parseInt(creditorCredit) + parseInt(formData.amount);
            const encryptedCredit = CryptoJS.AES.encrypt(newCredit.toString(), encryptionKey).toString();

            const encryptedData = {
                amount: CryptoJS.AES.encrypt(formData.amount, encryptionKey).toString(),
                date: CryptoJS.AES.encrypt(formData.date, encryptionKey).toString(),
                product: CryptoJS.AES.encrypt(formData.product, encryptionKey).toString(),
                stock: CryptoJS.AES.encrypt(formData.stock, encryptionKey).toString(),
                codeId: CryptoJS.AES.encrypt(formData.codeId, encryptionKey).toString()
            };

            const creditorDetailsRef = ref(database, `creditor/Creditors/${creditorId}/details`);
            await push(creditorDetailsRef, encryptedData);

            const creditorCreditRef = ref(database, `creditor/Creditors/${creditorId}/credit`);
            await set(creditorCreditRef, encryptedCredit);

            console.log('Data saved successfully.');
            onClose();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
            <div className="modal bg-white rounded-lg shadow-lg p-5">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                    </button>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Enter Details</h2>
                    <div className='flex-none md:flex xl:flex lg:flex gap-2'>
                        <input
                            type="text"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="Amount"
                            className="w-full border rounded-lg py-2 px-4 mb-4"
                        />
                        <input
                            type="text"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            placeholder="Date"
                            className="w-full border rounded-lg py-2 px-4 mb-4"
                        />
                    </div>
                    <div className='flex-none md:flex xl:flex lg:flex gap-2'>
                        <input
                            type="text"
                            name="product"
                            value={formData.product}
                            onChange={handleInputChange}
                            placeholder="Product"
                            className="w-full border rounded-lg py-2 px-4 mb-4"
                        />
                        <input
                            type="text"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            placeholder="Stock"
                            className="w-full border rounded-lg py-2 px-4 mb-4"
                        />
                    </div>
                    <input
                        type="text"
                        name="codeId"
                        value={formData.codeId}
                        onChange={handleInputChange}
                        placeholder="Code ID"
                        className="w-full border rounded-lg py-2 px-4 mb-4"
                    />
                    <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white md:font-bold font-normal md:py-2 md:px-4 py-1 px-2 md:text-md text-sm rounded">Submit</button>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2 mt-4">Details</h2>
                    <div className="h-64 overflow-auto">
                        {creditorDetails.map(detail => (
                            <div key={detail.id} className="border-b border-gray-300 py-2 space-y-1 text-sm">
                                <div className="px-4"><span className='text-gray-700 font-bold'>Amount: </span> {detail.amount}</div>
                                <div className="px-4"><span className='text-gray-700 font-bold'>Date: </span> {detail.date}</div>
                                <div className="px-4"><span className='text-gray-700 font-bold'>Product: </span> {detail.product}</div>
                                <div className="px-4"><span className='text-gray-700 font-bold'>Stocks: </span> {detail.stock}</div>
                                <div className="px-4"><span className='text-gray-700 font-bold'>Code ID: </span> {detail.codeId}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditorDetails;
