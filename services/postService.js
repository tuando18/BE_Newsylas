const Post = require("../models/postModel");
const HttpResponse = require("../utils/httpResponse");
const dotenv = require('dotenv');
dotenv.config();

class PostService {
    // Lấy tất cả bài viết
    getAllPost = async () => {
        try {
            const data = await Post.find(); // Removed population for user_id and group_id
            return HttpResponse.success(data, HttpResponse.getErrorMessages('getDataSucces'));
        } catch (error) {
            console.log(error);
            return HttpResponse.error(error);
        }
    }

    // Lấy bài viết theo ID
    getPostByID = async (id) => {
        try {
            const data = await Post.findById(id); 
            if (data) {
                return HttpResponse.success(data, HttpResponse.getErrorMessages('getDataSucces'));
            }
            return HttpResponse.error('Post not found');
        } catch (error) {
            console.log(error);
            return HttpResponse.error(error);
        }
        
    }

    // Thêm bài viết
    addPost = async ( title, content, imageArray) => {
        try {
            // Tạo bài viết mới
            const newPost = new Post({
                image: imageArray,
                title: title,
                content: content,
            });

            // Lưu bài viết vào cơ sở dữ liệu
            const result = await newPost.save();

            return HttpResponse.success(result, HttpResponse.getErrorMessages('success'));
        } catch (error) {
            console.log(error);
            return HttpResponse.error(error);
        }
        
    }

    // Cập nhật bài viết
    updatePost = async (id, title, content, imageArray) => {
        try {
            const post = await Post.findById(id);
            if (!post) {
                return HttpResponse.error('Post not found');
            }

            // Update post fields
            post.image = imageArray.length > 0 ? imageArray : post.image;
            post.title = title ?? post.title;
            post.content = content ?? post.content;

            const result = await post.save();
            return HttpResponse.success(result, HttpResponse.getErrorMessages('success'));
        } catch (error) {
            console.log(error);
            return HttpResponse.error(error);
        }
    }
}

module.exports = PostService;
