import { FC, ReactNode } from "react";
import { IncomingTabs } from "./components/IncomingTabs";
import { IncomingSidebar } from "./components/IncomingSidebar";

interface IProps {
  children?: ReactNode;
}

export const LettersV4Layout: FC<IProps> = ({ children }) => {
  return (
    <div>
      <IncomingTabs />
      <div className="tw-flex tw-gap-3 tw-py-4">
        <IncomingSidebar />
        <div className="content tw-overflow-auto tw-flex-1 tw-bg-white tw-rounded-lg tw-p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
