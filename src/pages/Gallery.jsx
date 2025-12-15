import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useUploadsStore from "../store/uploadsStore";
import useConfigStore from "../store/configStore";
import { getClient } from "../api/apiClient";

// helper to turn timestamps into "12/12/2025, 4:45 PM"
function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleString();
}

// normalize ListResponse into ListItem[]
function normalizeListResponse(data) {
  // backend returns: { items: [...] }
  if (data && typeof data === "object" && "items" in data && Array.isArray(data.items)) {
    return data.items;
  }

  // alternate shapes you allowed in types
  if (data && typeof data === "object" && "keys" in data && Array.isArray(data.keys)) {
    return data.keys.map((k) => ({ key: k }));
  }

  // raw array
  if (Array.isArray(data)) {
    // string[] -> ListItem[]
    if (data.length > 0 && typeof data[0] === "string") {
      return data.map((k) => ({ key: k }));
    }
    // ListItem[]
    return data;
  }

  return [];
}

function Gallery() {
  // session uploads (instant feedback)
  const uploads = useUploadsStore((s) => s.uploads);

  // config (baseUrl must exist for /image URLs)
  const baseUrl = useConfigStore((s) => s.baseUrl);

  // remote bucket list (persistent)
  const [remoteItems, setRemoteItems] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // fetch /list + poll
  useEffect(() => {
    if (!baseUrl) return;

    let alive = true;

    const fetchList = async () => {
      try {
        setSyncing(true);
        setError(null);

        const client = getClient();
        const data = await client.list();
        const items = normalizeListResponse(data);

        if (alive) setRemoteItems(items);
      } catch (e) {
        if (alive) setError(e?.message ?? "Failed to sync bucket list");
      } finally {
        if (alive) setSyncing(false);
      }
    };

    fetchList();
    const id = setInterval(fetchList, 12_000); // 10–15s

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [baseUrl]);

  // merge remote + session, de-dupe by key
  const mergedItems = useMemo(() => {
    if (!baseUrl) return [];

    const client = getClient();
    const map = new Map();

    // 1) remote first (persistent)
    for (const r of remoteItems) {
      if (!r?.key) continue;

      map.set(r.key, {
        key: r.key,
        originalName: r.key,
        backendUrl: client.buildImageUrl(r.key, { w: 400 }),
        uploadedAt: r.lastModified ?? null,
        source: "remote",
      });
    }

    // 2) overlay session uploads (instant + better metadata)
    for (const s of uploads) {
      if (!s?.key) continue;

      map.set(s.key, {
        ...s,
        source: "session",
      });
    }

    // 3) newest first
    return Array.from(map.values()).sort((a, b) => {
      const ta = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
      const tb = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
      return tb - ta;
    });
  }, [remoteItems, uploads, baseUrl]);

  const isEmpty = mergedItems.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Gallery</h1>
          <p className="text-xs text-slate-500">
            {syncing ? "Syncing…" : error ? "Sync failed" : "Synced"}
          </p>
        </div>

        <p className="text-sm text-slate-400">
          Session uploads + persistent bucket images (auto sync).
        </p>

        {error && (
          <div className="rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}
      </header>

      {/* Empty state */}
      {isEmpty ? (
        <div className="rounded border border-slate-700 bg-slate-900/60 px-4 py-6 text-center text-sm text-slate-400">
          <p>No images yet.</p>
          <p className="mt-2">
            Go to{" "}
            <Link to="/upload" className="text-emerald-400 hover:underline">
              Upload
            </Link>{" "}
            to add your first image.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            Showing {mergedItems.length} image{mergedItems.length > 1 ? "s" : ""}.
          </p>

          {/* Responsive grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mergedItems.map((item) => (
              <Link
                key={item.key}
                to={`/image/${encodeURIComponent(item.key)}`}
                className="group block overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70 transition-colors hover:border-slate-600 hover:bg-slate-900"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-950">
                  {item.backendUrl ? (
                    <img
                      src={item.backendUrl}
                      alt={item.originalName || item.key}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      No preview URL
                    </div>
                  )}
                </div>

                <div className="space-y-1 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm text-slate-100">
                      {item.originalName || item.key}
                    </p>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {item.source}
                    </span>
                  </div>

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
