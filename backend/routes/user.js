const { register, login, followUser, logout, updatePassword, updateProfile, deleteMyProfile, getUserProfile, getAllUser, myprofile, forgotPassword, resetPassword, getMyPosts, getUserPosts } = require("../controllers/user");
const {isAuthenticated} = require("../middleware/auth")
const router = require("express").Router();

router.post("/register",register);
router.post("/login",login);
router.get("/follow/:id",isAuthenticated,followUser);
router.get("/logout",isAuthenticated,logout);
router.put("/update/password",isAuthenticated,updatePassword);
router.put("/update/profile",isAuthenticated,updateProfile);
router.delete("/deleteprofile",isAuthenticated,deleteMyProfile);
router.get("/user/:id",isAuthenticated,getUserProfile);
router.get("/allusers",isAuthenticated,getAllUser);
router.get("/me",isAuthenticated,myprofile);
router.get("/my/posts",isAuthenticated,getMyPosts);
router.get("/userposts/:id",isAuthenticated, getUserPosts);
router.post("/forgot/password",forgotPassword);
router.put("/password/reset/:token",resetPassword);
module.exports = router; 