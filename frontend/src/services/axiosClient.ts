import axios from "axios";

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:3000",
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        window.location.href = "/login";
      } catch {}
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
