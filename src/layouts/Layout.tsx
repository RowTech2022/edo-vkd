import { Fragment, PropsWithChildren, useEffect, useLayoutEffect } from "react";
import { Header, SnowFlake } from "@ui";
import { Notifications } from "./Notifications";
import { Outlet, useLocation, useNavigate } from "react-router";
import { AuthStatus, useSession } from "@hooks";
import { getSavedTokenCert, setRedirectUrl } from "@utils";
import { CertificateAuth } from "@components";
import { TokenAuth } from "../components/auth/TokenAuth";
import { AppRoutes } from "@configs";
import clsx from "clsx";
import { ErrorBoundary } from "./ErrorBoundary";

type Props = {
  noOutlet?: boolean;
};

export const Layout = ({ children, noOutlet }: PropsWithChildren<Props>) => {
  const isAnimationAllowed = parseInt(
    import.meta.env.VITE_PUBLIC_SEASON_ANIMATION || ""
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { status } = useSession();
  useEffect(() => {
    if (status === AuthStatus.UNAUTHENTICATED) {
      navigate("/auth/login");
      if (pathname !== "/auth/login") {
        setRedirectUrl(pathname);
      }
    }
  }, [status, pathname]);

  useLayoutEffect(() => {
    getSavedTokenCert();
  }, []);

  const enableToken = parseInt(import.meta.env.VITE_PUBLIC_TOKEN_AUTH_ENABLE!);
  const enabledCertificate = parseInt(
    import.meta.env.VITE_PUBLIC_CERTIFICATE_AUTH_ENABLE!
  );
  const TokenProvider = enabledCertificate ? CertificateAuth : Fragment;
  const TokenProviderOld = enableToken ? TokenAuth : Fragment;

  const isLettersV4 = pathname.startsWith(AppRoutes.LETTERS_V4);

  return (
    <TokenProviderOld>
      <TokenProvider>
        <div
          id="__layout"
          className={`tw-h-full tw-flex tw-flex-col tw-relative`}
        >
          <Header />
          <ErrorBoundary>
            <main
              className={clsx("tw-flex-grow tw-pt-7 tw-min-h-[90vh] new-bg-gradient", {
                "lettersV4-main-gradient": isLettersV4,
              })}
            >
              {noOutlet ? children : <Outlet />}
              {isAnimationAllowed > 0 && <SnowFlake />}
            </main>
            <Notifications />
          </ErrorBoundary>
        </div>
      </TokenProvider>
    </TokenProviderOld>
  );
};
