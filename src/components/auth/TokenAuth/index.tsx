import {
  useEffect,
  useState,
  ReactNode,
  FC,
  createContext,
  useMemo,
  useLayoutEffect,
} from "react";
import { getEtokenPlugin } from "../EToken/plugin";
import { RuTokenPlugin, RuTokenPluginInstance } from "../RuToken/plugin";
import RutokenLogin from "../RuToken/login";
import ETokenLogin from "../EToken";
import { axios, signOut } from "@configs";
import {
  getSessions,
  SESSIONS,
  SESSION_ID,
  isTokenChecked,
  removeTokenChecked,
  saveToken,
  setTokenChecked,
} from "@utils";
import { useLocation } from "react-router";
import { useSession } from "@hooks";
import { Script } from "@ui";

export enum TokenType {
  etoken = "ETOKEN",
  rutoken = "RUTOKEN",
}

interface ITokenAuth {
  children?: ReactNode;
}

export const TokenContext = createContext<TokenType | null>(null);
export const RutokenPluginContext = createContext<any>(null);
export const TokenControllContext = createContext<any>([]);

declare namespace rutoken {
  const ready: Promise<boolean>;

  function isExtensionInstalled(): boolean;

  function isPluginInstalled(): boolean;

  function loadPlugin(): RuTokenPluginInstance;
}

export const TokenAuth: FC<ITokenAuth> = ({ children }) => {
  const [tokenType, setTokenType] = useState<TokenType | null>(null);
  const [rutokenPlugin, setRutokenPlugin] = useState<any>(null);
  const [etokenPlugin, setEtokenPlugin] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [modalEnabled, setModalEnabled] = useState(true);
  const [hideOnBackdrop, setHideOnBackdrop] = useState(false);
  const enableToken = parseInt(import.meta.env.VITE_PUBLIC_TOKEN_AUTH_ENABLE!);
  const { status } = useSession();
  const { pathname } = useLocation();

  useEffect(() => {
    getEtokenPlugin()
      .then((plugin: any) => setEtokenPlugin(plugin))
      .catch((err) => console.log("Error: ", err));
  }, []);

  const addSession = (sessionId: string) => {
    const { sessions } = getSessions();
    if (sessions.includes(sessionId)) return;
    sessions.push(sessionId);
    localStorage.setItem(SESSIONS, JSON.stringify(sessions));
  };

  const removeSession = (sessionId: string) => {
    const { sessions } = getSessions();

    const filteredSessions = sessions.filter((item: any) => item !== sessionId);
    localStorage.setItem(SESSIONS, JSON.stringify(filteredSessions));
  };

  useEffect(() => {
    const { signOutUser } = getSessions();
    const sessionId = sessionStorage.getItem(SESSION_ID);

    if (!sessionId && signOutUser && status === "authenticated") {
      localStorage.setItem(SESSIONS, "");
      signOut();
    }

    if (status !== "loading") {
      const newSessionId = sessionId ? sessionId : Math.random().toString();
      sessionStorage.setItem(SESSION_ID, newSessionId);
      addSession(newSessionId);

      window.onbeforeunload = () => {
        removeSession(newSessionId);
      };
    }
  }, [status]);

  const onLoadScript = () => {
    rutoken.ready
      .then(function () {
        return Promise.resolve(true);
      })
      .then(function () {
        return rutoken.isExtensionInstalled();
      })
      .then(function (result: boolean) {
        if (result) {
          return rutoken.isPluginInstalled();
        } else {
          return Promise.reject(
            "Не удаётся найти расширение 'Адаптер Рутокен Плагина'"
          );
        }
      })
      .then(function (result: boolean) {
        if (result) {
          return rutoken.loadPlugin();
        } else {
          return Promise.reject("Не удаётся найти Плагин");
        }
      })
      .then(function (pluginObject: any) {
        setRutokenPlugin(new RuTokenPlugin(pluginObject));
      })
      .then(undefined, function (reason: any) {
        console.log(reason);
      });
  };

  const getRutokenDevices = () =>
    new Promise((resolve, reject) => {
      rutokenPlugin.pluginObject
        .enumerateDevices()
        .then((devices: any) => resolve(devices || []));
      // .catch(() => resolve([]))
    });

  const getEtokenDevices = () =>
    new Promise((resolve, reject) => {
      const devices = etokenPlugin.getAllSlots();
      resolve(devices || []);
    });

  const redirectToAuth = () => {
    signOut();
    setHideOnBackdrop(false);
    setModalEnabled(true);
    setTokenInfo(null);
    removeTokenChecked();
  };

  const checkToken = async () => {
    const etokenDevices =
      tokenType === TokenType.rutoken
        ? []
        : ((await getEtokenDevices()) as Array<any>);
    const rutokenDevices =
      tokenType === TokenType.etoken
        ? []
        : ((await getRutokenDevices()) as Array<any>);

    const deviceObj = {
      [TokenType.rutoken]: rutokenDevices,
      [TokenType.etoken]: etokenDevices,
    };

    if (tokenType) {
      if (!deviceObj[tokenType].length) redirectToAuth();
      return;
    }

    if (etokenDevices.length > 0) {
      setTokenType(TokenType.etoken);
    } else if (rutokenDevices.length > 0) {
      setTokenType(TokenType.rutoken);
    }
  };

  useEffect(() => {
    let timerId: NodeJS.Timer | null = null;
    if (enableToken && etokenPlugin && rutokenPlugin) {
      timerId = setInterval(() => checkToken(), 4000);
    }

    return () => {
      if (timerId) {
        window.clearInterval(timerId);
      }
    };
  }, [etokenPlugin, rutokenPlugin, tokenType, enableToken]);

  useLayoutEffect(() => {
    if (pathname === "/auth/login") {
      removeTokenChecked();
    }

    if (isTokenChecked()) {
      setModalEnabled(false);
    }
  }, []);

  const onSuccess = (token: TokenInfo) => {
    axios.defaults.headers.common["CertId"] = token.certId.toString();
    axios.defaults.headers.common["CertExpiry"] = token.expiryDate.toString();
    axios.defaults.headers.common["CertStartDate"] = token.startDate.toString();
    saveToken(token);
    setHideOnBackdrop(true);
    setTokenInfo(token);
    setModalEnabled(false);
    if (!isTokenChecked()) {
      setTokenChecked();
    }
  };

  const onOutsideClick = () => {
    if (!hideOnBackdrop) return;
    setModalEnabled(false);
  };

  const getContent = () => {
    if (tokenInfo || !modalEnabled) return null;

    if (tokenType === TokenType.etoken) {
      return (
        <ETokenLogin onSuccess={onSuccess} onOutsideClick={onOutsideClick} />
      );
    }

    return (
      <RutokenLogin onSuccess={onSuccess} onOutsideClick={onOutsideClick} />
    );
  };

  const pageContent = useMemo(() => children, [children]);

  const tokenControlls = {
    value: tokenInfo,
    resetToken(backdrop = true) {
      setTokenInfo(null);
      setModalEnabled(true);
      setHideOnBackdrop(backdrop);
    },
  };

  return (
    <RutokenPluginContext.Provider value={rutokenPlugin}>
      <TokenControllContext.Provider value={tokenControlls}>
        <TokenContext.Provider value={tokenType}>
          <Script url="/js/rutoken-plugin.min.js" onLoad={onLoadScript} />
          {Boolean(enableToken) && getContent()}
          {pageContent}
        </TokenContext.Provider>
      </TokenControllContext.Provider>
    </RutokenPluginContext.Provider>
  );
};
