import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      default: null,
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: (v: string) => /\d{10}/.test(v),
        message: (props: { value: string }) => `${props.value} is not a valid phone number!`,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    preferences: {
      type: Object,
      default: {},
    },
    socialLinks: {
      type: Object,
      default: {},
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    assignedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    leaves: [
      {
        type: Schema.Types.ObjectId,
        ref: "Leave",
      },
    ],
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
