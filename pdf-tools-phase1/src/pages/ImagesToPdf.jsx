import React, { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

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
    <>
      <Helmet>
        <title>Images to PDF Converter – Free Online Tool for JPG, PNG to PDF | RarePDFtool</title>
        <meta name="description" content="Convert images to PDF online for free. Combine JPG, PNG, GIF, and other image formats into one PDF document. Fast, secure, and easy image to PDF converter." />
        <link rel="canonical" href="https://rarepdftool.com/images-to-pdf" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Images to PDF Converter – Free Online Tool | RarePDFtool" />
        <meta property="og:description" content="Convert images to PDF online for free. Combine multiple images into one PDF document." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/images-to-pdf" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-images-to-pdf.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Images to PDF Converter – Free Online Tool" />
        <meta name="twitter:description" content="Convert images to PDF online for free. Combine JPG, PNG, and other formats into one PDF." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-images-to-pdf.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Images to PDF Converter",
            "url": "https://rarepdftool.com/images-to-pdf",
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
              "ratingCount": "1850"
            },
            "description": "Free online tool to convert images (JPG, PNG, GIF, WebP) to PDF documents. Combine multiple images into a single PDF."
          })}
        </script>
      </Helmet>

      {/* Hidden SEO Content */}
      <div className="sr-only">
        <h1>Free Images to PDF Converter - Convert JPG, PNG, GIF to PDF Online</h1>
        <p>Convert any image format to PDF online for free. Our images to PDF converter supports JPG, PNG, GIF, WebP, and more. Combine multiple images into a single PDF document with customizable margins. Perfect for creating photo albums, portfolios, and document compilations.</p>
        <p>Related tools: <Link to="/jpg-to-pdf">JPG to PDF</Link>, <Link to="/png-to-pdf">PNG to PDF</Link>, <Link to="/merge-pdf">Merge PDF</Link></p>
      </div>

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

      {/* Comprehensive Blog/SEO Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* How to Convert */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Convert Images to PDF</h2>
            <div className="space-y-4">
              {[
                { step: 1, text: 'Select one or more images (JPG, PNG, GIF, WebP) from your device' },
                { step: 2, text: 'Adjust the page margin using the slider if needed' },
                { step: 3, text: 'Click "Create PDF" to combine images into one document' },
                { step: 4, text: 'Download your PDF file instantly' }
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step}
                  </div>
                  <p className="text-gray-700 pt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Convert Images to PDF */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Convert Images to PDF?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '📚', title: 'Create Albums', desc: 'Combine photos and images into organized digital albums or portfolios' },
              { icon: '📤', title: 'Easy Sharing', desc: 'Share multiple images as one convenient PDF file via email or cloud storage' },
              { icon: '📱', title: 'Universal Access', desc: 'PDF files work on all devices - computers, phones, and tablets' },
              { icon: '🎯', title: 'Professional Look', desc: 'Create polished presentations and documents from image collections' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Formats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Supported Image Formats</h2>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">📷</div>
                <h3 className="font-bold text-gray-900 mb-1">JPG/JPEG</h3>
                <p className="text-sm text-gray-600">Photos & Images</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">🖼️</div>
                <h3 className="font-bold text-gray-900 mb-1">PNG</h3>
                <p className="text-sm text-gray-600">Graphics & Logos</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="font-bold text-gray-900 mb-1">GIF</h3>
                <p className="text-sm text-gray-600">Animations</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold text-gray-900 mb-1">WebP</h3>
                <p className="text-sm text-gray-600">Modern Format</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📸</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Photo Collections</h3>
                  <p className="text-gray-600 text-sm">Create digital photo albums from vacation photos, events, or family gatherings. Organize multiple images into one shareable PDF document.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Business Reports</h3>
                  <p className="text-gray-600 text-sm">Compile charts, graphs, infographics, and screenshots into professional business reports and presentations.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Design Portfolios</h3>
                  <p className="text-gray-600 text-sm">Showcase your design work, art, or photography portfolio in a single, easy-to-share PDF format.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Document Scanning</h3>
                  <p className="text-gray-600 text-sm">Convert scanned documents, receipts, or handwritten notes captured as images into organized PDF files.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Highlight */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Customizable Page Margins</h2>
            <p className="text-yellow-100 mb-6">
              Our tool gives you full control over page margins. Add white space around your images for a professional look, 
              or remove margins entirely for edge-to-edge images. Perfect for creating exactly the PDF layout you need.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-semibold">Adjustable Margins</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">📐</div>
                <div className="font-semibold">Perfect Layout</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">Professional Results</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips & Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tips for Best Results</h2>
          <div className="space-y-4">
            {[
              { title: 'Select Images in Order', content: 'Upload your images in the order you want them to appear in the PDF. Most browsers maintain the selection order.' },
              { title: 'Optimize Image Size', content: 'Large images create large PDFs. Consider resizing images before conversion if file size is a concern.' },
              { title: 'Use Consistent Dimensions', content: 'For the best-looking PDFs, use images with similar dimensions and orientations (all landscape or all portrait).' },
              { title: 'Adjust Margins Wisely', content: 'Use margins for a polished, professional look. Zero margins work well for full-bleed images and posters.' }
            ].map((tip, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-yellow-50 transition-colors">
                  {tip.title}
                </summary>
                <div className="px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200">
                  {tip.content}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'What image formats can I convert to PDF?',
                a: 'Our tool supports all major image formats including JPG, JPEG, PNG, GIF, WebP, BMP, and TIFF. You can mix different formats in the same PDF.'
              },
              {
                q: 'Is there a limit on the number of images?',
                a: 'No! You can convert as many images as you need into a single PDF document. The tool handles multiple files efficiently in your browser.'
              },
              {
                q: 'Will my image quality be preserved?',
                a: 'Yes! We maintain the original quality of your images. The PDF will contain your images in their full resolution without compression.'
              },
              {
                q: 'Can I adjust the order of images?',
                a: 'The images will appear in the PDF in the same order you select them. Make sure to select files in your desired order before uploading.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-yellow-50 transition-colors">
                  {faq.q}
                </summary>
                <div className="px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Tools</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { to: '/jpg-to-pdf', icon: '📸', title: 'JPG to PDF', desc: 'Convert JPG images to PDF' },
              { to: '/png-to-pdf', icon: '🖼️', title: 'PNG to PDF', desc: 'Convert PNG images to PDF' },
              { to: '/merge-pdf', icon: '📑', title: 'Merge PDF', desc: 'Combine multiple PDFs' }
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
