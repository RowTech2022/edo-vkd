import { FC, useContext, useEffect, useState } from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { CertificateContext } from "@components";
import { TokenControllContext } from "@root/components/auth/TokenAuth";

type callback = (e?: React.MouseEvent<HTMLButtonElement>) => void;

interface ICustomButton extends ButtonProps {
  withRuToken?: boolean;
  ruTokenTitle?: string;
  loading?: boolean;
  onClick: callback;
}

export const CustomButton: FC<ICustomButton> = (props) => {
  const {
    withRuToken = false,
    ruTokenTitle = "Требуеться флеш-ключ",
    children,
    loading = false,
    onClick,
    ...otherProps
  } = props;
  const [event, setEvent] = useState<any>(null);
  const { allowed, resetToken } = useContext(CertificateContext);
  const tokenControl = useContext(TokenControllContext);

  const enableToken = parseInt(import.meta.env.VITE_PUBLIC_TOKEN_AUTH_ENABLE!);
  const enableCertificate = parseInt(
    import.meta.env.VITE_PUBLIC_CERTIFICATE_AUTH_ENABLE!
  );

  const beforeOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (withRuToken && (enableToken || enableCertificate)) {
      if (enableToken) {
        tokenControl?.resetToken();
      } else {
        resetToken && resetToken();
      }
      setEvent(e);
    } else {
      onClick && onClick(e);
    }
  };

  useEffect(() => {
    if (allowed && event && onClick) {
      onClick(event);
      setEvent(null);
    }
  }, [allowed, event]);

  return (
    <>
      <Button
        sx={{ minWidth: "140px" }}
        {...otherProps}
        onClick={beforeOnClick}
      >
        {loading && <CircularProgress size={30} color="inherit" />} {children}
      </Button>
    </>
  );
};
