import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StyledCard, StyledCardHeader } from "./components";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import { formatDate } from "@utils";
import { axios } from "@configs";
import { CertificateListContext } from "../../app/App";

interface IProps {
  children?: ReactNode;
}

export const CERTIFICATE_API_URL = `${
  import.meta.env.VITE_PUBLIC_CERTIFICATE_API_URL
}certificates`;

interface ITokenInfo {
  allowed?: boolean;
  resetToken?: (backdrop?: boolean) => void;
}

export const certificateAllowedKey = "certificateAllowed";

export const setHeaders = (token) => {
  axios.defaults.headers.common["CertId"] = token.CertId;
  axios.defaults.headers.common["CertExpiry"] = token.ValidTo.toString();
  axios.defaults.headers.common["CertStartDate"] = token.ValidFrom.toString();
};

export const hasRequiredHeaders = () => {
  const certId = axios.defaults.headers.common["CertId"];
  const certExpiry = axios.defaults.headers.common["CertExpiry"];
  const certStartDate = axios.defaults.headers.common["CertStartDate"];

  if (!certId || !certExpiry || !certStartDate) {
    return false;
  }

  return true;
};

export const certificateControl = (
  key: "set" | "get" | "remove",
  value?: any
) => {
  switch (key) {
    case "get":
      let token = null;
      try {
        token = JSON.parse(localStorage.getItem(certificateAllowedKey));
      } catch {
        token = null;
      }
      return token;
    case "set":
      return localStorage.setItem(certificateAllowedKey, JSON.stringify(value));
    default:
      return localStorage.removeItem(certificateAllowedKey);
  }
};

export const CertificateContext = createContext<ITokenInfo>({});

export const CertificateAuth: FC<IProps> = ({ children }) => {
  const allowedCertificate = useRef(
    Boolean(localStorage.getItem(certificateAllowedKey))
  );
  const enableToken = parseInt(
    import.meta.env.VITE_PUBLIC_CERTIFICATE_AUTH_ENABLE!
  );

  const certs = useContext(CertificateListContext) ?? [];

  const modalRef = useRef<any>();
  const contentRef = useRef<any>();

  const [tokenInfo, setTokenInfo] = useState<ITokenInfo>({
    allowed: allowedCertificate.current || false,
  });
  const [modalEnabled, setModalEnabled] = useState(!allowedCertificate.current);
  const [hideOnBackdrop, setHideOnBackdrop] = useState(false);

  const [values, setValues] = useState<{ cert: any; pin: string }>({
    cert: null,
    pin: "",
  });

  const tokenControlls = {
    allowed: tokenInfo?.allowed || false,
    resetToken(backdrop = true) {
      certificateControl("remove");
      setTokenInfo(null);
      setModalEnabled(true);
      setHideOnBackdrop(backdrop);
    },
  };

  const login = () => {
    if (!values.cert) {
      toast.error("Сертификат не выбран");
      return;
    }

    const selected = certs.find((item) => item.CertId === values.cert.value);

    if (selected) {
      setHeaders(selected);

      certificateControl("set", selected);
    }

    toast.success("Сертификат успешно принят");
    setTokenInfo({ allowed: true });
    setModalEnabled(false);
    allowedCertificate.current = true;
  };

  const onOutsideClick = () => {
    if (!hideOnBackdrop) return;
    setModalEnabled(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: Event) => {
      const target = e.target;
      if (
        target === modalRef.current ||
        target === modalRef.current?.firstChild
      ) {
        onOutsideClick && onOutsideClick();
      }
    };
    if (onOutsideClick && contentRef.current) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [contentRef.current]);

  if (!hasRequiredHeaders() && !modalEnabled && enableToken) {
    setModalEnabled(true);
  }

  return (
    <CertificateContext.Provider value={tokenControlls}>
      <Modal ref={modalRef} open={modalEnabled} setOpen={setModalEnabled}>
        <StyledCard ref={contentRef}>
          <StyledCardHeader title={"Подтвердите сертификат"} />
          <CardContent>
            <form>
              <Stack spacing={3}>
                <Autocomplete
                  disablePortal
                  value={values.cert}
                  onChange={(_, cert) => {
                    setValues({ ...values, cert });
                  }}
                  id="combo-box-demo"
                  componentsProps={{
                    paper: {
                      sx: {
                        maxHeight: "150px",
                      },
                    },
                  }}
                  options={
                    certs
                      ?.filter(
                        (item) => new Date(item.ValidTo) > new Date(Date.now())
                      )
                      .map((item) => ({
                        label: `${item.For} (${formatDate(item.ValidTo)})`,
                        value: item.CertId,
                      })) || []
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Сертификаты" />
                  )}
                />
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  onClick={login}
                  fullWidth
                  className="tw-mt-[100px]"
                >
                  Войти
                </LoadingButton>
              </Stack>
            </form>
          </CardContent>
        </StyledCard>
      </Modal>
      {children}
    </CertificateContext.Provider>
  );
};
