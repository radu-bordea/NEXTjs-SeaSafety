"use server";

import { prisma } from "@/app/db/prisma"; // Prisma client instance for DB operations
import { getCurrentuser } from "@/app/lib/current-user"; // Utility to get the logged-in user
import { revalidatePath } from "next/cache"; // Refreshes cache for a given route
import { isAdmin } from "@/app/lib/admins";

/**
 * Creates a new tutorial entry in the database.
 * This function is triggered from a form submission on the client side.
 */
export async function createTutorial(
  prevState: { success: boolean; message: string }, // Previous form state (useActionState hook)
  formData: FormData // Data from the submitted form
): Promise<{ success: boolean; message: string }> {
  try {
    // 1️⃣ Verify that a user is logged in
    const user = await getCurrentuser();
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to add tutorials.",
      };
    }

    if (!isAdmin(user.email)) {
      return {
        success: false,
        message: "You are not authorized to create tutorials.",
      };
    }

    // 3️⃣ Extract submitted fields
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;

    // 4️⃣ Validate that all required fields are provided
    if (!subject || !description || !videoUrl) {
      console.warn("Validation error: missing fields");
      return { success: false, message: "All fields are required." };
    }

    // 5️⃣ Validate that the provided URL is a valid YouTube link
    const isValidYouTubeUrl =
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(videoUrl);
    if (!isValidYouTubeUrl) {
      console.warn("Validation error: invalid YouTube URL");
      return { success: false, message: "Invalid YouTube URL format." };
    }

    // 6️⃣ Create the tutorial record in the database
    await prisma.tutorial.create({
      data: { subject, description, videoUrl },
    });

    // 7️⃣ Refresh the /tutorials page so the new entry appears immediately
    revalidatePath("/tutorials");

    return { success: true, message: "Tutorial created successfully." };
  } catch (error) {
    // Log and return an error state
    console.error("Error creating tutorial:", error);
    return {
      success: false,
      message: "An error occurred while creating the tutorial.",
    };
  }
}

/**
 * Fetch all tutorials from the database, sorted by newest first.
 */
export async function getTutorials() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log("Fetched tutorials:", tutorials.length); // Debug count
    return tutorials;
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return []; // Return empty array so the UI won't crash
  }
}

/**
 * Fetch a single tutorial by ID.
 * @param id - The ID of the tutorial to retrieve
 */
export async function getTutorialById(id: string) {
  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: Number(id) },
    });

    if (!tutorial) {
      console.log("Tutorial not found");
    }

    return tutorial;
  } catch (error) {
    console.log("Error fetching tutorial details", error);
    return null;
  }
}

/**
 * Delete a tutorial by ID (only allowed for admin 'Radu').
 * @param id - The ID of the tutorial to delete
 */
export async function deleteTutorial(id: number) {
  try {
    // 1️⃣ Verify user is logged in
    const user = await getCurrentuser();
    if (!user) {
      return { success: false, message: "Not logged in" };
    }

    // Check if is admin
    if(!isAdmin(user.email)) {
      return {success: false, message:"Unauthorized"}
    }

    // 3️⃣ Delete the tutorial from DB
    await prisma.tutorial.delete({ where: { id } });

    // 4️⃣ Revalidate the /tutorials page so UI updates immediately
    revalidatePath("/tutorials");

    return { success: true, message: "Tutorial deleted" };
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    return { success: false, message: "Error deleting tutorial" };
  }
}
