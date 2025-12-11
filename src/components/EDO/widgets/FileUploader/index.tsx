import { Box, CircularProgress, Grid } from "@mui/material";
import { UploadFileCard } from "@ui";
import { FC, useRef, useState } from "react";
import { FileItem } from "./components/File";
import fileService from "@services/fileService";
import { getParamFromUrl } from "@utils";
import { downloadFile } from "@hooks";
import { b64toBlob } from "./helpers";

interface IFileRequest {
  url: string;
}

interface IFileUploader {
  files: IFileRequest[];
  onChange: (files: IFileRequest[]) => void;
}

export const FileUploader: FC<IFileUploader> = ({ files = [], onChange }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileLoading, setSelectedFileLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<any>();

  const handlers = {
    select: async (file: any) => {
      setSelectedFile(file.url);
      setSelectedFileLoading(true);
      const blob = await b64toBlob(file.url);
      if (!blob) return;
      const blobUrl = URL.createObjectURL(blob);
      fileRef.current?.setAttribute("data", blobUrl);
      setSelectedFileLoading(false);
    },

    remove: (file: any) => {
      onChange(files.filter((item) => item.url !== file.url));
    },

    download: (file: any) => {
      downloadFile(
        encodeURI(file.url),
        getParamFromUrl(file.url, "fileName") || "FileRandomName"
      );
    },

    upload: async (_: any, event: any) => {
      const file = event.files;
      if (!file) {
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file[0]);

      await fileService.uploadFileV2(formData).then((e) => {
        let resp = e as { data: any };
        setUploading(false);
        onChange(files.concat(resp.data).reverse());
      });
    },
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={4}>
        <UploadFileCard
          change={handlers.upload}
          isLoading={uploading}
          item={files as any}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: 1,
          }}
          className="tw-mb-4"
        >
          {files &&
            files.map((item) => (
              <FileItem
                key={item?.url}
                file={item}
                active={selectedFile === item?.url}
                onClick={handlers.select}
                onRemove={handlers.remove}
                onDownload={handlers.download}
              />
            ))}
        </Box>
      </Grid>
      <Grid item xs={12} lg={8}>
        <Box
          style={{
            position: "relative",
            boxShadow: "rgba(0, 0, 0, 0.145) 0px 0px 4px 0px",
            borderRadius: "26px",
            paddingBottom: "1rem",
            overflow: "hidden",
          }}
        >
          <object
            ref={fileRef}
            type="application/pdf"
            width="100%"
            height="100%"
            style={{
              minHeight: "400px",
              maxHeight: "500px",
              opacity: Number(!selectedFileLoading),
            }}
          >
            Object not supported
          </object>
          {selectedFileLoading && (
            <CircularProgress className="tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2" />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
