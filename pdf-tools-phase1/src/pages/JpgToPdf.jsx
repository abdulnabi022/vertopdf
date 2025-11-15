import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

export default function JpgToPdf() {
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
      const res = await fetch(`${apiUrl}/api/jpg-to-pdf`, { method: 'POST', body: formData });
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
      <Helmet>
        <title>JPG to PDF Converter – Free Online Image to PDF Tool | RarePDFtool</title>
        <meta name="description" content="Convert JPG to PDF online for free. Combine multiple JPG images into one PDF document. Fast, secure, and easy to use. No registration required!" />
        <link rel="canonical" href="https://rarepdftool.com/jpg-to-pdf" />
        <meta property="og:title" content="JPG to PDF Converter – Free Online Image to PDF Tool | RarePDFtool" />
        <meta property="og:description" content="Convert JPG to PDF online for free. Combine multiple JPG images into one PDF document." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/jpg-to-pdf" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-jpg-to-pdf.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JPG to PDF Converter – Free Online Image to PDF Tool" />
        <meta name="twitter:description" content="Convert JPG to PDF online for free. Combine multiple JPG images into one PDF document." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-jpg-to-pdf.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "JPG to PDF Converter",
            "url": "https://rarepdftool.com/jpg-to-pdf",
            "applicationCategory": "Image to PDF Converter",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1876"
            },
            "description": "Convert JPG to PDF online for free. Combine multiple JPG images into one PDF document. Fast, secure, and easy to use."
          }
        `}</script>
      </Helmet>

      {/* SEO Intro Section */}
      <section className="sr-only">
        <h1>JPG to PDF Converter – Free Online Image to PDF Tool</h1>
        <p>Convert JPG images to PDF documents instantly with RarePDFtool. Combine multiple JPG files into a single PDF, perfect for sharing, archiving, and professional documents.</p>
        <ul>
          <li>Free JPG to PDF conversion</li>
          <li>Combine multiple images</li>
          <li>No watermark or registration</li>
          <li>Secure and private processing</li>
          <li>Works on all devices</li>
        </ul>
      </section>

      {dragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-500/20 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
            <DocumentArrowUpIcon className="w-16 h-16 text-teal-500 animate-bounce" />
            <p className="text-2xl font-bold text-gray-900">Drop your images here</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl mb-4 shadow-lg">
            <DocumentArrowUpIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">JPG to PDF</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Convert JPG images into a single PDF document. Free, fast, and secure image to PDF conversion.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
          <label className="block cursor-pointer">
            <input type="file" accept="image/jpeg,image/jpg" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="hidden" />
            <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${files.length > 0 ? 'border-teal-400 bg-teal-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50/50'}`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {files.length > 0 ? `${files.length} image${files.length > 1 ? 's' : ''} selected` : 'Click to upload or drag & drop'}
              </p>
              <p className="text-sm text-gray-500">JPG/JPEG files • Multiple files supported</p>
            </div>
          </label>

          <button onClick={onConvert} disabled={files.length === 0 || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
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

        <div className="grid grid-cols-3 gap-4 text-center text-sm mb-8">
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

        {/* Internal Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <span>Need more? Try our </span>
          <a href="/pdf-to-jpg" className="text-blue-600 underline hover:text-blue-800">PDF to JPG</a>
          <span>, </span>
          <a href="/images-to-pdf" className="text-blue-600 underline hover:text-blue-800">Images to PDF</a>
          <span>, or </span>
          <a href="/compress-pdf" className="text-blue-600 underline hover:text-blue-800">Compress PDF</a>
          <span> tools.</span>
        </div>

        {/* FAQ Section */}
        <section className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900">JPG to PDF FAQ</h2>
          <dl className="space-y-4 text-left">
            <div>
              <dt className="font-semibold">Is JPG to PDF conversion free?</dt>
              <dd className="ml-2 text-gray-600">Yes, our tool is 100% free with unlimited conversions and no registration required.</dd>
            </div>
            <div>
              <dt className="font-semibold">Can I convert multiple JPG files at once?</dt>
              <dd className="ml-2 text-gray-600">Absolutely! You can upload and combine multiple JPG images into a single PDF document.</dd>
            </div>
            <div>
              <dt className="font-semibold">Will the PDF have a watermark?</dt>
              <dd className="ml-2 text-gray-600">No, your PDF will never have a watermark. All conversions are clean and professional.</dd>
            </div>
            <div>
              <dt className="font-semibold">Are my images secure?</dt>
              <dd className="ml-2 text-gray-600">Yes. All files are processed securely and automatically deleted after conversion.</dd>
            </div>
          </dl>
        </section>

        {/* Blog Section */}
        <article className="max-w-4xl mx-auto my-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Guide to Converting JPG to PDF</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to know about creating PDF documents from JPG images.</p>
          </div>

          {/* How-to Section */}
          <section className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 md:p-10 mb-12 shadow-sm border border-teal-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-teal-500 text-white rounded-xl text-xl">📝</span>
              How to Convert JPG to PDF (Step-by-Step)
            </h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full font-bold">1</span>
                <div>
                  <strong className="text-gray-900">Upload JPG images:</strong>
                  <p className="text-gray-700 mt-1">Click the upload area or drag and drop one or multiple JPG files. You can select as many images as you need.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full font-bold">2</span>
                <div>
                  <strong className="text-gray-900">Convert to PDF:</strong>
                  <p className="text-gray-700 mt-1">Click the convert button. Our tool will automatically combine all your JPG images into a single PDF document.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full font-bold">3</span>
                <div>
                  <strong className="text-gray-900">Download your PDF:</strong>
                  <p className="text-gray-700 mt-1">Download your newly created PDF file instantly. No watermark, no registration!</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Why Convert Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Why Convert JPG to PDF?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Universal Compatibility</h4>
                    <p className="text-gray-600">PDF files open on any device without special software. Perfect for sharing images professionally.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📑</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Combine Multiple Images</h4>
                    <p className="text-gray-600">Merge multiple JPG photos into one organized PDF document instead of sending individual files.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🏢</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Professional Documents</h4>
                    <p className="text-gray-600">Create professional portfolios, photo albums, and business documents from your images.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🔒</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Preserve Image Quality</h4>
                    <p className="text-gray-600">Maintain original image quality and resolution when converting to PDF format.</p>
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
                <span className="text-xl">📷</span>
                <p className="text-gray-700"><strong>Photo Albums:</strong> Create digital photo albums and memories in PDF format for easy sharing.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💼</span>
                <p className="text-gray-700"><strong>Business Documents:</strong> Convert receipts, invoices, and business cards to PDF for professional records.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎨</span>
                <p className="text-gray-700"><strong>Portfolios:</strong> Designers and artists can create professional portfolios from their work.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📄</span>
                <p className="text-gray-700"><strong>Document Scanning:</strong> Convert scanned document images into proper PDF files for archiving.</p>
              </div>
            </div>
          </section>

          {/* Mobile Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-10 border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">📱</span>
                JPG to PDF on Mobile
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Convert your phone photos to PDF directly from your <strong>iPhone or Android device</strong>. No app download needed—just use your mobile browser!
              </p>
              <p className="text-gray-600">
                Perfect for converting photos on the go, creating quick documents, or sharing image collections while traveling.
              </p>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-12 bg-yellow-50 rounded-3xl p-8 md:p-10 border border-yellow-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔧</span>
              JPG to PDF Tips & Best Practices
            </h3>
            <div className="space-y-4">
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">How do I control page order?</summary>
                <p className="text-gray-700 mt-3 pl-2">Upload your images in the order you want them to appear in the PDF. The tool will maintain the upload sequence.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">What image quality should I use?</summary>
                <p className="text-gray-700 mt-3 pl-2">For best results, use high-quality JPG images. The tool preserves original quality, so start with good source images.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">Can I convert JPEG files?</summary>
                <p className="text-gray-700 mt-3 pl-2">Yes! JPG and JPEG are the same format with different file extensions. Both work perfectly with our tool.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">How many images can I convert at once?</summary>
                <p className="text-gray-700 mt-3 pl-2">You can upload and convert multiple JPG images simultaneously. All will be combined into a single PDF document.</p>
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
              <a href="/pdf-to-jpg" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">🔄</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">PDF to JPG</div>
                  <div className="text-sm text-gray-600">Convert PDF back to images</div>
                </div>
              </a>
              <a href="/images-to-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📄</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Images to PDF</div>
                  <div className="text-sm text-gray-600">Convert any images to PDF</div>
                </div>
              </a>
              <a href="/png-to-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">PNG to PDF</div>
                  <div className="text-sm text-gray-600">Convert PNG images to PDF</div>
                </div>
              </a>
              <a href="/compress-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📦</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Compress PDF</div>
                  <div className="text-sm text-gray-600">Reduce PDF file size</div>
                </div>
              </a>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
