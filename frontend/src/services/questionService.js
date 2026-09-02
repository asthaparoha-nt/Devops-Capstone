import api from "../api/axios";

export const getQuestions = async () => {

    const response = await api.get("/questions/");

    return response.data;

};

export const createQuestion = async (data) => {

    const response = await api.post(

        "/questions/",

        data

    );

    return response.data;

};

export const updateQuestion = async (

    id,

    data

) => {

    const response = await api.put(

        `/questions/${id}`,

        data

    );

    return response.data;

};

export const deleteQuestion = async (id) => {

    const response = await api.delete(

        `/questions/${id}`

    );


    return response.data;

};
export const getQuestionsByQuiz = async (quizId) => {

    const response = await api.get(

        `/questions/quiz/${quizId}`

    );

    return response.data;

};
export const getQuestionDetails = async (id) => {

    const response = await api.get(

        `/questions/details/${id}`

    );

    return response.data;

};