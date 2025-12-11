import { getSession, refreshAccessToken } from "../configs";

export const TOKEN_STORAGE_KEY = "authToken";
export enum AuthStatus {
  AUTHORIZED = "authorized",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export const useSession = () => {
  const token = getSession();

  let status = AuthStatus.AUTHENTICATED;
  if (!token) {
    status = AuthStatus.UNAUTHENTICATED;
  }

  return {
    data: { user: null },
    status,
    update: () => {
      refreshAccessToken(token);
    },
  } as any;
};
