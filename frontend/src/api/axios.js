import axios from "axios";

const api = axios.create({

    baseURL: "https://assessment-portal-alb-1084175467.us-east-1.elb.amazonaws.com/api",

    headers: {
        "Content-Type": "application/json"
    }

});

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

api.interceptors.response.use(

    (response) => response,

    (error) => {

        return Promise.reject(error);

    }

);
export default api;