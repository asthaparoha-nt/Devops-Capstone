import * as yup from "yup";

export const registerSchema = yup.object({

    full_name: yup

        .string()

        .required("Full name is required")

        .matches(

            /^[A-Za-z ]+$/,

            "Only alphabets and spaces are allowed"

        )

        .min(3, "Minimum 3 characters")

        .max(100, "Maximum 100 characters"),

    email: yup

        .string()

        .email("Enter a valid email")

        .required("Email is required"),

    password: yup

        .string()

        .required("Password is required")

        .min(8, "Minimum 8 characters")

        .matches(

            /[A-Z]/,

            "Must contain one uppercase letter"

        )

        .matches(

            /[a-z]/,

            "Must contain one lowercase letter"

        )

        .matches(

            /[0-9]/,

            "Must contain one number"

        )

        .matches(

            /[@$!%*?&]/,

            "Must contain one special character"

        ),

    confirmPassword: yup

        .string()

        .required("Confirm your password")

        .oneOf(

            [yup.ref("password")],

            "Passwords do not match"

        )

});