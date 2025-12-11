import { FC, useEffect } from "react";

interface IProps {
  url: string;
  onLoad: () => void;
}
export const Script: FC<IProps> = ({ url, onLoad }) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.async = true;

    script.onload = onLoad;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);

  return <></>;
};
