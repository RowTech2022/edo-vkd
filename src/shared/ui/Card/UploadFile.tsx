import { useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { CircularProgress } from "@mui/material";

interface IUploadFile {
  item: UploadFileLetters;
  change?: any;
  download?: any;
  type?: string;
  isLoading?: boolean;
}

export const UploadFileCard: React.FC<IUploadFile> = ({
  change,
  isLoading,
  item,
}) => {
  const hiddentInputLabelRef = useRef(null);
  return (
    <div className="tw-flex tw-items-center tw-gap-0.5 tw-w-full">
      <label
        ref={hiddentInputLabelRef}
        className="tw-cursor-pointer"
        htmlFor={`file-${item?.url}`}
      >
        <input
          className="tw-hidden"
          accept=".pdf, .doc, .docx, .xls, .xlsx"
          id={`file-${item?.url}`}
          type="file"
          onChange={(e) =>
            change(item?.url, e.currentTarget as HTMLInputElement)
          }
        />
      </label>
      <div
        onClick={() => hiddentInputLabelRef?.current?.click()}
        className={`tw-flex tw-items-center tw-justify-center tw-gap-0.5 tw-font-medium ${
          item?.url
            ? "tw-text-blue-500 tw-cursor-pointer tw-w-11/12"
            : "tw-text-gray-400"
        } tw-text-center tw-rounded-md tw-p-2 tw-cursor-pointer`}
      >
        {isLoading ? <CircularProgress size={20} /> : <AttachFileIcon />}
        <span
          style={{ width: item?.url ? "450px" : "" }}
          className={item?.url ? "tw-truncate tw-text-left" : ""}
        >
          {item?.url ? item?.url : "Загрузите файл"}
        </span>
      </div>
    </div>
  );
};
