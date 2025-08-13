import { getTutorials } from "@/actions/tutorial.actions"; // Fetch tutorials from the server
import { getCurrentuser } from "@/app/lib/current-user"; // Fetch currently logged-in user
import Link from "next/link";

// Helper function to convert YouTube URLs to embeddable format
const getYoutubeEmbedUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url); // Parse the URL
    const videoId = urlObj.searchParams.get("v"); // Get video ID for standard YouTube links
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    if (urlObj.hostname === "youtu.be")
      // Handle shortened YouTube links
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
  } catch {}
  return null; // Return null if URL is invalid
};

const TutorialsPage = async () => {
  const tutorials = await getTutorials(); // Fetch all tutorials
  const user = await getCurrentuser(); // Fetch logged-in user

  // ✅ Check if the user is Radu (admin)
  const isRadu =
    user?.name?.toLowerCase() === "radu" &&
    user?.email?.toLowerCase() === "radu@gmail.com";

  return (
    <div className="min-h-screen w-full px-8 py-8">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-8 text-center">Tutorials</h1>

      {/* Radu-only "Add New Tutorial" button */}
      {isRadu && (
        <div className="w-full max-w-6xl mx-auto mb-6">
          <Link
            href="/tutorials/new"
            className="block w-full bg-blue-400 hover:bg-blue-500 text-white text-center py-3 rounded-lg font-semibold transition"
          >
            ➕ Add New Tutorial
          </Link>
        </div>
      )}

      {/* Display tutorials or a "No Tutorials" message */}
      {tutorials.length === 0 ? (
        <p className="text-center text-gray-600">No Tutorials yet</p>
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {tutorials.map((tutorial) => {
            const embedUrl = getYoutubeEmbedUrl(tutorial.videoUrl); // Convert video URL to embed URL
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
                  {/* Description */}
                  <div className="w-full md:w-1/4">
                    <p className="text-base">{tutorial.description}</p>
                  </div>

                  {/* Video iframe */}
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
