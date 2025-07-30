import { getTutorials } from "@/actions/tutorial.actions"; // Import the function to fetch tutorials from the database
import Link from "next/link"; // Used to link to other pages in the app (client-side navigation)

// Helper function to convert YouTube URLs to an embeddable format
const getYoutubeEmbedUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url); // Parse the provided URL
    const videoId = urlObj.searchParams.get("v"); // Try to get the video ID from a regular YouTube URL (?v=abc123)

    if (videoId) return `https://www.youtube.com/embed/${videoId}`; // Return embed format if video ID is found

    // If the URL is a shortened youtu.be link
    if (urlObj.hostname === "youtu.be")
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`; // Strip the slash to get the video ID
  } catch {
    return null; // Return null if URL is invalid or parsing fails
  }

  return null; // Fallback return
};

// Async server component that renders the tutorials page
const TutorialsPage = async () => {
  const tutorials = await getTutorials(); // Fetch all tutorials from the DB

  return (
    <div className="min-h-screen w-full px-8 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8 text-center">Tutorials</h1>

      {/* "Add New Tutorial" Button */}
      <div className="w-full max-w-6xl mx-auto mb-6">
        <Link
          href="/tutorials/new"
          className="block w-full bg-blue-400 hover:bg-blue-500 text-white text-center py-3 rounded-lg font-semibold transition"
        >
          ➕ Add New Tutorial
        </Link>
      </div>

      {/* Conditional: Show message if no tutorials */}
      {tutorials.length === 0 ? (
        <p className="text-center text-gray-600">No Tutorials yet</p>
      ) : (
        // Tutorials list
        <div className="w-full max-w-6xl mx-auto space-y-8">
          {tutorials.map((tutorial) => {
            const embedUrl = getYoutubeEmbedUrl(tutorial.videoUrl); // Convert YouTube link to embed

            return (
              <div
                key={tutorial.id}
                className="rounded-xl shadow border p-6 space-y-6"
              >
                {/* Row 1: Tutorial Title */}
                <h2 className="text-2xl font-semibold text-center">
                  {tutorial.subject}
                </h2>

                {/* Row 2: Description and Video split into two columns (stacked on mobile) */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column: Description (25% width on desktop) */}
                  <div className="w-full md:w-1/4">
                    <p className="text-base">{tutorial.description}</p>
                  </div>

                  {/* Right Column: Embedded YouTube Video (75% width on desktop) */}
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
