import React from 'react'
import { NavLink, Outlet, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import MergePdf from './pages/MergePdf.jsx'
import CompressPdf from './pages/CompressPdf.jsx'
import ImagesToPdf from './pages/ImagesToPdf.jsx'
import PdfToJpg from './pages/PdfToJpg.jsx'
import JpgToPdf from './pages/JpgToPdf.jsx'
import PdfToPng from './pages/PdfToPng.jsx'
import PngToPdf from './pages/PngToPdf.jsx'
import ImageConverter from './pages/ImageConverter.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-neutral-900 flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">RarePDFtool</span>
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              All Tools
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-lg font-bold text-gray-900">RarePDFtool</span>
          </div>
          
          <p className="text-sm text-gray-600 max-w-md">
            Free PDF tools for everyone. All files processed securely and deleted after use.
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              100% Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              Privacy-First
            </span>
            <span>•</span>
            <span>No Registration</span>
          </div>
          
          <p className="text-xs text-gray-400 pt-2">
            © {new Date().getFullYear()} RarePDFtool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { index: true, element: <Home /> },
      { path: 'merge-pdf', element: <MergePdf /> },
      { path: 'compress-pdf', element: <CompressPdf /> },
      { path: 'images-to-pdf', element: <ImagesToPdf /> },
      { path: 'pdf-to-jpg', element: <PdfToJpg /> },
      { path: 'jpg-to-pdf', element: <JpgToPdf /> },
      { path: 'pdf-to-png', element: <PdfToPng /> },
      { path: 'png-to-pdf', element: <PngToPdf /> },
      { path: 'image-converter', element: <ImageConverter /> },
    ],
  },
])

export { router };
