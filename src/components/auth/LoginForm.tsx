import { AxiosError } from "axios";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LockIcon from "@mui/icons-material/Lock";
import SourceIcon from "@mui/icons-material/Source";
import EmailIcon from "@mui/icons-material/Email";
import classNames from "classnames";
import { PrimaryButton, CustomField } from "@ui";
import { memo, SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { domains, userGroups, getFieldErrors } from "@utils";
import { useFormik } from "formik";
import { axios, mapException } from "@configs";
import CircularProgress from "@mui/material/CircularProgress";
// import { number, object, string } from 'yup'

type UserGroup = {
  id: string | number;
  name: string;
};

type Props = {
  userGroup: UserGroup;
  onLogin: Function;
  loading?: boolean;
  disabled?: boolean;
  hovered?: boolean;
  error?: boolean;
  errorMsg?: string;
  onClick?: () => void;
  resetError: () => void;
  mode: any;
};

const digitRegexp = /^[0-9]{0,12}$/;

const DIGITS_ONLY_REGEX = /^\d*$/;

const LoginForm = (props: Props) => {
  const [telOrEmail, setTelOrEmail] = useState("");

  const [codeHasBeenSent, setCodeHasBeenSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotCodeVerified, setForgotCodeVerified] = useState(false);

  const formik = useFormik({
    initialValues: {
      login: "992",
      password: "",
      phoneOrMail: "",
      code: "",
      userGroup: props.userGroup?.id,
      domain: domains[0].value,
      newPassWord: "",
      confirmPassword: "",
      userType: "",
    },
    // validationSchema,
    onSubmit: async (credentials) => {
      setLoading(true);

      if (isForgotPassword) {
        if (!codeHasBeenSent) {
          await requestCode();
          setCodeHasBeenSent(true);
        } else {
          const errors: any = {};
          if (!credentials.newPassWord) {
            errors.newPassWord = "Обязательное поле";
          } else if (credentials.newPassWord.length < 8) {
            errors.newPassWord = "Минимум 8 символов";
          }
          if (!credentials.confirmPassword) {
            errors.confirmPassword = "Обязательное поле";
          } else if (credentials.confirmPassword.length < 8) {
            errors.confirmPassword = "Минимум 8 символов";
          }
          if (
            credentials.newPassWord &&
            credentials.confirmPassword &&
            credentials.newPassWord !== credentials.confirmPassword
          ) {
            errors.newPassWord = "Пароли не совпадают";
            errors.confirmPassword = "Пароли не совпадают";
          }

          if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            setLoading(false);
            return;
          }

          try {
            await axios.post("/api/user/resetPassword", {
              login: values.login,
              newPassWord: values.newPassWord,
              confirmPassword: values.confirmPassword,
              code: values.code,
              userType: 1,
            });
            toast.success("Пароль успешно изменен");
            setIsForgotPassword(false);
            resetForm();
          } catch (err) {
            const error = err as AxiosError;
            if (error.response && error.response.data) {
              toast.error(error.response.data.Message);
            }
          }
        }

        setLoading(false);
        return;
      } else {
        const errors: any = {};
        if (!credentials.password) {
          errors.password = "Обязательное поле";
        } else if (credentials.password.length < 8) {
          errors.password = "Минимум 8 символов";
        }

        if (!credentials.login) {
          errors.login = "Обязательное поле";
        }

        if (Object.keys(errors).length > 0) {
          formik.setErrors(errors);
          setLoading(false);
          return;
        }

        if (codeHasBeenSent) {
          props.onLogin(credentials);
          setLoading(false);
        } else {
          await requestCode();
        }
      }
    },
  });

  const { values, setFieldValue, setFieldTouched } = formik;

  const handleFormSubmit = async (event: SyntheticEvent) => {
    props.resetError();
    event.preventDefault();
    formik.submitForm();
  };

  const resetForm = () => {
    formik.resetForm();
    setCodeHasBeenSent(false);
    setTelOrEmail("");
  };

  const checkCode = async (code: string) => {
    try {
      const response = await axios.post("api/Auth/checkcode", {
        login: values.login,
        authType: 1,
        code,
      });
      toast.success("Код подтвержден");
      setForgotCodeVerified(true);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data?.Message) {
        toast.error(error.response.data.Message);
      }
    }
  };

  const requestCode = async () => {
    setLoading(true);
    try {
      const phoneOrMail =
        (values.userGroup == 1 && values.phoneOrMail) ||
        (values.userGroup == 2 && values.phoneOrMail) ||
        (values.userGroup == 3 &&
          values.phoneOrMail &&
          `${values.phoneOrMail}@${values.domain}`);

      const response = await axios.post(
        "api/Auth/getcode",
        {
          login: values.login,
          userType: values.userGroup,
          phoneOrMail,
        },
        {
          headers: {
            User: values.login,
          },
        }
      );

      if (response.status === 200) {
        setCodeHasBeenSent(true);
        toast.success("Код успешно отправлен");
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.data) {
        if ("Exception" in error.response.data) {
          toast.error(
            mapException[error.response.data.Message] ||
              error.response.data.Message
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetForm();
  }, [props.disabled]);

  const isPhoneAvailable =
    values.userGroup == 1 || values.userGroup == 2 || values.userGroup == 5;

  let endIcon: any = (
    <FormControl
      fullWidth
      sx={{
        width: "100%",
        maxWidth: "120px",

        "& .MuiInputBase-root": {
          border: "none !important",
        },

        "& .MuiSelect-select": {
          width: "120px",
        },

        "& fieldset": {
          border: "none !important",
        },
      }}
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={values.domain}
        label="Age"
        onChange={(e: SelectChangeEvent) => {
          setFieldValue("domain", e.target.value);
        }}
        MenuProps={{
          sx: {
            "& .MuiList-root": {
              padding: "0 !important",
            },

            "& .MuiMenuItem-root": {
              px: "10px !important",
            },
          },
        }}
      >
        {domains.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const isFinanceGroup = props.userGroup.id === userGroups.curators.id;
  if (!isFinanceGroup) {
    endIcon = null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          // marginRight: "20px",
        }}
      >
        {props.error && (
          <p className="tw-py-4 tw-text-redribbon"> {props.errorMsg} </p>
        )}
        <form
          onClick={props.onClick}
          className={classNames(
            " tw-relative tw-px-9 tw-pb-[51px] tw-pt-[26px] tw-box-border ",
            { "tw-bg-[#f7f7fc]": props.hovered }
          )}
          onSubmit={handleFormSubmit}
        >
          {/* <h2 className="tw-text-black tw-text-lg tw-font-bold tw-text-center tw-mb-6">
            {props.userGroup?.name}
          </h2> */}
          <Box minHeight={"290px"} overflow={"hidden"} position={"relative"}>
            {isForgotPassword ? (
              <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                <CustomField
                  name="login"
                  label="Логин"
                  required
                  StartIcon={PersonIcon}
                  value={values.login}
                  disabled={codeHasBeenSent && !props.error}
                  onChange={(login: string) => {
                    const onlyDigits = login.replace(/\D/g, "");
                    if (!onlyDigits.startsWith("992")) return;
                    const trimmed = onlyDigits.slice(0, 12);
                    setFieldValue("login", trimmed);
                    if (isFinanceGroup) {
                      setFieldValue("phoneOrMail", trimmed);
                    }
                  }}
                  {...getFieldErrors(formik, "login")}
                />
                <CustomField
                  label="Код"
                  type="text"
                  required
                  StartIcon={SourceIcon}
                  value={values.code}
                  placeholder="Код"
                  disabled={!codeHasBeenSent}
                  onChange={(value: string) => {
                    const isOnlyDigit = DIGITS_ONLY_REGEX.test(value);
                    if (isOnlyDigit && value.length <= 4) {
                      setFieldValue("code", value);

                      if (value.length === 4) {
                        checkCode(value);
                      }
                    }
                  }}
                />

                <CustomField
                  label="Новый пароль"
                  type="password"
                  disabled={!forgotCodeVerified}
                  StartIcon={LockIcon}
                  //@ts-ignore
                  value={values.newPassWord}
                  onChange={(val: string) => setFieldValue("newPassWord", val)}
                  {...getFieldErrors(formik, "newPassWord")}
                />
                <CustomField
                  label="Подтвердите пароль"
                  type="password"
                  disabled={!forgotCodeVerified}
                  StartIcon={LockIcon}
                  //@ts-ignore
                  value={values.confirmPassword}
                  onChange={(val: string) =>
                    setFieldValue("confirmPassword", val)
                  }
                  {...getFieldErrors(formik, "confirmPassword")}
                />
              </Box>
            ) : (
              <>
                <Box
                  sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}
                >
                  <CustomField
                    name="login"
                    label="Логин"
                    required
                    StartIcon={PersonIcon}
                    value={values.login}
                    autoComplete="off"
                    disabled={codeHasBeenSent && !props.error}
                    onChange={(login: string) => {
                      const onlyDigits = login.replace(/\D/g, "");
                      if (!onlyDigits.startsWith("992")) return;
                      const trimmed = onlyDigits.slice(0, 12);
                      setFieldValue("login", trimmed);
                      if (isFinanceGroup) {
                        setFieldValue("phoneOrMail", trimmed);
                      }
                    }}
                    {...getFieldErrors(formik, "login")}
                  />
                  <CustomField
                    name="password"
                    label="Password"
                    required
                    type={passwordVisible ? "text" : "password"}
                    StartIcon={LockIcon}
                    autoComplete="new-password"
                    endIcon={
                      <IconButton
                        sx={{
                          position: "absolute",
                          right: "10px",
                          borderRadius: "100% !important",
                          border: "none !important",
                        }}
                        onClick={() => {
                          !(codeHasBeenSent && !props.error) &&
                            setPasswordVisible(!passwordVisible);
                        }}
                      >
                        {passwordVisible ? (
                          <VisibilityIcon
                            sx={{
                              color:
                                codeHasBeenSent && !props.error
                                  ? "#C2C2C2"
                                  : "#009688",
                            }}
                          />
                        ) : (
                          <VisibilityOffIcon
                            sx={{
                              color:
                                codeHasBeenSent && !props.error
                                  ? "#C2C2C2"
                                  : "#009688",
                            }}
                          />
                        )}
                      </IconButton>
                    }
                    value={values.password}
                    disabled={codeHasBeenSent && !props.error}
                    onChange={(value: string) => {
                      setFieldValue("password", value);
                    }}
                    {...getFieldErrors(formik, "password")}
                  />
                  {/* <CustomField
                    label={isPhoneAvailable ? "Моб. номер" : "Эл. почта"}
                    type="text"
                    required
                    StartIcon={isPhoneAvailable ? LocalPhoneIcon : EmailIcon}
                    disabled={codeHasBeenSent && !props.error}
                    value={values.phoneOrMail}
                    endIcon={endIcon}
                    onBlur={() => setFieldTouched("phoneOrMail", true)}
                    onChange={(value: string) => {
                      if (isFinanceGroup) return;
                      const isOnlyDigit = digitRegexp.test(value);
                      if (isPhoneAvailable && !isOnlyDigit) {
                        return;
                      }
                      let valueWithCountryCode = value;
                      if (isPhoneAvailable) {
                        if (valueWithCountryCode.length === 3) {
                          setFieldValue("phoneOrMail", "");
                          return;
                        }

                        if (!valueWithCountryCode.startsWith("992")) {
                          valueWithCountryCode = "992" + valueWithCountryCode;
                        }
                      }

                      setFieldValue("phoneOrMail", valueWithCountryCode);
                    }}
                    {...getFieldErrors(formik, "phoneOrMail")}
                  /> */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{ flex: 2 }}>
                      <CustomField
                        label="Код"
                        type="text"
                        required
                        StartIcon={SourceIcon}
                        value={values.code}
                        placeholder="Код"
                        disabled={!codeHasBeenSent}
                        onChange={(value: string) => {
                          const isOnlyDigit = DIGITS_ONLY_REGEX.test(value);
                          if (isOnlyDigit && value.length <= 4) {
                            setFieldValue("code", value);

                            if (value.length === 4) {
                              checkCode(value);
                            }
                          }
                        }}
                      />
                    </Box>
                    {codeHasBeenSent && (
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          mt: "-25px",
                        }}
                      >
                        <PrimaryButton
                          type="button"
                          onClick={requestCode}
                          className="tw-rounded-full tw-py-2 tw-text-sm"
                          // loading={loading}
                        >
                          Отправить ещё раз
                        </PrimaryButton>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            )}

            <Box sx={{ textAlign: "center" }}>
              <Button
                onClick={async () => {
                  if (isForgotPassword) {
                    await requestCode();
                  } else {
                    setIsForgotPassword(true);
                    resetForm();
                  }
                }}
                disabled={
                  loading ||
                  (isForgotPassword ? values.login.length !== 12 : false)
                }
                variant={
                  isForgotPassword && !codeHasBeenSent
                    ? "contained"
                    : "outlined"
                }
                startIcon={
                  isForgotPassword && loading ? (
                    <CircularProgress size={18} />
                  ) : null
                }
              >
                {isForgotPassword ? "Отправить код" : "Забыли пароль"}
              </Button>
            </Box>
          </Box>
          <div className="tw-flex tw-gap-4 tw-absolute -tw-bottom-[22px] tw-left-1/2 -tw-translate-x-1/2">
            <PrimaryButton
              type="submit"
              className="tw-w-[190px] tw-rounded-full"
              variant={
                isForgotPassword && !codeHasBeenSent ? "outlined" : "contained"
              }
              disabled={
                loading ||
                props.loading ||
                (!isForgotPassword && values.login.length !== 12) ||
                (!isForgotPassword &&
                  codeHasBeenSent &&
                  (!forgotCodeVerified || values.code.length !== 4))
              }
              loading={!isForgotPassword && (props.loading || loading)}
              onClick={() => {
                if (isForgotPassword && !codeHasBeenSent) {
                  setIsForgotPassword(false);
                  resetForm();
                }
              }}
            >
              {isForgotPassword
                ? codeHasBeenSent
                  ? "Сменить пароль"
                  : "Войти"
                : codeHasBeenSent
                ? "Войти"
                : "Отправить код"}
            </PrimaryButton>
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default memo(LoginForm);
