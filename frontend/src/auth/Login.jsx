import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    InputAdornment,
    IconButton
} from "@mui/material";
import { encryptPassword } from "../utils/crypto";
import {

    EmailOutlined,

    LockOutlined,

    Visibility,

    VisibilityOff

} from "@mui/icons-material";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { toast } from "react-toastify";

import { loginUser } from "../services/authService";

import { useAuth } from "../hooks/useAuth";

const schema = yup.object({

    email: yup

        .string()

        .email("Enter valid email")

        .required("Email is required"),

    password: yup

        .string()

        .required("Password is required")

});

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const {

        register,

        handleSubmit,

        formState: { errors, isSubmitting }

    } = useForm({

        resolver: yupResolver(schema)

    });

    const onSubmit = async (data) => {

    try {

        const response = await loginUser(data);

        console.log("Backend Response:", response);

        const token = response.data.access_token;
        const role = response.data.role;

        login(token, role);

        toast.success(response.message);

        if (role === "admin") {

            navigate("/admin/dashboard");

        } else {

            navigate("/student/dashboard");

        }

    } 
    catch (error) {

    console.log("ERROR OBJECT:", error);
    console.log("ERROR RESPONSE:", error.response);
    console.log("ERROR DATA:", error.response?.data);

    toast.error(

        error.response?.data?.message ||

        error.response?.data?.detail ||

        "Login Failed"

    );

}

};
    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "#EEF2FF"
            }}
        >

            <Box
                sx={{
                    flex: 1,
                    display: {
                        xs: "none",
                        md: "flex"
                    },
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    background:
                        "linear-gradient(135deg,#4338CA,#7C3AED)",
                    color: "#fff",
                    p: 5
                }}
            >

                <Typography variant="h2">

                    Assessment Portal

                </Typography>

                <Typography mt={3} fontSize={22}>

                    Learn.

                    Assess.

                    Grow.

                </Typography>

            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Paper
                    elevation={12}
                    sx={{
                        width: 420,
                        p: 5,
                        borderRadius: 5
                    }}
                >

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >

                        Welcome Back

                    </Typography>

                    <Typography
                        mb={3}
                        color="gray"
                    >

                        Login to continue

                    </Typography>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <TextField

                            fullWidth

                            margin="normal"

                            label="Email"

                            {...register("email")}

                            error={!!errors.email}

                            helperText={errors.email?.message}

                            InputProps={{

                                startAdornment:

                                    <InputAdornment position="start">

                                        <EmailOutlined/>

                                    </InputAdornment>

                            }}

                        />

                        <TextField

                            fullWidth

                            margin="normal"

                            label="Password"

                            type={

                                showPassword

                                    ?

                                    "text"

                                    :

                                    "password"

                            }

                            {...register("password")}

                            error={!!errors.password}

                            helperText={errors.password?.message}

                            InputProps={{

                                startAdornment:

                                    <InputAdornment position="start">

                                        <LockOutlined/>

                                    </InputAdornment>,

                                endAdornment:

                                    <InputAdornment position="end">

                                        <IconButton

                                            onClick={() =>

                                                setShowPassword(

                                                    !showPassword

                                                )

                                            }

                                        >

                                            {

                                                showPassword

                                                    ?

                                                    <VisibilityOff/>

                                                    :

                                                    <Visibility/>

                                            }

                                        </IconButton>

                                    </InputAdornment>

                            }}

                        />

                        <Button

                            fullWidth

                            type="submit"

                            variant="contained"

                            disabled={isSubmitting}

                            sx={{

                                mt: 4,

                                height: 55,

                                borderRadius: 3,

                                fontSize: 16

                            }}

                        >

                            {

                                isSubmitting

                                    ?

                                    "Signing In..."

                                    :

                                    "Login"

                            }

                        </Button>

                    </form>

                    <Typography

                        mt={3}

                        textAlign="center"

                    >

                        Don't have an account?

                        <Link

                            sx={{

                                ml: 1,

                                cursor: "pointer"

                            }}

                            onClick={() =>

                                navigate("/register")

                            }

                        >

                            Register

                        </Link>

                    </Typography>

                </Paper>

            </Box>

        </Box>

    );

}

export default Login;