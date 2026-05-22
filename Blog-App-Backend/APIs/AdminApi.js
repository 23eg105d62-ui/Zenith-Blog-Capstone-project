import exp from 'express'
import { register } from '../services/authService.js'
import { ArticleModel } from '../models/ArticleModel.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { upload } from '../config/multer.js'
import cloudinary from '../config/cloudinary.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import { UserModel } from '../models/UserModel.js'
export const  adminRoute=exp.Router()

//Register admin(protected route)
adminRoute.post("/users", verifyToken("ADMIN"), upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    //getb user obj
    let userObj = req.body;

    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    const newUserObj = await register({
      ...userObj,
      role: "ADMIN",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err); 
  }
});


//Read all articles
adminRoute.get("/articles", verifyToken("ADMIN"), async (req, res) => {
  //read articles of all authors
  const articles = await ArticleModel.find().populate("author");
  //send res
  res.status(200).json({ message: "all articles", payload: articles });
});

//Read all users (Authors and Users)
adminRoute.get("/users", verifyToken("ADMIN"), async (req, res) => {
  // Find all users who are not ADMINs
  const users = await UserModel.find({ role: { $in: ["USER", "AUTHOR"] } });
  res.status(200).json({ message: "all users", payload: users });
});

//Block  users
adminRoute.put("/users/:userId/block", verifyToken("ADMIN"), async (req, res) => {
  const { userId } = req.params;
  // Find user and update isBlocked status
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { isBlocked: true } },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User blocked successfully", payload: user });
});

//Unblock users
adminRoute.put("/users/:userId/unblock", verifyToken("ADMIN"), async (req, res) => {
  const { userId } = req.params;
  // Find user and update isBlocked status
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { isBlocked: false } },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User unblocked successfully", payload: user });
});

//Delete or restore article(Protected route)
adminRoute.patch("/articles/:id/status", verifyToken("ADMIN"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await ArticleModel.findById(id).populate("author");
  console.log(article);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // Update isArticleActive status
  article.isArticleActive = isArticleActive;
  await article.save(); 
  return res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    payload: article, 
  });
});