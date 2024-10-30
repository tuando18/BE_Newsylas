const Post = require("../../models/postModel");
const PostService = require("../../services/postService");
const HttpResponse = require("../../utils/httpResponse");

class PostController {
    // Hiển thị toàn bộ bài viết
    getAllPost = async (req, res) => {
        try {
            const data = await new PostService().getAllPost();
            if (data) {
                return res.json(HttpResponse.result(data));
            } else {
                return res.json(HttpResponse.fail(HttpResponse.getErrorMessages('dataNotFound')));
            }
        } catch (error) {
            console.log(error);
            return res.json(HttpResponse.error(error));
        }
    }

    // Hiển thị một bài viết khi được chọn
    getPostByID = async (req, res) => {
        try {
            const { id } = req.params;
            const data = await new PostService().getPostByID(id);
            if (data) {
                return res.json(HttpResponse.result(data));
            } else {
                return res.json(HttpResponse.fail(HttpResponse.getErrorMessages('dataNotFound')));
            }
        } catch (error) {
            console.log(error);
            return res.json(HttpResponse.error(error));
        }
    }

    // Thêm bài viết
    addPost = async (req, res, next) => {
        try {
            const { title, content } = req.body; // Lấy title và content từ body
            console.log('Title:', title); // Kiểm tra giá trị title
            console.log('Content:', content); // Kiểm tra giá trị content
            
            // Xử lý hình ảnh (nếu có)
            let imageArray = [];
            if (req.files && req.files.length > 0) {
                imageArray = req.files.map(file => {
                    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
                });
            }
    
            const createdPost = await new PostService().addPost( title, content, imageArray);
            if (createdPost) {
                return res.json(HttpResponse.result(createdPost));
            } else {
                return res.json(HttpResponse.fail(HttpResponse.getErrorMessages('dataNotFound')));
            }
        } catch (error) {
            console.log(error);
            return res.json(HttpResponse.error(error));
        }
    }
    

    // Cập nhật bài viết
    updatePost = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content } = req.body; // Nhận dữ liệu từ body
            // Xử lý hình ảnh (nếu có)
            let imageArray = [];
            if (req.files && req.files.length > 0) {
                imageArray = req.files.map(file => {
                    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
                });
            }
            
            const updatedPost = await new PostService().updatePost(id, title, content, imageArray); // Cập nhật bài viết với ảnh
            if (updatedPost) {
                return res.json(HttpResponse.result(updatedPost));
            } else {
                return res.json(HttpResponse.fail(HttpResponse.getErrorMessages('dataNotFound')));
            }
        } catch (error) {
            console.log(error);
            return res.json(HttpResponse.error(error));
        }
    }
}

module.exports = PostController;
