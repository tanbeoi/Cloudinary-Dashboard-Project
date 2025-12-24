import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useConfigStore from "../store/configStore";
import { getClient } from "../api/apiClient";

function Image() {
  const params = useParams();
  const rawKey = params.key ?? "";

  const key = useMemo(() => {
    try {
      return decodeURIComponent(rawKey);
    } catch {
      return rawKey;
    }
  }, [rawKey]);

  const baseUrl = useConfigStore((s) => s.baseUrl);

  // 🔑 Transform controls 
  const [w, setW] = useState("600");
  const [h, setH] = useState("");
  const [q, setQ] = useState("80");
  const [fmt, setFmt] = useState("");

  const previewUrl = useMemo(() => {
    if (!baseUrl || !key) return "";

    const url = new URL(`/image/${encodeURIComponent(key)}`, baseUrl);

    if (w !== "") url.searchParams.set("w", w);
    if (h !== "") url.searchParams.set("h", h);
    if (q !== "") url.searchParams.set("q", q);
    if (fmt) url.searchParams.set("fmt", fmt);

    return url.toString();
  }, [baseUrl, key, w, h, q, fmt]);

  // Metadata state
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState(null);

  // Signed URL state
  const [signedUrl, setSignedUrl] = useState("");
  const [signedLoading, setSignedLoading] = useState(false);
  const [signedError, setSignedError] = useState(null);

  const handleFetchMetadata = async () => {
    if (!key) return;
    try {
      setMetadataLoading(true);
      setMetadataError(null);
      const client = getClient();
      const data = await client.getMetadata(key);
      setMetadata(data);
    } catch (e) {
      setMetadata(null);
      setMetadataError(e?.message ?? "Failed to fetch metadata");
    } finally {
      setMetadataLoading(false);
    }
  };

  const handleFetchSignedUrl = async () => {
    if (!key) return;
    try {
      setSignedLoading(true);
      setSignedError(null);
      setSignedUrl("");
      const client = getClient();
      const data = await client.getSignedUrl(key, 3600);
      const url =
        typeof data === "string"
          ? data
          : data?.url || data?.signedUrl || data?.signed_url || "";
      if (!url) throw new Error("Signed URL response did not include a URL");
      setSignedUrl(url);
    } catch (e) {
      setSignedError(e?.message ?? "Failed to fetch signed URL");
    } finally {
      setSignedLoading(false);
    }
  };

  const handleOpenSignedUrl = () => {
    if (signedUrl) {
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Image</h1>
          <Link to="/gallery" className="text-sm text-emerald-400 hover:underline">
            Back to Gallery
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          Key: <span className="font-mono text-slate-300">{key || "(missing)"}</span>
        </p>
      </header>

      {!baseUrl && (
        <div className="rounded border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-400">
          Base URL is not set. Configure it in the top bar.
        </div>
      )}

      {/* Preview */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Large preview</h2>
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={key}
              className="max-h-[520px] w-full object-contain"
            />
          ) : (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              {!key ? "No image selected" : "No preview URL"}
            </div>
          )}
        </div>

        <div className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2">
          <p className="text-[11px] font-mono text-slate-300 break-all">
            {previewUrl}
          </p>
        </div>
      </section>

      {/* Transform controls */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Transform controls</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Width */}
          <label className="space-y-1">
            <span className="text-xs text-slate-400">width (w)</span>
            <input
              type="text"
              inputMode="numeric"
              value={w}
              placeholder="600"
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) setW(v);
              }}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          {/* Height */}
          <label className="space-y-1">
            <span className="text-xs text-slate-400">height (h)</span>
            <input
              type="text"
              inputMode="numeric"
              value={h}
              placeholder="(optional)"
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) setH(v);
              }}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          {/* Quality */}
          <label className="space-y-1">
            <span className="text-xs text-slate-400">quality (q)</span>
            <input
              type="text"
              inputMode="numeric"
              value={q}
              placeholder="80"
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^\d+$/.test(v)) setQ(v);
              }}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          {/* Format */}
          <label className="space-y-1">
            <span className="text-xs text-slate-400">format (fmt)</span>
            <select
              value={fmt}
              onChange={(e) => setFmt(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            >
              <option value="">(default)</option>
              <option value="jpg">jpg</option>
              <option value="png">png</option>
              <option value="webp">webp</option>
              <option value="avif">avif</option>
            </select>
          </label>
        </div>
      </section>

      {/* Metadata */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Metadata</h2>

        <button
          onClick={handleFetchMetadata}
          disabled={!baseUrl || !key || metadataLoading}
          className="rounded bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:opacity-60"
        >
          {metadataLoading ? "Fetching…" : "GET /metadata"}
        </button>

        {metadataError && (
          <div className="rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">
            {metadataError}
          </div>
        )}

        {metadata && (
          <pre className="overflow-auto rounded border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        )}
      </section>

      {/* Signed URL */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200">Signed URL</h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleFetchSignedUrl}
            disabled={!baseUrl || !key || signedLoading}
            className="rounded bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:opacity-60"
          >
            {signedLoading ? "Fetching…" : "GET /sign?expires=3600"}
          </button>

          <button
            onClick={handleOpenSignedUrl}
            disabled={!signedUrl}
            className="rounded bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:opacity-60"
          >
            Open signed URL
          </button>
        </div>

        {signedError && (
          <div className="rounded border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">
            {signedError}
          </div>
        )}

        {signedUrl && (
          <div className="rounded border border-slate-800 bg-slate-900/60 px-3 py-2">
            <p className="text-[11px] font-mono text-slate-300 break-all">
              {signedUrl}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Image;
