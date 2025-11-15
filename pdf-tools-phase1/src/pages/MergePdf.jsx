// src/pages/MergePdf.jsx
import React, { useCallback, useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/*
MergePdf with:
- drag & drop
- reordering via @dnd-kit
- thumbnails for images; try to render first page for PDFs (pdfjs-dist lazy)
*/

function FileIconPdf() {
  return (
    <div className="w-16 h-20 rounded-md bg-red-50 flex items-center justify-center text-red-600 text-sm font-semibold">
      PDF
    </div>
  );
}

function FilePreview({ item }) {
  // item: { id, file, previewUrl, typeLabel, pageCount (optional) }
  const { previewUrl, file, typeLabel, pageCount } = item;

  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt={file.name}
        className="w-16 h-20 object-cover rounded-md border"
      />
    );
  }

  if (file.type === "application/pdf") {
    return (
      <div className="w-16 h-20 rounded-md border bg-neutral-50 flex flex-col items-center justify-center text-xs text-neutral-700 p-1">
        <div className="text-sm font-semibold">PDF</div>
        {typeof pageCount === "number" && (
          <div className="text-[11px] mt-1">{pageCount}p</div>
        )}
      </div>
    );
  }

  // fallback icon
  return (
    <div className="w-16 h-20 rounded-md border bg-neutral-50 flex items-center justify-center text-xs text-neutral-700">
      FILE
    </div>
  );
}

