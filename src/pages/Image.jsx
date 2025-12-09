import { useParams } from "react-router-dom";

function Image() {
  const { key } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 gap-4">
      <h1 className="text-3xl font-bold text-pink-400">
        Image    Page ✅
      </h1>
      <p className="text-slate-200">
        key from URL: <span className="font-mono">{key}</span>
      </p>
    </div>
  );
}

export default Image;
