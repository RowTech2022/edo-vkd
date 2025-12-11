import { UploadIcon } from "@icons";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Tooltip from "@mui/material/Tooltip";
import { CircularProgress } from "@mui/material";

interface IUpload {
  item: Letters.IncomeLetterFile;
  change?: any;
  download?: any;
  type?: string;
  disabled?: boolean;
  postfix?: string;
  urlParser?: (url: string) => string;
  accept?: string;
}

export const UploadCard: React.FC<IUpload> = ({
  item,
  change,
  download,
  disabled,
  postfix,
  accept,
  urlParser,
}) => {
  return (
    <div className="tw-flex tw-items-center tw-gap-0.5 tw-w-full">
      <label
        className="tw-cursor-pointer"
        htmlFor={`file-${item.id}-${postfix}`}
      >
        {item.loading ? (
          <CircularProgress size={24} />
        ) : (
          <AttachFileIcon
            sx={{ opacity: disabled ? 0.5 : 1, transform: "rotate(25deg)" }}
          />
        )}
        <input
          disabled={disabled}
          className="tw-hidden"
          accept={accept || "*"}
          id={`file-${item.id}-${postfix}`}
          type="file"
          onChange={(e) => change(item.id, e.currentTarget as HTMLInputElement)}
        />
      </label>
      <div
        onClick={(e) => download(item.url)}
        className={`tw-flex tw-items-center tw-gap-0.5 tw-font-medium ${
          item?.url
            ? "tw-text-blue-500 tw-cursor-pointer tw-w-11/12"
            : "tw-text-gray-400"
        } tw-text-center tw-rounded-md tw-p-2`}
      >
        <UploadIcon
          fill={item?.url ? "#607D8B" : "rgba(149,164,166,1)"}
          reverse={item?.url ? true : false}
        />
        <Tooltip title={item?.url || ""} arrow>
          <span
            style={{ width: item.url ? "450px" : "" }}
            className={item?.url ? "tw-truncate tw-text-left" : ""}
          >
            {item?.url
              ? urlParser
                ? urlParser(item?.url)
                : item?.url
              : "Загрузите файл"}
          </span>
        </Tooltip>
      </div>
    </div>
  );
};
