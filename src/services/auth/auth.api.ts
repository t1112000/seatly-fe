import Api from "..";

export const loginWithGoogle = (accessToken: string) =>
  Api.post("/v1/auth/google", { access_token: accessToken });

export const logout = () => Api.post("/v1/auth/logout");

export const fetchCurrentUser = () => Api.get("/v1/auth/me");
