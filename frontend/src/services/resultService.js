import api from "../api/axios";

export const getResult = async (

    attemptId

) => {

    const response = await api.get(

        `/results/${attemptId}`

    );

    return response.data;

};

export const getHistory = async () => {

    const response = await api.get(

        "/results/history"

    );

    return response.data;

};
export const getQuizResults = async (quizId) => {

    const response = await api.get(

        `/results/quiz/${quizId}`

    );

    return response.data;

};
export const getLeaderboard = async (quizId) => {

    const response = await api.get(

        `/results/leaderboard/${quizId}`

    );

    return response.data;

};