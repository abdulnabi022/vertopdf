# rarepdftool Python Backend

All-in-one PDF & image toolkit backend for rarepdftool.

## Features
- PDF compression (/api/compress)
- PDF to Word (/api/pdf-to-word)
- PDF to Excel (/api/pdf-to-excel)
- PDF to JPG (/api/pdf-to-jpg)
- JPG to PDF (/api/jpg-to-pdf)
- PDF to PNG (/api/pdf-to-png)
- PNG to PDF (/api/png-to-pdf)
- Image format converter (/api/image-convert)

## Setup

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Install system dependencies:
   - [Ghostscript](https://www.ghostscript.com/) (for PDF compression)
   - [Poppler](https://poppler.freedesktop.org/) (for pdf2image)
     - On macOS: `brew install ghostscript poppler`

3. Run the server:
   ```sh
   uvicorn main:app --reload --port 5050
   ```

---

© 2025 rarepdftool
