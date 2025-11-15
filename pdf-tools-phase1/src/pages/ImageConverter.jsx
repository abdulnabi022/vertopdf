import React, { useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('jpg');
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  React.useEffect(() => {
    const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
    const handleDrop = (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const onSelect = (e) => setFile(e.target.files?.[0] || null);

  const onConvert = async () => {
    if (!file) return;
    setBusy(true); setDownloadUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiUrl}/api/image-convert`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Conversion failed');
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Conversion failed: ' + err.message);
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
      {dragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-500/20 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
            <ArrowsRightLeftIcon className="w-16 h-16 text-purple-500 animate-bounce" />
            <p className="text-2xl font-bold text-gray-900">Drop your image here</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl mb-4 shadow-lg">
            <ArrowsRightLeftIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Image Converter</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Convert between JPG, PNG, and WebP formats</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
          <label className="block cursor-pointer">
            <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={onSelect} className="hidden" />
            <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${file ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'}`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {file ? file.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-sm text-gray-500">JPG, PNG, or WebP files</p>
            </div>
          </label>

          {file && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Convert to:
              </label>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setFormat('jpg')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    format === 'jpg'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                  }`}
                >
                  JPG
                </button>
                <button
                  onClick={() => setFormat('png')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    format === 'png'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                  }`}
                >
                  PNG
                </button>
                <button
                  onClick={() => setFormat('webp')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    format === 'webp'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                  }`}
                >
                  WebP
                </button>
              </div>
            </div>
          )}

          <button onClick={onConvert} disabled={!file || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </span>
            ) : `Convert to ${format.toUpperCase()}`}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download={`converted_${Date.now()}.${format}`} className="block w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105">
              ✓ Download {format.toUpperCase()}
            </a>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-white/50 rounded-xl p-4">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-semibold text-gray-700">Fast</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <div className="text-2xl mb-1">🔒</div>
            <div className="font-semibold text-gray-700">Secure</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <div className="text-2xl mb-1">🎨</div>
            <div className="font-semibold text-gray-700">Quality</div>
          </div>
        </div>
      </div>
    </div>
  );
}
