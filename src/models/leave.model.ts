import mongoose from "mongoose";
import { Schema } from "mongoose";

const leaveSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  reason: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const Leave = mongoose.models.Leave || mongoose.model("Leave", leaveSchema);
export default Leave;