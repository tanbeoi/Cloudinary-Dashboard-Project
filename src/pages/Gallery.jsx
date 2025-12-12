import { Link } from "react-router-dom";
import useUploadsStore from "../store/uploadsStore";

//helper to turn 1702338000000 → "12/12/2025, 4:45 PM"
function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
}

function Gallery() {
  //get uploads array from Zustand 
  const uploads = useUploadsStore((s) => s.uploads);
  const isEmpty = uploads.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="text-sm text-slate-400">
          Images uploaded in this browser session.
        </p>
      </header>

      {/* Empty state */}
      {isEmpty ? (
        <div className="rounded border border-slate-700 bg-slate-900/60 px-4 py-6 text-center text-sm text-slate-400">
          <p>No uploads in this session yet.</p>
          <p className="mt-2">
            Go to{" "}
            <Link to="/upload" className="text-emerald-400 hover:underline">
              Upload
            </Link>{" "}
            to add your first image.
          </p>
        </div>
      ) : ( //else show full gallery 
        // Text adapts to plural based on number of uploads
        <>
          <p className="text-xs text-slate-500">
            Showing {uploads.length} upload
            {uploads.length > 1 ? "s" : ""} this session.
          </p>

          {/* Grid */}
          {/* Responsive grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {uploads.map((item) => (
              // Link to image detail page 
              <Link
                key={item.key + item.uploadedAt}
                to={`/image/${encodeURIComponent(item.key)}`}
                className="group block overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70 transition-colors hover:border-slate-600 hover:bg-slate-900"
              >
                {/* Ensure thumbnail are uniformally square */}
                <div className="aspect-square w-full overflow-hidden bg-slate-950">
                  {item.backendUrl ? (
                    <img
                      src={item.backendUrl}
                      alt={item.originalName || item.key}
                      // Image gets cropped to cover the square, slightly zooms in upon hover
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      No preview URL
                    </div>
                  )}
                </div>

                <div className="space-y-1 px-3 py-2">
                  <p className="truncate text-sm text-slate-100">
                    {item.originalName || item.key}
                  </p>
                  <p className="truncate text-[11px] font-mono text-slate-500">
                    {item.key}
                  </p>
                  {item.uploadedAt && (
                    <p className="text-[11px] text-slate-500">
                      {formatTime(item.uploadedAt)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Gallery;
