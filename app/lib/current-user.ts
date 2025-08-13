import { verifyAuthToken, getAuthCookie } from "./auth"; // Functions to get token from cookies and verify JWT
import { prisma } from "@/app/db/prisma"; // Prisma client to query the database

// Define the shape of the JWT payload
type AuthPayload = {
  userId: string;
};

export async function getCurrentuser() {
  try {
    // Get the auth token from cookies
    const token = await getAuthCookie();
    if (!token) return null; // If no token exists, user is not logged in

    // Verify JWT token and get payload
    const payload = (await verifyAuthToken(token)) as AuthPayload;

    if (!payload?.userId) return null; // Invalid payload → treat as not logged in

    // Fetch the user from the database using the userId from the token
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true, // Only select needed fields
        email: true,
        name: true,
      },
    });

    return user; // Return the user object
  } catch (error) {
    console.log("Error getting the current user", error);
    return null; // Return null on any error
  }
}
