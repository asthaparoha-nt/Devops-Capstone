import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack
} from "@mui/material";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { toast } from "react-toastify";

import {

    createCategory,

    updateCategory

} from "../services/categoryService";

const schema = yup.object({

    name: yup

        .string()

        .required("Category Name is required")

        .matches(

            /^[A-Za-z ]+$/,

            "Only alphabets and spaces allowed"

        )

        .min(3)

        .max(50),

    description: yup

.string()

.required("Description is required")

.test(

"not-number",

"Description cannot contain only numbers",

(value)=>{

return !/^[0-9 ]+$/.test(value);

}

)

.min(5)

.max(200)

});

function CategoryDialog({

    open,

    handleClose,

    selectedCategory,

    refreshCategories

}) {

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

        if (selectedCategory) {

            reset({

                name: selectedCategory.name,

                description:

                    selectedCategory.description

            });

        }

        else {

            reset({

                name: "",

                description: ""

            });

        }

    }, [

        selectedCategory,

        reset

    ]);

    const onSubmit = async (data) => {

    const payload = {

        name: data.name.trim(),

        description: data.description.trim()

    };

    try {

        if (selectedCategory) {

            await updateCategory(

                selectedCategory.id,

                payload

            );

            toast.success(

                "Category Updated Successfully"

            );

        }

        else {

            await createCategory(

                payload

            );

            toast.success(

                "Category Created Successfully"

            );

        }

        refreshCategories();

        handleClose();

    }

    catch (error) {

    if (selectedCategory) {

        toast.error("Category already exists.");

    }

    else {

        toast.error(

            error.response?.data?.message ||

            error.response?.data?.detail ||

            "Category creation failed."

        );

    }

}

};

    return (

        <Dialog

            open={open}

            onClose={handleClose}

            fullWidth

            maxWidth="sm"

        >

            <DialogTitle>

                {

                    selectedCategory

                    ?

                    "Update Category"

                    :

                    "Create Category"

                }

            </DialogTitle>

            <form

                onSubmit={handleSubmit(onSubmit)}

            >

                <DialogContent>

                    <Stack

                        spacing={3}

                        mt={1}

                    >

                        <TextField

                            label="Category Name"

                            fullWidth

                            {

                                ...register("name")

                            }

                            error={!!errors.name}

                            helperText={

                                errors.name?.message

                            }

                        />

                        <TextField

                            label="Description"

                            multiline

                            rows={4}

                            fullWidth

                            {

                                ...register(

                                    "description"

                                )

                            }

                            error={

                                !!errors.description

                            }

                            helperText={

                                errors.description?.message

                            }

                        />

                    </Stack>

                </DialogContent>

                <DialogActions>

                    <Button

                        onClick={handleClose}

                    >

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

                            selectedCategory

                            ?

                            "Update"

                            :

                            "Create"

                        }

                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

}

export default CategoryDialog;