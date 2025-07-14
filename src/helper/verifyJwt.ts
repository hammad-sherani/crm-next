// helper/verifyJwt.ts

import jwt from "jsonwebtoken";

export const verifyJwt = (token: string): { id: string; email: string; role: string } | null => {
  try {
    const secret = process.env.JWT_SECRET || "your_secret_key";
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};
