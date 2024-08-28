import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
});


export default api;





























// import axios from "axios";
// import { apiRequest } from "./http";
// import Cookies from "js-cookie"
// import { toast } from "react-toastify";

// type T = (token: string) => any;
// const api = axios.create();

// let isRefreshing = false;
// let refreshSubscribers: T[] = [];

// function subscribeTokenRefresh(callback: T) {
//   refreshSubscribers.push(callback);
// }

// function onTokenRefreshed(token: string) {
//   refreshSubscribers.map((callback) => callback(token));
//   refreshSubscribers = [];
// }

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const url = window.location.href;
//     const params = new URLSearchParams(new URL(url).search);
//     const token = params.get("token");

//     if (error.config.url.includes("/auth/token")) {
//       Cookies.remove("gitaRefreshToken");
//       Cookies.remove("gitaAuth");
//       if (token) {
//         window.location.href = `/?token=${token}`;
//       } else {
//         window.location.href = "/";
//       }
//       return Promise.reject(error);
//     }

//     if (error?.response?.data?.detail?.toLowerCase() === "not authenticated") {
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         if (!isRefreshing) {
//           isRefreshing = true;

//           const refreshTokenResponse = await apiRequest.auth.refreshToken();

//           if (refreshTokenResponse.status === 200) {
//             const date = new Date();
//             date.setMinutes(date.getMinutes() + 50);

//             Cookies.set(
//               "gitaAuth",
//               JSON.stringify({
//                 authorization: `${refreshTokenResponse.data.token_type} ${refreshTokenResponse.data.access_token}`,
//               }),
//               { expires: date },
//             );
//             date.setHours(date.getHours() + 6);
//             Cookies.set(
//               "gitaRefreshToken",
//               JSON.stringify({
//                 authorization: `${refreshTokenResponse.data.token_type} ${refreshTokenResponse.data.refresh_token}`,
//               }),
//               { expires: date },
//             );

//             originalRequest.headers.authorization = `${refreshTokenResponse.data.token_type} ${refreshTokenResponse.data.access_token}`;
//             isRefreshing = false;
//             onTokenRefreshed(originalRequest.headers.authorization);
//             return api(originalRequest);
//           } else {
//             if (token) {
//               window.location.href = `/?token=${token}`;
//             } else {
//               window.location.href = "/";
//             }
//             return Promise.reject(error);
//           }
//         } else {
//           return new Promise((resolve) => {
//             subscribeTokenRefresh((token: string) => {
//               originalRequest.headers.authorization = token;
//               resolve(api(originalRequest));
//             });
//           });
//         }
//       }
//     } else if (
//       error.response.status === 401 &&
//       !error?.response?.data?.message?.toLowerCase().includes("token")
//     ) {
//       toast.error("Unauthorized", { toastId: "unauthorized" });
//     }
//     return Promise.reject(error);
//   },
// );
// export default api;
