import { FC, MutableRefObject, RefObject, useEffect, useState } from "react";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useFetchUserDetailsQuery } from "../../../services/admin/userProfileApi";
import { toBase64 } from "../../utils";

interface IProps {
  url: string;
  fileName: string;
  documentId?: string;
  fileType?: string;
  updatedAt?: string;
  onSave?: () => void;
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
}) => {
  const { data: details } = useFetchUserDetailsQuery();

  const [renderEditor, setRenderEditor] = useState(false);
  const [instance, setInstance] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  const isPdf = url?.split("?")[0].endsWith(".pdf");

  const callbackUrl = `${ROW_CALLBACK_API_URL}?fileName=${fileName}&fileType=${fileType}&documentId=${documentId}`;

  useEffect(() => {
    if (!details) return;

    // Полностью скрываем редактор
    setRenderEditor(false);

    url = `${url?.slice(
      0,
      url?.indexOf("?")
    )}?fileName=${fileName}&updatedAt=${updatedAt}`;

    console.log("Url: ", { url, key: fileName + documentId + updatedAt });
    // Задержка, чтобы размонтировать
    const timer = setTimeout(() => {
      setConfig({
        document: {
          fileType: isPdf ? "pdf" : "docx",
          key: toBase64(fileName + documentId + updatedAt),
          title: fileName,
          url,
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
      });
      // После обновления конфига рендерим редактор
      setRenderEditor(true);
    }, 100); // можно и меньше, главное дать React время размонтировать

    return () => clearTimeout(timer);
  }, [url, fileName, updatedAt, details, isPdf, callbackUrl]);

  if (!details) return null;

  return (
    <>
      {renderEditor && config && (
        <DocumentEditor
          ref={editorRef}
          key={config.document.key}
          width="100%"
          height="100%"
          id="docxEditor"
          documentServerUrl={ROW_API_URL}
          config={config}
          events_onAppReady={(instance: any) => {
            console.log("Instance: ", instance, instance?.editor);
            // editorRef.current = instance;
          }}
          onLoadComponentError={(code, desc) =>
            console.error("Component load error:", code, desc)
          }
          // events_onDocumentStateChange={(event: any) => {
          //   console.log("Event: ", event);
          //   if (!event?.data) {
          //     onSave?.();
          //   }
          // }}
        />
      )}
    </>
  );
};
