import { FC } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useDynamicSearchParams } from "@hooks";
import { IconButton } from "@mui/material";

export const IncomingTopTabs: FC = () => {
  const { params, setParams } = useDynamicSearchParams();

  const handleToggleMenu = () => {
    setParams("folders", "");
    setParams("minified", params.minified ? "" : "true");
  };

  const topTab = (
    <div className="tab tw-mb-2 tw-flex tw-gap-6 tw-text-[#252525] tw-text-[16px] tw-font-bold">
      <IconButton onClick={handleToggleMenu}>
        <MenuIcon />
      </IconButton>
      <div className="tw-cursor-pointer tw-border-b-2 tw-border-[#5F8CA1]">
        Письма
      </div>
    </div>
  );

  return (
    <div className="lettersV4-gradient tw-rounded-[12px] tw-p-2 tw-pb-1">
      {topTab}
    </div>
  );
};
