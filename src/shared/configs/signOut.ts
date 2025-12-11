export const ACCESS_TOKEN = "ACCESS_TOKEN";

export const getNewExpiredDateTime = (token: any) => {
  return token.expireTime * 1000 + Date.now();
};

export const getSession = () => {
  const session = localStorage.getItem(ACCESS_TOKEN);

  if (session) {
    return JSON.parse(session);
  }

  return null;
};

export async function refreshAccessToken(token: any) {
  try {
    const url = import.meta.env.VITE_PUBLIC_API_BASE_URL + "api/Auth/token";
    const body = JSON.stringify({
      refreshToken: token.refreshToken,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    saveAccessToken({
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      expiredDateTime: getNewExpiredDateTime(refreshedTokens),
    });
  } catch (error) {
    signOut();
  }
}

export const saveAccessToken = (token: any) => {
  localStorage.setItem(ACCESS_TOKEN, JSON.stringify(token));
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
};

export const signOut = () => {
  removeAccessToken();
  window.location.href = "/auth/login";
};
