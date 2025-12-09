import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Upload from "./pages/Upload.jsx";
import Gallery from "./pages/Gallery.jsx";
import Image from "./pages/Image.jsx";

import ApiTest from "./pages/ApiTest.jsx";


function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top config navbar */}
      <Navbar />

      {/* Simple nav for testing */}
      <nav className="flex gap-4 p-4 border-b border-slate-800 bg-slate-900">
        <Link to="/upload" className="hover:underline">
          Upload
        </Link>
        <Link to="/gallery" className="hover:underline">
          Gallery
        </Link>
        <Link to="/image/test-key-123" className="hover:underline">
          Image (test)
        </Link>
        
        <Link to="/test-api">
          API Test
        </Link>
      </nav>

      {/* Main content container */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/image/:key" element={<Image />} />

            {/* test route */}
          <Route path="/test-api" element={<ApiTest />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
