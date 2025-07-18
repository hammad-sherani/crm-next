import jwt from "jsonwebtoken";

interface User {
  _id: string; 
  email: string;
  role: string;
}

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const createJwt = async (user: User): Promise<string> => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    throw new Error("JWT_SECRET is missing");
  }

  const payload: JwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  try {
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "12h" });
    return token;
  } catch (error) {
    console.error("Failed to create JWT:", error);
    throw new Error("Failed to generate JWT");
  }
};