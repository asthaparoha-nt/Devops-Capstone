import Button from "@mui/material/Button";

function PrimaryButton({

    children,

    ...props

}) {

    return (

        <Button

            variant="contained"

            fullWidth

            size="large"

            sx={{

                mt:2,

                borderRadius:3,

                textTransform:"none",

                py:1.4

            }}

            {...props}

        >

            {children}

        </Button>

    );

}

export default PrimaryButton;