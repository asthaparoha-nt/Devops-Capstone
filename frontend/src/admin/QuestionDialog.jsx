import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack
} from "@mui/material";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { toast } from "react-toastify";

import {
    createQuestion,
    updateQuestion
} from "../services/questionService";

import { getQuizzes } from "../services/quizService";

const schema = yup.object({

    quiz_id: yup
        .string()
        .required("Quiz is required"),

    question_text: yup
        .string()
        .trim()
        .required("Question is required")
        .min(5, "Minimum 5 characters")
        .max(500, "Maximum 500 characters"),

    question_type: yup
        .string()
        .required(),

    optionA: yup
    .string()
    .trim()
    .when("question_type", {
        is: "mcq",
        then: (schema) =>
            schema.required("Option A is required"),
        otherwise: (schema) =>
            schema.notRequired()
    }),

optionB: yup
    .string()
    .trim()
    .when("question_type", {
        is: "mcq",
        then: (schema) =>
            schema.required("Option B is required"),
        otherwise: (schema) =>
            schema.notRequired()
    }),

    optionC: yup
        .string(),

    optionD: yup
        .string(),

    correct_answer: yup
        .string()
        .required("Correct answer is required"),

    difficulty: yup
        .string()
        .required(),

    marks: yup
        .number()
        .typeError("Marks must be numeric")
        .positive()
        .required(),

    tags: yup
        .string()

});

