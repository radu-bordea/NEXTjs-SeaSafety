"use server";

import { prisma } from "@/app/db/prisma";
import bcrypt from "bcryptjs";
import { signAuthToken, setAuthCookie, removeAuthCookie } from "@/app/lib/auth";

type ResponseResult = {
  success: boolean;
  message: string;
};

export async function registerUser(
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> {
  try {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!name || !email || !password) {
      console.log("Validation error: Missing registration fields");
      return { success: false, message: "All fields are required" };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log("Registration failed, user already exists:", email);
      return { success: false, message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Sign and set auth token
    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);
    console.log(`User regsitered successfully: ${email}`);

    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}

// Log user out and remove auth cookie
export async function logoutUser(): Promise<{
  success: boolean, message: string
}> {
  try {
    await removeAuthCookie()
    console.log("User logout successfully");
    return {success: true, message: 'Logout successful'}
  } catch (error) {
    console.log("Unexpected error", error);

    return {success: false, message: "logout failed. Please try again"}
    
  }
}