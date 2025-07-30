"use client"; // This marks the file as a Client Component (required for hooks like useEffect and useRouter)

import { useActionState, useEffect } from "react"; // useActionState manages async form state, useEffect reacts to state changes
import { useRouter } from "next/navigation"; // Router hook for client-side navigation
import { createTutorial } from "@/actions/tutorial.actions"; // Server action to submit the form to the database
import { toast } from "sonner"; // Toast notification library

const NewTutorialForm = () => {
  // useActionState allows form submission using server actions
  const [state, formAction] = useActionState(createTutorial, {
    success: false,
    message: "",
  });

  const router = useRouter(); // For redirecting user after form submission

  // Watch for a successful submission
  useEffect(() => {
    if (state.success) {
      toast.success("Tutorial submitted successfully"); // Show success toast
      router.push("/tutorials"); // Redirect to the list page
    }
  }, [state.success, router]);

  return (
    <div className="w-full max-w-md shadow-md rounded-lg p-8 border">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a Tutorial</h1>

      {/* Show error message if submission failed */}
      {state.message && !state.success && (
        <p className="text-red-500 mb-4 text-center">{state.message}</p>
      )}

      {/* Form - action is linked to the server action through formAction */}
      <form action={formAction} className="space-y-4">
        {/* Subject Input */}
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          name="subject"
          placeholder="Subject"
        />

        {/* Description Textarea */}
        <textarea
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="description"
          placeholder="Describe the content or topic"
          rows={4}
        />

        {/* YouTube Video URL */}
        <input
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="url"
          name="videoUrl"
          placeholder="YouTube Video URL"
        />

        {/* Submit Button */}
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
