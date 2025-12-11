import { BaseIcon } from "./BaseIcon";
type Props = {
  fill: string;
  stroke: string;
};
export const ChevronLeftIcon = (props: any & Props) => {
  return (
    <BaseIcon {...props}>
      <path
        d="M14.033 19.8107L5.57674 11.3359L14.033 2.86117L11.4297 0.257812L0.351562 11.3359L11.4297 22.4141L14.033 19.8107Z"
        fill={props.fill || "#607D8B"}
      />
      <path />
    </BaseIcon>
  );
};
