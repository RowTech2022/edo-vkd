import LoadingButton from "@mui/lab/LoadingButton";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import { useFormik } from "formik";
import {
  memo,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RdnValue, RuTokenPlugin } from "./plugin";
import { toast } from "react-toastify";
import { RutokenPluginContext } from "../TokenAuth";
import { formatDate } from "@utils";

interface LoginProps {
  title?: string;
  rutoken?: any;
  onSuccess: (data: TokenInfo) => void;
  onOutsideClick?: () => void;
}

interface ISelectOption {
  value: number | string;
  label: string;
}

export interface FormProps {
  pin: string;
  deviceId?: number;
  certId?: string;
  device: null | ISelectOption;
  cert: null | ISelectOption;
}

interface Certificate {
  id: string;
  startDate: string;
  expiryDate: string;
  serialNumber?: string;
  issuer?: RdnValue;
  subject?: RdnValue;
}

export default memo(function RutokenLogin({
  title = "Требуется сертификат(E-token или Rutoken)",
  onOutsideClick,
  onSuccess,
}: LoginProps) {
  const contentRef: RefObject<any> = useRef(null);
  const modalRef: RefObject<any> = useRef(null);
  const [devices, setDevices] = useState<number[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [login, setLogin] = useState(false);
  const rutoken = useContext(RutokenPluginContext) as RuTokenPlugin;
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
      device: null,
      cert: null,
    },
    onSubmit(values) {
      if (!values.cert || !values.certId) {
        toast.error("Сертификат не выбран");
        return;
      }

      setLogin(true);
      // rutoken?.pluginObject?.logout(values.deviceId as number)
      rutoken?.pluginObject.login(values.deviceId!, values.pin).then(
        () => {
          const certFounded = certs.find(({ id }) => id === values.certId);
          onSuccess({
            startDate: certFounded?.startDate || "",
            expiryDate: certFounded?.expiryDate || "",
            deviceId: values.deviceId!,
            certId:
              certFounded?.serialNumber?.split(":").join("").toLowerCase() ||
              "",
          });
          toast.success("ПИН-код успешно принят");
          rutoken?.pluginObject.logout(values.deviceId as number);
        },
        (err) => {
          console.log("Error: ", err);
          setLogin(false);
          setErrors({ pin: "Некорректный PIN-код" });
          toast.error("Некорректный PIN-код");
        }
      );
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
    let timerId = setInterval(() => {
      rutoken?.getDevices().then((devices) => {
        setDevices(devices.map((item) => item.id));
      });
    }, 2000);

    return () => {
      clearInterval(timerId);
    };
  }, [rutoken]);

  useEffect(() => {
    if (values.deviceId !== undefined) {
      rutoken?.getCertificates(values.deviceId).then((certificates) => {
        setCerts(
          certificates
            .map((item) => ({
              id: item.serialNumber,
              serialNumber: item.serialNumber,
              startDate: item.validNotBefore,
              expiryDate: item.validNotAfter,
              issuer: item.issuer.find((item) => item.rdn === "commonName"),
              subject: item.subject.find((item) => item.rdn === "commonName"),
            }))
            .filter((item) => {
              const date = new Date(item.expiryDate);
              return date.getTime() > Date.now();
            })
        );
      });
    }
  }, [rutoken, values.deviceId]);

  return (
    <Modal sx={{ borderRadius: "35px" }} ref={modalRef} open>
      <StyledCard ref={contentRef}>
        <StyledCardHeader title={title} />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Autocomplete
                disablePortal
                value={values.device}
                onChange={(_, value) => {
                  if (value) {
                    setFieldValue("deviceId", value.value);
                    setFieldValue("device", value);
                  }
                }}
                id="combo-box-demo"
                options={
                  devices &&
                  devices.map((deviceId) => ({
                    label: `Rutoken ECP #${deviceId}`,
                    value: deviceId,
                  }))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Доступные устройство" />
                )}
              />

              <Autocomplete
                disablePortal
                value={values.cert}
                onChange={(_, value) => {
                  if (value) {
                    setFieldValue("certId", value.value);
                    setFieldValue("cert", value);
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
                  certs.map((item) => ({
                    label: `${item.issuer?.value} ${
                      item.subject?.value
                    } (${formatDate(item.expiryDate)})`,
                    value: item.id,
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
});
