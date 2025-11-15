import React from "react";
import { NavLink } from "react-router-dom";
import { 
  DocumentDuplicateIcon, 
  ArrowDownTrayIcon, 
  PhotoIcon, 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon, 
  DocumentTextIcon, 
  ArrowsRightLeftIcon 
} from '@heroicons/react/24/outline';

const tools = [
  {
    to: "/merge-pdf",
    title: "Merge PDF",
    desc: "Combine multiple PDFs into one",
    icon: DocumentDuplicateIcon,
    color: "from-red-400 to-red-600",
    iconBg: "bg-red-50",
    iconColor: "text-red-600"
  },
  {
    to: "/compress-pdf",
    title: "Compress PDF",
    desc: "Reduce PDF file size",
    icon: ArrowDownTrayIcon,
    color: "from-orange-400 to-orange-600",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    to: "/images-to-pdf",
    title: "Images to PDF",
    desc: "Convert JPG/PNG to PDF",
    icon: PhotoIcon,
    color: "from-yellow-400 to-yellow-600",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600"
  },
  {
    to: "/pdf-to-jpg",
    title: "PDF to JPG",
    desc: "Convert PDF to JPG images",
    icon: DocumentArrowDownIcon,
    color: "from-green-400 to-green-600",
    iconBg: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    to: "/jpg-to-pdf",
    title: "JPG to PDF",
    desc: "Convert JPG to PDF",
    icon: DocumentArrowUpIcon,
    color: "from-teal-400 to-teal-600",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600"
  },
  {
    to: "/pdf-to-png",
    title: "PDF to PNG",
    desc: "Convert PDF to PNG images",
    icon: DocumentTextIcon,
    color: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    to: "/png-to-pdf",
    title: "PNG to PDF",
    desc: "Convert PNG to PDF",
    icon: DocumentArrowUpIcon,
    color: "from-indigo-400 to-indigo-600",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600"
  },
  {
    to: "/image-converter",
    title: "Image Converter",
    desc: "Convert JPG, PNG, WebP",
    icon: ArrowsRightLeftIcon,
    color: "from-purple-400 to-purple-600",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            RarePDFtool
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Every tool you need to work with PDFs in one place
          </p>
          <p className="text-base sm:text-lg text-white/80 mt-3 max-w-2xl mx-auto">
            100% FREE • No Registration • Fast & Secure
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <NavLink
                  key={tool.to}
                  to={tool.to}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-transparent transition-all duration-300 p-6 flex flex-col items-center text-center hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${tool.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 md:w-10 md:h-10 ${tool.iconColor}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                    {tool.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-500 leading-snug">
                    {tool.desc}
                  </p>

                  {/* Hover gradient border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} 
                       style={{ padding: '2px' }}>
                    <div className="w-full h-full bg-white rounded-2xl"></div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% Free</h3>
              <p className="text-gray-600">All tools are completely free to use, no hidden fees</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Files are automatically deleted after processing</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-gray-600">Lightning-fast conversions and transformations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RarePDFtool. All files are processed securely. No files stored after processing.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Made with ❤️ for PDF lovers
          </p>
        </div>
      </footer>
    </div>
  );
}
