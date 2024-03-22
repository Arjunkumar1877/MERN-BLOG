import express from "express";
const router = express.Router();
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletePost, getPost } from "../controllers/post.controller.js";



router.post("/create", verifyToken,  create);

router.get('/getposts', getPost);

router.delete("/deletepost/:postId/:userId", verifyToken, deletePost)


export default router;