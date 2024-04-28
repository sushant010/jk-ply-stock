import React from 'react';

function DeleteConfirmationModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-md">
                <p className="text-lg mb-4">Are you sure you want to delete this item?</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Yes</button>
                    <button onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
