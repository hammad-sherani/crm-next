import jwt from "jsonwebtoken";
import  User  from "../models/user.model.js"; 

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const createJwt = async (user: typeof User.prototype): Promise<string> => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    throw new Error("JWT secret is missing");
  }

  try {
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    return token;
  } catch (error) {
    console.log(error);
  }
};
