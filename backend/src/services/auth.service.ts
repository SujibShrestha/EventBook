import bcrypt from "bcryptjs";
import type { RegisterInput } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";


export const registerUser = async (input: RegisterInput) => {
  const { name, email, password } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  
  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  return { user, token };
}
