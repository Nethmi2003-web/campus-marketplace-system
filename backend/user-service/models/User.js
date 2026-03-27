import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    faculty: {
      type: String,
      required: true,
      trim: true,
    },
    universityEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@(my\.sliit\.lk|sliit\.lk|.*\.ac\.lk|.*\.edu)$/, 'Please use a valid university email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin", "sportAdmin"],
      default: "user",
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    sessionVersion: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Virtual for confirmPassword validation
userSchema.virtual('confirmPassword')
  .get(function() { return this._confirmPassword; })
  .set(function(value) { this._confirmPassword = value; });

userSchema.pre('validate', function(next) {
  if (this.isNew || this.isModified('password')) {
    if (this.password !== this._confirmPassword) {
      this.invalidate('confirmPassword', 'Password and confirm password must match');
    }
  }
  next();
});

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password (login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
