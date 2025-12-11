import Close from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { CertificateContext, UserMenuDropdown } from "@components";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import { CategoryIcon } from "@root/shared/ui/Icons/CategoryIcon";
import { NetworkIcon } from "@root/shared/ui/Icons/NetworkIcon";
import { PhoneIcon } from "@root/shared/ui/Icons/PhoneIcon";
import { PrimaryButton, CountdownTimer, ProfileIcon, Notifications } from "@ui";
import { removeTokenChecked } from "@utils";
import { useScreenSize, useSession } from "../hooks";
import { AppRoutes, signOut, getSession } from "../configs";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAppDispatch, useAppSelector } from "@root/store/hooks";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import { setMode } from "@root/store/slices/snackbarSlice";
import { RuTokenContext } from "../../components/auth/RuToken";
import { TokenControllContext } from "../../components/auth/TokenAuth";

const remainTime =
  Number(import.meta.env.VITE_PUBLIC_REFRESH_TOKEN_REMAIN_TIME) || 60;

export const Header = () => {
  const { status, update } = useSession();
    const { width } = useScreenSize();
  const [sessionUpdated, setSessionUpdated] = useState<any>({});
  const session = getSession();
  const { data: details, refetch } = useFetchUserDetailsQuery();
  const [showPopup, setShowPopup] = useState(false);
  const [timeExpiry, setTimeExpiry] = useState<Date | null>(null);
  const isGglobalSearchEnabled = Boolean(
    Number(import.meta.env.VITE_PUBLIC_GLOBAL_SEARCH)
  );
  const [searchPopup, setSearchPopup] = useState(false);
  const mode = useAppSelector((state) => state.snackbar.mode);
  const dispatch = useAppDispatch();

  const rutoken = useContext(RuTokenContext);
  const { data } = useSession();

  const { resetToken } = useContext(TokenControllContext);
  const certificateControl = useContext(CertificateContext);

  const handleLogout = () => {
    signOut();
    resetToken && resetToken(false);
    certificateControl.resetToken();
    if (rutoken && data?.rutoken?.deviceId) {
      rutoken.pluginObject.logout(data.rutoken.deviceId).then();
    }
    setShowPopup(false);
  };

  const isDarkModeEnabled = Number(import.meta.env.VITE_PUBLIC_DARK_MODE);

  const handleClose = () => {
    setShowPopup(false);
  };

  const updateSession = async () => {
    try {
      await update({ ...session });
      setSessionUpdated({});
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      const token = jwtDecode(session?.accessToken as string);
      const expirationTime = (token?.exp as number) * 1000;
      setTimeExpiry(new Date(expirationTime));
    }
    const checkTokenExpiration = async () => {
      if (session && session.accessToken) {
        const token = await jwtDecode(session?.accessToken as string);
        const expirationTime = (token?.exp as number) * 1000;
        const currentTime = new Date().getTime();
        const timeToExpiration = expirationTime - currentTime;

        if (timeToExpiration <= remainTime * 1000) {
          setShowPopup(true);
        }
      }
    };

    const timer = setInterval(checkTokenExpiration, 30000);
    return () => clearInterval(timer);
  }, [session?.accessToken, sessionUpdated]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="tw-bg-white tw-py-7 tw-relative">
      <div className="tw-absolute  tw-left-0 tw-overflow-hidden tw-w-full tw-h-[60px] tw-pointer-events-none"></div>
      <div className="tw-container tw-relative tw-z-50">
        <div className="tw-flex tw-justify-between tw-items-center">
          {/* {session && status === "authenticated" && (
            <div className="max-md:tw-hidden tw-organzatian-info">
              <ul className="tw-text-xs tw-flex tw-flex-col tw-gap-1">
                <li className="tw-flex tw-items-center tw-gap-2">
                  <ProfileIcon width="8px" height="8px" />
                  ФИО: {details?.displayName}
                </li>
                <li className="tw-flex tw-items-center tw-gap-2">
                  <NetworkIcon
                    width="8px"
                    height="8px"
                    stroke="none"
                    fill="currentColor"
                  />
                  ИНН: {details?.userCompany?.inn}
                </li>
                <li className="tw-flex tw-items-center tw-gap-2">
                  <CategoryIcon width="8px" height="8px" stroke="none" />
                  Организация: {details?.userCompany?.name}
                </li>
                <li className="tw-flex tw-items-center tw-gap-2">
                  <PhoneIcon width="8px" height="8px" stroke="none" />
                  Телефон: {details?.phone}
                </li>
              </ul>
            </div>
          )} */}
          <div className="md:tw-mx-start">
            <Link to={AppRoutes.USERS_PROFILE}>
              <div className="tw-flex tw-gap-5 tw-items-center tw-cursor-pointer">
                <img src="/logo_3.jpg" className="md:tw-w-16 md:tw-h-16 max-md:tw-w-10 max-md:tw-h-10" alt="logo" />
                <h2 className="tw-flex tw-flex-col md:tw-items-start">
                  <p className="max-md:tw-text-sm max-md:tw-uppercase tw-font-medium">Вазорати корҳои дохилии</p>
                  <p className="max-md:tw-text-sm max-md:tw-uppercase tw-font-medium">Ҷумҳурии Тоҷикистон</p>
                </h2>
              </div>
            </Link>
          </div>
          <div className="tw-relative tw-flex tw-items-center tw-gap-2">
            {isDarkModeEnabled ? (
              <IconButton
                onClick={() => {
                  if (mode === "light") {
                    if (window !== undefined) {
                      localStorage.setItem("mode", "dark");
                      dispatch(setMode("dark"));
                    }
                  } else {
                    if (window !== undefined) {
                      localStorage.setItem("mode", "light");
                      dispatch(setMode("light"));
                    }
                  }
                }}
              >
                {mode == null ? (
                  <LightModeIcon sx={{ color: "orange" }} />
                ) : mode == "light" ? (
                  <LightModeIcon sx={{ color: "orange" }} />
                ) : (
                  <Brightness3Icon
                    sx={{ color: "#fff", transform: "rotate(150deg)" }}
                  />
                )}
              </IconButton>
            ) : null}
            {/* {isGglobalSearchEnabled &&
              <GlobalSearchIcon
                onClick={() => {
                  setSearchPopup(true)
                }}
              />}
              <GlobalSearchIcon
                onClick={() => {
                  setSearchPopup(true)
                }}
              /> */}
            {/* <button onClick={() => {
                  setSearchPopup(true)
                }}>fff</button> */}
          </div>
          <div className="tw-relative tw-flex tw-gap-8 tw-items-center">
            <Notifications />
            {session && status === "authenticated" ? (
              <UserMenuDropdown
                title={details?.displayName}
                avatar={details?.shortImage}
              />
            ) : (
              <Link to="/auth/login">
                <PrimaryButton>Войти</PrimaryButton>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={showPopup}
      >
        <DialogTitle
          sx={{ m: 0, py: 2, pr: 10, background: "#607D8B", color: "#fff" }}
          id="customized-dialog-title"
        >
          Ваша сессия скоро истечет
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#fff",
          }}
        >
          <Close />
        </IconButton>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            m: 4,
          }}
        >
          <Typography>Продолжить сесию? </Typography>
          <Typography>
            {timeExpiry && (
              <CountdownTimer
                targetDate={timeExpiry}
                callback={() => {
                  removeTokenChecked();
                  signOut();
                }}
              />
            )}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            background: "#E0E0E0",
          }}
        >
          <PrimaryButton
            onClick={() => {
              updateSession();
              setShowPopup(false);
            }}
          >
            Продолжать
          </PrimaryButton>
          <PrimaryButton onClick={handleLogout}>Выйти</PrimaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};
