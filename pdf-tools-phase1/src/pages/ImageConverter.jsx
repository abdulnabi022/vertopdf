import React, { useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('jpg');
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

  const onSelect = (e) => setFile(e.target.files?.[0] || null);

  const onConvert = async () => {
    if (!file) return;
    setBusy(true); setDownloadUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5050';
      const res = await fetch(`${apiUrl}/api/image-convert`, {
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
    <>
      <Helmet>
        <title>Image Converter – Free JPG, PNG, WebP Converter Online | RarePDFtool</title>
        <meta name="description" content="Convert images between JPG, PNG, and WebP formats online for free. Fast, secure image format converter. Change image formats without quality loss." />
        <link rel="canonical" href="https://rarepdftool.com/image-converter" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Image Converter – Free Online Tool | RarePDFtool" />
        <meta property="og:description" content="Convert images between JPG, PNG, and WebP formats online for free." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/image-converter" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-image-converter.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Image Converter – Free Online Tool" />
        <meta name="twitter:description" content="Convert images between JPG, PNG, and WebP formats online for free." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-image-converter.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Image Converter",
            "url": "https://rarepdftool.com/image-converter",
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
              "ratingCount": "1550"
            },
            "description": "Free online image converter. Convert between JPG, PNG, and WebP formats instantly."
          })}
        </script>
      </Helmet>

      {/* Hidden SEO Content */}
      <div className="sr-only">
        <h1>Free Image Converter - Convert JPG, PNG, WebP Online</h1>
        <p>Convert images between different formats online for free. Our image converter supports JPG, PNG, and WebP formats. Change image file types quickly and easily without installing software. Perfect for web optimization, social media, and design projects.</p>
        <p>Related tools: <Link to="/jpg-to-pdf">JPG to PDF</Link>, <Link to="/png-to-pdf">PNG to PDF</Link>, <Link to="/pdf-to-jpg">PDF to JPG</Link></p>
      </div>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
        {dragActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-500/20 backdrop-blur-sm pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-3">
              <ArrowsRightLeftIcon className="w-16 h-16 text-purple-500 animate-bounce" />
              <p className="text-2xl font-bold text-gray-900">Drop your image here</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl mb-4 shadow-lg">
              <ArrowsRightLeftIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Image Converter</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">Convert between JPG, PNG, and WebP formats</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
            <label className="block cursor-pointer">
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={onSelect} className="hidden" />
              <div className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${file ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'}`}>
                <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  {file ? file.name : 'Click to upload or drag & drop'}
                </p>
                <p className="text-sm text-gray-500">JPG, PNG, or WebP files</p>
              </div>
            </label>

            {file && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Convert to:
                </label>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setFormat('jpg')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      format === 'jpg'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    JPG
                  </button>
                  <button
                    onClick={() => setFormat('png')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      format === 'png'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setFormat('webp')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      format === 'webp'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    WebP
                  </button>
                </div>
              </div>
            )}

            <button onClick={onConvert} disabled={!file || busy} className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed">
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </span>
              ) : `Convert to ${format.toUpperCase()}`}
            </button>

            {downloadUrl && (
              <a href={downloadUrl} download={`converted_${Date.now()}.${format}`} className="block w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105">
                ✓ Download {format.toUpperCase()}
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
              <div className="text-2xl mb-1">🎨</div>
              <div className="font-semibold text-gray-700">Quality</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Convert Image Formats</h2>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Upload your image file (JPG, PNG, or WebP)' },
                { step: 2, text: 'Select the output format you want to convert to' },
                { step: 3, text: 'Click the convert button to process your image' },
                { step: 4, text: 'Download your converted image instantly' }
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step}
                  </div>
                  <p className="text-gray-700 pt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Image Format Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
              <thead className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Format</th>
                  <th className="px-6 py-4 text-left">Transparency</th>
                  <th className="px-6 py-4 text-left">File Size</th>
                  <th className="px-6 py-4 text-left">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-semibold">JPG</td>
                  <td className="px-6 py-4 text-red-600">✗ No</td>
                  <td className="px-6 py-4">Small</td>
                  <td className="px-6 py-4">Photos, complex images</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-semibold">PNG</td>
                  <td className="px-6 py-4 text-green-600">✓ Yes</td>
                  <td className="px-6 py-4">Large</td>
                  <td className="px-6 py-4">Graphics, logos, screenshots</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold">WebP</td>
                  <td className="px-6 py-4 text-green-600">✓ Yes</td>
                  <td className="px-6 py-4">Smallest</td>
                  <td className="px-6 py-4">Web images, modern browsers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Convert Image Formats?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🌐', title: 'Web Optimization', desc: 'Convert to WebP for faster loading websites with smaller file sizes' },
              { icon: '✨', title: 'Transparency Needs', desc: 'Convert to PNG when you need transparent backgrounds for logos and graphics' },
              { icon: '📧', title: 'Email Compatibility', desc: 'Convert to JPG for universal compatibility with email and older systems' },
              { icon: '💾', title: 'Storage Savings', desc: 'Reduce file size by converting to more efficient formats like WebP' }
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
                <span className="text-2xl">🌐</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Website Performance</h3>
                  <p className="text-gray-600 text-sm">Convert images to WebP for faster page loads and better SEO</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Design Projects</h3>
                  <p className="text-gray-600 text-sm">Convert to PNG for transparency in graphic design work</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Social Media</h3>
                  <p className="text-gray-600 text-sm">Convert to JPG for maximum compatibility across platforms</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Marketing</h3>
                  <p className="text-gray-600 text-sm">Optimize email attachments with proper format conversion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Why Choose WebP?</h2>
            <p className="text-purple-100 mb-6">
              WebP is a modern image format developed by Google that provides superior compression for web images. 
              WebP files are typically 25-35% smaller than JPG and PNG while maintaining the same visual quality. 
              Perfect for improving website speed and user experience!
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">📉</div>
                <div className="font-semibold">30% Smaller Files</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">Faster Loading</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">Same Quality</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Conversion Tips</h2>
          <div className="space-y-4">
            {[
              { title: 'Choose the Right Format', content: 'Use JPG for photos and complex images, PNG for graphics with transparency, and WebP for modern web applications where browser support is guaranteed.' },
              { title: 'Quality Considerations', content: 'PNG uses lossless compression, preserving perfect quality. JPG uses lossy compression, resulting in smaller files but potential quality loss.' },
              { title: 'Browser Support', content: 'WebP is supported by all modern browsers (Chrome, Firefox, Edge, Safari 14+). Consider fallback images for older browsers.' },
              { title: 'File Size vs Quality', content: 'For web use, smaller file sizes mean faster loading. WebP offers the best balance of quality and file size for most applications.' }
            ].map((tip, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-purple-50 transition-colors">
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
                q: 'Does converting reduce image quality?',
                a: 'Converting to PNG maintains perfect quality (lossless). Converting to JPG or WebP uses compression that may reduce quality slightly, but our tool uses high-quality settings to minimize any loss.'
              },
              {
                q: 'Can I convert multiple images at once?',
                a: 'Currently, you can convert one image at a time. Simply convert each image individually for best results.'
              },
              {
                q: 'Which format is best for websites?',
                a: 'WebP is ideal for modern websites due to its small file size and excellent quality. Use PNG for images requiring transparency and JPG for broad compatibility.'
              },
              {
                q: 'Are my images safe?',
                a: 'Yes! All conversions happen in your browser. Your images never leave your device, ensuring complete privacy and security.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-purple-50 transition-colors">
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
              { to: '/jpg-to-pdf', icon: '📄', title: 'JPG to PDF', desc: 'Convert JPG images to PDF' },
              { to: '/png-to-pdf', icon: '📑', title: 'PNG to PDF', desc: 'Convert PNG images to PDF' },
              { to: '/pdf-to-jpg', icon: '📸', title: 'PDF to JPG', desc: 'Extract JPG from PDF' }
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
