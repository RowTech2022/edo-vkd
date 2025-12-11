import React, { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Устанавливаем путь к worker.js
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl }) => {
  const canvasRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdfDoc = await getDocument(fileUrl).promise;
        setPdf(pdfDoc);
        renderPage(pageNumber, pdfDoc);
      } catch (error) {
        console.error("Ошибка при загрузке PDF:", error);
      }
    };

    loadPDF();
  }, [fileUrl]);

  const renderPage = (num, pdfDoc) => {
    pdfDoc
      .getPage(num)
      .then((page) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page
          .render({
            canvasContext: context,
            viewport: viewport,
          })
          .promise.then(() => {
            console.log(`Страница ${num} отрендерена`);
          })
          .catch((error) => {
            console.error("Ошибка при рендеринге страницы:", error);
          });
      })
      .catch((error) => {
        console.error("Ошибка при загрузке страницы:", error);
      });
  };

  const goToNextPage = () => {
    if (pdf && pageNumber < pdf.numPages) {
      setPageNumber(pageNumber + 1);
      renderPage(pageNumber + 1, pdf);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      renderPage(pageNumber - 1, pdf);
    }
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <div>
        <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (pdf?.numPages || 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
