import React, { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(0.7);
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

  const onCompress = async () => {
    if (!file) return;
    setBusy(true); setDownloadUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiUrl}/api/compress`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Compression failed');
      const blob = await res.blob();
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
      {dragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-orange-500/20 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
            <ArrowDownTrayIcon className="w-16 h-16 text-orange-500 animate-bounce" />
            <p className="text-2xl font-bold text-gray-900">Drop your PDF here</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl mb-4 shadow-lg">
            <ArrowDownTrayIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Compress PDF</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Reduce your PDF file size while maintaining quality</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
          <label className="block cursor-pointer">
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} className="hidden" />
            <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${file ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50'}`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {file ? file.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-sm text-gray-500">PDF files only • Max 50MB</p>
            </div>
          </label>

          {/* Scale Slider */}
          {file && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Compression Level: {Math.round((1 - scale) * 100)}%
              </label>
              <input type="range" min="0.3" max="0.9" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Maximum</span>
                <span>Balanced</span>
                <span>Minimum</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button onClick={onCompress} disabled={!file || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Compressing...
              </span>
            ) : 'Compress PDF'}
          </button>

          {/* Download Button */}
          {downloadUrl && (
            <a href={downloadUrl} download={`compressed_${Date.now()}.pdf`} className="block w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105">
              ✓ Download Compressed PDF
            </a>
          )}
        </div>

        {/* Features */}
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
            <div className="text-2xl mb-1">✨</div>
            <div className="font-semibold text-gray-700">Quality</div>
          </div>
        </div>
      </div>
    </div>
  );
}
