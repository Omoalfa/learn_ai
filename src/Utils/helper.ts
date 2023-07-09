import { JWT_SECRET } from "@/Config";
import jwt from "jsonwebtoken";

export const generatePin = (): string => Math.floor(100000 + Math.random() * 900000).toString()

export const generateToken = (id: number, email: string): string => {
  return jwt.sign({ id, email }, JWT_SECRET);
} 

export const verifyToken = (token: string): { id: number, email: string } => {
  const decode = jwt.verify(token, JWT_SECRET) as { id: number, email: string };

  return decode;
}
