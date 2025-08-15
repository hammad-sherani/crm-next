import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
}

const JWT_EXPIRY = "12h";

export function createJwt(user: User): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    return jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (error) {
    console.error("JWT creation failed:", error);
    throw new Error("Failed to generate JWT");
  }
}
