import api from "../api/axios";

export const getQuizzes = async () => {

    const response = await api.get("/quizzes/");

    return response.data;

};

export const createQuiz = async (data) => {

    const response = await api.post(

        "/quizzes/",

        data

    );

    return response.data;

};

export const updateQuiz = async (

    id,

    data

) => {

    const response = await api.put(

        `/quizzes/${id}`,

        data

    );

    return response.data;

};

export const deleteQuiz = async (id) => {

    const response = await api.delete(

        `/quizzes/${id}`

    );

    return response.data;

};
export const getQuizDetails = async (id) => {

    const response = await api.get(

        `/quizzes/details/${id}`

    );

    return response.data;

};