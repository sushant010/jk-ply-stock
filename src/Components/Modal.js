// AdditionalCreditModal.js
import React, { useState } from 'react';

function Modal({ onClose, onSave }) {
    const [additionalCredit, setAdditionalCredit] = useState('');

    const handleSave = () => {
        if (additionalCredit.trim() !== '') {
            onSave(parseFloat(additionalCredit));
            onClose();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Enter Additional Credit Value</h2>
                <input
                    type="number"
                    value={additionalCredit}
                    onChange={(e) => setAdditionalCredit(e.target.value)}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default Modal;
