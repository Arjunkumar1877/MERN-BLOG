import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
   
  },
  profilePicture: {
    type: String,
    default: "https://i.pinimg.com/600x315/7f/39/f0/7f39f0ad4dd6b777ab72bc7dc3b91958.jpg"
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;