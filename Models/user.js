import mongoose from "mongoose";
import  userRoles  from "../utils/userRole.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SECRET = process.env.SECRET;
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      default: null,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      maxLength: [50, "max length is 50"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      default: null,
      select: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    emailVerificationToken:String,
    emailVerificationTokenExpiry:Date
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
   
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  return next();
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, SECRET, {
    expiresIn: "2h",
  });
};
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateForgetPasswordToken = async function () {
  const forgetToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgetToken)
    .digest("hex");
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgetToken;
};

userSchema.methods.getEmailVerificationToken=async function()
{
    if(!this.isEmailVerified)
    {
        const verificationToken=crypto.randomBytes(20).toString("hex");
        this.emailVerificationToken=crypto.createHash("sha256").update(verificationToken).digest("hex");
        this.emailVerificationTokenExpiry=Date.now() + 20 * 60 * 1000;
        await this.save({ validateBeforeSave: false })
        return verificationToken

    }   
}

userSchema.statics.IsEmailExists = async function (email) {
  if (await User.findOne({ email: email })) {
    return true;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;