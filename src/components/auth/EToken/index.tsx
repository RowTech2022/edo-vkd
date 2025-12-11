import {
  FC,
  memo,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import { getEtokenPlugin } from "./plugin";
import { useFormik } from "formik";
import { Autocomplete } from "@mui/material";
import { toast } from "react-toastify";
import { formatDate } from "@utils";

interface LoginProps {
  children?: ReactNode;
  title?: string;
  id?: string;
  onSuccess?: (data: TokenInfo) => void;
  onOutsideClick?: () => void;
}

interface IDevice {
  id: number;
  tokenExists: boolean;
  device: {
    formFactor: string;
    model: string;
    modelFriendlyName: string;
    name: string;
    serialNumber: string;
  };
}

interface ISelectOption {
  label: string;
  value: number;
}

export interface FormProps {
  pin: string;
  deviceId?: ISelectOption | null;
  certId?: ISelectOption | null;
}

interface Certificate {
  id: number;
  description: string;
}

const TokenComponent: FC<LoginProps> = ({
  title = "Требуется сертификат(E-token или Rutoken)",
  id,
  onSuccess,
  onOutsideClick,
}) => {
  const contentRef: RefObject<any> = useRef(null);
  const modalRef: RefObject<any> = useRef(null);

  const [etokenPlugin, setEtokenPlugin] = useState<any>(null);

  /**
   * devices will be obtained from etokenPlugin
   * and will be setted to this state
   */
  const [devices, setDevices] = useState<IDevice[]>([]);

  const [tokenID, setTokenID] = useState<number>(0);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [certId, setCertId] = useState<number>(0);

  const [login, setLogin] = useState(false);

  const getCertificateData = (params?: { id?: number; tokenId?: number }) => {
    const { id, tokenId } = params || {};
    if (etokenPlugin && (id || certId)) {
      const body = etokenPlugin.getCertificateBody({
        args: {
          id: id || certId,
          tokenID: tokenId || tokenID,
        },
      });

      return etokenPlugin.parseX509Certificate({
        args: {
          id: certId,
          tokenID,
          cert: body,
        },
      });
    }

    return null;
  };

  const isCertValid = (certData: any) => {
    const beginDate = certData.Data.Validity["Not Before"];
    const endDate = certData.Data.Validity["Not After"];

    return beginDate <= Date.now() && Date.now() <= endDate;
  };

  const toHex = (arr: number[]) =>
    arr
      .map((item) => {
        const hex = item.toString(16);
        if (hex.length === 1) return `0${hex}`;
        return hex;
      })
      .join("");

  const tokenLogin = (pin: string) => {
    if (etokenPlugin) {
      setLogin(true);
      new Promise((resolve, reject) => {
        try {
          etokenPlugin.bindToken({
            args: {
              tokenID,
              pin,
            },
          });
          const cert = getCertificateData();

          if (cert && !isCertValid(cert)) {
            toast.error("Выбранный сертификат просрочен");
            return;
          }

          if (onSuccess && cert) {
            onSuccess({
              startDate: new Date(
                cert.Data.Validity["Not Before"]
              ).toISOString(),
              expiryDate: new Date(
                cert.Data.Validity["Not After"]
              ).toISOString(),
              certId: toHex(cert.Data["Serial Number"]),
              deviceId: tokenID,
            });
          }
          resolve(true);
        } catch (err) {
          console.log(err);
          reject(false);
        }
      })
        .then(() => toast.success("ПИН-код успешно принят"))
        .catch(() => toast.error("Некорректный PIN-код"))
        .finally(() => setLogin(false));
    }
  };

  const {
    handleSubmit,
    handleChange,
    setFieldValue,
    values,
    errors,
    setErrors,
  } = useFormik<FormProps>({
    initialValues: {
      pin: "",
      certId: null,
    },
    onSubmit(values) {
      if (!values.certId) {
        toast.error("Сертификат не выбран");
        return;
      }
      tokenLogin(values.pin);
    },
  });

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

  useEffect(() => {
    getEtokenPlugin()
      .then((plugin) => setEtokenPlugin(plugin))
      .catch((err) => console.log(err));
  }, []);

  const getAllCerts = (tokenId: number) => {
    if (etokenPlugin) {
      const certs = etokenPlugin.getStandaloneCertificateList({
        args: {
          tokenID: tokenId,
        },
      }) as Certificate[];
      if (certs) {
        let certOptions = certs;
        try {
          certOptions = certs
            .map(({ id }) => {
              const certBody = getCertificateData({ tokenId, id });

              const expiryDate = new Date(certBody.Data.Validity["Not After"]);
              if (expiryDate.getTime() < Date.now()) return null;

              const { Data } = certBody || {};
              const subject =
                Data?.Subject?.find((item: any) => {
                  if (typeof item === "object") {
                    return item.rdn === "CN";
                  }
                  return false;
                })?.value || "Unknown";
              return {
                id,
                description: `${
                  Data?.Issuer[0]?.value
                } ${subject} (${formatDate(expiryDate.toString())})`,
              };
            })
            .filter((item) => item) as Certificate[];
        } catch (err) {
          console.log("Error: ", err);
        }
        setCerts(certOptions);
      }
    }
  };

  const addDevices = () => {
    const devices: Array<any> = etokenPlugin.getAllSlots();
    setDevices(devices);
  };

  useEffect(() => {
    return () => {
      const state = etokenPlugin && etokenPlugin.getLoggedInState().state;
      if (
        etokenPlugin &&
        etokenPlugin.Vars &&
        etokenPlugin.Vars.AuthState.binded === state
      ) {
        etokenPlugin.unbindToken();
      }
    };
  }, [etokenPlugin, id]);

  useEffect(() => {
    if (etokenPlugin) {
      addDevices();
      const id = setInterval(addDevices, 3000);
      return () => {
        clearInterval(id);
      };
    }
    return () => {};
  }, [etokenPlugin, id]);

  return (
    <Modal ref={modalRef} open>
      <StyledCard ref={contentRef}>
        <StyledCardHeader title={title} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Autocomplete
                disablePortal
                value={values.deviceId}
                onChange={(_, value) => {
                  const tokenID = value?.value as number;
                  setFieldValue("deviceId", value);
                  setTokenID(tokenID);
                  getAllCerts(tokenID);
                }}
                id="combo-box-demo"
                options={
                  devices &&
                  devices.map(({ id, device: { modelFriendlyName } }) => ({
                    label: modelFriendlyName,
                    value: id,
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Доступные устройство" />
                )}
              />

              <Autocomplete
                disablePortal
                value={values.deviceId}
                onChange={(_, value) => {
                  if (value) {
                    setFieldValue("certId", value);
                    setCertId(value?.value);
                  }
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
                  certs &&
                  certs.map(({ id, description }) => ({
                    label: description,
                    value: id,
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Сертификаты" />
                )}
              />
              <TextField
                name="pin"
                label="PIN-код"
                value={values.pin}
                error={!!errors.pin}
                helperText={errors.pin}
                required
                fullWidth
                onChange={handleChange}
              />
              <LoadingButton
                type="submit"
                variant="outlined"
                loading={login}
                fullWidth
              >
                Войти
              </LoadingButton>
            </Stack>
          </form>
        </CardContent>
      </StyledCard>
    </Modal>
  );
};

export default memo(TokenComponent);
