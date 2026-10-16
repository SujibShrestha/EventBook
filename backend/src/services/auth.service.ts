import bcrypt from "bcryptjs";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const signToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

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

  const token = signToken(user.id);

  if (!token) {
    throw new Error("Token generation failed");
  }

  return { user, token };
}

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = signToken(user.id);
  const { passwordHash: _passwordHash, ...safeUser } = user;

  return { user: safeUser, token };
}
