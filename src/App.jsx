import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Upload from "./pages/Upload.jsx";
import Gallery from "./pages/Gallery.jsx";
import Image from "./pages/Image.jsx";


function App() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Top config navbar */}
      <Navbar />

      {/* Simple nav */}
      <nav className="w-full border-b border-slate-800 bg-slate-900">
        <div className="mx-auto w-full max-w-5xl px-4 py-4">
          <div className="flex flex-wrap gap-4">
            <Link to="/upload" className="hover:underline">
              Upload
            </Link>
            <Link to="/gallery" className="hover:underline">
              Gallery
            </Link>
            <Link to="/image" className="hover:underline">
              Image
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content container */}
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/image" element={<Image />} />
          <Route path="/image/:key" element={<Image />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
