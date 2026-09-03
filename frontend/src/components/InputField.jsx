import TextField from "@mui/material/TextField";

function InputField(props) {

    return (

        <TextField

            fullWidth

            margin="normal"

            variant="outlined"

            {...props}

        />

    );

}

export default InputField;