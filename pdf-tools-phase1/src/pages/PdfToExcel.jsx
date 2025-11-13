import React, { useState } from 'react';
import Card from '../components/Card';

const PdfToExcel = () => {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const onSelect = (e) => setFile(e.target.files?.[0] || null);

  const onConvert = async () => {
    if (!file) return;
    setBusy(true); setDownloadUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:5050/api/pdf-to-excel', {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">PDF to Excel</h1>
      <Card
        title={<span className="flex items-center gap-2 justify-center text-3xl font-extrabold text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" stroke="currentColor" fill="none"/><path d="M8 8l8 8M16 8l-8 8" strokeWidth="2" stroke="currentColor"/></svg>Convert PDF to Excel</span>}
        description="Upload a PDF file to convert it into an Excel spreadsheet."
        buttonText={busy ? 'Converting…' : 'Convert to Excel'}
        onButtonClick={onConvert}
        disabled={busy || !file}
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={onSelect}
        className="mt-4"
      />
      {downloadUrl && (
        <a className="mt-4 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-medium" href={downloadUrl} download={`converted_${Date.now()}.xlsx`}>
          Download Excel
        </a>
      )}
    </div>
  );
};

export default PdfToExcel;
