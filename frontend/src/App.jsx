import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [name, setName] = useState("");
  const [rawCV, setRawCV] = useState("");
  const [optimizedCV, setOptimizedCV] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("raw_cv", rawCV);

    try {
      const res = await axios.post("http://localhost:8000/optimize-cv/", formData);
      setOptimizedCV(res.data.optimized_cv);
      setPdfUrl("http://localhost:8000/download-cv");
    } catch (error) {
      alert("Xəta baş verdi: " + error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ResumeGPT</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Adınız"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="CV mətnini daxil edin"
          className="border p-2 w-full h-40"
          value={rawCV}
          onChange={(e) => setRawCV(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Optimizə et
        </button>
      </form>

      {optimizedCV && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Optimallaşdırılmış CV</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{optimizedCV}</pre>
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded"
            >
              PDF-ni yüklə
            </a>
          )}
        </div>
      )}
    </div>
  );
}
