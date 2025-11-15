import React from "react";
import { NavLink } from "react-router-dom";
import { DocumentDuplicateIcon, ArrowDownTrayIcon, PhotoIcon, ArrowPathIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, DocumentTextIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const tools = [
  {
    to: "/merge-pdf",
    title: "Merge PDFs",
    desc: "Combine multiple PDFs or images into a single PDF file.",
  },
  {
    to: "/compress-pdf",
    title: "Compress PDF",
    desc: "Reduce PDF file size by scaling pages. 100% in your browser.",
  },
  {
    to: "/images-to-pdf",
    title: "Images → PDF",
    desc: "Convert JPG/PNG images into a multi-page PDF.",
  },
  {
    to: "/pdf-to-jpg",
    title: "PDF → JPG",
    desc: "Convert a PDF file to JPG images (one per page).",
  },
  {
    to: "/jpg-to-pdf",
    title: "JPG → PDF",
    desc: "Combine JPG images into a single PDF.",
  },
  {
    to: "/pdf-to-png",
    title: "PDF → PNG",
    desc: "Convert a PDF file to PNG images (one per page).",
  },
  {
    to: "/png-to-pdf",
    title: "PNG → PDF",
    desc: "Combine PNG images into a single PDF.",
  },
  {
    to: "/image-converter",
    title: "Image Converter",
    desc: "Convert between JPG, PNG, and WebP formats.",
  },
  // Add more tools here if needed
];

const toolIcons = {
  'Merge PDFs': <DocumentDuplicateIcon className="h-7 w-7 text-blue-500" />, // Merge
  'Compress PDF': <ArrowDownTrayIcon className="h-7 w-7 text-green-600" />, // Compress
  'Images → PDF': <PhotoIcon className="h-7 w-7 text-yellow-500" />, // Images to PDF
  'PDF → JPG': <DocumentArrowDownIcon className="h-7 w-7 text-pink-500" />, // PDF to JPG
  'JPG → PDF': <DocumentArrowUpIcon className="h-7 w-7 text-pink-600" />, // JPG to PDF
  'PDF → PNG': <DocumentTextIcon className="h-7 w-7 text-blue-400" />, // PDF to PNG
  'PNG → PDF': <DocumentArrowUpIcon className="h-7 w-7 text-blue-600" />, // PNG to PDF
  'Image Converter': <ArrowsRightLeftIcon className="h-7 w-7 text-purple-500" />, // Image Converter
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col">
      <header className="w-full py-10 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-500 shadow-lg mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight text-center">rarepdftool</h1>
        <p className="text-lg md:text-xl text-blue-100 mt-2 text-center max-w-2xl px-2">All-in-one PDF & image toolkit. Fast, private, and free. No files are stored after processing.</p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center w-full px-0 pb-12">
        <div className="w-full flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-0">
          {tools.map((tool, idx) => (
            <NavLink
              key={tool.to}
              to={tool.to}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-neutral-200 hover:border-blue-400 transition-all duration-200 w-full max-w-xs sm:w-72 h-52 flex flex-col items-center justify-center p-4 sm:p-7 overflow-hidden hover:scale-105 min-w-[90vw] xs:min-w-[300px] sm:min-w-[260px] mx-2 my-2"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400 opacity-70 rounded-t-3xl group-hover:opacity-100 transition" />
              <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 shadow-inner">
                {toolIcons[tool.title]}
              </div>
              <h2 className="text-xl font-bold text-blue-900 text-center mb-1 group-hover:text-blue-600 transition-all">{tool.title}</h2>
              <p className="text-sm text-neutral-500 text-center leading-snug flex-1">{tool.desc}</p>
              <span className="absolute bottom-4 right-4 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition">Start &rarr;</span>
            </NavLink>
          ))}
        </div>
      </main>
      <footer className="text-xs text-neutral-400 text-center py-8 mt-8 w-full px-2">
        <p>All files are processed securely on your device and our server. No files are stored after processing. Minimalist, privacy-first. <span className="text-neutral-300">© {new Date().getFullYear()} rarepdftool</span></p>
      </footer>
    </div>
  );
}
