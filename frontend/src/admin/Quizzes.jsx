import {
    Box,
    Button,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    CircularProgress,
    IconButton,
    Tooltip,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Chip
} from "@mui/material";
import {
    Add,
    Search,
    Edit,
    Delete,
    Visibility
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";

import {
    useEffect,
    useState,
    useCallback
} from "react";

import { toast } from "react-toastify";

import {

    getQuizzes,

    deleteQuiz,

    getQuizDetails

} from "../services/quizService";

import QuizDialog from "./QuizDialog";

function Quizzes() {

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openDialog, setOpenDialog] = useState(false);

    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [viewingQuiz, setViewingQuiz] = useState(null);

    const [details, setDetails] = useState(null);

    const [loadingDetails, setLoadingDetails] = useState(false);
    const loadQuizDetails = async (quiz) => {

    try {

        setLoadingDetails(true);

        const response = await getQuizDetails(

            quiz.id

        );

        setViewingQuiz(quiz);

        setDetails(

            response.data

        );

    }

    catch {

        toast.error(

            "Unable to load quiz details"

        );

    }

    finally {

        setLoadingDetails(false);

    }

};
    const loadQuizzes = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getQuizzes();

            const data = response.data || [];

            const formatted = data.map((quiz) => ({

                id: quiz.id || quiz._id,

                title: quiz.title,

                description: quiz.description,

                category_id: quiz.category_id,

                duration: quiz.duration,

                total_marks: quiz.total_marks,

                is_active: quiz.is_active,

                created_at: quiz.created_at

            }));

            setRows(formatted);

        }

        catch (error) {

            toast.error(

                error.response?.data?.detail ||

                "Unable to fetch quizzes"

            );

        }

        finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadQuizzes();

    }, [loadQuizzes]);

    const filteredRows = rows.filter(

        (quiz) =>

            quiz.title

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

    );

    const handleDelete = async (id) => {

        try {

            await deleteQuiz(id);

            toast.success(

                "Quiz Deleted Successfully"

            );

            loadQuizzes();

        }

        catch (error) {

            toast.error(

                error.response?.data?.detail ||

                "Delete Failed"

            );

        }

    };
    const formatDate = (value) => {

    if (!value) {

        return "-";

    }

    return new Date(value).toLocaleDateString(

        "en-GB",

        {

            day: "2-digit",

            month: "2-digit",

            year: "2-digit"

        }

    );

};
        const columns = [

        {

            field: "title",

            headerName: "Quiz Title",

            flex: 1.6

        },

        {

            field: "description",

            headerName: "Description",

            flex: 2.2

        },

        {

            field: "duration",

            headerName: "Duration",

            flex: 1,

            renderCell: (params) => (

                <Typography>

                    {params.row.duration} mins

                </Typography>

            )

        },

        {

            field: "total_marks",

            headerName: "Marks",

            flex: 0.8

        },

        {

            field: "is_active",

            headerName: "Status",

            flex: 1,

            renderCell: (params) => (

                <Typography

                    fontWeight="bold"

                    color={

                        params.row.is_active

                            ?

                            "#16A34A"

                            :

                            "#DC2626"

                    }

                >

                    {

                        params.row.is_active

                            ?

                            "Active"

                            :

                            "Inactive"

                    }

                </Typography>

            )

        },

        {

            field: "actions",

            headerName: "Actions",

            sortable: false,

            width: 190,

            renderCell: (params) => (

    <Stack

        direction="row"

        spacing={1}

    >

        <Tooltip title="Browse Quiz">

            <IconButton

                color="success"

                onClick={() =>

                    loadQuizDetails(

                        params.row

                    )

                }

            >

                <Visibility />

            </IconButton>

        </Tooltip>

        <Tooltip title="Edit">

            <IconButton

                color="primary"

                onClick={() => {

                    setSelectedQuiz(

                        params.row

                    );

                    setOpenDialog(true);

                }}

            >

                <Edit />

            </IconButton>

        </Tooltip>

        <Tooltip title="Delete">

            <IconButton

                color="error"

                onClick={() =>

                    handleDelete(

                        params.row.id

                    )

                }

            >

                <Delete />

            </IconButton>

        </Tooltip>

    </Stack>

)

        }

    ];

    return (

        <Box>

            <Box

                sx={{

                    display: "flex",

                    justifyContent: "space-between",

                    alignItems: "center",

                    mb: 4

                }}

            >

                <Box>

                    <Typography

                        variant="h4"

                        fontWeight="bold"

                    >

                        Quiz Management

                    </Typography>

                    <Typography

                        color="text.secondary"

                        mt={1}

                    >

                        Create and manage quizzes

                    </Typography>

                </Box>

                <Button

                    variant="contained"

                    startIcon={<Add />}

                    onClick={() => {

                        setSelectedQuiz(null);

                        setOpenDialog(true);

                    }}

                    sx={{

                        borderRadius: 3,

                        px: 3,

                        py: 1.4,

                        textTransform: "none",

                        fontWeight: "bold"

                    }}

                >

                    Create Quiz

                </Button>

            </Box>

            <Paper

                elevation={0}

                sx={{

                    p: 3,

                    borderRadius: 4,

                    boxShadow:

                        "0 8px 30px rgba(0,0,0,.06)"

                }}

            >

                <TextField

                    fullWidth

                    placeholder="Search Quiz..."

                    value={search}

                    onChange={(e) =>

                        setSearch(

                            e.target.value

                        )

                    }

                    sx={{

                        mb: 3

                    }}

                    InputProps={{

                        startAdornment: (

                            <InputAdornment position="start">

                                <Search />

                            </InputAdornment>

                        )

                    }}

                />                {

                    loading

                        ?

                        <Box

                            sx={{

                                display: "flex",

                                justifyContent: "center",

                                py: 10

                            }}

                        >

                            <CircularProgress />

                        </Box>

                        :

                        <DataGrid

                            rows={filteredRows}

                            columns={columns}

                            autoHeight

                            disableRowSelectionOnClick

                            pageSizeOptions={[5, 10, 20]}

                            initialState={{

                                pagination: {

                                    paginationModel: {

                                        pageSize: 5

                                    }

                                }

                            }}

                            sx={{

                                border: 0,

                                borderRadius: 3,

                                "& .MuiDataGrid-columnHeaders": {

                                    backgroundColor: "#EEF2FF",

                                    fontWeight: "bold",

                                    fontSize: 15

                                },

                                "& .MuiDataGrid-row:hover": {

                                    backgroundColor: "#F8FAFC"

                                },

                                "& .MuiDataGrid-cell": {

                                    alignItems: "center"

                                }

                            }}

                        />

                }

            </Paper>
            {

    viewingQuiz &&

    (

        <Card

            elevation={3}

            sx={{

                mt:4,

                borderRadius:4,

                overflow:"hidden"

            }}

        >

            <CardContent>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Box>

                        <Typography

                            variant="h5"

                            fontWeight="bold"

                        >

                            {

                                details?.quiz?.title

                            }

                        </Typography>

                        <Typography

                            color="text.secondary"

                        >

                            {

                                details?.quiz?.description

                            }

                        </Typography>

                    </Box>

                    <Button

                        variant="outlined"

                        onClick={()=>{

                            setViewingQuiz(null);

                            setDetails(null);

                        }}

                    >

                        Close

                    </Button>

                </Stack>

                <Grid

                    container

                    spacing={2}

                    mb={4}

                >

                    <Grid item xs={12} md={3}>

                        <Card

                            sx={{

                                bgcolor:"#EEF2FF",

                                borderRadius:3

                            }}

                        >

                            <CardContent>

                                <Typography

                                    color="text.secondary"

                                >

                                    Category

                                </Typography>

                                <Typography

                                    variant="h6"

                                    fontWeight="bold"

                                >

                                    {

                                        details?.category?.name ||

                                        "-"

                                    }

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={12} md={3}>

                        <Card

                            sx={{

                                bgcolor:"#ECFDF5",

                                borderRadius:3

                            }}

                        >

                            <CardContent>

                                <Typography

                                    color="text.secondary"

                                >

                                    Duration

                                </Typography>

                                <Typography

                                    variant="h5"

                                    fontWeight="bold"

                                >

                                    {

                                        details?.quiz?.duration

                                    } mins

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={12} md={3}>

                        <Card

                            sx={{

                                bgcolor:"#FEF3C7",

                                borderRadius:3

                            }}

                        >

                            <CardContent>

                                <Typography

                                    color="text.secondary"

                                >

                                    Total Marks

                                </Typography>

                                <Typography

                                    variant="h5"

                                    fontWeight="bold"

                                >

                                    {

                                        details?.quiz?.total_marks

                                    }

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={12} md={3}>

                        <Card

                            sx={{

                                bgcolor:"#F3E8FF",

                                borderRadius:3

                            }}

                        >

                            <CardContent>

                                <Typography

                                    color="text.secondary"

                                >

                                    Attempts

                                </Typography>

                                <Typography

                                    variant="h5"

                                    fontWeight="bold"

                                >

                                    {

                                        details?.attempt_count

                                    }

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

                <Divider

                    sx={{

                        mb:3

                    }}

                />

                <Typography

                    variant="body2"

                    color="text.secondary"

                    mb={3}

                >

                    Created :

                    {

                        formatDate(

                            details?.quiz?.created_at

                        )

                    }

                </Typography>

                <Typography

                    variant="h6"

                    fontWeight="bold"

                    mb={2}

                >

                    Questions

                </Typography>{

    loadingDetails

    ?

    <Box

        sx={{

            display:"flex",

            justifyContent:"center",

            py:5

        }}

    >

        <CircularProgress/>

    </Box>

    :

    details?.questions?.length===0

    ?

    <Typography

        color="text.secondary"

    >

        No questions found for this quiz.

    </Typography>

    :

    <Grid

        container

        spacing={2}

    >

        {

            details.questions.map(

                (

                    question,

                    index

                )=>(

                    <Grid

                        item

                        xs={12}

                        md={6}

                        key={question.id}

                    >

                        <Card

                            variant="outlined"

                            sx={{

                                borderRadius:3,

                                height:"100%",

                                transition:".3s",

                                "&:hover":{

                                    transform:

                                    "translateY(-4px)",

                                    boxShadow:

                                    "0 12px 30px rgba(0,0,0,.12)"

                                }

                            }}

                        >

                            <CardContent>

                                <Typography

                                    fontWeight="bold"

                                    gutterBottom

                                >

                                    Q{index+1}.{" "}

                                    {

                                        question.question_text

                                    }

                                </Typography>

                                <Stack

                                    direction="row"

                                    spacing={1}

                                    flexWrap="wrap"

                                    mt={2}

                                >

                                    <Chip

                                        label={

                                            question.question_type

                                        }

                                        color="primary"

                                        size="small"

                                    />

                                    <Chip

                                        label={

                                            question.difficulty

                                        }

                                        color="warning"

                                        size="small"

                                    />

                                    <Chip

                                        label={`${question.marks} Marks`}

                                        color="success"

                                        size="small"

                                    />

                                </Stack>

                                {

                                    question.options &&

                                    question.options.length>0 &&

                                    <Box mt={3}>

                                        <Typography

                                            fontWeight="bold"

                                            mb={1}

                                        >

                                            Options

                                        </Typography>

                                        {

                                            question.options.map(

                                                (

                                                    option,

                                                    optionIndex

                                                )=>(

                                                    <Typography

                                                        key={optionIndex}

                                                        variant="body2"

                                                        sx={{

                                                            py:.5

                                                        }}

                                                    >

                                                        • {option}

                                                    </Typography>

                                                )

                                            )

                                        }

                                    </Box>

                                }

                            </CardContent>

                        </Card>

                    </Grid>

                )

            )

        }

    </Grid>

}

            </CardContent>

        </Card>

    )

}

<QuizDialog

    open={openDialog}

    handleClose={()=>

        setOpenDialog(false)

    }

    selectedQuiz={selectedQuiz}

    refreshQuizzes={loadQuizzes}

/>

</Box>

);

}

export default Quizzes;

            