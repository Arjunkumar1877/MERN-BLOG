import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';


export const signup = async(req,res)=>{
    console.log(req.body);
 //  res.json("hai")
    const {username, email, password} = req.body;

 
    if(!username || !email || !password || username === '' || email === '' || password === ''){
     return res.status(400).json({message: 'All fields are required'})
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
     res.status(500).json({message: error.message})
  }
 }
 