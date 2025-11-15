import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

export default function ImagesToPdf() {
  const [files, setFiles] = useState([]);
  const [margin, setMargin] = useState(16);
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

  const onSelect = (e) => setFiles(Array.from(e.target.files || []));

  const onBuild = async () => {
    if (!files.length) return;
    setBusy(true); setDownloadUrl('');
    try {
      const doc = await PDFDocument.create();
      for (const f of files) {
        const type = f.type || 'image/jpeg';
        const bytes = await f.arrayBuffer();
        let img;
        if (type.includes('png')) img = await doc.embedPng(bytes);
        else img = await doc.embedJpg(bytes);
        const imgDims = img.scale(1);
        const pageWidth = Math.min(595, imgDims.width);
        const scale = pageWidth / imgDims.width;
        const pageHeight = imgDims.height * scale;
        const page = doc.addPage([pageWidth + margin * 2, pageHeight + margin * 2]);
        page.drawImage(img, {
          x: margin,
          y: margin,
          width: pageWidth,
          height: pageHeight,
        });
      }
      const out = await doc.save();
      const blob = new Blob([out], { type: 'application/pdf' });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-yellow-500/20 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
            <PhotoIcon className="w-16 h-16 text-yellow-500 animate-bounce" />
            <p className="text-2xl font-bold text-gray-900">Drop your images here</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl mb-4 shadow-lg">
            <PhotoIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Images to PDF</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Convert multiple images into a single PDF document</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
          <label className="block cursor-pointer">
            <input type="file" accept="image/*" multiple onChange={onSelect} className="hidden" />
            <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${files.length > 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/50'}`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {files.length > 0 ? `${files.length} image${files.length > 1 ? 's' : ''} selected` : 'Click to upload or drag & drop'}
              </p>
              <p className="text-sm text-gray-500">JPG, PNG, GIF • Multiple files supported</p>
            </div>
          </label>

          {files.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Page Margin: {margin}px
              </label>
              <input 
                type="range" 
                min="0" 
                max="64" 
                value={margin} 
                onChange={(e) => setMargin(parseInt(e.target.value))} 
                className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No margin</span>
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          )}

          <button onClick={onBuild} disabled={files.length === 0 || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating PDF...
              </span>
            ) : 'Create PDF'}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download={`images_${Date.now()}.pdf`} className="block w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105">
              ✓ Download PDF
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
            <div className="text-2xl mb-1">📄</div>
            <div className="font-semibold text-gray-700">Browser</div>
          </div>
        </div>
      </div>
    </div>
  );
}
