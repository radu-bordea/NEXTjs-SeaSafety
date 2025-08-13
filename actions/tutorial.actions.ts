"use server";

import { prisma } from "@/app/db/prisma"; // Import Prisma instance for database interaction
import { getCurrentuser } from "@/app/lib/current-user";
import { revalidatePath } from "next/cache"; // Used to refresh the cache of a specific path

/**
 * Server action to create a new tutorial entry.
 * This function will be triggered by a form submission from the client side.
 */
export async function createTutorial(
  prevState: { success: boolean; message: string }, // Previous form state (used by useActionState)
  formData: FormData // Form data submitted from the client
): Promise<{ success: boolean; message: string }> {
  try {
    // ✅ Check if user is logged in
    const user = await getCurrentuser();
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to add tutorials.",
      };
    }

    // ✅ Check if user is allowed (hardcoded for now)
    const allowedAdmins = [
      { name: "radu", email: "radu@gmail.com" },
      { name: "otherAdmin", email: "otheradmin@example.com" }, // optional second admin
    ];

    const isAllowed = allowedAdmins.some(
      (admin) => admin.name === user.name && admin.email === user.email
    );

    if (!isAllowed) {
      return {
        success: false,
        message: "You are not authorized to create tutorials.",
      };
    }

    // Extract form fields
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;

    // --- Basic Validation ---
    // Make sure all fields are filled
    if (!subject || !description || !videoUrl) {
      console.warn("Validation error: missing fields");
      return { success: false, message: "All fields are required." };
    }

    // Validate YouTube URL format (youtube.com or youtu.be links)
    const isValidYouTubeUrl =
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(videoUrl);
    if (!isValidYouTubeUrl) {
      console.warn("Validation error: invalid YouTube URL");
      return { success: false, message: "Invalid YouTube URL format." };
    }

    // --- Create Tutorial in DB ---
    await prisma.tutorial.create({
      data: {
        subject, // Title of the tutorial
        description, // Description or content
        videoUrl, // YouTube video link
      },
    });

    // Revalidate the cache for /tutorials so the new entry shows up immediately
    revalidatePath("/tutorials");

    // Return success state to client
    return {
      success: true,
      message: "Tutorial created successfully.",
    };
  } catch (error) {
    // Handle any unexpected error
    console.error("Error creating tutorial:", error);
    return {
      success: false,
      message: "An error occurred while creating the tutorial.",
    };
  }
}

/**
 * Server function to fetch all tutorials from the database.
 */
export async function getTutorials() {
  try {
    // Query all tutorials, most recent first
    const tutorials = await prisma.tutorial.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log("Fetched tutorials:", tutorials.length); // Debug: how many were fetched
    return tutorials;
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    return []; // Return empty array on error so UI won't crash
  }
}

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
