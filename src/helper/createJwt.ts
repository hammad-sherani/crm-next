import jwt from "jsonwebtoken";

// Define the User interface to match your User model
interface User {
  _id: string; // or import the correct type from your User model
  email: string;
  role: string;
}

// Define the JWT payload interface
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
    id: user._id.toString(), // Ensure _id is converted to string
    email: user.email,
    role: user.role,
  };

  try {
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Failed to create JWT:", error);
    throw new Error("Failed to generate JWT");
  }
};