import { getTutorials } from "@/actions/tutorial.actions";
import Link from "next/link";

const TutorialsPage = async () => {
  const tutorials = await getTutorials();

  return (
    // Outer container fills full screen height and width
    <div className="min-h-screen w-full px-8 py-8">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        Tutorials
      </h1>

      {/* Add New Tutorial Button with same width as list and spacing */}
      <div className="w-full max-w-6xl mx-auto mb-6">
        <Link
          href="/tutorials/new"
          className="block w-full bg-blue-400 hover:bg-blue-500 text-white text-center py-3 rounded-lg font-semibold transition"
        >
          ➕ Add New Tutorial
        </Link>
      </div>

      {/* Tutorial List */}
      {tutorials.length === 0 ? (
        <p className="text-center text-gray-600">No Tutorials yet</p>
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-4">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="flex flex-col md:flex-row md:justify-between md:items-center rounded-xl shadow border p-6"
            >
              {/* Subject Title */}
              <h2 className="text-xl font-semibold">
                {tutorial.subject}
              </h2>

              {/* View Link */}
              <Link
                href={`/tutorials/${tutorial.id}`}
                className="bg-blue-400 hover:bg-blue-500 text-white mt-4 md:mt-0 inline-block text-sm px-4 py-2 rounded transition"
              >
                View Tutorial
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorialsPage;
