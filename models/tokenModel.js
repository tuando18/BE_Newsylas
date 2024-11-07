const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
    {
        tokenName: { type: String, required: true },
        tokenAddress: { type: String, required: true, unique: true },
        mintAddress: { type: String, required: true },
        owner: { type: String, required: true },
        balance: { type: Number, required: true },
        status: { type: String, default: 'Initialized' },
        transactionHistory: [
            {
                signature: String,
                amount: Number,
                timestamp: Date,
            },
        ],
    },
    {
        collection: 'Tokens',
    }
);

const TokenModel = mongoose.model('Token', tokenSchema);

module.exports = TokenModel;
