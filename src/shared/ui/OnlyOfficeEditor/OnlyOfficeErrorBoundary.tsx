import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onError?: () => void;
}

interface State {
  hasError: boolean;
}

/**
 * Специальный ErrorBoundary для OnlyOffice DocumentEditor.
 * Игнорирует ошибки removeChild, которые возникают из-за
 * прямых DOM-манипуляций OnlyOffice при размонтировании.
 */
export class OnlyOfficeErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State | null {
    // Игнорируем ошибки removeChild от OnlyOffice
    if (
      error?.message?.includes("removeChild") ||
      error?.message?.includes("The node to be removed")
    ) {
      console.warn("[OnlyOffice] Ignoring DOM cleanup error:", error.message);
      return null; // Не устанавливаем hasError для этих ошибок
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логируем, но не ломаем приложение для ошибок removeChild
    if (
      error?.message?.includes("removeChild") ||
      error?.message?.includes("The node to be removed")
    ) {
      console.warn("[OnlyOffice] DOM cleanup error (ignored):", error);
      return;
    }
    
    console.error("[OnlyOffice] Component error:", error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#666"
        }}>
          Ошибка загрузки редактора
        </div>
      );
    }

    return this.props.children;
  }
}
