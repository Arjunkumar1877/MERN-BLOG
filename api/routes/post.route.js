import express from "express";
const router = express.Router();
import { verifyToken } from '../utils/verifyUser.js';
import { create } from "../controllers/post.controller.js";



router.post("/create", verifyToken,  create)


export default router;