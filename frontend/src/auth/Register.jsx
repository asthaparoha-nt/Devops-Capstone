import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    IconButton,
    InputAdornment,
} from "@mui/material";

import {
    EmailOutlined,
    LockOutlined,
    PersonOutlineOutlined,
    Visibility,
    VisibilityOff,
    School
} from "@mui/icons-material";
import { useState } from "react";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { registerSchema } from "../validation/authValidation";

import PasswordStrength from "../components/PasswordStrength";

import { registerUser } from "../services/authService";

import { toast } from "react-toastify";

function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {

        register,

        handleSubmit,

        watch,

        formState: {

            errors,

            isSubmitting

        }

    } = useForm({

        resolver: yupResolver(registerSchema),

        mode: "onChange"

    });

    const password = watch("password");

    const onSubmit = async (data) => {

        try {

            const payload = {

                full_name: data.full_name,

                email: data.email,

                password: data.password

            };

            const response = await registerUser(payload);

            toast.success(response.message);

            setTimeout(() => {

                navigate("/login");

            },1500);

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                error.response?.data?.detail ||

                "Registration Failed"

            );

        }

    };

    return(

<Box

sx={{

display:"flex",

minHeight:"100vh",

background:"#EEF2FF"

}}

>

<Box

sx={{

flex:1,

display:{

xs:"none",

md:"flex"

},

flexDirection:"column",

justifyContent:"center",

alignItems:"center",

background:

"linear-gradient(135deg,#4338CA,#7C3AED)",

color:"white",

p:6

}}

>

<School

sx={{

fontSize:90,

mb:4

}}

/>

<Typography

variant="h3"

fontWeight="bold"

>

Assessment Portal

</Typography>

<Typography

mt={3}

fontSize={22}

>

Build.

Learn.

Grow.

</Typography>

<Typography

mt={5}

width="70%"

textAlign="center"

lineHeight={2}

>

Join our smart assessment platform and experience seamless online assessments.

</Typography>

</Box>

<Box

sx={{

flex:1,

display:"flex",

justifyContent:"center",

alignItems:"center",

p:3

}}

>

<motion.div

initial={{

opacity:0,

y:40

}}

animate={{

opacity:1,

y:0

}}

>

<Paper

elevation={18}

sx={{

width:470,

borderRadius:5,

p:5

}}

>

<Typography

variant="h4"

fontWeight="bold"

>

Create Account

</Typography>

<Typography

mb={4}

color="gray"

>

Register to continue

</Typography>

<form

onSubmit={handleSubmit(onSubmit)}

>

<TextField

fullWidth

margin="normal"

label="Full Name"

{

...register("full_name")

}

error={!!errors.full_name}

helperText={errors.full_name?.message}

InputProps={{

startAdornment:(

<InputAdornment position="start">

<PersonOutlineOutlined />

</InputAdornment>

)

}}

/>

<TextField

fullWidth

margin="normal"

label="Email"

{

...register("email")

}

error={!!errors.email}

helperText={errors.email?.message}

InputProps={{

startAdornment:(

<InputAdornment position="start">

<EmailOutlined/>

</InputAdornment>

)

}}

/><TextField

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

{

...register("password")

}

error={!!errors.password}

helperText={errors.password?.message}

InputProps={{

startAdornment:(

<InputAdornment position="start">

<LockOutlined/>

</InputAdornment>

),

endAdornment:(

<InputAdornment position="end">

<IconButton

onClick={()=>

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

)

}}

/>

<PasswordStrength

password={password}

/>

<TextField

fullWidth

margin="normal"

label="Confirm Password"

type={

showConfirmPassword

?

"text"

:

"password"

}

{

...register("confirmPassword")

}

error={!!errors.confirmPassword}

helperText={errors.confirmPassword?.message}

InputProps={{

startAdornment:(

<InputAdornment position="start">

<LockOutlined/>

</InputAdornment>

),

endAdornment:(

<InputAdornment position="end">

<IconButton

onClick={()=>

setShowConfirmPassword(

!showConfirmPassword

)

}

>

{

showConfirmPassword

?

<VisibilityOff/>

:

<Visibility/>

}

</IconButton>

</InputAdornment>

)

}}

/>

<Button

fullWidth

variant="contained"

type="submit"

disabled={isSubmitting}

sx={{

mt:4,

height:55,

fontSize:16,

fontWeight:"bold",

borderRadius:3,

textTransform:"none",

background:

"linear-gradient(135deg,#4338CA,#7C3AED)",

"&:hover":{

background:

"linear-gradient(135deg,#312E81,#6D28D9)"

}

}}

>

{

isSubmitting

?

"Creating Account..."

:

"Create Account"

}

</Button>

<Typography

textAlign="center"

mt={4}

>

Already have an account?

<Link

sx={{

cursor:"pointer",

ml:1,

fontWeight:"bold"

}}

onClick={()=>

navigate("/login")

}

>

Login

</Link>

</Typography>

</form>

</Paper>

</motion.div>

</Box>

</Box>

);

}

export default Register;