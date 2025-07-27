"use server";
// Marks this module or function to be executed **on the server side** in Next.js (required for server actions)

// Import the Prisma client from your app directory to interact with the database
import { prisma } from "@/app/db/prisma";

// Import `revalidatePath` from Next.js to manually revalidate a specific route in the static cache
import { revalidatePath } from "next/cache";

/**
 * Server action to create a new tutorial entry.
 * This function is designed to work with server-side form submissions (e.g., using <form action={createTutorial}>).
 *
 * @param prevState - Previous submission state, useful for form status and error handling
 * @param formData - The FormData object containing submitted form fields
 * @returns An object indicating whether the creation was successful and a message
 */
export async function createTutorial(
  prevState: { success: boolean; message: string }, // Prior state passed from the form (progressive enhancement)
  formData: FormData // Incoming form data from the browser
): Promise<{ success: boolean; message: string }> {
  try {
    // Extract individual fields from the form data
    const subject = formData.get("subject") as string; // The subject/title of the tutorial
    const description = formData.get("description") as string; // The tutorial description or content

    // Validate that both required fields are present
    if (!subject || !description) {
      console.log("Missing tutorial fields"); // Log issue for debugging
      return { success: false, message: "All fields are required" }; // Return validation error
    }

    // Create a new tutorial entry in the database using Prisma
    const tutorial = await prisma.tutorial.create({
      data: { subject, description }, // Map submitted values to the database schema
    });

    // Revalidate the "/tutorials" path so that newly added tutorials are visible on the frontend
    revalidatePath("/tutorials");

    // Return success state to the form handler
    return { success: true, message: "Tutorial created successfully" };
  } catch (error) {
    // Catch and log any errors (e.g., database errors)
    console.log("An error occured while creating the tutorial", error);

    // Return failure response to the form
    return {
      success: false,
      message: "An error occured while creating the tutorial",
    };
  }
}

/**
 * Fetches a list of all tutorials from the database, ordered by creation date.
 * Can be used on the server side to display tutorial lists in pages, APIs, etc.
 *
 * @returns An array of tutorials (empty if an error occurs)
 */
export async function getTutorials() {
  try {
    // Use Prisma to fetch all tutorials, sorted with newest first
    const tutorials = await prisma.tutorial.findMany({
      orderBy: { createdAt: "desc" }, // Sort tutorials from newest to oldest
    });

    // Log the number of tutorials fetched
    console.log("Fetched tutorial list", `${tutorials.length}`);

    // Return the list of tutorials to the caller
    return tutorials;
  } catch (error) {
    // Log any error encountered while fetching
    console.log("Error fetching tutorials", error);

    // Return an empty array as a safe fallback (prevents frontend crashes)
    return [];
  }
}
