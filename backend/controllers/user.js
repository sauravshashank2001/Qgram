const User = require("../models/User");
const Post = require("../models/Post");
const {sendEmail}= require("../middleware/sendEmail")
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.register = async(req,res) => {
    try {
        const {name,email,password,avatar} = req.body;
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "user already exist"
            })
        }
        const myCloud = await cloudinary.v2.uploader.upload(avatar,{
            older: "avatars"
        })

        user = await User.create({name,email,password,avatar:{public_id:myCloud.public_id,url:myCloud.secure_url}});
        const token = await user.generateToken();
        const option = {
            expires: new Date(Date.now()+(1000 * 60 * 60 * 24 * 30))
            ,httpOnly: true
        }

        
        
        res.status(201).cookie("token",token,option).json({
            success: true,
            message:"user registered successfully",
            user,
            token
        })

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message

        })
    }
}



exports.login = async(req,res)=> {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})
                                .select("+password")
                                .populate("posts followers following");
    
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "enter right credentials"
            })
        }
        
        const token = await user.generateToken();
        const option = {
            expires: new Date(Date.now()+(1000 * 60 * 60 * 24 * 30))
            ,httpOnly: true
        }

        
        
        res.status(200).cookie("token",token,option).json({
            success: true,
            message:"user logged in",
            user,
            token
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message

        })
    }
}


exports.logout = async(req,res)=>{
    try{
        res.status(200).cookie("token",null,{expires: new Date(Date.now()),httpOnly: true}).json({
            success: true,
            message:"Logged Out Successfully"
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
       
    }
}






exports.followUser = async (req,res) => {
    try{
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        if(!userToFollow){
            return res.status(401).json({
                success: false,
                message: "user not found"
            });
        }

        if(loggedInUser.following.includes(userToFollow._id)){
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(indexFollowing,1);
            const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(indexFollowers,1);


            await loggedInUser.save();
            await userToFollow.save();

            return res.status(201).json({
                success: true,
                message: "user Unfollowed"
            })
        }
        else{
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);
    
            await loggedInUser.save();
            await userToFollow.save();
            
            
            res.status(201).json({
                success: true,
                message: "User Followed"
            })
        }

       
    }
    catch(error){
        res.status(500).json({
            success: true,
            message: "internal server error"
        })
    }
}



exports.updatePassword = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("+password");
        const {oldPassword,newPassword} = req.body;
        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success: false,
                message: "Please fill all the required fields"
            });
        }
        const isMatch = await user.matchPassword(oldPassword);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect Old Password"
            });
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    }
    catch(err){
        res.status(500).json({
            success: true,
            message: "internal server error"
        })
    }
}

exports.updateProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const {name,email,avatar} = req.body;
        if(name){
            user.name = name;
        }
        if(email){
            user.email = email;
        }
        //user avatar to do
        if (avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      
            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatars",
            });
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
          }
      


        await user.save();
        res.status(200).json({
            success: true,
            message: "profile updated successfully"
        })

    }
    catch(err){
        res.status(500).json({
            success: true,
            message: "internal server error"
        })
    }
}


exports.getMyPosts = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const posts = [];
  
      for (let i = 0; i < user.posts.length; i++) {
        const post = await Post.findById(user.posts[i]).populate(
          "likes comments.user owner"
        );
        posts.push(post);
      }
  
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  

exports.deleteMyProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;
       
        //Remove photos from cloudinary

        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        await user.remove();

        //logout user after deleting profile

        res.cookie("token",null,{expires: new Date(Date.now()),httpOnly: true});


        //deleting all post of users
        for(let i=0;i<posts.length;i++){
            const post = await Post.findById(posts[i]);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.remove();
        }

       // removing user from  followers following

       for(let i=0;i<followers.length;i++){
        const follower = await User.findById(followers[i]);
        const index = follower.following.indexOf(userId);
        follower.following.splice(index,1);
        await follower.save();
       }
       
       // removing user from  followings follower
      
       for(let i=0;i<following.length;i++){
        const follows = await User.findById(following[i]);
        const index = follows.followers.indexOf(userId);
        follows.followers.splice(index,1);
        await follows.save();
       }
    




        res.status(200).json({
            success: true,
            message: "profile deleted successfully"
        })
        
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.myprofile = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).populate("posts followers following");
        res.status(201).json({
            success: true,
            user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.getUserProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.params.id).populate("posts followers following");
        if(!user){
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        res.status(201).json({
            success: true,
            user
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.getAllUser = async(req,res)=>{
    try{
        const users = await User.find({name: {$regex: req.query.name, $options: 'i'}});
        res.status(200).json({
            success: true,
            users
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

exports.forgotPassword = async(req,res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const resetToken = await user.getResetPasswordToken();
        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
        const message = `reset your password by clicking on the link below : ${resetUrl}`;
        try{
            await sendEmail({
                email: user.email,
                subject: "ResetPassword",
                message,
            })
            res.status(200).json({
                success: true,
                message: `Email Sent Successfully to ${user.email}`
            })
        }
        catch(err){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                message: err.message 
            })
        }

    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.resetPassword = async(req,res)=>{
    try{
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt : Date.now()},
        });
        if(!user){
           return res.status(401).json({
            success: false,
            message: "Token has expired"
           })
        }
        user.password = req.body.password;
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(200).json({
            success:true,
            message: "password updated successfully"
        })
    }   
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.getUserPosts = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      const posts = [];
  
      for (let i = 0; i < user.posts.length; i++) {
        const post = await Post.findById(user.posts[i]).populate(
          "likes comments.user owner"
        );
        posts.push(post);
      }
  
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  