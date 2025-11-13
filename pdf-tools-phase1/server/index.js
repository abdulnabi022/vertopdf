const express = require('express');
const multer = require('multer');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const { createCanvas } = require('canvas');

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

const app = express();
app.use(cors());

console.log('typeof pdfParse at startup:', typeof pdfParse);

app.get('/', (req, res) => {
  res.send('PDF compression server is running and CORS is enabled.');
});

const upload = multer({ dest: 'uploads/' });

// PDF compression endpoint
app.post('/api/compress', upload.single('file'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `compressed_${Date.now()}.pdf`);

  // Ghostscript command for PDF compression
  const gsArgs = [
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.4',
    '-dPDFSETTINGS=/ebook', // /screen, /ebook, /printer, /prepress, /default
    '-dNOPAUSE',
    '-dQUIET',
    '-dBATCH',
    `-sOutputFile=${outputPath}`,
    inputPath
  ];

  execFile('gs', gsArgs, (err) => {
    fs.unlinkSync(inputPath); // Remove original upload
    if (err) {
      res.status(500).json({ error: 'Compression failed', details: err.message });
    } else {
      res.download(outputPath, 'compressed.pdf', (err) => {
        fs.unlinkSync(outputPath); // Remove compressed file after download
      });
    }
  });
});

// PDF to Word endpoint
app.post('/api/pdf-to-word', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const { Document, Packer, Paragraph } = require('docx');
  console.log('PDF to Word endpoint called');
  console.log('typeof pdfParse:', typeof pdfParse);
  try {
    const dataBuffer = fs.readFileSync(inputPath);
    const pdfData = await pdfParse(dataBuffer);
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: pdfData.text.split('\n').map(line => new Paragraph(line)),
        },
      ],
    });
    const b = await Packer.toBuffer(doc);
    res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(b);
  } catch (err) {
    console.error('PDF to Word conversion error:', err);
    res.status(500).json({ error: 'Conversion failed', details: err.message });
  } finally {
    fs.unlinkSync(inputPath);
  }
});

// PDF to Excel endpoint
app.post('/api/pdf-to-excel', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const ExcelJS = require('exceljs');
  const fs = require('fs');

  try {
    const dataBuffer = fs.readFileSync(inputPath);
    const pdfData = await pdfParse(dataBuffer);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PDF Data');
    // Split PDF text into lines and add each as a row
    pdfData.text.split('\n').forEach(line => worksheet.addRow([line]));
    res.setHeader('Content-Disposition', 'attachment; filename="converted.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed', details: err.message });
  } finally {
    fs.unlinkSync(inputPath);
  }
});

