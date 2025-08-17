import { getTutorials } from "@/actions/tutorial.actions";
import { getCurrentuser } from "@/app/lib/current-user";
import Link from "next/link";
import DeleteTutorialButton from "@/components/DeleteTutorialButton"; // client component for deletion
import { isAdmin } from "@/app/lib/admins";

/**
 * Converts a YouTube watch or short link to an embeddable URL.
 * Supports:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 */
const getYoutubeEmbedUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    // Check for watch?v=VIDEO_ID format
    const videoId = urlObj.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;

    // Check for youtu.be/VIDEO_ID format
    if (urlObj.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
  } catch {
    return null; // Invalid URL
  }

  return null; // Not YouTube or unrecognized
};

const TutorialsPage = async () => {
  // Fetch tutorials and current logged-in user
  const tutorials = await getTutorials();
  const user = await getCurrentuser();

  // ✅ Centralized admin check
  const canManage = isAdmin(user?.email);

  return (
    <div className="min-h-screen w-full px-8 py-8">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-8 text-center">Tutorials</h1>

      {/* Add tutorial button for admins */}
      {canManage && (
        <div className="w-full max-w-6xl mx-auto mb-6">
          <Link
            href="/tutorials/new"
            className="block w-full bg-blue-400 hover:bg-blue-500 text-white text-center py-3 rounded-lg font-semibold transition"
          >
            ➕ Add New Tutorial
          </Link>
        </div>
      )}

      {/* No tutorials found */}
      {tutorials.length === 0 ? (
        <p className="text-center text-gray-600">No Tutorials yet</p>
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {tutorials.map((tutorial) => {
            const embedUrl = getYoutubeEmbedUrl(tutorial.videoUrl);

            return (
              <div
                key={tutorial.id}
                className="rounded-xl shadow border p-6 space-y-6"
              >
                {/* Tutorial subject */}
                <h2 className="text-2xl font-semibold text-center">
                  {tutorial.subject}
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left side: video preview or error */}
                  <div className="w-full md:w-3/4">
                    {embedUrl ? (
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          src={embedUrl}
                          title={tutorial.subject}
                          allowFullScreen
                          className="w-full h-full rounded"
                        ></iframe>
                      </div>
                    ) : (
                      <p className="text-red-500 text-sm">
                        Invalid YouTube link
                      </p>
                    )}
                  </div>

                  {/* Right side: description + delete button */}
                  <div className="w-full md:w-1/4">
                    <p className="text-base">{tutorial.description}</p>

                    {canManage && (
                      <DeleteTutorialButton tutorialId={tutorial.id} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TutorialsPage;
