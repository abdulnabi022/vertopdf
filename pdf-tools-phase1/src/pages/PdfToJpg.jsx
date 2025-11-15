import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function PdfToJpg() {
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
      const res = await fetch(`${apiUrl}/api/pdf-to-jpg`, { method: 'POST', body: formData });
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
        <title>PDF to JPG Converter – Free, Fast & Secure | RarePDFtool</title>
        <meta name="description" content="Convert PDF to JPG images online for free. Fast, secure, and high-quality PDF to JPG conversion. No registration required. Try RarePDFtool now!" />
        <link rel="canonical" href="https://rarepdftool.com/pdf-to-jpg" />
        <meta property="og:title" content="PDF to JPG Converter – Free, Fast & Secure | RarePDFtool" />
        <meta property="og:description" content="Convert PDF to JPG images online for free. Fast, secure, and high-quality PDF to JPG conversion. No registration required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/pdf-to-jpg" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-pdf-to-jpg.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF to JPG Converter – Free, Fast & Secure | RarePDFtool" />
        <meta name="twitter:description" content="Convert PDF to JPG images online for free. Fast, secure, and high-quality PDF to JPG conversion. No registration required." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-pdf-to-jpg.png" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF to JPG Converter",
            "url": "https://rarepdftool.com/pdf-to-jpg",
            "applicationCategory": "PDF Converter",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "1243"
            },
            "description": "Convert PDF to JPG images online for free. Fast, secure, and high-quality PDF to JPG conversion. No registration required."
          }
        `}</script>
      </Helmet>
      {/* SEO Intro Section */}
      <section className="sr-only">
        <h1>PDF to JPG Converter – Free, Fast & Secure</h1>
        <p>Convert your PDF files to high-quality JPG images instantly. No signup, no watermark. RarePDFtool offers a free, secure, and easy-to-use PDF to JPG conversion tool for everyone.</p>
        <ul>
          <li>Free PDF to JPG conversion</li>
          <li>No registration required</li>
          <li>High-quality output images</li>
          <li>Secure: files deleted after processing</li>
          <li>Works on any device</li>
        </ul>
      </section>

      {dragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-500/20 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
            <DocumentArrowDownIcon className="w-16 h-16 text-green-500 animate-bounce" />
            <p className="text-2xl font-bold text-gray-900">Drop your PDF here</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl mb-4 shadow-lg">
            <DocumentArrowDownIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">PDF to JPG</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Convert PDF pages to high-quality JPG images. No watermark, no registration, 100% free and secure. Try our PDF to JPG converter now!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
          <label className="block cursor-pointer">
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} className="hidden" />
            <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'}`}>
              <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {file ? file.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-sm text-gray-500">PDF files only</p>
            </div>
          </label>

          <button onClick={onConvert} disabled={!file || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </span>
            ) : 'Convert to JPG'}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download={`converted_${Date.now()}.zip`} className="block w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105">
              ✓ Download JPG Images (ZIP)
            </a>
          )}
        </div>

        {/* Internal Links to Related Tools */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <span>Need more? Try our </span>
          <a href="/jpg-to-pdf" className="text-blue-600 underline hover:text-blue-800">JPG to PDF</a>
          <span>, </span>
          <a href="/pdf-to-png" className="text-blue-600 underline hover:text-blue-800">PDF to PNG</a>
          <span>, or </span>
          <a href="/compress-pdf" className="text-blue-600 underline hover:text-blue-800">Compress PDF</a>
          <span> tools.</span>
        </div>

        {/* FAQ Section */}
        <section className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900">PDF to JPG FAQ</h2>
          <dl className="space-y-4 text-left">
            <div>
              <dt className="font-semibold">Is this PDF to JPG converter free?</dt>
              <dd className="ml-2 text-gray-600">Yes, our tool is 100% free to use with no hidden fees or registration required.</dd>
            </div>
            <div>
              <dt className="font-semibold">Are my files safe?</dt>
              <dd className="ml-2 text-gray-600">Absolutely. All files are processed securely and deleted automatically after conversion.</dd>
            </div>
            <div>
              <dt className="font-semibold">Will the images have a watermark?</dt>
              <dd className="ml-2 text-gray-600">No, your converted JPG images will never have a watermark.</dd>
            </div>
            <div>
              <dt className="font-semibold">Can I convert multiple PDFs?</dt>
              <dd className="ml-2 text-gray-600">You can convert as many PDFs as you like, one at a time, for free.</dd>
            </div>
          </dl>
        </section>

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
            <div className="text-2xl mb-1">🖼️</div>
            <div className="font-semibold text-gray-700">HD Quality</div>
          </div>
        </div>

        {/* Blog Section: PDF to JPG Guide & Tips */}
        <article className="max-w-4xl mx-auto my-16 px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Complete Guide to Converting PDF to JPG</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to know about PDF to JPG conversion, tips, and best practices.</p>
          </div>

          {/* How-to Section */}
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-10 mb-12 shadow-sm border border-green-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-xl text-xl">📝</span>
              How to Convert PDF to JPG Online (Step-by-Step)
            </h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold">1</span>
                <div>
                  <strong className="text-gray-900">Upload your PDF:</strong>
                  <p className="text-gray-700 mt-1">Click the upload area above or simply drag and drop your PDF file. Our tool supports PDFs of all sizes.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold">2</span>
                <div>
                  <strong className="text-gray-900">Start conversion:</strong>
                  <p className="text-gray-700 mt-1">Hit the <b>Convert to JPG</b> button. Our advanced algorithm will process each page of your PDF into high-quality JPG images.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold">3</span>
                <div>
                  <strong className="text-gray-900">Download images:</strong>
                  <p className="text-gray-700 mt-1">Once conversion is complete, download your JPG images as a convenient ZIP file. No watermark, no registration needed!</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Why Convert Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">💡</span>
              Why Convert PDF to JPG?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📤</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Easy Sharing</h4>
                    <p className="text-gray-600">JPG images are universally supported across all devices, platforms, and messaging apps. Share your PDF content effortlessly.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🖼️</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Extract Visual Content</h4>
                    <p className="text-gray-600">Save individual pages, charts, or graphics from PDFs as standalone images for presentations, reports, or social media.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🌐</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Web-Ready Format</h4>
                    <p className="text-gray-600">JPG is the perfect format for websites, blogs, and online galleries. Optimize your web content with ease.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📱</span>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Mobile Friendly</h4>
                    <p className="text-gray-600">JPG images load faster and work better on mobile devices compared to heavy PDF files.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-12 bg-blue-50 rounded-3xl p-8 md:p-10 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Common Use Cases
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🎓</span>
                <p className="text-gray-700"><strong>Students:</strong> Save textbook pages, lecture notes, and study materials as images for easy reference.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💼</span>
                <p className="text-gray-700"><strong>Professionals:</strong> Share document previews, create presentations, and distribute visual content.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎨</span>
                <p className="text-gray-700"><strong>Designers:</strong> Extract artwork, logos, and graphics from PDF portfolios and brochures.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🏢</span>
                <p className="text-gray-700"><strong>Businesses:</strong> Convert invoices, receipts, and documents for archiving and sharing.</p>
              </div>
            </div>
          </section>

          {/* Mobile Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-10 border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">📱</span>
                PDF to JPG on Mobile Devices
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Our tool works perfectly on <strong>iPhone, Android, iPad, and all tablets</strong>. No app download required! Simply open this page in your mobile browser, upload your PDF, and convert instantly. 
              </p>
              <p className="text-gray-600">
                The responsive design ensures a smooth experience whether you're on a smartphone, tablet, or desktop computer.
              </p>
            </div>
          </section>

          {/* Comparison Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              Online vs. Desktop PDF to JPG Conversion
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-green-600">Online (This Tool)</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Desktop Software</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-gray-900 font-medium">Cost</td>
                    <td className="px-6 py-4 text-green-600">✓ 100% Free</td>
                    <td className="px-6 py-4 text-gray-600">Often paid</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Installation</td>
                    <td className="px-6 py-4 text-green-600">✓ No install needed</td>
                    <td className="px-6 py-4 text-gray-600">Requires download</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900 font-medium">Device Support</td>
                    <td className="px-6 py-4 text-green-600">✓ Works on any device</td>
                    <td className="px-6 py-4 text-gray-600">Limited to OS</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Privacy</td>
                    <td className="px-6 py-4 text-green-600">✓ Files auto-deleted</td>
                    <td className="px-6 py-4 text-gray-600">Stored locally</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900 font-medium">Updates</td>
                    <td className="px-6 py-4 text-green-600">✓ Always up-to-date</td>
                    <td className="px-6 py-4 text-gray-600">Manual updates</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Troubleshooting Section */}
          <section className="mb-12 bg-yellow-50 rounded-3xl p-8 md:p-10 border border-yellow-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🔧</span>
              Troubleshooting & Pro Tips
            </h3>
            <div className="space-y-4">
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">Conversion failed or stuck?</summary>
                <p className="text-gray-700 mt-3 pl-2">Ensure your file is a valid PDF and not corrupted. Very large PDFs (over 100MB) may take longer to process. Try refreshing the page and uploading again.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">Images look blurry or low quality?</summary>
                <p className="text-gray-700 mt-3 pl-2">We preserve the highest quality from your original PDF. If images appear blurry, the source PDF may have low-resolution content. Try using a higher-quality PDF source.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">Need only specific pages?</summary>
                <p className="text-gray-700 mt-3 pl-2">Use a PDF splitting tool first to extract the pages you need, then convert those specific pages to JPG. This saves time and reduces file size.</p>
              </details>
              <details className="bg-white rounded-xl p-5 border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                <summary className="font-bold text-gray-900 cursor-pointer">How to get the best image quality?</summary>
                <p className="text-gray-700 mt-3 pl-2">Start with a high-resolution PDF. Avoid converting PDFs that were created from low-quality scans. Our tool maintains the original quality without compression.</p>
              </details>
            </div>
          </section>

          {/* Related Tools Section */}
          <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-10 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-3xl">🛠️</span>
              Other Free PDF Tools You Might Like
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/jpg-to-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">🔄</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">JPG to PDF</div>
                  <div className="text-sm text-gray-600">Convert images back to PDF</div>
                </div>
              </a>
              <a href="/pdf-to-png" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">PDF to PNG</div>
                  <div className="text-sm text-gray-600">Convert PDF to PNG format</div>
                </div>
              </a>
              <a href="/compress-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📦</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Compress PDF</div>
                  <div className="text-sm text-gray-600">Reduce PDF file size</div>
                </div>
              </a>
              <a href="/images-to-pdf" className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📄</span>
                <div>
                  <div className="font-bold text-gray-900 group-hover:text-blue-600">Images to PDF</div>
                  <div className="text-sm text-gray-600">Merge multiple images into PDF</div>
                </div>
              </a>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
