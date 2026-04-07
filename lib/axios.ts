import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

instance.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
})

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        const token = Cookies.get("token");
        if (token) {
            Cookies.remove("token");
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
})

export default instance;