import api from "../api/axios";

export const startAttempt = async (quizId) => {

    const response = await api.post(

        "/attempts/start",

        {

            quiz_id: quizId

        }

    );

    return response.data;

};

export const saveAnswer = async (

    attemptId,

    data

) => {

    const response = await api.put(

        `/attempts/${attemptId}/answer`,

        data

    );

    return response.data;

};

export const submitAttempt = async (

    attemptId

) => {

    const response = await api.post(

        `/attempts/${attemptId}/submit`

    );

    return response.data;

};