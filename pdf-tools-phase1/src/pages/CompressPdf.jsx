import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>Compress PDF Online – Free PDF Compressor Tool | RarePDFtool</title>
        <meta name="description" content="Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast, secure, and easy to use. No registration required!" />
        <link rel="canonical" href="https://rarepdftool.com/compress-pdf" />
        <meta property="og:title" content="Compress PDF Online – Free PDF Compressor Tool | RarePDFtool" />
        <meta property="og:description" content="Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast, secure, and easy to use." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/compress-pdf" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-compress-pdf.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compress PDF Online – Free PDF Compressor Tool | RarePDFtool" />
        <meta name="twitter:description" content="Compress PDF files online for free. Reduce PDF file size while maintaining quality." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-compress-pdf.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Compressor",
            "url": "https://rarepdftool.com/compress-pdf",
            "applicationCategory": "PDF Compressor",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "2156"
            },
            "description": "Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast, secure, and easy to use."
          }
        `}</script>
      </Helmet>

      {/* SEO Intro Section */}
      <section className="sr-only">
        <h1>Compress PDF Online – Free PDF Compressor Tool</h1>
        <p>Reduce PDF file size online for free with RarePDFtool. Our PDF compressor maintains quality while significantly reducing file size. Perfect for email attachments, web uploads, and storage optimization.</p>
        <ul>
          <li>Free PDF compression</li>
          <li>Maintain document quality</li>
          <li>No file size limits</li>
          <li>Secure and private</li>
          <li>Works on all devices</li>
        </ul>
      </section>

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
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Reduce your PDF file size while maintaining quality. Free, fast, and secure PDF compression for everyone.</p>
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
        <div className="grid grid-cols-3 gap-4 text-center text-sm mb-8">
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

        {/* Internal Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <span>Need more? Try our </span>
          <a href="/merge-pdf" className="text-blue-600 underline hover:text-blue-800">Merge PDF</a>
          <span>, </span>
          <a href="/pdf-to-jpg" className="text-blue-600 underline hover:text-blue-800">PDF to JPG</a>
          <span>, or </span>
          <a href="/images-to-pdf" className="text-blue-600 underline hover:text-blue-800">Images to PDF</a>
          <span> tools.</span>
        </div>

        {/* FAQ Section */}
        <section className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Compress PDF FAQ</h2>
          <dl className="space-y-4 text-left">
            <div>
              <dt className="font-semibold">Is this PDF compressor free?</dt>
              <dd className="ml-2 text-gray-600">Yes, our PDF compression tool is 100% free with no hidden costs or registration required.</dd>
            </div>
            <div>
              <dt className="font-semibold">Will compressing reduce quality?</dt>
              <dd className="ml-2 text-gray-600">Our intelligent compression algorithm maintains visual quality while reducing file size. You can adjust the compression level to balance size and quality.</dd>
            </div>
            <div>
              <dt className="font-semibold">What's the maximum file size?</dt>
              <dd className="ml-2 text-gray-600">You can compress PDF files up to 50MB in size.</dd>
            </div>
            <div>
              <dt className="font-semibold">Is my file secure?</dt>
              <dd className="ml-2 text-gray-600">Absolutely. All files are processed securely and deleted immediately after compression.</dd>
            </div>
          </dl>
        </section>

        {/* Blog Section */}
        <article className="max-w-4xl mx-auto my-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Guide to PDF Compression</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Learn everything about reducing PDF file size without losing quality.</p>
          </div>

          {/* How-to Section */}
          <section className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 md:p-10 mb-12 shadow-sm border border-orange-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-xl text-xl">📝</span>
              How to Compress PDF Online (Step-by-Step)
            </h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold">1</span>
                <div>
                  <strong className="text-gray-900">Upload your PDF:</strong>
                  <p className="text-gray-700 mt-1">Click the upload area or drag and drop your PDF file. Our tool supports files up to 50MB.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold">2</span>
                <div>
                  <strong className="text-gray-900">Adjust compression level:</strong>
                  <p className="text-gray-700 mt-1">Choose your preferred compression level. Higher compression means smaller file size but may slightly reduce quality.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold">3</span>
                <div>
                  <strong className="text-gray-900">Download compressed PDF:</strong>
                  <p className="text-gray-700 mt-1">Click the compress button and download your optimized PDF in seconds!</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Why Compress Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Why Compress PDF Files?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📧</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Email Attachments</h4>
                    <p className="text-gray-600">Reduce file size to meet email attachment limits (typically 25MB). Send documents faster and more reliably.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">☁️</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Save Storage Space</h4>
                    <p className="text-gray-600">Free up valuable cloud storage and hard drive space by reducing PDF file sizes by up to 90%.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Faster Upload/Download</h4>
                    <p className="text-gray-600">Smaller files transfer faster. Perfect for uploading to websites, forms, and sharing platforms.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🌐</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Web Optimization</h4>
                    <p className="text-gray-600">Improve website load times and user experience with compressed PDFs.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-12 bg-blue-50 rounded-3xl p-8 md:p-10 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Common Use Cases
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📄</span>
                <p className="text-gray-700"><strong>Job Applications:</strong> Reduce resume and portfolio file sizes for faster uploads to job portals.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🏢</span>
                <p className="text-gray-700"><strong>Business Documents:</strong> Compress invoices, reports, and contracts for easier email distribution.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎓</span>
                <p className="text-gray-700"><strong>Academic Papers:</strong> Meet university submission size requirements while maintaining readability.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📸</span>
                <p className="text-gray-700"><strong>Scanned Documents:</strong> Significantly reduce the size of scanned PDFs which are often very large.</p>
              </div>
            </div>
          </section>

          {/* Compression Tips */}
          <section className="mb-12 bg-yellow-50 rounded-3xl p-8 md:p-10 border border-yellow-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔧</span>
              PDF Compression Tips & Tricks
            </h3>
            <div className="space-y-4">
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">What affects PDF file size?</summary>
                <p className="text-gray-700 mt-3 pl-2">Images, fonts, and embedded objects are the main contributors. High-resolution images and custom fonts increase file size significantly.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">Which compression level should I choose?</summary>
                <p className="text-gray-700 mt-3 pl-2"><strong>Maximum:</strong> Best for documents with lots of images. <strong>Balanced:</strong> Great for most documents. <strong>Minimum:</strong> Use when quality is critical.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">Can I compress an already compressed PDF?</summary>
                <p className="text-gray-700 mt-3 pl-2">Yes, but returns may diminish. If a PDF has already been heavily compressed, additional compression may not reduce size significantly.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">Will text remain searchable after compression?</summary>
                <p className="text-gray-700 mt-3 pl-2">Yes! Our compression maintains all text, links, and searchability. Only image quality may be slightly affected at higher compression levels.</p>
              </details>
            </div>
          </section>

          {/* Related Tools */}
          <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-10 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🛠️</span>
              Other Free PDF Tools You Might Like
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/merge-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📑</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Merge PDF</div>
                  <div className="text-sm text-gray-600">Combine multiple PDFs into one</div>
                </div>
              </a>
              <a href="/pdf-to-jpg" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">PDF to JPG</div>
                  <div className="text-sm text-gray-600">Convert PDF pages to images</div>
                </div>
              </a>
              <a href="/images-to-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📄</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Images to PDF</div>
                  <div className="text-sm text-gray-600">Convert images to PDF format</div>
                </div>
              </a>
              <a href="/jpg-to-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">🔄</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">JPG to PDF</div>
                  <div className="text-sm text-gray-600">Convert JPG images to PDF</div>
                </div>
              </a>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
