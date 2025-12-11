import TabItem, { TabProps } from "@mui/material/Tab";

interface ItemProps extends TabProps {
  selected?: boolean;
}

export default function Tab({ ...props }: ItemProps) {
  return <TabItem {...props} disabled={props?.selected} />;
}
