var express = require('express');
const managerRouter = express.Router();

const fs = require('fs');
const path = require('path');
const hbs = require('hbs'); // Import Handlebars
const { isAuthenticated, redirectToHomeIfLoggedIn, isAuthorized } = require('../middlewares/authMiddleware');

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
managerRouter.get('/', (req, res) => {
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

managerRouter.get('/create_post', (req, res) => {
    const admin = req.session.admin;
    console.log(admin);

    const drivers = [];
    const content = renderPartial('create_post'); 
    res.render('dashboard', {
        title: 'Tạo bài viết',
        body: content,
        admin, // Gửi ID người dùng tới view nếu cần
    });
});

managerRouter.use("/post-detail/:id", function (req, res, next) {
    // Thực hiện logic để lấy chi tiết bài viết dựa trên `req.params.id`
    const admin = req.session.admin;
    console.log(admin); 

    const postId = req.params.id;
    const content = renderPartial('post_detail', {
        postId: postId, // Truyền thông tin id bài viết cho view
    });
    console.log(postId);
    
    // Render giao diện chi tiết bài viết
    res.render('dashboard', {
        title: 'Chi tiết bài viết',
        body: content,  // Tên đúng của phần template/partial
        admin: admin,    // Truyền thông tin admin nếu cần sử dụng trong view
    });
});
module.exports = managerRouter;
