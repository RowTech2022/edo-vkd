import { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  message: string;
};
export const SWRError1 = (props: Props) => {
  useEffect(() => {
    toast.error(props.message);
  }, []);

  return (
    <>
      <div className="tw-p-6 tw-border tw-border-slate-400 tw-rounded-md">
        <p className="tw-text-slate-400 tw-mb-8">Что-то пошло не так</p>
      </div>
    </>
  );
};
