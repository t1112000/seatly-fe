import axios from "axios";
import { get } from "lodash";

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true, // Enable sending cookies with requests
});

Api.interceptors.request.use((config) => {
  return config;
});

Api.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject("Request cancelled");
    }
    if ((error as { code?: string }).code === "ECONNABORTED") {
      throw error;
    }

    const err =
      get(error, "response.data.error.message") ||
      get(error, "response.data.data.error.message") ||
      get(error, "response.data.message") ||
      get(error, "response.data.data.message") ||
      "Unknown error";

    return Promise.reject(new Error(typeof err === "string" ? err : err?.[0]));
  }
);

export default Api;
