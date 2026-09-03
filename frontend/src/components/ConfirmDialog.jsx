import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

function ConfirmDialog({

    open,

    title,

    message,

    onCancel,

    onConfirm,

    loading

}) {

    return (

        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >

            <DialogTitle
                sx={{
                    fontWeight: "bold"
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    {message}

                </DialogContentText>

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>

                <Button
                    onClick={onCancel}
                    color="inherit"
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                    disabled={loading}
                >

                    {

                        loading

                            ?

                            "Deleting..."

                            :

                            "Delete"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

}

export default ConfirmDialog;