// PDF to JPG endpoint
app.post('/api/pdf-to-jpg', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputDir = path.join('uploads', `pdf2jpg_${Date.now()}`);
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('[PDF to JPG] Request received. Input:', inputPath);
  try {
    const { PDFDocument } = require('pdf-lib');
    const sharp = require('sharp');
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    const dataBuffer = fs.readFileSync(inputPath);
    const data = new Uint8Array(dataBuffer); // Always convert Buffer to Uint8Array
    console.log('[PDF to JPG] Loaded PDF data, length:', data.length);
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const pageCount = pdf.numPages;
    console.log('[PDF to JPG] PDF loaded. Page count:', pageCount);
    const jpgFiles = [];
    for (let i = 1; i <= pageCount; i++) {
      console.log(`[PDF to JPG] Rendering page ${i}`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvasFactory = new NodeCanvasFactory();
      const canvasAndCtx = canvasFactory.create(viewport.width, viewport.height);
      await page.render({ canvasContext: canvasAndCtx.context, viewport, canvasFactory }).promise;
      const imgBuffer = canvasAndCtx.canvas.toBuffer();
      const jpgPath = path.join(outputDir, `page_${i}.jpg`);
      await sharp(imgBuffer).jpeg({ quality: 90 }).toFile(jpgPath);
      jpgFiles.push(jpgPath);
      console.log(`[PDF to JPG] Page ${i} saved as JPG:`, jpgPath);
    }
    // Zip the JPGs
    const archiver = require('archiver');
    const zipPath = path.join('uploads', `pdf2jpg_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    jpgFiles.forEach(f => archive.file(f, { name: path.basename(f) }));
    await archive.finalize();
    output.on('close', () => {
      console.log('[PDF to JPG] Sending zip file:', zipPath);
      res.download(zipPath, 'pdf-to-jpg.zip', () => {
        fs.unlinkSync(inputPath);
        jpgFiles.forEach(f => fs.unlinkSync(f));
        fs.rmdirSync(outputDir);
        fs.unlinkSync(zipPath);
        console.log('[PDF to JPG] Cleanup complete.');
      });
    });
  } catch (err) {
    console.error('[PDF to JPG] Error:', err);
    res.status(500).json({ error: 'Conversion failed', details: err.message });
    fs.unlinkSync(inputPath);
    if (fs.existsSync(outputDir)) fs.rmdirSync(outputDir, { recursive: true });
  }
});

// JPG to PDF endpoint
app.post('/api/jpg-to-pdf', upload.array('files'), async (req, res) => {
  try {
    const { PDFDocument } = require('pdf-lib');
    const doc = await PDFDocument.create();
    for (const file of req.files) {
      const imgBytes = fs.readFileSync(file.path);
      const img = await doc.embedJpg(imgBytes);
      const dims = img.scale(1);
      const page = doc.addPage([dims.width, dims.height]);
      page.drawImage(img, { x: 0, y: 0, width: dims.width, height: dims.height });
    }
    const pdfBytes = await doc.save();
    res.setHeader('Content-Disposition', 'attachment; filename="jpg-to-pdf.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
    req.files.forEach(f => fs.unlinkSync(f.path));
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed', details: err.message });
    req.files.forEach(f => fs.unlinkSync(f.path));
  }
});

// PDF to PNG endpoint
app.post('/api/pdf-to-png', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputDir = path.join('uploads', `pdf2png_${Date.now()}`);
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('[PDF to PNG] Request received. Input:', inputPath);
  try {
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    const sharp = require('sharp');
    const data = new Uint8Array(fs.readFileSync(inputPath));
    console.log('[PDF to PNG] Loaded PDF data, length:', data.length);
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const pageCount = pdf.numPages;
    console.log('[PDF to PNG] PDF loaded. Page count:', pageCount);
    const pngFiles = [];
    for (let i = 1; i <= pageCount; i++) {
      console.log(`[PDF to PNG] Rendering page ${i}`);
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvasFactory = new NodeCanvasFactory();
      const canvasAndCtx = canvasFactory.create(viewport.width, viewport.height);
      await page.render({ canvasContext: canvasAndCtx.context, viewport, canvasFactory }).promise;
      const imgBuffer = canvasAndCtx.canvas.toBuffer();
      const pngPath = path.join(outputDir, `page_${i}.png`);
      await sharp(imgBuffer).png().toFile(pngPath);
      pngFiles.push(pngPath);
      console.log(`[PDF to PNG] Page ${i} saved as PNG:`, pngPath);
    }
    // Zip the PNGs
    const archiver = require('archiver');
    const zipPath = path.join('uploads', `pdf2png_${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    pngFiles.forEach(f => archive.file(f, { name: path.basename(f) }));
    await archive.finalize();
    output.on('close', () => {
      console.log('[PDF to PNG] Sending zip file:', zipPath);
      res.download(zipPath, 'pdf-to-png.zip', () => {
        fs.unlinkSync(inputPath);
        pngFiles.forEach(f => fs.unlinkSync(f));
        fs.rmdirSync(outputDir);
        fs.unlinkSync(zipPath);
        console.log('[PDF to PNG] Cleanup complete.');
      });
    });
  } catch (err) {
    console.error('[PDF to PNG] Error:', err);
    res.status(500).json({ error: 'Conversion failed', details: err.message });
    fs.unlinkSync(inputPath);
    if (fs.existsSync(outputDir)) fs.rmdirSync(outputDir, { recursive: true });
  }
});

// PNG to PDF endpoint
app.post('/api/png-to-pdf', upload.array('files'), async (req, res) => {
  try {
    const { PDFDocument } = require('pdf-lib');
    const doc = await PDFDocument.create();
    for (const file of req.files) {
      const imgBytes = fs.readFileSync(file.path);
      const img = await doc.embedPng(imgBytes);
      const dims = img.scale(1);
      const page = doc.addPage([dims.width, dims.height]);
      page.drawImage(img, { x: 0, y: 0, width: dims.width, height: dims.height });
    }
    const pdfBytes = await doc.save();
    res.setHeader('Content-Disposition', 'attachment; filename="png-to-pdf.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
    req.files.forEach(f => fs.unlinkSync(f.path));
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed', details: err.message });
    req.files.forEach(f => fs.unlinkSync(f.path));
  }
});

// Image Converter endpoint (JPG, PNG, WebP)
app.post('/api/image-convert', upload.single('file'), async (req, res) => {
  const { format } = req.body; // 'jpg', 'png', 'webp'
  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `converted_${Date.now()}.${format}`);
  try {
    const sharp = require('sharp');
    let img = sharp(inputPath);
    if (format === 'jpg') img = img.jpeg({ quality: 90 });
    else if (format === 'png') img = img.png();
    else if (format === 'webp') img = img.webp();
    await img.toFile(outputPath);
    res.download(outputPath, `converted.${format}`, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed', details: err.message });
    fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
});

app.listen(5050, () => {
  console.log('PDF compression server running on http://localhost:5050');
});
