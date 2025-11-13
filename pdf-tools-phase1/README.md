# SwiftPDF – Phase 1 (Client-Side MVP)

Three privacy-first tools that run 100% in the browser:
- Merge PDFs
- Compress PDF (basic, scale-based)
- Images → PDF

## Quickstart

```bash
npm i
npm run dev
```

Open http://localhost:5173

## Notes

- Uses [`pdf-lib`](https://pdf-lib.js.org/) and React (Vite).
- Compression here is basic (re-embed pages at a smaller scale). Stronger compression usually requires rendering pages to images (pdf.js) or server-side tools (Ghostscript/pdfcpu).
- Large files can be memory heavy in-browser; Phase 2 will add a FastAPI backend + S3.
