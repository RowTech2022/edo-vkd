import { useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { printPlugin } from "@react-pdf-viewer/print";
import { bookmarkPlugin } from "@react-pdf-viewer/bookmark";
import { selectionModePlugin } from "@react-pdf-viewer/selection-mode";

import "@react-pdf-viewer/selection-mode/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";

const DocumentPdf = ({ url }) => {
  const printPluginInstance = printPlugin();
  const bookmarkPluginInstance = bookmarkPlugin();
  const selectionModePluginInstance = selectionModePlugin();

  const isPdf = url?.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    if (!isPdf && url) {
      // Если не PDF — инициируем скачивание
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop(); // Получаем имя файла
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [url, isPdf]);

  if (!isPdf) {
    return (
      <div className="tw-text-center tw-py-10">
        <p>Файл не является PDF.</p>
      </div>
    );
  }

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-space-y-3 tw-items-center tw-h-[100vh] tw-overflow-y-auto">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          defaultScale={1}
          fileUrl={url}
          plugins={[
            printPluginInstance,
            bookmarkPluginInstance,
            selectionModePluginInstance,
          ]}
          renderLoader={() => (
            <div className="tw-flex tw-items-center tw-justify-center tw-h-full">
              <div className="tw-animate-spin-slow tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-w-12 tw-h-12" />
            </div>
          )}
        />
      </Worker>
    </div>
  );
};

export default DocumentPdf;
