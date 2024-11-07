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
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');

dotenv.config();

const app = express();
app.use(bodyParser.json()); // To parse JSON request bodies

const connection = new Connection(process.env.SOLANA_CONNECTION_URL);

// Get token information
const getTokenInfo = async (req, res) => {
    try {
        const adminWalletAddress = 'GEEoQbyDPRbXZVozvdnMW5Rj9D88PE3DcVPxYwtpRvz7'; // Replace with actual admin wallet address
        const tokenMintAddress = 'BBPMR5ec2HokRpSLJjfgW4H4wUw7kFCDR91cfHG6pPRj'; // Replace with actual token mint address

        // Get token account info
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(adminWalletAddress), {
            mint: new PublicKey(tokenMintAddress),
        });

        const tokenAccountInfo = tokenAccounts.value.map(accountInfo => ({
            address: accountInfo.pubkey.toString(),
            balance: accountInfo.account.data.parsed.info.tokenAmount.uiAmount,
            mint: accountInfo.account.data.parsed.info.mint,
            owner: accountInfo.account.data.parsed.info.owner,
        }));

        // Get recent transaction signatures
        const signatures = await connection.getSignaturesForAddress(new PublicKey(adminWalletAddress), {
            limit: 10, // Limit the number of transactions for simplicity
        });

        // Get transaction details
        const transactionHistory = await Promise.all(signatures.map(async (signatureInfo) => {
            const transaction = await connection.getParsedTransaction(signatureInfo.signature);
            if (transaction) {
                const transferInstruction = transaction.transaction.message.instructions.find(
                    instr => instr.program === 'spl-token' && instr.parsed && instr.parsed.info.amount
                );

                return {
                    signature: signatureInfo.signature,
                    amount: transferInstruction ? transferInstruction.parsed.info.amount / Math.pow(10, 9) : 0,
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

module.exports = {
  getTokenInfo,
};
