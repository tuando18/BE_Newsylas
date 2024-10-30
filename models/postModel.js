const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postModel = new Schema({
    
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    
    image: {
        type: Array,
        default: null // Mặc định là null
    },
}, {
    timestamps: true // Kích hoạt tính năng tự động tạo createdAt và updatedAt
});
module.exports = mongoose.model('post', postModel);
