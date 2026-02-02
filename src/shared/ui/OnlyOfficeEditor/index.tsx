import {
  FC,
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useFetchUserDetailsQuery } from "../../../services/admin/userProfileApi";
import { toBase64 } from "../../utils";
import { OnlyOfficeErrorBoundary } from "./OnlyOfficeErrorBoundary";

interface IProps {
  url: string;
  fileName: string;
  documentId?: string;
  fileType?: string;
  updatedAt?: string;
  onSave?: () => void;
  onDocumentStateChange?: (event: any) => void;
  editorRef?: MutableRefObject<any>;
}

const ROW_API_URL = import.meta.env.VITE_ROW_OFFICE_API_BASE_URL;
const ROW_CALLBACK_API_URL = import.meta.env.VITE_ROW_OFFICE_CALLBACK_API_URL;

export const OnlyOfficeEditor: FC<IProps> = ({
  url,
  fileName,
  documentId,
  fileType,
  updatedAt,
  editorRef,
  onSave,
  onDocumentStateChange,
}) => {
  const { data: details } = useFetchUserDetailsQuery();

  const [renderEditor, setRenderEditor] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorIdRef = useRef<string>(`docxEditor_${Date.now()}`);

  const isPdf = url?.split("?")[0].endsWith(".pdf");

  const callbackUrl = `${ROW_CALLBACK_API_URL}?fileName=${fileName}&fileType=${fileType}&documentId=${documentId}`;

  // Генерируем уникальный ключ для полной пересоздания DOM
  const editorKey = useMemo(() => {
    return toBase64(fileName + documentId + updatedAt + Date.now());
  }, [fileName, documentId, updatedAt]);

  // Очистка DOM при размонтировании - используем try-catch для подавления ошибок
  useLayoutEffect(() => {
    const container = containerRef.current;
    return () => {
      if (container) {
        try {
          // Пытаемся безопасно очистить контейнер
          while (container.firstChild) {
            try {
              container.removeChild(container.firstChild);
            } catch (e) {
              // Игнорируем ошибки removeChild
              break;
            }
          }
        } catch (e) {
          // Игнорируем любые ошибки очистки
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!details) return;

    // Генерируем новый ID для редактора при каждом обновлении
    editorIdRef.current = `docxEditor_${Date.now()}`;

    // Полностью скрываем редактор и очищаем конфиг
    setRenderEditor(false);
    setConfig(null);

    // Build URL with cache-busting parameters
    // If URL already has query params, append to them; otherwise create new query string
    const urlBase = url?.split("?")[0] || url;
    const existingParams = url?.includes("?") ? url.split("?")[1] : "";
    const params = new URLSearchParams(existingParams);
    params.set("fileName", fileName);
    params.set("updatedAt", updatedAt);
    // Add cache buster if _t parameter exists in URL
    if (url?.includes("_t=")) {
      const tMatch = url.match(/_t=(\d+)/);
      if (tMatch) {
        params.set("_t", tMatch[1]);
      }
    }
    const modifiedUrl = `${urlBase}?${params.toString()}`;

    console.log("Url: ", { url: modifiedUrl, key: fileName + documentId + updatedAt });

    // Задержка, чтобы дать React время размонтировать
    const timer = setTimeout(() => {
      const newConfig = {
        document: {
          fileType: isPdf ? "pdf" : "docx",
          key: toBase64(fileName + documentId + updatedAt),
          title: fileName,
          url: modifiedUrl,
        },
        documentType: "text",
        editorConfig: {
          mode: isPdf ? "view" : "edit",
          lang: "ru",
          callbackUrl,
          user: {
            id: details.id?.toString() || "",
            name: details.displayName || "",
          },
          customization: {
            forcesave: !isPdf,
          },
        },
      };

      setConfig(newConfig);
      setRenderEditor(true);
    }, 200);

    return () => {
      clearTimeout(timer);
      setRenderEditor(false);
    };
  }, [url, fileName, updatedAt, details, isPdf, callbackUrl, documentId]);

  if (!details) return null;

  return (
    <OnlyOfficeErrorBoundary>
      <div
        ref={containerRef}
        key={editorKey}
        style={{ width: "100%", height: "100%" }}
      >
        {renderEditor && config && (
          <DocumentEditor
            ref={editorRef}
            key={config.document.key}
            width="100%"
            height="100%"
            id={editorIdRef.current}
            documentServerUrl={ROW_API_URL}
            config={config}
            events_onAppReady={(instance: any) => {
              console.log("Instance: ", instance, instance?.editor);
            }}
            onLoadComponentError={(code, desc) =>
              console.error("Component load error:", code, desc)
            }
          />
        )}
      </div>
    </OnlyOfficeErrorBoundary>
  );
};
