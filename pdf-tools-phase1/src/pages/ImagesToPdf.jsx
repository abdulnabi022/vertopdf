import React, { useState } from 'react'
import Card from '../components/Card.jsx'
import { PDFDocument } from 'pdf-lib'

export default function ImagesToPdf() {
  const [files, setFiles] = useState([])
  const [margin, setMargin] = useState(16)
  const [busy, setBusy] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')

  const onSelect = (e) => setFiles(Array.from(e.target.files || []))

  const onBuild = async () => {
    if (!files.length) return
    setBusy(true); setDownloadUrl('')
    try {
      const doc = await PDFDocument.create()
      for (const f of files) {
        const type = f.type || 'image/jpeg'
        const bytes = await f.arrayBuffer()
        let img
        if (type.includes('png')) img = await doc.embedPng(bytes)
        else img = await doc.embedJpg(bytes)
        const imgDims = img.scale(1)
        const pageWidth = Math.min(595, imgDims.width) // A4 width ≈ 595pt
        const scale = pageWidth / imgDims.width
        const pageHeight = imgDims.height * scale
        const page = doc.addPage([pageWidth + margin * 2, pageHeight + margin * 2])
        page.drawImage(img, {
          x: margin,
          y: margin,
          width: pageWidth,
          height: pageHeight,
        })
      }
      const out = await doc.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      setDownloadUrl(URL.createObjectURL(blob))
    } catch (err) {
      alert('Conversion failed: ' + err.message)
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-2 py-8 bg-neutral-50">
      <Card
        title="Images → PDF"
        description="Turn your images into a single PDF. Drag or select images in order. 100% in your browser."
        buttonText={busy ? 'Building…' : 'Create PDF'}
        onButtonClick={onBuild}
        disabled={busy || files.length === 0}
      >
        <label className="block w-full cursor-pointer mb-2">
          <input
            multiple
            type="file"
            accept="image/*"
            onChange={onSelect}
            className="hidden"
          />
          <div className={`w-full border-2 border-dashed rounded-lg p-4 text-center text-blue-700 bg-blue-50 hover:bg-blue-100 transition cursor-pointer ${files.length ? 'border-blue-400' : 'border-blue-200'}`}>{files.length ? `${files.length} image(s) selected` : 'Click to select images'}</div>
        </label>
        <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center mt-2">
          <label className="text-sm text-blue-900 font-medium flex items-center gap-2">
            Margin
            <input
              type="number"
              min="0"
              max="64"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value || '0', 10))}
              className="w-20 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-300"
            />
          </label>
        </div>
        {downloadUrl && (
          <a className="w-full mt-4 block px-5 py-2 rounded-lg bg-green-500 text-white text-base font-semibold text-center shadow hover:bg-green-600 transition" href={downloadUrl} download={`images_${Date.now()}.pdf`}>
            Download PDF
          </a>
        )}
      </Card>
    </div>
  )
}
