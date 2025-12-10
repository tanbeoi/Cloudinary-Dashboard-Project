import useConfigStore from "../store/configStore";

function Navbar() {
  const { baseUrl, apiKey, setBaseUrl, setApiKey } = useConfigStore();

  return (
    <nav className="flex items-center gap-4 p-4 border-b border-slate-800 bg-slate-900">
      {/* Base URL Input */}
      <div className="flex flex-col">
        <label className="text-xs text-slate-400">Base URL</label>
        <input
          type="text"
          value={baseUrl}
          placeholder="https://mini-cloudinary-project.onrender.com"

          //this updates the base URL in the Zustand store (configStore.js) 
          onChange={(e) => setBaseUrl(e.target.value)}
          className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 w-80"
        />
      </div>

      {/* API Key Input */}
      <div className="flex flex-col">
        <label className="text-xs text-slate-400">API Key</label>
        <input
          type="password"
          value={apiKey}
          placeholder="enter API key…"

          //this updates the API key in the Zustand store (configStore.js) 
          onChange={(e) => setApiKey(e.target.value)}
          className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 w-64"
        />
      </div>
    </nav>
  );
}

export default Navbar;
