// src/lib/jwt.ts

import jwt from "jsonwebtoken";
import { JwtPayload } from "@/types/auth.type";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET not found in environment variables");
}

const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
  });
};

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
};

export { signToken, verifyToken };