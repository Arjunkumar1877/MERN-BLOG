import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';


export const signup = async(req,res, next)=>{
    console.log(req.body);
 //  res.json("hai")
    const {username, email, password} = req.body;

 
    if(!username || !email || !password || username === '' || email === '' || password === ''){
     return next(errorHandler(400, "All fields are required"));
    }
 
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({
     username,
     email,
     password: hashedPassword
    })
 
  try {
   await newUser.save();
 
     res.json("saved user")
  } catch (error) {
     next(error)
  }
 }
 