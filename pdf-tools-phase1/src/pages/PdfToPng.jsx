import React, { useRef, useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Card from '../components/Card';

export default function PdfToPng() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const dropRef = useRef();

  // Drag & drop handlers for the whole page
  React.useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragActive(true);
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragActive(false);
    };
    const handleDrop = (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        setFile(e.dataTransfer.files[0]);
      }
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
      const res = await fetch('http://localhost:5050/api/pdf-to-png', {
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
    <div className={`relative min-h-screen flex flex-col items-center justify-center px-2 py-8 bg-gradient-to-br from-blue-50 to-white transition-all duration-300 ${dragActive ? 'ring-4 ring-blue-400/60' : ''}`}
      style={{ minHeight: '100vh' }}>
      {/* Drag overlay */}
      {dragActive && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-blue-100/80 pointer-events-none animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-16 h-16 text-blue-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4m0 0l-4 4m4-4v12" /></svg>
            <span className="text-2xl font-bold text-blue-700 drop-shadow">Drop your PDF here</span>
          </div>
        </div>
      )}
      <Card
        title={<span className="flex items-center gap-2 justify-center text-3xl font-extrabold text-blue-900"><DocumentTextIcon className="h-8 w-8 text-blue-400" />PDF to PNG</span>}
        description={<span className="text-lg text-neutral-600">Convert every page of your PDF into high-quality PNG images. Download as a ZIP archive.</span>}
        buttonText={busy ? 'Converting…' : 'Convert to PNG'}
        onButtonClick={onConvert}
        disabled={busy || !file}
      >
        <label
          ref={dropRef}
          className="block w-full cursor-pointer mb-2"
          style={{ minHeight: 224 }}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={onSelect}
            className="hidden"
          />
          <div className={`w-full h-56 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-6 text-center bg-white/80 hover:bg-blue-50 transition cursor-pointer shadow-lg ${file ? 'border-blue-400' : 'border-blue-200'}`}>
            <span className="flex items-center gap-2 justify-center text-xl font-semibold text-blue-700">
              {/* Upward arrow for upload icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4m0 0l-4 4m4-4v12" /></svg>
              Upload
            </span>
            <span className="flex items-center gap-2 justify-center text-base text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4" /></svg>
              Drag & Drop to select your PDF
            </span>
            <span className="mt-2 text-blue-900 font-semibold text-base">{file ? file.name : 'No file selected'}</span>
          </div>
        </label>
        {downloadUrl && (
          <a className="w-full mt-4 block px-5 py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white text-base font-semibold text-center shadow hover:from-green-500 hover:to-green-700 transition" href={downloadUrl} download={`pdf-to-png_${Date.now()}.zip`}>
            Download PNGs (ZIP)
          </a>
        )}
      </Card>
      <div className="mt-8 text-center text-neutral-400 text-xs max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1"><svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4" /></svg> Drag & drop anywhere on this page</span>
      </div>
    </div>
  );
}
