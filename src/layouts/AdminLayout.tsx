import { Fragment, PropsWithChildren, useEffect } from "react";
import { Button, Toolbar, AppBar } from "@mui/material";
import { Header } from "@ui";
import { useNavigate } from "react-router-dom";
import { AuthStatus, useSession } from "@hooks";
import { CertificateAuth } from "@components";
import { TokenAuth } from "../components/auth/TokenAuth";
import { ErrorBoundary } from "./ErrorBoundary";

type Props = {};

export const AdminLayout = ({ children }: PropsWithChildren<Props>) => {
  const navigate = useNavigate();
  const { status } = useSession();

  useEffect(() => {
    if (status === AuthStatus.UNAUTHENTICATED) {
      navigate("/auth/login");
    }
  }, [status]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const enableToken = parseInt(import.meta.env.VITE_PUBLIC_TOKEN_AUTH_ENABLE!);
  const enabledCertificate = parseInt(
    import.meta.env.VITE_PUBLIC_CERTIFICATE_AUTH_ENABLE!
  );
  const TokenProvider = enabledCertificate ? CertificateAuth : Fragment;
  const TokenProviderOld = enableToken ? TokenAuth : Fragment;

  return (
    <TokenProviderOld>
      <TokenProvider>
        <div id="__layout" className="tw-h-full tw-flex tw-flex-col">
          <Header />
          <ErrorBoundary>
            <AppBar
              position="static"
              sx={{ background: "white", boxShadow: "none", mt: 2 }}
            >
              <Toolbar disableGutters>
                <div className="tw-container">
                  <Button variant="outlined" onClick={handleGoBack}>
                    Назад
                  </Button>
                </div>
              </Toolbar>
            </AppBar>
            <main className="tw-flex-grow tw-container">{children}</main>
          </ErrorBoundary>
        </div>
      </TokenProvider>
    </TokenProviderOld>
  );
};
