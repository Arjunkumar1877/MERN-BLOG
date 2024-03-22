import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'


export const test = async(req,res)=>{
    res.json("Api working")
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          errorHandler(400, 'Username must be between 7 and 20 characters')
        );
      }
      if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
          errorHandler(400, 'Username can only contain letters and numbers')
        );
      }
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
};


export const deleteUser = async(req, res, next)=>{
  if(req.user.id !== req.params.userId){
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User had been deleted");
  } catch (error) {
    next(error)
  }

}


export const signout = async(req, res, next)=>{
 try {
  res.clearCookie('access_token').json("User had been signed out")
 } catch (error) {
  next(error)
 }
}


export const getUsers = async(req, res, next)=>{
  if(!req.user.isAdmin){
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find({}).sort({createAt: sortDirection}).skip(startIndex).limit(limit);

    const usersWithOutPassword = users.map((user)=>{
      const { password, ...resData } = user._doc;
      return resData;
    })
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth()-1,
      now.getDate()
    );

    const lastMonthsUsers = await User.countDocuments({
      createdAt: {$gte: oneMonthAgo}
    });

    res.status(200).json({
      users: usersWithOutPassword,
      totalUsers,
      lastMonthsUsers,
    });

  } catch (error) {
    next(error);
  }
}


export const deleteUserFromList = async(req, res, next)=>{
 if(req.user.id === req.params.userId){
  return next(errorHandler(402, 'You cannot delete your account itself'))
 }

 if(!req.user.isAdmin){
  return next(errorHandler(402, 'Admin can only delete users '))

 }
  try {
    const deleted = await User.findByIdAndDelete(req.params.userId);

    res.status(200).json("User sucessfully deleted !");


  } catch (error) {
    next(error)
  }
}