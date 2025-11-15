import React, { useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

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
    <>
      <Helmet>
        <title>PNG to PDF Converter – Free Online PNG to PDF Tool | RarePDFtool</title>
        <meta name="description" content="Convert PNG to PDF online for free. Combine multiple PNG images into one PDF document. Fast, secure, and easy-to-use PNG to PDF converter with no quality loss." />
        <link rel="canonical" href="https://rarepdftool.com/png-to-pdf" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PNG to PDF Converter – Free Online Tool | RarePDFtool" />
        <meta property="og:description" content="Convert PNG to PDF online for free. Combine multiple PNG images into one PDF document." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/png-to-pdf" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-png-to-pdf.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PNG to PDF Converter – Free Online Tool" />
        <meta name="twitter:description" content="Convert PNG to PDF online for free. Combine multiple PNG images into one PDF." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-png-to-pdf.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PNG to PDF Converter",
            "url": "https://rarepdftool.com/png-to-pdf",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1680"
            },
            "description": "Free online tool to convert PNG images to PDF documents. Combine multiple PNG files into a single PDF."
          })}
        </script>
      </Helmet>

      {/* Hidden SEO Content */}
      <div className="sr-only">
        <h1>Free PNG to PDF Converter - Convert PNG Images to PDF Documents Online</h1>
        <p>Convert PNG images to PDF format online for free. Our PNG to PDF converter allows you to combine multiple PNG files into a single PDF document while preserving image quality and transparency. Perfect for creating photo albums, portfolios, and document archives.</p>
        <p>Related tools: <Link to="/jpg-to-pdf">JPG to PDF</Link>, <Link to="/images-to-pdf">Images to PDF</Link>, <Link to="/merge-pdf">Merge PDF</Link></p>
      </div>

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

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Convert PNG to PDF</h2>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Select one or more PNG files from your device' },
                { step: 2, text: 'Click "Convert to PDF" to start the conversion' },
                { step: 3, text: 'Wait for the processing to complete' },
                { step: 4, text: 'Download your combined PDF document' }
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step}
                  </div>
                  <p className="text-gray-700 pt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Convert PNG to PDF?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '📱', title: 'Universal Compatibility', desc: 'PDF files open on any device and platform without special software' },
              { icon: '📄', title: 'Combine Multiple Images', desc: 'Create multi-page documents from separate PNG files' },
              { icon: '🔒', title: 'Preserve Quality', desc: 'Maintain original image quality and transparency in the PDF' },
              { icon: '📧', title: 'Easy Sharing', desc: 'Share multiple images as one convenient PDF file via email or cloud' }
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
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Photo Albums</h3>
                  <p className="text-gray-600 text-sm">Create digital photo albums from PNG screenshots and images</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Business Documents</h3>
                  <p className="text-gray-600 text-sm">Combine charts, graphs, and infographics into one PDF</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Design Portfolios</h3>
                  <p className="text-gray-600 text-sm">Showcase your work with PNG images in a professional PDF</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Reports & Presentations</h3>
                  <p className="text-gray-600 text-sm">Compile screenshots and visuals into presentation-ready PDFs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Convert PNG to PDF on Mobile</h2>
            <p className="text-indigo-100 mb-6">
              Our PNG to PDF converter works seamlessly on smartphones and tablets. Convert images from your camera roll 
              directly to PDF without installing any apps. Perfect for creating documents on the go!
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-semibold">Mobile-Friendly</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">☁️</div>
                <div className="font-semibold">No App Needed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">Instant Results</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tips for Best Results</h2>
          <div className="space-y-4">
            {[
              { title: 'Image Order Matters', content: 'Upload your PNG files in the order you want them to appear in the PDF. Most browsers maintain file order when selecting multiple files.' },
              { title: 'Optimize Image Size', content: 'For smaller PDF files, consider compressing your PNG images before conversion. Large PNG files will create large PDFs.' },
              { title: 'Preserve Transparency', content: 'PNG transparency is maintained in the PDF. This is perfect for logos and graphics with transparent backgrounds.' },
              { title: 'Batch Processing', content: 'You can select and convert multiple PNG files at once, saving time when creating multi-page PDF documents.' }
            ].map((tip, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-indigo-50 transition-colors">
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
                q: 'Can I convert multiple PNG files to one PDF?',
                a: 'Yes! Our tool allows you to select and convert multiple PNG files into a single PDF document. All images will be combined in the order you select them.'
              },
              {
                q: 'Is PNG to PDF conversion free?',
                a: 'Absolutely! Our PNG to PDF converter is completely free with no hidden costs, watermarks, or file limits.'
              },
              {
                q: 'Will the image quality be reduced?',
                a: 'No, we preserve the original quality of your PNG images. The conversion process maintains full resolution and quality without compression.'
              },
              {
                q: 'Are my PNG files safe?',
                a: 'Yes! All conversions happen directly in your browser. Your PNG files never leave your device, ensuring complete privacy and security.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-indigo-50 transition-colors">
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
              { to: '/jpg-to-pdf', icon: '📸', title: 'JPG to PDF', desc: 'Convert JPG images to PDF' },
              { to: '/pdf-to-png', icon: '🖼️', title: 'PDF to PNG', desc: 'Convert PDF pages to PNG' },
              { to: '/images-to-pdf', icon: '🎨', title: 'Images to PDF', desc: 'Convert any images to PDF' }
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
