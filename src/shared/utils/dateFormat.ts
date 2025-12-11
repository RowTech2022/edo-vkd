import { format } from "date-fns";

export const newDateFormat = "dd.MM.yyyy";
export const newDateHMFormat = "dd.MM.yyyy HH:mm";
export const newDateHMSFormat = "dd.MM.yyyy hh:mm:ss";

export const formatDate = (dateString: string, hideTime?: boolean) => {
  if (!dateString) return "";
  return format(
    new Date(dateString),
    hideTime ? newDateFormat : newDateHMFormat
  );
};
