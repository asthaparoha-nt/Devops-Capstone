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
    createQuiz,
    updateQuiz
} from "../services/quizService";

import { getCategories } from "../services/categoryService";

const schema = yup.object({

    title: yup

        .string()

        .trim()

        .required("Quiz title is required")

        .matches(

            /^[A-Za-z0-9 ]+$/,

            "Only letters and numbers allowed"

        )

        .min(3)

        .max(100),

    description: yup

        .string()

        .trim()

        .required("Description is required")

        .test(

            "not-number",

            "Description cannot contain only numbers",

            value => !/^[0-9 ]+$/.test(value || "")

        )

        .min(5)

        .max(500),

    category_id: yup

        .string()

        .required("Category is required"),

    duration: yup

        .number()

        .typeError("Duration must be a number")

        .positive()

        .min(1)

        .max(180)

        .required(),

    total_marks: yup

        .number()

        .typeError("Marks must be a number")

        .positive()

        .min(1)

        .max(500)

        .required()

});

function QuizDialog({

    open,

    handleClose,

    selectedQuiz,

    refreshQuizzes

}) {

    const [categories, setCategories] = useState([]);

    const {

        register,

        handleSubmit,

        reset,

        formState: {

            errors,

            isSubmitting

        }

    } = useForm({

        resolver: yupResolver(schema)

    });
        useEffect(() => {

        const loadCategories = async () => {

            try {

                const response = await getCategories();

                setCategories(

                    response.data || []

                );

            }

            catch {

                toast.error(

                    "Unable to load categories"

                );

            }

        };

        loadCategories();

    }, []);

    useEffect(() => {

        if (selectedQuiz) {

            reset({

                title: selectedQuiz.title,

                description: selectedQuiz.description,

                category_id: selectedQuiz.category_id,

                duration: selectedQuiz.duration,

                total_marks: selectedQuiz.total_marks

            });

        }

        else {

            reset({

                title: "",

                description: "",

                category_id: "",

                duration: "",

                total_marks: ""

            });

        }

    }, [

        selectedQuiz,

        reset

    ]);

    const onSubmit = async (data) => {

        const payload = {

            title: data.title.trim(),

            description: data.description.trim(),

            category_id: data.category_id,

            duration: Number(data.duration),

            total_marks: Number(data.total_marks)

        };

        try {

            if (selectedQuiz) {

                await updateQuiz(

                    selectedQuiz.id,

                    payload

                );

                toast.success(

                    "Quiz Updated Successfully"

                );

            }

            else {

                await createQuiz(

                    payload

                );

                toast.success(

                    "Quiz Created Successfully"

                );

            }

            refreshQuizzes();

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

                    selectedQuiz

                        ?

                        "Update Quiz"

                        :

                        "Create Quiz"

                }

            </DialogTitle>

            <form

                onSubmit={

                    handleSubmit(onSubmit)

                }

            >

                <DialogContent>

                    <Stack

                        spacing={3}

                        mt={1}

                    >

                        <TextField

                            label="Quiz Title"

                            fullWidth

                            {...register("title")}

                            error={!!errors.title}

                            helperText={

                                errors.title?.message

                            }

                        />

                        <TextField

                            label="Description"

                            multiline

                            rows={4}

                            fullWidth

                            {...register("description")}

                            error={

                                !!errors.description

                            }

                            helperText={

                                errors.description?.message

                            }

                        />

                        <TextField

                            select

                            label="Category"

                            fullWidth

                            defaultValue=""

                            {...register("category_id")}

                            error={

                                !!errors.category_id

                            }

                            helperText={

                                errors.category_id?.message

                            }

                        >

                            {

                                categories.map(

                                    (category) => (

                                        <MenuItem

                                            key={

                                                category.id ||

                                                category._id

                                            }

                                            value={

                                                category.id ||

                                                category._id

                                            }

                                        >

                                            {category.name}

                                        </MenuItem>

                                    )

                                )

                            }

                        </TextField>                        <TextField

                            label="Duration (Minutes)"

                            type="number"

                            fullWidth

                            {...register("duration")}

                            error={!!errors.duration}

                            helperText={

                                errors.duration?.message

                            }

                        />

                        <TextField

                            label="Total Marks"

                            type="number"

                            fullWidth

                            {...register("total_marks")}

                            error={!!errors.total_marks}

                            helperText={

                                errors.total_marks?.message

                            }

                        />

                    </Stack>

                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3
                    }}
                >

                    <Button

                        onClick={handleClose}

                        color="inherit"

                    >

                        Cancel

                    </Button>

                    <Button

                        variant="contained"

                        type="submit"

                        disabled={isSubmitting}

                        sx={{

                            px: 4,

                            borderRadius: 2,

                            textTransform: "none"

                        }}

                    >

                        {

                            isSubmitting

                                ?

                                "Saving..."

                                :

                                selectedQuiz

                                    ?

                                    "Update Quiz"

                                    :

                                    "Create Quiz"

                        }

                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

}

export default QuizDialog;