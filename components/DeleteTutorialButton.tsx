"use client";
// This tells Next.js that this is a client component
// (needed because we're using browser APIs like `confirm` and toast notifications)

// Import the server action to delete a tutorial from the database
import { deleteTutorial } from "@/actions/tutorial.actions";

// Import toast notifications library
import { toast } from "sonner";

export default function DeleteTutorialButton({
  tutorialId,
}: {
  tutorialId: number; // The ID of the tutorial to delete
}) {
  /**
   * Handles the delete button click event
   * 1. Asks for user confirmation
   * 2. Calls the server action to delete the tutorial
   * 3. Shows a success toast notification
   */
  const handleDelete = async () => {
    // Show confirmation dialog
    const confirmDelete = confirm(
      "Are you sure you want to delete this tutorial?"
    );
    if (!confirmDelete) return; // Exit if user cancels

    // Call the server action to delete the tutorial
    await deleteTutorial(tutorialId);

    // Show a success toast after deletion
    toast.success("Tutorial deleted successfully ✅");
  };

  // Render the delete button
  return (
    <button
      onClick={handleDelete} // Attach delete logic
      className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      🗑 Delete
    </button>
  );
}
