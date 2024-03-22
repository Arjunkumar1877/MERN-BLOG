import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import  jwt  from 'jsonwebtoken';


export const signup = async(req, res, next)=>{
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


export const signin = async(req, res, next)=>{
   const { email, password } = req.body;

   if(!email || !password || email === '' || password === ''){
      next(errorHandler(400, "All fields required"));
   }

   try {
      const validUser = await User.findOne({email: email});

      if(!validUser){
      return next(errorHandler(400, 'User not found !'));
      }

      const validPassword = bcryptjs.compareSync(password, validUser.password);

      if(!validPassword){
       return  next(errorHandler(400, 'Invalid credential !'))
      }

      const token = jwt.sign({
         id: validUser._id,
         isAdmin: validUser.isAdmin
      }, process.env.JWT_SECRET)

      const {password: passs, ...restData} = validUser._doc;

      res.status(200).cookie('access_token', token, {httpOnly: true}).json(restData)
   } catch (error) {
      next(error)
   }

}
 

export const google = async(req, res, next)=>{
   console.log(req.body);
   const { name, email, googlePhotoUrl } = req.body;
   try {
      
      const user = await User.findOne({email});

      if(user){
         const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
         const { password, ...restData} = user._doc;
         res.status(200).cookie('access_token', token, {
            httpOnly: true,
         }).json(restData);
      }else{
         const generatedPassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8);
         console.log(generatedPassword);
         const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

         const newUser = new User({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email: email,
            password: hashedPassword,
            profilePicture: googlePhotoUrl
         })

         await newUser.save();
         const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
         const { password, ...restData} = newUser._doc;

         res.status(200).cookie("access_token", token, {
            httpOnly: true
         }).json(restData)
      }

      // res.json("hii")
   } catch (error) {
      next(error)
   }
}