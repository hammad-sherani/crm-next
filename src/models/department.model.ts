import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

const Department =  mongoose.models.Department || mongoose.model("Department", departmentSchema);
export default Department;