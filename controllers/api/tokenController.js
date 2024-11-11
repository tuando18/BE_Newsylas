
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');
const { 
    TOKEN_PROGRAM_ID, 
    getOrCreateAssociatedTokenAccount, 
    createTransferInstruction 
} = require('@solana/spl-token');

dotenv.config();

const app = express();
app.use(bodyParser.json()); // To parse JSON request bodies

// Kết nối tới Solana Devnet
const connection = new Connection(process.env.SOLANA_CONNECTION_URL);
const adminPrivateKey = Uint8Array.from(JSON.parse(process.env.ADMIN_PRIVATE_KEY));
const adminKeypair = Keypair.fromSecretKey(adminPrivateKey);

// Hàm để lấy thông tin token
const getTokenInfo = async (req, res) => {
    try {
        const adminWalletAddress = 'GEEoQbyDPRbXZVozvdnMW5Rj9D88PE3DcVPxYwtpRvz7';
        const tokenMintAddress = 'BBPMR5ec2HokRpSLJjfgW4H4wUw7kFCDR91cfHG6pPRj';

        // Lấy thông tin tài khoản token của admin
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(adminWalletAddress), {
            mint: new PublicKey(tokenMintAddress),
        });

        const tokenAccountInfo = tokenAccounts.value.map(accountInfo => ({
            address: accountInfo.pubkey.toString(),
            balance: accountInfo.account.data.parsed.info.tokenAmount.uiAmount,
            mint: accountInfo.account.data.parsed.info.mint,
            owner: accountInfo.account.data.parsed.info.owner,
        }));

        // Lấy các giao dịch gần đây
        const signatures = await connection.getSignaturesForAddress(new PublicKey(adminWalletAddress), {
            limit: 10,
        });

        const transactionHistory = await Promise.all(signatures.map(async (signatureInfo) => {
            const transaction = await connection.getParsedTransaction(signatureInfo.signature);
            if (transaction) {
                const transferInstruction = transaction.transaction.message.instructions.find(
                    instr => instr.program === 'spl-token' && instr.parsed && instr.parsed.info.amount
                );

                return {
                    signature: signatureInfo.signature,
                    amount: transferInstruction ? transferInstruction.parsed.info.amount : 0,
                    timestamp: new Date((transaction.blockTime || 0) * 1000),
                };
            } else {
                return {
                    signature: signatureInfo.signature,
                    amount: 0,
                    timestamp: null,
                };
            }
        }));

        res.json({
            token: {
                name: 'Sylas',
                tokenAccounts: tokenAccountInfo,
                transactionHistory,
            },
        });
    } catch (error) {
        console.error('Error fetching token info:', error);
        res.status(500).json({ error: 'Failed to fetch token information' });
    }
};

const transferTokens = async (req, res) => {
    try {
        const { userPublicKey } = req.body;
        if (!userPublicKey) {
            return res.status(400).json({ error: "User public key is required" });
        }

        const tokenMintAddress = new PublicKey('BBPMR5ec2HokRpSLJjfgW4H4wUw7kFCDR91cfHG6pPRj'); // Địa chỉ mint của token

        console.log("Creating or fetching Admin's token account...");
        // Tạo hoặc lấy tài khoản token của admin
        const adminTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            adminKeypair,
            tokenMintAddress,
            adminKeypair.publicKey
        );
        console.log('Admin Token Account:', adminTokenAccount.address);

        console.log("Creating or fetching User's token account...");
        // Tạo hoặc lấy tài khoản token của user
        const userTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            adminKeypair,
            tokenMintAddress,
            new PublicKey(userPublicKey)
        );
        console.log('User Token Account:', userTokenAccount.address);

        // Kiểm tra nếu tài khoản token của user chưa được tạo
        const userAccountExists = await connection.getAccountInfo(userTokenAccount.address);
        if (!userAccountExists) {
            console.error("User token account creation failed");
            return res.status(400).json({ error: 'User token account not created or found' });
        }

        // Kiểm tra số dư của admin để đảm bảo đủ token
        const adminBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
        console.log('Admin Token Balance:', adminBalance.value.uiAmount);

        if (adminBalance.value.uiAmount < 10) {
            return res.status(400).json({ error: 'Insufficient token balance in admin account' });
        }

        // Tạo và gửi giao dịch chuyển token
        const transaction = new Transaction().add(
            createTransferInstruction(
                adminTokenAccount.address,
                userTokenAccount.address,
                adminKeypair.publicKey,
                10 * Math.pow(10, 9), // 10 tokens (tính theo số lượng decimal)
                [], 
                TOKEN_PROGRAM_ID
            )
        );

        console.log('Sending transaction...');
        const signature = await sendAndConfirmTransaction(connection, transaction, [adminKeypair]);
        console.log('Transaction successful:', signature);

        return res.status(200).json({ success: true, signature });
    } catch (error) {
        console.error('Detailed Error:', error);
        if (error.name === 'TokenAccountNotFoundError') {
            return res.status(400).json({ error: 'Token account not found. Ensure the user has a valid token account.' });
        }
        return res.status(500).json({ success: false, error: 'Failed to transfer tokens' });
    }
};

// Các route cho ứng dụng
module.exports = {
  getTokenInfo, transferTokens
};
