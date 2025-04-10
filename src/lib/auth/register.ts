import { prisma } from "../prisma";
import bcrypt from "bcryptjs";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function register({ email, password, name }: RegisterData) {
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return user;
} 