import bcrypt from "bcryptjs";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import type { AuthRole } from "../types/auth.js";

const signToken = (userId: string, role: AuthRole) => {
  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
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

  const token = signToken(user.id, user.role);

  if (!token) {
    throw new Error("Token generation failed");
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;

  return { user: safeUser, token };
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

  const token = signToken(user.id, user.role);
  const { passwordHash: _passwordHash, ...safeUser } = user;

  return { user: safeUser, token };
}

export const getCurrentUser = async (userId: string) => {

  if (!userId) {
    throw new Error("User ID is required");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
