var express = require('express');
const managerRouter = express.Router();

const fs = require('fs');
const path = require('path');
const hbs = require('hbs'); // Import Handlebars

const renderPartial = (partialName, data = {}) => {
    const partialPath = path.join(__dirname, '../views/partials', `${partialName}.hbs`);
    const template = fs.readFileSync(partialPath, 'utf8');
    
    // Biên dịch template với dữ liệu
    const compiledTemplate = hbs.compile(template);
    return compiledTemplate(data); // Trả về HTML đã được biên dịch
};

// Điều hướng cho trang quản lý tài xế của admin
managerRouter.get('/post', (req, res) => {
    const admin = req.session.admin;
    console.log(admin);

    const drivers = [];
    const content = renderPartial('post'); // Giả sử bạn có hàm renderPartial để tạo nội dung
    res.render('dashboard', {
        title: 'Bài viết',
        body: content,
        admin, // Gửi ID người dùng tới view nếu cần
    });
});
managerRouter.use("/user", function (req, res, next) {
    const admin = req.session.admin;
    console.log(admin);

    const drivers = [];
    const content = renderPartial('user');
    res.render('dashboard', {
        title: 'Người dùng',
        body: content,
    });
});
module.exports = managerRouter;
