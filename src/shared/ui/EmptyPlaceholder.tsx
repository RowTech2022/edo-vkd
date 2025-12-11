import { FlatButton } from "./FlatButton";

export const EmptyPlaceholder = () => {
  const reloadPage = () => {
    window.location.reload();
  };
  return (
    <div className="tw-p-6 tw-border tw-border-slate-400 tw-rounded-md">
      <p className="tw-text-slate-400 tw-mb-8">
        Данных по вашему запросу нет. Попробуйте перезагрузить страницу.
      </p>
      <FlatButton onClick={reloadPage}>Перезагрузить</FlatButton>
    </div>
  );
};
