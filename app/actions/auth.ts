"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  deleteSession,
  getSessionUser,
} from "@/lib/auth/session";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  await createSession(user.id);

  return { error: null, success: true };
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required", success: false };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Invalid email or password", success: false };
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return { error: "Invalid email or password", success: false };
  }

  await createSession(user.id);

  return { error: null, success: true };
}

export async function signOut() {
  await deleteSession();
  return { success: true };
}

export async function getUser() {
  return getSessionUser();
}
