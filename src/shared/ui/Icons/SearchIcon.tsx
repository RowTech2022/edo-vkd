import { BaseIcon } from "./BaseIcon";
type Props = {
  fill: string;
  stroke: string;
};
export const SearchIcon = (props: any & Props) => {
  return (
    <BaseIcon {...props}>
      <g clipPath="url(#clip0_406_2200)">
        <path
          d="M10.0065 20.0093C12.3144 20.0123 14.5517 19.2138 16.3362 17.7503L22.3047 23.7178C22.7021 24.1016 23.3354 24.0906 23.7193 23.6932C24.0937 23.3055 24.0937 22.6909 23.7193 22.3032L17.7518 16.3347C21.2475 12.0561 20.6129 5.75364 16.3342 2.25788C12.0555 -1.23788 5.75309 -0.603207 2.25733 3.67546C-1.23843 7.95412 -0.603757 14.2565 3.67491 17.7523C5.46197 19.2124 7.69884 20.0097 10.0065 20.0093Z"
          fill={props.fill || "#374957"}
        />
      </g>
      <defs>
        <clipPath id="clip0_406_2200">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </BaseIcon>
  );
};