function QuestionDialog({

    open,

    handleClose,

    selectedQuestion,

    refreshQuestions

}) {

    const [quizzes, setQuizzes] = useState([]);

    const {

        register,

        handleSubmit,

        watch,

        reset,

        formState: {

            errors,

            isSubmitting

        }

    } = useForm({

        resolver: yupResolver(schema),

        defaultValues: {

            question_type: "mcq",

            difficulty: "easy"

        }

    });

    const questionType = watch("question_type");

    useEffect(() => {

        async function loadQuizzes() {

            try {

                const response = await getQuizzes();

                setQuizzes(response.data || []);

            }

            catch {

                toast.error(

                    "Unable to load quizzes"

                );

            }

        }

        loadQuizzes();

    }, []);

    useEffect(() => {

        if (!selectedQuestion) {

            reset({

                quiz_id: "",

                question_text: "",

                question_type: "mcq",

                optionA: "",

                optionB: "",

                optionC: "",

                optionD: "",

                correct_answer: "",

                difficulty: "easy",

                marks: "",

                tags: ""

            });

            return;

        }

        reset({

            quiz_id:

                selectedQuestion.quiz_id,

            question_text:

                selectedQuestion.question_text,

            question_type:

                selectedQuestion.question_type,

            optionA:

                selectedQuestion.options?.[0] || "",

            optionB:

                selectedQuestion.options?.[1] || "",

            optionC:

                selectedQuestion.options?.[2] || "",

            optionD:

                selectedQuestion.options?.[3] || "",

            correct_answer:

                selectedQuestion.correct_answer,

            difficulty:

                selectedQuestion.difficulty,

            marks:

                selectedQuestion.marks,

            tags:

                selectedQuestion.tags

                    ?

                    selectedQuestion.tags.join(", ")

                    :

                    ""

        });

    }, [

        selectedQuestion,

        reset

    ]);
        const onSubmit = async (data) => {

        let options = [];

        if (data.question_type === "true_false") {

            options = [

                "True",

                "False"

            ];

        }

        else {

            options = [

                data.optionA.trim(),

                data.optionB.trim(),

                data.optionC.trim(),

                data.optionD.trim()

            ]
            .filter(Boolean)
            .map(option => option.trim());

        }
        const uniqueOptions = new Set(

    options.map(

        option => option.toLowerCase().trim()

    )

);

if (uniqueOptions.size !== options.length) {

    toast.error(

        "Options cannot be identical."

    );

    return;

}
        const payload = {

            quiz_id: data.quiz_id,

            question_text: data.question_text.trim(),

            question_type: data.question_type,

            options,

            correct_answer: data.correct_answer,

            difficulty: data.difficulty,

            marks: Number(data.marks),

            tags: data.tags

                ?

                data.tags

                    .split(",")

                    .map(tag => tag.trim())

                    .filter(Boolean)

                :

                []

        };

        try {

            if (selectedQuestion) {

                await updateQuestion(

                    selectedQuestion.id,

                    payload

                );

                toast.success(

                    "Question Updated Successfully"

                );

            }
            
            else {
                console.log(payload);
                await createQuestion(

                    payload

                );

                toast.success(

                    "Question Created Successfully"

                );

            }

            refreshQuestions();

            handleClose();

        }

        catch (error) {

            toast.error(

                error.response?.data?.detail ||

                error.response?.data?.message ||

                "Operation Failed"

            );

        }

    };

    return (

        <Dialog

            open={open}

            onClose={handleClose}

            fullWidth

            maxWidth="md"

        >

            <DialogTitle>

                {

                    selectedQuestion

                        ?

                        "Update Question"

                        :

                        "Create Question"

                }

            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>

                <DialogContent>

                    <Stack spacing={3} mt={1}>

                        <TextField

                            select

                            label="Quiz"

                            defaultValue=""

                            {...register("quiz_id")}

                            error={!!errors.quiz_id}

                            helperText={errors.quiz_id?.message}

                        >

                            {

                                quizzes.map((quiz)=>(

                                    <MenuItem

                                        key={quiz.id || quiz._id}

                                        value={quiz.id || quiz._id}

                                    >

                                        {quiz.title}

                                    </MenuItem>

                                ))

                            }

                        </TextField>

                        <TextField

                            label="Question"

                            multiline

                            rows={4}

                            {...register("question_text")}

                            error={!!errors.question_text}

                            helperText={errors.question_text?.message}

                        />

                        <TextField

                            select

                            label="Question Type"

                            defaultValue="mcq"

                            {...register("question_type")}

                        >

                            <MenuItem value="mcq">

                                Multiple Choice

                            </MenuItem>

                            <MenuItem value="true_false">

                                True / False

                            </MenuItem>

                        </TextField>

                        {

                            questionType === "mcq"

                            &&

                            <>

                                <TextField

                                    label="Option A"

                                    {...register("optionA")}

                                    error={!!errors.optionA}

                                    helperText={errors.optionA?.message}

                                />

                                <TextField

                                    label="Option B"

                                    {...register("optionB")}

                                    error={!!errors.optionB}

                                    helperText={errors.optionB?.message}

                                />

                                <TextField

                                    label="Option C"

                                    {...register("optionC")}

                                />

                                <TextField

                                    label="Option D"

                                    {...register("optionD")}

                                />

                            </>

                        }

                        <TextField

                            select

                            label="Correct Answer"

                            defaultValue=""

                            {...register("correct_answer")}

                            error={!!errors.correct_answer}

                            helperText={errors.correct_answer?.message}

                        >

                            {

                                questionType === "mcq"

                                ?

                                [

                                    watch("optionA"),

                                    watch("optionB"),

                                    watch("optionC"),

                                    watch("optionD")

                                ]

                                .filter(Boolean)

                                .map(option=>(

                                    <MenuItem

                                        key={option}

                                        value={option}

                                    >

                                        {option}

                                    </MenuItem>

                                ))

                                :

                                [

                                    <MenuItem

                                        key="True"

                                        value="True"

                                    >

                                        True

                                    </MenuItem>,

                                    <MenuItem

                                        key="False"

                                        value="False"

                                    >

                                        False

                                    </MenuItem>

                                ]

                            }

                        </TextField>

                        <TextField

                            select

                            label="Difficulty"

                            defaultValue="easy"

                            {...register("difficulty")}

                        >

                            <MenuItem value="easy">

                                Easy

                            </MenuItem>

                            <MenuItem value="medium">

                                Medium

                            </MenuItem>

                            <MenuItem value="hard">

                                Hard

                            </MenuItem>

                        </TextField>

                        <TextField

                            label="Marks"

                            type="number"

                            {...register("marks")}

                            error={!!errors.marks}

                            helperText={errors.marks?.message}

                        />

                        <TextField

                            label="Tags"

                            placeholder="java, arrays, basics"

                            {...register("tags")}

                        />

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button onClick={handleClose}>

                        Cancel

                    </Button>

                    <Button

                        variant="contained"

                        type="submit"

                        disabled={isSubmitting}

                    >

                        {

                            isSubmitting

                                ?

                                "Saving..."

                                :

                                selectedQuestion

                                    ?

                                    "Update Question"

                                    :

                                    "Create Question"

                        }

                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

}

export default QuestionDialog;