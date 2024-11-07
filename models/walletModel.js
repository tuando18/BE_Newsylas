const { Connection, PublicKey } = require('@solana/web3.js');
const dotenv = require('dotenv');

dotenv.config(); // Tải biến môi trường từ file .env

// Tạo kết nối với mạng Solana
const connection = new Connection(process.env.SOLANA_CONNECTION_URL);

async function getWalletInfo(address) {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: PublicKey.default,
    });

    return {
        balance: balance / 1e9, // Chuyển đổi từ lamports sang SOL
        tokenAccounts: tokenAccounts.value,
    };
}

module.exports = {
    getWalletInfo,
};
