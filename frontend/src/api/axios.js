import axios from "axios";

const api = axios.create({
    baseURL: "https://mern-e-commerce-2qen.onrender.com/api",
});


// Automatically send JWT token
api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }
);


export default api;

