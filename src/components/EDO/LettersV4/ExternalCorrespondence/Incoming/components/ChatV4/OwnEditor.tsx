import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const OwnEditor = ({ content, setContent }) => {
  const editor = useRef(null);

  const config: any = useMemo(
    () => ({
      readonly: false,
      height: "auto",
      minHeight: "700px",
      width: "100%",
      placeholder: "",
      toolbarSticky: false,
      iframe: false,
      defaultActionOnPaste: "insert_as_text",
      useTab: true,
      tabIndex: 1,
      cleanHTML: {
        removeEmpty: false,
        replaceNBSP: false,
        removeExtraSpaces: false,
        ignore: ["*"],
      },
      style: {
        backgroundColor: "#f5f5f5", // цвет фона вокруг "листа"
        padding: "40px 0", // отступ сверху и снизу
      },
      events: {
        keydown: (e: KeyboardEvent) => {
          if (e.key === "Tab") {
            e.preventDefault();
            document.execCommand(
              "insertHTML",
              false,
              "&nbsp;&nbsp;&nbsp;&nbsp;"
            );
          }
        },
      },
    }),
    []
  );

  return (
    <div
      style={{
        backgroundColor: "#fff",
        width: "595pt", // ширина A4 в пунктах
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        padding: "0px 50px", // отступы со всех сторон, совпадающие с pdf
        boxSizing: "border-box",
        overflowY: "auto", // вертикальный скролл внутри страницы
        overflowX: "hidden", // горизонтальный скролл отключен
      }}
    >
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
      />
    </div>
  );
};

export default OwnEditor;
