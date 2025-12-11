import { AuthFooter, AuthHeader, CertificateAuth } from "@components";
import { Fragment, PropsWithChildren } from "react";
import { SnowFlake } from "@ui";
import { TokenAuth } from "../components/auth/TokenAuth";
import { ErrorBoundary } from "./ErrorBoundary";

type Props = {};

export const AuthLayout = ({ children }: PropsWithChildren<Props>) => {
  const isAnimationAllowed = parseInt(
    import.meta.env.VITE_PUBLIC_SEASON_ANIMATION || ""
  );

  const enableToken = parseInt(import.meta.env.VITE_PUBLIC_TOKEN_AUTH_ENABLE!);
  const enabledCertificate = parseInt(
    import.meta.env.VITE_PUBLIC_CERTIFICATE_AUTH_ENABLE!
  );
  const TokenProvider = enabledCertificate ? CertificateAuth : Fragment;
  const TokenProviderOld = enableToken ? TokenAuth : Fragment;

  return (
    <TokenProviderOld>
      <TokenProvider>
        <div id="__auth-layout" className="tw-h-[100vh] tw-flex tw-flex-col">
          <AuthHeader />
          <ErrorBoundary>
            <main className="tw-flex-grow">
              {children}
              {isAnimationAllowed > 0 && <SnowFlake />}
            </main>
            <AuthFooter />
          </ErrorBoundary>
        </div>
      </TokenProvider>
    </TokenProviderOld>
  );
};
