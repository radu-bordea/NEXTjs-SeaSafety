"use server"; // Marks this function to be run on the server side

import { prisma } from "@/app/db/prisma"; // Import the Prisma client for DB access
import { revalidatePath } from "next/cache"; // Used to revalidate static cache paths

export async function createTutorial(
  prevState: { success: boolean; message: string }, // Previous state for progressive enhancement (like in form submissions)
  formData: FormData // Incoming form data
): Promise<{ success: boolean; message: string }> {
  try {
    // Extract form fields
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;

    // Validate required fields
    if (!subject || !description) {
      console.log("Missing tutorial fields");
      return { success: false, message: "All fields are required" };
    }

    // Save new tutorial entry in the database
    const tutorial = await prisma.tutorial.create({
      data: { subject, description },
    });

    // Revalidate the /tutorials path so the new data shows up
    revalidatePath("/tutorials");

    // Return success response
    return { success: true, message: "Tutorial created successfully" };
  } catch (error) {
    // Log error message in the server console
    console.log("An error occured while creating the tutorial");

    // Return error response
    return {
      success: false,
      message: "An error occured while creating the tutorial",
    };
  }
}
