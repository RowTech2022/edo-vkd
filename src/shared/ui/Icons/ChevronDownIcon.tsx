import { BaseIcon } from "./BaseIcon";

type Props = any;

export const ChevronDownIcon = (props: Props) => {
  return (
    <BaseIcon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </BaseIcon>
  );
};
