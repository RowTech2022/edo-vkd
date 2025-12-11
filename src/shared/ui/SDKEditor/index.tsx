import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";

const realKey =
  "Technologiya Bomi Jahon LLC:OEM:a5jJQ000001PEIX::B+3:AMS(20260706):A856BCCB3371ADB813583F376FB0EBA02880B0F5BEEDA78006F120EA6B6782DFFA656D";

export const SDKEditor = forwardRef(
  (
    {
      initialDoc,
      handleSaveDoc,
      isPdf = false,
    }: {
      initialDoc: null | string;
      handleSaveDoc: (core: any) => void;
      isPdf?: boolean;
    },
    ref
  ) => {
    const viewer = useRef(null);
    const instanceRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      print: () => {
        instanceRef.current?.UI.print();
      },
    }));

    useEffect(() => {
      if (!viewer.current) return;

      WebViewer(
        {
          path: "/lib/webviewer",
          enableOfficeEditing: !isPdf,
          fullAPI: true,
          licenseKey: realKey,
          initialDoc,
        },
        viewer.current
      ).then(async (instance) => {
        instanceRef.current = instance;
        const { UI, Core } = instance;
        UI.setLanguage("ru");
        handleSaveDoc(Core);
      });

      return () => {
        if (viewer.current) {
          viewer.current.innerHTML = "";
        }
      };
    }, [initialDoc, isPdf]);

    return (
      <>
        <div className="tw-w-full tw-flex tw-justify-end tw-h-[40px]"></div>

        <div
          className="webviewer"
          ref={viewer}
          style={{ height: "calc(100% - 40px)" }}
        ></div>
      </>
    );
  }
);
