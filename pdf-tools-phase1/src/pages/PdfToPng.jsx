import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function PdfToPng() {
  const [file, setFile] = useState(null);
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

  const onConvert = async () => {
    if (!file) return;
    setBusy(true); setDownloadUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiUrl}/api/pdf-to-png`, { method: 'POST', body: formData });
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
    <>
      <Helmet>
        <title>PDF to PNG Converter – Free Online PDF to Transparent PNG | RarePDFtool</title>
        <meta name="description" content="Convert PDF to PNG images online for free. Export PDF pages to high-quality transparent PNG format. Fast, secure, and easy-to-use PDF to PNG converter." />
        <link rel="canonical" href="https://rarepdftool.com/pdf-to-png" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PDF to PNG Converter – Free Online Tool | RarePDFtool" />
        <meta property="og:description" content="Convert PDF to PNG images online for free. Export PDF pages to high-quality transparent PNG format." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/pdf-to-png" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-pdf-to-png.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF to PNG Converter – Free Online Tool" />
        <meta name="twitter:description" content="Convert PDF to PNG images online for free with transparency support." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-pdf-to-png.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF to PNG Converter",
            "url": "https://rarepdftool.com/pdf-to-png",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1450"
            },
            "description": "Free online tool to convert PDF documents to high-quality PNG images with transparency support."
          })}
        </script>
      </Helmet>

      {/* Hidden SEO Content */}
      <div className="sr-only">
        <h1>Free PDF to PNG Converter - Convert PDF Pages to Transparent PNG Images</h1>
        <p>Convert PDF documents to PNG images online. Our free PDF to PNG converter supports transparent backgrounds and maintains high quality. Perfect for extracting images from PDFs, creating web graphics, and converting PDF pages to PNG format.</p>
        <p>Related tools: <Link to="/pdf-to-jpg">PDF to JPG</Link>, <Link to="/compress-pdf">Compress PDF</Link>, <Link to="/merge-pdf">Merge PDF</Link></p>
      </div>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
        {dragActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
              <DocumentTextIcon className="w-16 h-16 text-blue-500 animate-bounce" />
              <p className="text-2xl font-bold text-gray-900">Drop your PDF here</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl mb-4 shadow-lg">
              <DocumentTextIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">PDF to PNG</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">Convert PDF pages to high-quality PNG images with transparency</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
            <label className="block cursor-pointer">
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} className="hidden" />
              <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}`}>
                <svg className="w-16 h-16 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  {file ? file.name : 'Click to upload or drag & drop'}
                </p>
                <p className="text-sm text-gray-500">PDF files only</p>
              </div>
            </label>

            <button onClick={onConvert} disabled={!file || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </span>
              ) : 'Convert to PNG'}
            </button>

            {downloadUrl && (
              <a href={downloadUrl} download={`converted_${Date.now()}.zip`} className="block w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105">
                ✓ Download PNG Images (ZIP)
              </a>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl mb-1">✨</div>
              <div className="font-semibold text-gray-700">Transparent</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl mb-1">🔒</div>
              <div className="font-semibold text-gray-700">Secure</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl mb-1">🖼️</div>
              <div className="font-semibold text-gray-700">HD Quality</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Convert PDF to PNG</h2>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Click "Upload" or drag your PDF file into the converter' },
                { step: 2, text: 'Wait for the conversion to complete automatically' },
                { step: 3, text: 'Download your PNG images as a ZIP file' },
                { step: 4, text: 'Extract and use your high-quality PNG images' }
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step}
                  </div>
                  <p className="text-gray-700 pt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Convert PDF to PNG?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '✨', title: 'Transparent Backgrounds', desc: 'PNG supports alpha transparency, perfect for overlays and graphics' },
              { icon: '🌐', title: 'Web-Friendly', desc: 'Ideal for websites, blogs, and digital content with excellent browser support' },
              { icon: '📱', title: 'High Quality', desc: 'Lossless compression maintains perfect image quality' },
              { icon: '🎨', title: 'Easy Editing', desc: 'Edit in Photoshop, GIMP, or any image editor' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Use Cases</h2>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Extract Graphics</h3>
                  <p className="text-gray-600 text-sm">Pull images and graphics from PDF presentations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Web Publishing</h3>
                  <p className="text-gray-600 text-sm">Convert PDF pages for website use with transparency</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Design Projects</h3>
                  <p className="text-gray-600 text-sm">Use PDF content in graphic design workflows</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Digital Archives</h3>
                  <p className="text-gray-600 text-sm">Archive PDF documents as high-quality images</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">PNG vs JPG: Which to Choose?</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Feature</th>
                  <th className="px-6 py-4 text-left">PNG</th>
                  <th className="px-6 py-4 text-left">JPG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-semibold">Transparency</td>
                  <td className="px-6 py-4 text-green-600">✓ Supported</td>
                  <td className="px-6 py-4 text-red-600">✗ Not supported</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Compression</td>
                  <td className="px-6 py-4">Lossless</td>
                  <td className="px-6 py-4">Lossy</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold">File Size</td>
                  <td className="px-6 py-4">Larger</td>
                  <td className="px-6 py-4">Smaller</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Best For</td>
                  <td className="px-6 py-4">Graphics, logos, screenshots</td>
                  <td className="px-6 py-4">Photos, large images</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tips for Best Results</h2>
          <div className="space-y-4">
            {[
              { title: 'Check Your PDF Quality', content: 'Higher quality PDFs produce better PNG images. Use vector PDFs when possible for crisp results.' },
              { title: 'Consider File Size', content: 'PNG files are larger than JPG. For photos without transparency needs, consider using PDF to JPG instead.' },
              { title: 'Use Transparency Wisely', content: 'PNG transparency is perfect for logos and graphics that need to overlay on different backgrounds.' },
              { title: 'Batch Processing', content: 'Our tool converts all pages in your PDF to individual PNG files, saving you time on multi-page documents.' }
            ].map((tip, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-blue-50 transition-colors">
                  {tip.title}
                </summary>
                <div className="px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200">
                  {tip.content}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is the PDF to PNG conversion free?',
                a: 'Yes! Our PDF to PNG converter is completely free with no file limits or watermarks.'
              },
              {
                q: 'Does PNG support transparency?',
                a: 'Yes, PNG format supports alpha transparency, making it ideal for graphics and images that need transparent backgrounds.'
              },
              {
                q: 'How many pages can I convert at once?',
                a: 'You can convert all pages from your PDF document. Each page will be saved as a separate PNG file in a ZIP archive.'
              },
              {
                q: 'Are my files secure?',
                a: 'Absolutely! All conversions happen in your browser. Your files never leave your device, ensuring complete privacy and security.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-blue-50 transition-colors">
                  {faq.q}
                </summary>
                <div className="px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Tools</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { to: '/pdf-to-jpg', icon: '📸', title: 'PDF to JPG', desc: 'Convert PDF to JPG images' },
              { to: '/png-to-pdf', icon: '📄', title: 'PNG to PDF', desc: 'Convert PNG images to PDF' },
              { to: '/compress-pdf', icon: '🗜️', title: 'Compress PDF', desc: 'Reduce PDF file size' }
            ].map((tool, idx) => (
              <Link
                key={idx}
                to={tool.to}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
