import LoginForms from "@root/components/auth";
import { RuTokenContext } from "@root/components/auth/RuToken";
import { AuthLayout } from "@layouts";
import { useContext, useEffect, useState } from "react";
import { clearRedirectUrl, getRedirectUrl } from "@utils";
import { useNavigate } from "react-router";
import { useSession } from "@hooks";
import { AppRoutes } from "@configs";

let interval: NodeJS.Timeout;

export const LoginPage = () => {
  const [modal, setModal] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const rutoken = useContext(RuTokenContext);
  const navigate = useNavigate();
  const { status } = useSession();

  useEffect(() => {
    if (rutoken !== undefined && status === "unauthenticated") {
      interval = setInterval(() => {
        rutoken.getDevices().then((devices) => {
          setModal(!!devices.length);
        });
      }, 500);
    }
    return () => {
      clearInterval(interval);
    };
  }, [rutoken, status]);

  useEffect(() => {
    if (status === "authenticated") {
      const redirectUrl = getRedirectUrl();
      navigate(AppRoutes.USERS_PROFILE || redirectUrl);
      clearRedirectUrl();
    }
  }, [status]);

  return (
    <AuthLayout>
      <LoginForms token={tokenInfo} />
    </AuthLayout>
  );
};
