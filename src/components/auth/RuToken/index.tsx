import {
  ReactNode,
  createContext,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RuTokenPlugin } from "./plugin";
import RutokenLogin from "./login";
import { TokenType } from "../TokenAuth";
import { axios, signOut } from "@configs";
import { removeTokenChecked } from "@utils";
import { useSession } from "@hooks";

let timer: NodeJS.Timer;
export const RuTokenContext = createContext<RuTokenPlugin | undefined>(
  undefined
);

export default memo(function RuTokenAuth({
  children,
  setTokenType,
  plugin,
}: {
  setTokenType?: (value: TokenType | null) => void;
  children: ReactNode;
  plugin: RuTokenPlugin;
}) {
  const { data, status } = useSession();

  useEffect(() => {
    if (
      status === "authenticated" &&
      plugin &&
      data &&
      data.rutoken !== undefined
    ) {
      timer = setInterval(() => {
        const { certId, deviceId } = data.rutoken!;
        plugin.pluginObject.enumerateDevices().then((deviceIds) => {
          if (deviceIds && deviceIds.length) {
            setTokenType && setTokenInfo(TokenType.rutoken);
          }
          if (deviceIds.length === 0) signOut();
          if (deviceIds.includes(deviceId)) {
            plugin.pluginObject
              .enumerateCertificates(
                deviceId,
                plugin.pluginObject.CERT_CATEGORY_USER
              )
              .then(
                (certIds) => {
                  if (!certIds.includes(certId)) {
                    removeTokenChecked();
                    signOut();
                  }
                },
                () => {
                  removeTokenChecked();
                  signOut();
                }
              );
          }
        });
      }, 3000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [data, plugin, status]);

  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const onSuccess = (token: TokenInfo) => {
    axios.defaults.headers.common["CertId"] = token.certId.toString();
    axios.defaults.headers.common["CertExpiry"] = token.expiryDate.toString();
    setTokenInfo(token);
  };

  return useMemo(
    () => (
      <>
        {!tokenInfo ? (
          <RutokenLogin rutoken={plugin} onSuccess={onSuccess} />
        ) : (
          children
        )}
      </>
    ),
    [children, plugin, tokenInfo]
  );
});
