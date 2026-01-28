import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function getPaste(id: string) {
  try {
   
    const h = await headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    const res = await fetch(`${protocol}://${host}/api/pastes/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function ViewPaste({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paste = await getPaste(id);
  //console.log("Paste", paste);

  if (!paste) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Paste</h1>

          <div className="mb-4 text-sm text-gray-600 space-y-1">
            {paste.expires_at && (
              <p>Expires at: {new Date(paste.expires_at).toLocaleString()}</p>
            )}
            {paste.remaining_views !== null && (
              <p>Remaining views: {paste.remaining_views}</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <pre className="whitespace-pre-wrap break-words text-sm">
              {paste.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
