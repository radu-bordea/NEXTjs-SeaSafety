"use server";

import { prisma } from "@/app/db/prisma"; // Prisma client to interact with DB
import bcrypt from "bcryptjs"; // For hashing passwords securely
import { signAuthToken, setAuthCookie, removeAuthCookie } from "@/app/lib/auth"; // JWT utilities

// Type for response returned by register/login actions
type ResponseResult = {
  success: boolean;
  message: string;
};

/**
 * Register a new user
 * @param prevState - optional previous state (not used, but kept for compatibility)
 * @param formData - form data containing name, email, and password
 * @returns {ResponseResult} - success status and message
 */
export async function registerUser(
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> {
  try {
    // Extract values from form
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Validate required fields
    if (!name || !email || !password) {
      return { success: false, message: "All fields are required" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Generate JWT token including userId, name, and email
    // ✅ Including name/email allows middleware to verify Radu access
    const token = await signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    // Set cookie on client for authentication
    await setAuthCookie(token);

    return { success: true, message: "Registration successful" };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}

/**
 * Log in an existing user
 * @param prevState - optional previous state
 * @param formData - form data containing email and password
 * @returns {ResponseResult} - success status and message
 */
export async function loginUser(
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> {
  try {
    // Extract and trim email & password
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password)
      return { success: false, message: "Email and password are required" };

    // Fetch user from database
    const user = await prisma.user.findUnique({ where: { email } });

    // If user not found or password missing → fail
    if (!user || !user.password)
      return { success: false, message: "Invalid email or password" };

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return { success: false, message: "Invalid email or password" };

    // Generate JWT including name/email
    const token = await signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return { success: true, message: "Login successful" };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
}

/**
 * Log out the current user
 * Removes the auth cookie
 * @returns {success:boolean, message:string}
 */
export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await removeAuthCookie();
    return { success: true, message: "Logout successful" };
  } catch {
    return { success: false, message: "Logout failed. Please try again" };
  }
}
