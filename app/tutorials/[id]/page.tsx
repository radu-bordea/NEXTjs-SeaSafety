import { getTutorialById } from "@/actions/tutorial.actions";
import Link from "next/link";
import { notFound } from "next/navigation";

const TutorialDetailsPage = async (props: {
  params: {
    id: string;
  };
}) => {
  const { id } = props.params;
  const tutorial = await getTutorialById(id);

  if (!tutorial) {
    return notFound(); // ⬅️ Properly handle null tutorial
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto rounded-lg shadow border border-gray-200 p-8 space-y-6">
        <h1 className="text-3xl font-bold">{tutorial.subject}</h1>

        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p>{tutorial.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Created At</h2>
          <p>{new Date(tutorial.createdAt).toLocaleString()}</p>
        </div>

        <Link
          href="/tutorials"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ← Back to Tutorials
        </Link>
      </div>
    </div>
  );
};

export default TutorialDetailsPage;
