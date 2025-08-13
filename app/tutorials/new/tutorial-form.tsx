"use client";

import { useActionState, useEffect } from "react"; // useActionState tracks form submission state
import { useRouter } from "next/navigation"; // Router for programmatic navigation
import { createTutorial } from "@/actions/tutorial.actions"; // Action that handles tutorial creation
import { toast } from "sonner"; // For toast notifications

const NewTutorialForm = () => {
  // Initialize state for the form action
  // `state` contains success & message from action
  // `formAction` is a function we pass to <form action={}>
  const [state, formAction] = useActionState(createTutorial, {
    success: false,
    message: "",
  });

  const router = useRouter(); // Next.js router for navigation

  // Watch for success state → show toast and redirect
  useEffect(() => {
    if (state.success) {
      toast.success("Tutorial submitted successfully"); // Show success toast
      router.push("/tutorials"); // Redirect to tutorials page
    }
  }, [state.success, router]);

  return (
    <div className="w-full max-w-md shadow-md rounded-lg p-8 border">
      {/* Form title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a Tutorial</h1>

      {/* Display error message if submission failed */}
      {state.message && !state.success && (
        <p className="text-red-500 mb-4 text-center">{state.message}</p>
      )}

      {/* Tutorial submission form */}
      <form action={formAction} className="space-y-4">
        {/* Subject input */}
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          name="subject"
          placeholder="Subject"
        />

        {/* Description textarea */}
        <textarea
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="description"
          placeholder="Describe the content or topic"
          rows={4}
        />

        {/* Video URL input */}
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="url"
          name="videoUrl"
          placeholder="YouTube Video URL"
        />

        {/* Submit button */}
        <button
          className="w-full bg-blue-400 hover:bg-blue-500 text-white p-3 rounded transition disabled:opacity-50"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewTutorialForm;
