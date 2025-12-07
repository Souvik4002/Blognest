import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    profileImageUrl: {
      type: String,
      default: "/images/default.png",

    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    }
  },
  { timestamps: true }
);


  userSchema.pre('save', async function (next) {
     const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    next();
  });
const users = mongoose.model('user', userSchema);

export default users;
