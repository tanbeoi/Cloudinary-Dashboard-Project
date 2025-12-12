import { useState, useEffect } from "react";
import useConfigStore from "../store/configStore";
import { getClient } from "../api/apiClient";
import useUploadsStore from "../store/uploadsStore";

function Upload() {
  const { baseUrl, apiKey } = useConfigStore();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [backendPreviewUrl, setBackendPreviewUrl] = useState(null);
  const addUpload = useUploadsStore((s) => s.addUpload);

  // Clean up object URL when file changes
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Handle File selection from the user's computer 
  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setStatus("");
  }

  async function handleUpload() {
  if (!file) {
    setStatus("Please select a file before uploading.");
    return;
  }

  if (!baseUrl) {
    setStatus("Base URL is not set. Fill it in the navbar.");
    return;
  }

  if (!apiKey) {
    setStatus("API key is not set. Fill it in the navbar.");
    return;
  }

  try {
    // disable button and show loading status
    setIsUploading(true);
    setStatus("Uploading…");

    // get api client with base URL and API key from the store
    const client = getClient();
    const formData = new FormData();
    formData.append("file", file);

    const result = await client.upload(formData);

    //use actual key for backend returns
    const key = result.key;
    if (!key) {
      setStatus("Upload succeeded but no key was returned from the server.");
      return;
    }

    const backendUrl = `${baseUrl}/image/${encodeURIComponent(key)}?w=400`;

    setBackendPreviewUrl(backendUrl);
    setStatus(`Upload successful. Key: ${key}`);

    //upload into the session gallery store
    addUpload({
      key,
      backendUrl,
      originalName: file.name,
      uploadedAt: Date.now(),
    });

  } catch (err) {
    console.error(err);
    setStatus(err.message || "Upload failed.");
  } finally {
    setIsUploading(false);
  }
}


  const configMissing = !baseUrl || !apiKey;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Upload</h1>
        <p className="text-sm text-slate-400">
          Select an image and send it to your Mini Cloudinary backend.
        </p>
      </header>

      {/* Config status */}
      {configMissing ? (
        <div className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Base URL and API key are required. Set them in the navbar before
          uploading.
        </div>
      ) : (
        <div className="rounded border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200">
          Ready to upload to{" "}
          <span className="font-mono text-emerald-300">{baseUrl}</span>
        </div>
      )}

      {/* Main layout */}
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
        {/* Left: file selection + button */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">
              File to upload
            </label>

            {/* Simple dropzone-style area (click to select) */}
            <label className="flex cursor-pointer flex-col items-center justify-center rounded border border-dashed border-slate-600 bg-slate-900/60 px-4 py-8 text-center text-sm text-slate-400 hover:border-slate-400 hover:bg-slate-900">
              <span className="mb-2 text-slate-200">
                {file ? file.name : "Click to choose a file"}
              </span>
              <span className="text-xs text-slate-500">
                JPG, PNG, GIF, etc.
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !file || configMissing}
            className={`inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium ${
              isUploading || !file || configMissing
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {isUploading ? "Uploading…" : "Upload"}
          </button>

          {status && (
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {status}
            </p>
          )}
        </div>

        {/* Right: preview panel */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-200">Preview</h2>
          <div className="flex h-64 items-center justify-center rounded border border-slate-700 bg-slate-900/60">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-sm text-slate-500">
                No file selected yet.
              </span>
            )}
          </div>
        </div>

        {/* Backend-served preview */}
        {/* if backendPreviewURL exists, THEN this panel below displays */}
        {backendPreviewUrl && (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-slate-200">Backend Image</h2>
            <div className="flex h-64 items-center justify-center rounded border border-slate-700 bg-slate-900/60">
              <img
                src={backendPreviewUrl}
                alt="Uploaded from backend"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Upload;
