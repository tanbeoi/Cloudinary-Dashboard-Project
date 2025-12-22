import useConfigStore from "../store/configStore";

function Navbar() {
  const { baseUrl, apiKey, setBaseUrl, setApiKey } = useConfigStore();

  return (
    <nav className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-4">
        {/* wrap on small screens */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
          {/* Base URL */}
          <div className="flex flex-1 flex-col min-w-0">
            <label className="text-xs text-slate-400">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              placeholder="https://mini-cloudinary-project.onrender.com"
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full min-w-0 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
            />
          </div>

          {/* API Key */}
          <div className="flex flex-1 flex-col min-w-0 sm:flex-none sm:w-64">
            <label className="text-xs text-slate-400">API Key</label>
            <input
              type="password"
              value={apiKey}
              placeholder="enter API key…"
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full min-w-0 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
