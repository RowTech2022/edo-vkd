import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import LoginForm from "@root/components/auth/LoginForm";
import { Fragment, memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userGroups } from "@utils";
import AuthForgotPasswordModal from "./ForgotPasswordModal";
import {
  AppRoutes,
  axios,
  getNewExpiredDateTime,
  saveAccessToken,
} from "@configs";
import { useNavigate } from "react-router";
import { certificateControl } from "..";
import { useAppSelector } from "@root/store/hooks";
import "./styles.css";
type CredentialsType = {
  login: string;
  password: string;
  code: number;
  userGroup: number;
};

export default memo(function Login({ token }: { token?: TokenInfo }) {
  const [activeForm, setActiveForm] = useState(
    userGroups.budgetOrganization.id
  );
  const [hoveredForm, setHoveredForm] = useState(
    userGroups.budgetOrganization.id
  );
  const mode = useAppSelector((state) => state.snackbar.mode);
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const authorize = async (credentials: any | undefined) => {
    const data = {
      userLogin: credentials?.userLogin,
      password: credentials?.password,
      type: parseInt(`${credentials?.type}`),
      code: parseInt(`${credentials?.code}`),
    } as Record<"type" | "userLogin" | "password" | "code", string | number>;
    try {
      const headers: Record<string, string> = {};
      if (
        credentials?.certId &&
        credentials?.deviceId &&
        credentials?.expiryDate
      ) {
        headers["CertId"] = credentials.certId.toString();
        headers["CertExpiry"] = credentials.expiryDate.toString();
      }
      const tokensResponse = await axios.post("api/Auth/login", data, {
        headers,
      });

      if (tokensResponse.status === 200) {
        const token = {
          ...tokensResponse.data,
          expiredDateTime: getNewExpiredDateTime(tokensResponse.data),
        };

        saveAccessToken(token);

        navigate(AppRoutes.USERS_PROFILE);

        return token;
      }
    } catch (error: any) {
      if (typeof error === "object" && error && "response" in error) {
        return { error: error.response?.data.Message };
      }

      return { error: "Произошла ошибка аутентификации" };
    }
  };

  const login = async (credentials: CredentialsType) => {
    setLoading(true);
    const configHeaders = {
      redirect: false,
      userLogin: credentials.login,
      password: credentials.password,
      code: credentials.code,
      type: credentials.userGroup,
      ...token,
    };

    const response = (await authorize(configHeaders))!;

    const { error } = response;

    if (error) {
      setErrorMsg(error);
      setError(true);
      toast.error(error);
    } else {
      setErrorMsg("");
      setError(false);
    }

    setLoading(false);
    return 0;
  };

 const [active, setActive] = useState(1);


  const getAnimateClass = (idx: number) => {
    if (active === -1) return "";

    if (idx === active) return `form-center--${idx}`;

    return "";
  };

  const resetError = () => setErrorMsg("");

  useEffect(() => {
    certificateControl("remove");
  }, []);

  return (
    <Fragment>
      <div
        style={{
          background:
            mode === null
              ? "linear-gradient(90deg, #F3E7E9 0%, #E3EEFF 99%, #E3EEFF 100%)"
              : mode === "light"
              ? "#010223"
              : "linear-gradient(90deg, #F3E7E9 0%, #E3EEFF 99%, #E3EEFF 100%)",
          transition: "all .3s ease-out",
          position: "relative",
          // left: active !== -1 ? "50%" : 0,
          // width: active !== -1 ? "50%" : "100%",
          left: 0,
          width: "100%",
        }}
        className="max-md:tw-left-0 max-md:tw-w-full new-bg-gradient"
      >
        {/* <div
          className={`tw-bg-mf-login-bg tw-bg-no-repeat tw-bg-cover tw-bg-center tw-absolute tw-w-[100%] tw-h-[100%] tw-top-0 -tw-left-[100%]`}
        /> */}
        {/* {active !== -1 && (
          <IconButton
            onClick={() => setActive(-1)}
            size="large"
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 999,
            }}
          >
            <CloseIcon sx={{ fontSize: '40px' }} />
          </IconButton>
        )} */}
        <div className="tw-container">
          <div className="tw-flex tw-justify-center tw-w-full">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "calc(100vh - 98px)",
                minWidth: "380px",
              }}
            >
              <div className="tw-bg-[white] tw-rounded-[35px] ">
                <div className="tw-flex tw-justify-center tw-flex-col tw-mt-[30px]">
                  <p className="tw-text-center tw-font-medium">Вход</p>
                  {/* <FormControl
                    className="custom-select"
                    sx={{ width: "70%", margin: "auto" }}
                  >
                    <InputLabel>Тип организации</InputLabel>
                    <Select
                      className="custom-select"
                      fullWidth
                      value={active}
                      label="Тип организации"
                      // @ts-ignore
                      onChange={(e) => {
                        setActive(+e.target.value);
                        localStorage.setItem(
                          "activeOrgTip",
                          JSON.stringify(e.target.value)
                        );
                      }}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <MenuItem value={1}>Государсвенные учреждение</MenuItem>
                      <MenuItem value={2}>Коммерческая орнанизация</MenuItem>
                    </Select>
                  </FormControl> */}
                  {active === -1 && (
                    <div
                      className={`xl:tw-col-span-3 tw-w-[380px] flex-1 form-transition ${getAnimateClass(
                        1
                      )}`}
                      onMouseOver={() =>
                        setHoveredForm(userGroups.budgetOrganization.id)
                      }
                      onFocus={() =>
                        setActiveForm(userGroups.budgetOrganization.id)
                      }
                    >
                      <LoginForm
                        mode={mode}
                        onClick={() => setActive(1)}
                        userGroup={userGroups.budgetOrganization}
                        hovered={
                          hoveredForm !== userGroups.budgetOrganization.id
                        }
                        disabled={
                          activeForm !== userGroups.budgetOrganization.id
                        }
                        loading={
                          activeForm === userGroups.budgetOrganization.id &&
                          loading
                        }
                        error={
                          activeForm === userGroups.budgetOrganization.id &&
                          error
                        }
                        errorMsg={errorMsg}
                        onLogin={login}
                        resetError={resetError}
                      />
                    </div>
                  )}
                </div>
                {active === 1 && (
                  <div
                    className={`xl:tw-col-span-3 tw-w-[380px] flex-1 form-transition ${getAnimateClass(
                      1
                    )}`}
                    onMouseOver={() =>
                      setHoveredForm(userGroups.budgetOrganization.id)
                    }
                    onFocus={() =>
                      setActiveForm(userGroups.budgetOrganization.id)
                    }
                  >
                    <LoginForm
                      mode={mode}
                      onClick={() => setActive(1)}
                      userGroup={userGroups.budgetOrganization}
                      hovered={hoveredForm !== userGroups.budgetOrganization.id}
                      disabled={activeForm !== userGroups.budgetOrganization.id}
                      loading={
                        activeForm === userGroups.budgetOrganization.id &&
                        loading
                      }
                      error={
                        activeForm === userGroups.budgetOrganization.id && error
                      }
                      errorMsg={errorMsg}
                      onLogin={login}
                      resetError={resetError}
                    />
                  </div>
                )}
                {/* {active === 2 && (
                  <div
                    className={`xl:tw-col-span-3 tw-w-[380px] flex-1 form-transition ${getAnimateClass(
                      2
                    )}`}
                    onMouseOver={() => setHoveredForm(userGroups.curators.id)}
                    onFocus={() => setActiveForm(userGroups.curators.id)}
                  >
                    <LoginForm
                      mode={mode}
                      onClick={() => setActive(2)}
                      userGroup={userGroups.curators}
                      hovered={hoveredForm !== userGroups.curators.id}
                      disabled={activeForm !== userGroups.curators.id}
                      loading={activeForm === userGroups.curators.id && loading}
                      error={activeForm === userGroups.curators.id && error}
                      errorMsg={errorMsg}
                      onLogin={login}
                      resetError={resetError}
                    />
                  </div>
                )} */}
                {active === 2 && (
                  <div
                    className={`xl:tw-col-span-3 tw-w-[380px] flex-1 form-transition ${getAnimateClass(
                      2
                    )}`}
                    onMouseOver={() =>
                      setHoveredForm(userGroups.commercialOrganization.id)
                    }
                    onFocus={() =>
                      setActiveForm(userGroups.commercialOrganization.id)
                    }
                  >
                    <LoginForm
                      mode={mode}
                      onClick={() => setActive(2)}
                      userGroup={userGroups.commercialOrganization}
                      hovered={
                        hoveredForm !== userGroups.commercialOrganization.id
                      }
                      disabled={
                        activeForm !== userGroups.commercialOrganization.id
                      }
                      loading={
                        activeForm === userGroups.commercialOrganization.id &&
                        loading
                      }
                      error={
                        activeForm === userGroups.commercialOrganization.id &&
                        error
                      }
                      errorMsg={errorMsg}
                      onLogin={login}
                      resetError={resetError}
                    />
                  </div>
                )}
              </div>
            </Box>
          </div>
        </div>
        <div id="modals">
          <AuthForgotPasswordModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        </div>
      </div>
    </Fragment>
  );
});
