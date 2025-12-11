import { store } from "@root/store";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CustomToast } from "@ui";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { theme } from "@utils";
import { RouterProvider } from "react-router";
import { router } from "../pages/routing";
import "react-toastify/dist/ReactToastify.css";
import "./styles/globals.scss";
import "./styles/profile.scss";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import {
  CERTIFICATE_API_URL,
  certificateControl,
  setHeaders,
} from "@components";
import { ICertificateItem } from "src/components/certificate-auth/model";

declare global {
  interface Window {
    browser: any;
  }
}

export const CertificateListContext = createContext<ICertificateItem[]>([]);
export default function App() {
  const certificateEnable = parseInt(
    import.meta.env.VITE_PUBLIC_CERTIFICATE_AUTH_ENABLE!
  );

  const [certs, setCerts] = useState<ICertificateItem[]>([]);

  useLayoutEffect(() => {
    const token = certificateControl("get");

    if (!token) return;

    setHeaders(token);
  }, []);

  useEffect(() => {
    if (certificateEnable) {
      fetch(CERTIFICATE_API_URL)
        .then((res) => res.json())
        .then((data) => setCerts(data))
        .catch((err) => console.log(err));
    }
  }, [certificateEnable]);

  return (
    <>
      <CertificateListContext.Provider value={certs}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <RouterProvider router={router} />
            </ThemeProvider>
            <CustomToast />
          </Provider>
        </LocalizationProvider>
        <ToastContainer />
      </CertificateListContext.Provider>
    </>
  );
}
