import { UploadIcon } from "@icons";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Tooltip from "@mui/material/Tooltip";
import { CircularProgress } from "@mui/material";
import { IEgovServicesFile } from "@services/egovServices";

interface IUpload {
  item: IEgovServicesFile;
  change?: any;
  download?: any;
  type?: string;
  disabled?: boolean;
  postfix?: string;
  urlParser?: (url: string) => string;
}

export const UploadCardTemplate: React.FC<IUpload> = ({
  item,
  change,
  download,
  disabled,
  postfix,
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
          accept="*"
          id={`file-${item.id}-${postfix}`}
          type="file"
          onChange={(e) => change(item.id, e.currentTarget as HTMLInputElement)}
        />
      </label>
      <div
        onClick={() => download(item.template)}
        className={`tw-flex tw-items-center tw-gap-0.5 tw-font-medium ${
          item?.template
            ? "tw-text-blue-500 tw-cursor-pointer tw-w-11/12"
            : "tw-text-gray-400"
        } tw-text-center tw-rounded-md tw-p-2`}
      >
        <UploadIcon
          fill={item?.template ? "#607D8B" : "rgba(149,164,166,1)"}
          reverse={item?.template ? true : false}
        />
        <Tooltip title={item?.template || ""} arrow>
          <span
            style={{ width: item.template ? "450px" : "" }}
            className={item?.template ? "tw-truncate tw-text-left" : ""}
          >
            {item?.template
              ? urlParser
                ? urlParser(item?.template)
                : item?.template
              : "Загрузите файл"}
          </span>
        </Tooltip>
      </div>
    </div>
  );
};
