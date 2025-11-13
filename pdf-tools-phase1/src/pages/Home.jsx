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

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export default function Home() {
  const columns = chunkArray(tools, 5);
  return (
    <div className="max-w-4xl mx-auto py-10 px-2">
      <h1 className="text-3xl font-extrabold mb-4 text-neutral-900 tracking-tight text-center drop-shadow">SwiftPDF Tools</h1>
      <p className="text-base text-neutral-500 mb-8 text-center">All files are processed securely on your device and our server. No files are stored after processing. Minimalist, privacy-first.</p>
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-full justify-center">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-4 w-72">
              {col.map((tool) => (
                <NavLink
                  key={tool.to}
                  to={tool.to}
                  className="block border border-neutral-200 rounded-xl bg-white hover:bg-blue-50 transition p-6 group shadow-sm hover:shadow-lg focus:ring-2 focus:ring-blue-300"
                >
                  <div className="flex items-center gap-3 mb-1">
                    {toolIcons[tool.title]}
                    <span className="text-lg font-semibold text-neutral-800 group-hover:text-blue-600 transition-all">
                      {tool.title}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 leading-snug">
                    {tool.desc}
                  </div>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      </div>
      <footer className="text-xs text-neutral-400 text-center py-8 mt-8">
        <p>All files are processed securely on your device and our server. No files are stored after processing. Minimalist, privacy-first. <span className="text-neutral-300">© {new Date().getFullYear()} SwiftPDF</span></p>
      </footer>
    </div>
  );
}
