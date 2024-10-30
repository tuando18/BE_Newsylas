var express = require('express');
var router = express.Router();
const PostController = require('../../controllers/api/postController');
const upload = require('../../config/common/upload');

router.get('/get-all-post', new PostController().getAllPost);
router.get('/get-post-by-id/:id', new PostController().getPostByID);
router.post('/add-post', upload.array('images'), new PostController().addPost);
router.put('/update-post/:id', upload.array('images'), new PostController().updatePost);

module.exports = router;
