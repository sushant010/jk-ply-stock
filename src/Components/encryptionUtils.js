// import CryptoJS from 'crypto-js';

// const encryptionKey = 'mKghetsvcbertioqbcger';

// // Encryption function
// export const encryptData = (data) => {
//     try {
//         const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
//         return encryptedData;
//     } catch (error) {
//         console.error('Error encrypting data:', error);
//         return null;
//     }
// };

// // Decryption function
// export const decryptData = (encryptedData) => {
//     try {
//         const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
//         if (bytes.toString()) {
//             const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//             return decryptedData;
//         }
//         return null;
//     } catch (error) {
//         console.error('Error decrypting data:', error);
//         return null;
//     }
// };