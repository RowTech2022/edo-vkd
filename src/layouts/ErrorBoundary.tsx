import { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "react-toastify";
// или любой другой тостер

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Ошибка в компоненте:", error, errorInfo);
    toast.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
  }

  render() {
    if (this.state.hasError) {
      // Можно вернуть null или кастомную заглушку
      return (
        <div className="tw-pt-[6rem] tw-border-t tw-border-gray-100">
          <div className="tw-container">
            <h1 className="tw-mb-3">Произошла непредвиденная ошибка</h1>
            <p className="tw-text-gray-400 tw-text-lg">
              При загрузке этого раздела возникла техническая ошибка.
            </p>{" "}
            <p className="tw-text-gray-400 tw-text-lg">
              Мы уже работаем над её устранением. Пожалуйста, попробуйте
              обновить страницу или повторите попытку позже.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
