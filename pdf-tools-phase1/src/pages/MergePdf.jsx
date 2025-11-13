// src/pages/MergePdf.jsx
import React, { useCallback, useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";

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
      className="flex items-center gap-3 p-3 border rounded-lg bg-white"
    >
      <div className="flex-shrink-0">
        <FilePreview item={item} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.file.name}</div>
        <div className="text-xs text-neutral-500">
          {(item.file.size / 1024 / 1024).toFixed(2)} MB • {item.typeLabel}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          {...listeners}
          {...attributes}
          className="px-2 py-1 text-xs rounded-md bg-neutral-100 hover:bg-neutral-200"
          title="Drag to reorder"
        >
          ☰
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100"
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-2 py-8 bg-gradient-to-br from-blue-50 to-white">
      <Card
        title="Merge PDFs"
        description="Combine PDF and image files. Drag, reorder, and merge—all in your browser."
        buttonText={busy ? 'Merging…' : 'Merge'}
        onButtonClick={handleMerge}
        disabled={busy || items.length === 0}
      >
        <div {...getRootProps()} className={`w-full border-2 border-dashed rounded-lg p-4 text-center text-blue-700 bg-blue-50 hover:bg-blue-100 transition cursor-pointer ${isDragActive ? 'border-blue-400' : 'border-blue-200'}`}>
          <input {...getInputProps()} />
          <div className="text-base">
            {isDragActive ? (
              <span>Drop files here</span>
            ) : (
              <span>Drag & drop PDF/images or <span className="underline">browse</span></span>
            )}
            <div className="mt-1 text-xs text-neutral-400">
              {items.length} files • {totalSizeMB.toFixed(2)} MB
            </div>
          </div>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2 w-full mt-4">
              {items.length === 0 ? (
                <div className="text-center text-neutral-300 text-xs py-4">No files yet.</div>
              ) : (
                items.map((item, idx) => (
                  <SortableRow key={item.id} item={item} index={idx} onRemove={handleRemove} />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex gap-2 mt-4 w-full">
          <button
            onClick={handleMerge}
            disabled={busy || items.length === 0}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-base font-semibold shadow hover:bg-blue-700 transition disabled:opacity-40"
          >
            {busy ? 'Merging…' : 'Merge'}
          </button>
          <button
            onClick={clearAll}
            disabled={items.length === 0}
            className="px-3 py-2 rounded-lg bg-neutral-100 text-base font-semibold"
          >
            Clear
          </button>
          {downloadUrl && (
            <a
              className="flex-1 px-3 py-2 rounded-lg bg-green-500 text-white text-base font-semibold text-center shadow hover:bg-green-600 transition ml-auto"
              href={downloadUrl}
              download={`merged_${Date.now()}.pdf`}
            >
              Download
            </a>
          )}
        </div>
        <div className="text-xs text-neutral-400 text-center mt-2">
          Tip: For large jobs (&gt;50 MB) use the server-side queue (coming soon).
        </div>
      </Card>
    </div>
  );
}

/* Wrapper component for each sortable row that uses our SortableItem UI */
function SortableRow({ item, index, onRemove }) {
  return (
    <SortableItem item={item} index={index} onRemove={onRemove} />
  );
}
