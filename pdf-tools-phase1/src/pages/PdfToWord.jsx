import React, { useState } from 'react';
import Card from '../components/Card';

const PdfToWord = () => {
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiUrl}/api/pdf-to-word`, {
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
      <h1 className="text-4xl font-bold mb-8 text-gray-800">PDF to Word</h1>
      <Card
        title={<span className="flex items-center gap-2 justify-center text-3xl font-extrabold text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4V4zm4 4h8v8H8V8zm2 2v4h4v-4h-4z" /></svg>Convert PDF to Word</span>}
        description="Upload a PDF file to convert it into a Word document."
        buttonText={busy ? 'Converting…' : 'Convert to Word'}
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
        <a className="mt-4 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-medium" href={downloadUrl} download={`converted_${Date.now()}.docx`}>
          Download Word
        </a>
      )}
    </div>
  );
};

export default PdfToWord;
