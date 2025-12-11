import Close from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  CountdownTimer,
  PrimaryButton,
  ProfileIcon,
  UserMenuDropdown,
  CategoryIcon,
  NetworkIcon,
  PhoneIcon,
  Notifications,
} from "@ui";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import { removeTokenChecked } from "@utils";
import { Link } from "react-router-dom";
import { useSession } from "@hooks";
import { signOut } from "@configs";

const remainTime =
  Number(import.meta.env.VITE_PUBLIC_REFRESH_TOKEN_REMAIN_TIME) || 60;

const Header = () => {
  const [sessionUpdated, setSessionUpdated] = useState<any>({});
  const { data: session, status, update } = useSession();
  const { data: details, refetch } = useFetchUserDetailsQuery();
  const [showPopup, setShowPopup] = useState(false);
  const [timeExpiry, setTimeExpiry] = useState<Date | null>(null);

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
      {/* <img
        className="tw-absolute -tw-bottom-[10px] tw-left-0 tw-w-[80px]"
        src="/images/bg_teapot.png"
      />
      <img
        className="tw-absolute -tw-bottom-[5px] tw-right-0 tw-w-[120px]"
        src="/images/bg_plate.png"
      /> */}
      {/* <img
        className="tw-fixed tw-top-[180px] tw-left-0 tw-w-[150px]"
        src="/images/bg_man.png"
      /> */}
      {/* <img
        className="tw-fixed tw-top-[170px] tw-right-0 tw-w-[150px]"
        src="/images/bg_woman.png"
      /> */}
      {/* <img
        src="/images/bg_atlas.png"
        className="tw-absolute tw-bottom-[-40px] tw-z-40 tw-w-full"
      /> */}
      <div className="tw-absolute  tw-left-0 tw-overflow-hidden tw-w-full tw-h-[60px] tw-pointer-events-none"></div>
      <div className="tw-container tw-relative tw-z-50">
        <div className="tw-flex tw-justify-between tw-items-center">
          {session && status === "authenticated" && (
            <div className="tw-organzatian-info">
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
          )}
          <div className="tw-mx-auto">
            <Link to="/users/me/profile">
              <div className="tw-flex tw-gap-5 tw-items-center tw-cursor-pointer">
                <img src="/log_2.png" alt="Логотип" />
                <h2 className="tw-flex tw-flex-col tw-items-center">
                  <b>Вазорати корҳои дохилии</b>
                  <b>Ҷумҳурии Тоҷикистон</b>
                </h2>
              </div>
            </Link>
          </div>
          <div className="tw-relative">
            <Notifications />
          </div>
          <div className="tw-relative">
            {session && status === "authenticated" ? (
              <UserMenuDropdown
                title={details?.displayName}
                avatar={details?.avatar}
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
          <PrimaryButton onClick={handleClose}>Выйти</PrimaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Header;