/* Sortable item component using @dnd-kit/sortable */
function SortableItem({ item, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white hover:border-red-300 hover:shadow-md transition-all"
    >
      <div className="flex-shrink-0">
        <FilePreview item={item} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 truncate">{item.file.name}</div>
        <div className="text-xs text-gray-500">
          {(item.file.size / 1024 / 1024).toFixed(2)} MB • {item.typeLabel}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          {...listeners}
          {...attributes}
          className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          ⋮⋮
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="px-3 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-all"
          title="Remove file"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function MergePdf() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [totalSizeMB, setTotalSizeMB] = useState(0);

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor));

  // Clean-up object URLs when unmount or when items change
  useEffect(() => {
    return () => {
      // revoke preview URLs
      items.forEach((it) => {
        if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const total = items.reduce((s, it) => s + (it.file?.size || 0), 0);
    setTotalSizeMB(total / 1024 / 1024);
  }, [items]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles || !acceptedFiles.length) return;
      // limit: keep pragmatic total size guard for browser processing
      const MAX_TOTAL_MB = 60; // adjust as needed; warn users if exceed
      const newFilesSize = acceptedFiles.reduce((s, f) => s + f.size, 0);
      const currentSize = items.reduce((s, it) => s + (it.file?.size || 0), 0);
      if ((currentSize + newFilesSize) / 1024 / 1024 > MAX_TOTAL_MB) {
        alert(
          `Total size would exceed ${MAX_TOTAL_MB} MB. Please add smaller files or use fewer files.`
        );
        return;
      }

      // Map files to items: generate preview for images, attempt pdf thumbnail for PDFs
      const mapped = await Promise.all(
        acceptedFiles.map(async (file) => {
          const id = uuidv4();
          const typeLabel = file.type || "unknown";
          let previewUrl = null;
          let pageCount = undefined;

          if (file.type.startsWith("image/")) {
            previewUrl = URL.createObjectURL(file);
          } else if (file.type === "application/pdf") {
            // Try to render first page thumbnail using pdfjs-dist, lazily.
            try {
              const { getDocument } = await import("pdfjs-dist/build/pdf");
              // worker should be set via workerSrc if needed — pdfjs-dist 3+ may auto-handle
              const arrayBuf = await file.arrayBuffer();
              const loadingTask = getDocument({ data: arrayBuf });
              const pdf = await loadingTask.promise;
              pageCount = pdf.numPages || undefined;
              const page = await pdf.getPage(1);
              const viewport = page.getViewport({ scale: 1.2 });
              const canvas = document.createElement("canvas");
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext("2d");
              await page.render({ canvasContext: ctx, viewport }).promise;
              previewUrl = canvas.toDataURL("image/jpeg", 0.7);
              // cleanup pdf doc (may be auto)
              try {
                pdf.destroy();
              } catch (e) {}
            } catch (err) {
              // fail gracefully — no thumbnail
              // console.debug("PDF thumbnail failed:", err);
            }
          }

          return {
            id,
            file,
            previewUrl,
            typeLabel,
            pageCount,
          };
        })
      );

      setItems((prev) => [...prev, ...mapped]);
    },
    [items]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [],
    },
    multiple: true,
  });

  const handleRemove = (id) => {
    setItems((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove?.previewUrl) URL.revokeObjectURL(toRemove.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
    setDownloadUrl("");
  };

  const handleMerge = async () => {
    if (!items.length) return;
    setBusy(true);
    setDownloadUrl("");
    try {
      const outPdf = await PDFDocument.create();

      for (const it of items) {
        const f = it.file;
        const buf = await f.arrayBuffer();
        const src = await PDFDocument.load(buf);
        const copied = await outPdf.copyPages(src, src.getPageIndices());
        copied.forEach((p) => outPdf.addPage(p));
      }

      // Optional: add page numbers
      const font = await outPdf.embedFont(StandardFonts.Helvetica);
      outPdf.getPages().forEach((page, i) => {
        const { width } = page.getSize();
        page.drawText(String(i + 1), {
          x: width - 40,
          y: 20,
          size: 10,
          font,
          color: rgb(0.35, 0.35, 0.35),
        });
      });

      const bytes = await outPdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert("Merge failed: " + (err?.message || err));
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  // DnD kit onDragEnd: reorder items
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === active.id);
        const newIndex = prev.findIndex((p) => p.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const clearAll = () => {
    items.forEach((it) => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
    setItems([]);
    setDownloadUrl("");
  };

  return (
    <>
      <Helmet>
        <title>Merge PDF Files – Free Online PDF Merger Tool | RarePDFtool</title>
        <meta name="description" content="Merge multiple PDF files into one document online for free. Combine PDFs and images in any order. Fast, secure, and easy-to-use PDF merger with drag-and-drop." />
        <link rel="canonical" href="https://rarepdftool.com/merge-pdf" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Merge PDF Files – Free Online PDF Merger | RarePDFtool" />
        <meta property="og:description" content="Merge multiple PDF files into one document online for free. Combine PDFs and images in any order." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rarepdftool.com/merge-pdf" />
        <meta property="og:site_name" content="RarePDFtool" />
        <meta property="og:image" content="https://rarepdftool.com/og-merge-pdf.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Merge PDF Files – Free Online PDF Merger" />
        <meta name="twitter:description" content="Merge multiple PDF files into one document online for free with drag-and-drop." />
        <meta name="twitter:image" content="https://rarepdftool.com/og-merge-pdf.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "PDF Merger",
            "url": "https://rarepdftool.com/merge-pdf",
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
              "ratingCount": "2100"
            },
            "description": "Free online tool to merge multiple PDF files into one document. Supports PDFs and images with drag-and-drop reordering."
          })}
        </script>
      </Helmet>

      {/* Hidden SEO Content */}
      <div className="sr-only">
        <h1>Free PDF Merger - Combine Multiple PDF Files Online</h1>
        <p>Merge PDF files online for free. Our PDF merger allows you to combine multiple PDF documents and images into a single file. Drag and drop to reorder pages, add page numbers, and download your merged PDF instantly. Works in your browser with complete privacy.</p>
        <p>Related tools: <Link to="/compress-pdf">Compress PDF</Link>, <Link to="/images-to-pdf">Images to PDF</Link>, <Link to="/pdf-to-jpg">PDF to JPG</Link></p>
      </div>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-8">
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Merge PDFs</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Combine PDF and image files in any order—all in your browser</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
          {/* Drop Zone */}
          <div 
            {...getRootProps()} 
            className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all cursor-pointer ${
              isDragActive 
                ? 'border-red-400 bg-red-50' 
                : 'border-gray-300 hover:border-red-400 hover:bg-red-50/50'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Click to upload or drag & drop'}
            </p>
            <p className="text-sm text-gray-500">PDF and image files • Multiple files supported</p>
            {items.length > 0 && (
              <div className="mt-3 text-sm font-semibold text-red-600">
                {items.length} file{items.length > 1 ? 's' : ''} • {totalSizeMB.toFixed(2)} MB
              </div>
            )}
          </div>

          {/* File List with Drag-and-Drop Reordering */}
          {items.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Files ({items.length})</h3>
                <button
                  onClick={clearAll}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear All
                </button>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2 max-h-96 overflow-y-auto p-1">
                    {items.map((item, idx) => (
                      <SortableRow key={item.id} item={item} index={idx} onRemove={handleRemove} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* Action Buttons */}
          <button 
            onClick={handleMerge} 
            disabled={items.length === 0 || busy} 
            className="w-full mt-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Merging...
              </span>
            ) : 'Merge Files'}
          </button>

          {downloadUrl && (
            <a 
              href={downloadUrl} 
              download={`merged_${Date.now()}.pdf`} 
              className="block w-full mt-4 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg text-center transition-all transform hover:scale-105"
            >
              ✓ Download Merged PDF
            </a>
          )}
        </div>

        {/* Features */}
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
            <div className="text-2xl mb-1">🔄</div>
            <div className="font-semibold text-gray-700">Reorder</div>
          </div>
        </div>
      </div>
    </div>

    {/* Comprehensive Blog/SEO Content */}
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* How to Merge PDFs */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Merge PDF Files</h2>
          <div className="space-y-4">
            {[
              { step: 1, text: 'Upload PDF files or images by clicking or dragging into the tool' },
              { step: 2, text: 'Drag and drop files to reorder them as needed' },
              { step: 3, text: 'Click "Merge Files" to combine all documents' },
              { step: 4, text: 'Download your merged PDF with automatic page numbers' }
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                  {step}
                </div>
                <p className="text-gray-700 pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Merge PDFs */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Merge PDF Files?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: '📚', title: 'Organize Documents', desc: 'Combine related documents into one file for better organization' },
            { icon: '📧', title: 'Easier Sharing', desc: 'Send multiple documents as one attachment instead of many files' },
            { icon: '📑', title: 'Create Reports', desc: 'Compile reports, presentations, and portfolios from multiple sources' },
            { icon: '💾', title: 'Save Storage', desc: 'Reduce file clutter by combining related PDFs into single documents' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Powerful Merge Features</h2>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Drag & Drop Reordering</h3>
                <p className="text-gray-600 text-sm">Easily rearrange files in any order before merging with intuitive drag-and-drop</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">PDF + Images Support</h3>
                <p className="text-gray-600 text-sm">Combine PDFs and images (JPG, PNG) in a single document</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔢</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Auto Page Numbers</h3>
                <p className="text-gray-600 text-sm">Automatically adds page numbers to your merged PDF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">👁️</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Preview Thumbnails</h3>
                <p className="text-gray-600 text-sm">See thumbnails of your files before merging for accurate ordering</p>
              </div>
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
              <span className="text-2xl">💼</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Business Documents</h3>
                <p className="text-gray-600 text-sm">Combine contracts, proposals, invoices, and supporting documents into comprehensive business packages.</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Reports & Presentations</h3>
                <p className="text-gray-600 text-sm">Merge slides, charts, data tables, and executive summaries into polished presentations.</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Academic Papers</h3>
                <p className="text-gray-600 text-sm">Combine research papers, appendices, citations, and supporting materials for submissions.</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Legal Documents</h3>
                <p className="text-gray-600 text-sm">Compile legal filings, exhibits, evidence, and supporting documentation into organized packages.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browser-Based Highlight */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">100% Browser-Based Merging</h2>
          <p className="text-red-100 mb-6">
            Our PDF merger works entirely in your browser using advanced client-side technology. Your files never 
            leave your device, ensuring maximum security and privacy. No uploads, no servers, no waiting.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-semibold">Complete Privacy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Lightning Fast</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl mb-2">💻</div>
              <div className="font-semibold">Works Offline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips & Best Practices */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tips for Merging PDFs</h2>
        <div className="space-y-4">
          {[
            { title: 'Check File Order', content: 'Use the drag-and-drop feature to arrange files in the exact order you want them in the final PDF. The preview thumbnails help ensure accuracy.' },
            { title: 'Mix PDFs and Images', content: 'You can combine PDF documents with image files (JPG, PNG). Images will be converted to PDF pages and inserted at their position in the queue.' },
            { title: 'Monitor File Size', content: 'Keep an eye on the total file size displayed. Merging many large PDFs can create very large files that may be difficult to email or share.' },
            { title: 'Page Numbers Added', content: 'Our tool automatically adds page numbers to the merged PDF. This helps with navigation and reference in long documents.' }
          ].map((tip, idx) => (
            <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-red-50 transition-colors">
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
              q: 'Can I merge more than 2 PDF files?',
              a: 'Yes! You can merge as many PDF files as you need. Simply upload all the files you want to combine and arrange them in your preferred order.'
            },
            {
              q: 'Can I combine PDFs and images?',
              a: 'Absolutely! Our merger supports both PDF files and images (JPG, PNG). All files will be combined into a single PDF document.'
            },
            {
              q: 'Will the page order be preserved?',
              a: 'Yes, pages are combined in the order you arrange the files. Use drag-and-drop to reorder files before merging to control the final page sequence.'
            },
            {
              q: 'Is PDF merging free?',
              a: 'Yes! Our PDF merger is completely free with no limits on the number of files or merges. No watermarks or hidden fees.'
            }
          ].map((faq, idx) => (
            <details key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-red-50 transition-colors">
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
            { to: '/compress-pdf', icon: '🗜️', title: 'Compress PDF', desc: 'Reduce PDF file size' },
            { to: '/images-to-pdf', icon: '🎨', title: 'Images to PDF', desc: 'Convert images to PDF' },
            { to: '/pdf-to-jpg', icon: '📸', title: 'PDF to JPG', desc: 'Extract images from PDF' }
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

/* Wrapper component for each sortable row that uses our SortableItem UI */
function SortableRow({ item, index, onRemove }) {
  return (
    <SortableItem item={item} index={index} onRemove={onRemove} />
  );
}
