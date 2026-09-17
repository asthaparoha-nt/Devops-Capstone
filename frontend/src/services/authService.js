import api from "../api/axios";
import { BASE_URL } from "../constants/constants";


export const loginUser = async (data) => {

    const response = await api.post(

        `${BASE_URL}/auth/login`,
        data
    );

    return response.data;

};

export const registerUser = async (data) => {

    const response = await api.post(

        `${BASE_URL}/auth/register`,

        data

    );

    return response.data;

};