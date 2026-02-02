import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { printPlugin } from "@react-pdf-viewer/print";
import { bookmarkPlugin } from "@react-pdf-viewer/bookmark";
import { selectionModePlugin } from "@react-pdf-viewer/selection-mode";
import { Typography } from "@mui/material";

// Хук для определения мобильного устройства
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

import "@react-pdf-viewer/selection-mode/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";

const DocumentPdf = ({ url }) => {
  const [hasError, setHasError] = useState(false);
  const isMobile = useIsMobile();
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

  useEffect(() => {
    setHasError(false);
  }, [url]);

  useEffect(() => {
    // Скрываем только технические ошибки PDF viewer, но не наш компонент
    const hideErrors = () => {
      // Ищем только элементы внутри PDF viewer
      const viewerContainer = document.querySelector('[data-testid="core__viewer"]');
      if (!viewerContainer) return;

      const allDivs = viewerContainer.querySelectorAll('div');
      allDivs.forEach((el: any) => {
        const text = el?.textContent || '';
        // Скрываем только технические сообщения об ошибках
        if (text.includes('Missing PDF') || 
            text.includes('Error loading') ||
            (text.includes('Error') && text.length < 200)) {
          // Проверяем, что это не наш компонент с сообщением
          const parent = el.closest('[class*="tw-"]');
          if (!parent) {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
          }
        }
      });
    };

    // Используем MutationObserver только для контейнера viewer
    const viewerContainer = document.querySelector('[data-testid="core__viewer"]');
    if (viewerContainer) {
      const observer = new MutationObserver(hideErrors);
      observer.observe(viewerContainer, {
        childList: true,
        subtree: true,
        characterData: true
      });

      // Также проверяем периодически
      const interval = setInterval(hideErrors, 100);
      
      // Первая проверка
      setTimeout(hideErrors, 200);

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, [url]);

  if (!isPdf) {
    return (
      <div className="tw-text-center tw-py-10">
        <p>Файл не является PDF.</p>
      </div>
    );
  }

  if (hasError || !url) {
    return (
      <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-bg-gray-100">
        <div className="tw-text-center tw-p-8">
          <Typography variant="body1" className="tw-text-gray-600 tw-font-medium">
            Документ временно недоступен
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center tw-overflow-y-auto tw-bg-gray-100 md:tw-bg-[#F1F5F9]">
      <style>{`
        .rpv-core__viewer--error,
        .rpv-core__viewer--error *,
        div[class*="error"],
        div:has-text("Missing PDF"),
        div:has-text("Missing PDF") * {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Адаптивные стили ТОЛЬКО для мобильных устройств */
        @media (max-width: 767px) {
          .rpv-core__viewer {
            width: 100% !important;
            height: 100% !important;
          }
          
          .rpv-core__inner-pages {
            padding: 0 !important;
            width: 100% !important;
          }
          
          .rpv-core__page-layer {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            width: 100% !important;
          }
          
          .rpv-core__canvas {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
          }
          
          .rpv-core__page {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          defaultScale={isMobile ? 0.8 : 1}
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
          renderError={() => {
            return (
              <div className="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-bg-gray-100">
                <div className="tw-text-center tw-p-8">
                  <Typography variant="body1" className="tw-text-gray-500">
                    Документ временно недоступен
                  </Typography>
                </div>
              </div>
            );
          }}
          onDocumentLoad={() => {
            setHasError(false);
          }}
          onDocumentLoadError={() => {
            setHasError(true);
          }}
        />
      </Worker>
    </div>
  );
};

export default DocumentPdf;
