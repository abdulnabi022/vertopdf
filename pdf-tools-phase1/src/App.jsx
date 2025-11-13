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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-4xl p-4 grid gap-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-100 shadow-sm">
      <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-extrabold tracking-tight text-blue-700 hover:text-blue-600 transition-colors flex items-center gap-2">
          <span>VertoPDF</span>
        </NavLink>
        <nav className="flex gap-6 text-sm font-medium">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-neutral-700 hover:text-blue-600 transition'}>Home</NavLink>
          <a href="#about" className="text-neutral-700 hover:text-blue-600 transition">About</a>
          <a href="#support" className="text-neutral-700 hover:text-blue-600 transition">Support</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white/80 border-t border-neutral-100 py-8 mt-8 text-sm text-neutral-600">
      <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div id="about">
          <h3 className="font-bold text-blue-700 mb-2">About Us</h3>
          <p>VertoPDF is a privacy-first PDF and image toolkit. We help you convert, compress, and manage your documents with ease. No files are stored after processing.</p>
        </div>
        <div id="support">
          <h3 className="font-bold text-blue-700 mb-2">Support</h3>
          <p>Need help? Email <a href="mailto:support@vertopdf.app" className="text-blue-600 underline">support@vertopdf.app</a> or visit our <a href="#" className="text-blue-600 underline">Help Center</a>.</p>
        </div>
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="mb-2">
            <span className="font-bold text-blue-700">VertoPDF</span> <span className="text-neutral-400">© {new Date().getFullYear()}</span>
          </div>
          <div className="text-xs text-neutral-400">Minimalist, privacy-first. No files are stored after processing.</div>
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
