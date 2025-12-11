import{ FC, Fragment, ReactNode, useState } from "react";
import ETokenLogin from "./";
import { axios } from "@configs";

interface IETokenAuth {
  children?: ReactNode;
}
export const ETokenAuth: FC<IETokenAuth> = ({ children }) => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const onSuccess = (token: TokenInfo) => {
    axios.defaults.headers.common["CertId"] = token.certId.toString();
    axios.defaults.headers.common["CertExpiry"] = token.expiryDate.toString();
    setTokenInfo(token);
  };

  return (
    <Fragment>
      {!tokenInfo && <ETokenLogin onSuccess={onSuccess} />}
      {tokenInfo && children}
    </Fragment>
  );
};
