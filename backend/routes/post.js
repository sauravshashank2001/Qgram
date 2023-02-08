const { createPost, likeOrUnlikePost, deletePost, getPostOfFollowing, updateCaption, addComment, deleteComment } = require("../controllers/post");
const { isAuthenticated } = require("../middleware/auth");

const router = require("express").Router();

router.post("/post/upload",isAuthenticated,createPost);
router.get("/post/:id",isAuthenticated,likeOrUnlikePost)
router.delete("/post/:id",isAuthenticated,deletePost);
router.get("/posts",isAuthenticated,getPostOfFollowing);
router.put("/post/:id",isAuthenticated,updateCaption);
router.post("/post/comment/:id",isAuthenticated,addComment);
router.delete("/post/comment/:id",isAuthenticated,deleteComment);



module.exports = router; 
