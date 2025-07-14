import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
  title: String,
  description: String,
  assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  dueDate: Date,
});


const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default Task;