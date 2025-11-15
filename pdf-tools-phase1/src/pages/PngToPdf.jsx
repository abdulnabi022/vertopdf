import React, { useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

export default function PngToPdf() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  React.useEffect(() => {
    const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
    const handleDrop = (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files) setFiles(Array.from(e.dataTransfer.files));
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

  const onConvert = async () => {
    if (files.length === 0) return;
    setBusy(true); setDownloadUrl('');
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiUrl}/api/png-to-pdf`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Conversion failed');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-500/20 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
            <DocumentArrowUpIcon className="w-16 h-16 text-indigo-500 animate-bounce" />
            <p className="text-2xl font-bold text-gray-900">Drop your images here</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-3xl mb-4 shadow-lg">
            <DocumentArrowUpIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">PNG to PDF</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Convert PNG images into a single PDF document</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
          <label className="block cursor-pointer">
            <input type="file" accept="image/png" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="hidden" />
            <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${files.length > 0 ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {files.length > 0 ? `${files.length} image${files.length > 1 ? 's' : ''} selected` : 'Click to upload or drag & drop'}
              </p>
              <p className="text-sm text-gray-500">PNG files • Multiple files supported</p>
            </div>
          </label>

          <button onClick={onConvert} disabled={files.length === 0 || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </span>
            ) : 'Convert to PDF'}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download={`converted_${Date.now()}.pdf`} className="block w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105">
              ✓ Download PDF
            </a>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-white/50 rounded-xl p-4">
            <div className="text-2xl mb-1">📄</div>
            <div className="font-semibold text-gray-700">Multi-page</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <div className="text-2xl mb-1">🔒</div>
            <div className="font-semibold text-gray-700">Secure</div>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-semibold text-gray-700">Fast</div>
          </div>
        </div>
      </div>
    </div>
  );
}
