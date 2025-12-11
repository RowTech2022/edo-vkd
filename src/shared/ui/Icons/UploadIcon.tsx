type Props = {
  fill?: string;
  stroke?: string;
  reverse?: boolean;
};
export const UploadIcon = (props: any & Props) => {
  return (
    <svg
      className={props.reverse ? "tw-transform tw-rotate-180" : ""}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        d="M3 19h18v2H3v-2zM13 5.828V17h-2V5.828L4.929 11.9l-1.414-1.414L12 2l8.485 8.485-1.414 1.414L13 5.83z"
        fill={props.fill ? props.fill : "rgba(149,164,166,1)"}
      />
    </svg>
  );
};
