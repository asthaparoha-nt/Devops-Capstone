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
    useState,
    useEffect,
    useCallback
} from "react";

import { toast } from "react-toastify";

import {

    getQuestions,

    createQuestion,

    updateQuestion,

    deleteQuestion,

    getQuestionDetails

} from "../services/questionService";

import QuestionDialog from "./QuestionDialog";

function Questions(){

    const [rows,setRows]=useState([]);

    const [loading,setLoading]=useState(true);

    const [search,setSearch]=useState("");

    const [openDialog,setOpenDialog]=useState(false);

    const [selectedQuestion,setSelectedQuestion]=useState(null);
    const [viewingQuestion, setViewingQuestion] = useState(null);

    const [details, setDetails] = useState(null);

    const [loadingDetails, setLoadingDetails] = useState(false);
    const loadQuestionDetails = async (question) => {

    try {

        setLoadingDetails(true);

        const response = await getQuestionDetails(

            question.id

        );

        setViewingQuestion(question);

        setDetails(response.data);

    }

    catch {

        toast.error(

            "Unable to load question details"

        );

    }

    finally {

        setLoadingDetails(false);

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
    const loadQuestions=useCallback(async()=>{

        try{

            setLoading(true);

            const response=await getQuestions();

            const data=response.data||[];

            const formatted=data.map(question=>({

                id:question.id||question._id,

                question_text:question.question_text,

                question_type:question.question_type,

                difficulty:question.difficulty,

                marks:question.marks,

                quiz_id:question.quiz_id,

                options:question.options,

                correct_answer:question.correct_answer,

                tags:question.tags

            }));

            setRows(formatted);

        }

        catch(error){

            toast.error(

                error.response?.data?.detail||

                "Unable to fetch questions"

            );

        }

        finally{

            setLoading(false);

        }

    },[]);

    useEffect(()=>{

        loadQuestions();

    },[loadQuestions]);

    const filteredRows=rows.filter(

        question=>

            question.question_text

            .toLowerCase()

            .includes(

                search.toLowerCase()

            )

    );

    const handleDelete=async(id)=>{

        try{

            await deleteQuestion(id);

            toast.success(

                "Question Deleted Successfully"

            );

            loadQuestions();

        }

        catch(error){

            toast.error(

                error.response?.data?.detail||

                "Delete Failed"

            );

        }

    };    const columns = [

        {

            field: "question_text",

            headerName: "Question",

            flex: 2.8

        },

        {

            field: "question_type",

            headerName: "Type",

            flex: 1,

            renderCell: (params) => (

                <Box

                    sx={{

                        bgcolor:

                            params.row.question_type === "mcq"

                                ? "#DBEAFE"

                                : "#FCE7F3",

                        color:

                            params.row.question_type === "mcq"

                                ? "#1D4ED8"

                                : "#BE185D",

                        px: 2,

                        py: .5,

                        borderRadius: 5,

                        fontWeight: 700,

                        textTransform: "uppercase",

                        fontSize: 12

                    }}

                >

                    {params.row.question_type}

                </Box>

            )

        },

        {

            field: "difficulty",

            headerName: "Difficulty",

            flex: 1,

            renderCell: (params) => {

                const colors = {

                    easy: {

                        bg: "#DCFCE7",

                        color: "#166534"

                    },

                    medium: {

                        bg: "#FEF3C7",

                        color: "#92400E"

                    },

                    hard: {

                        bg: "#FEE2E2",

                        color: "#991B1B"

                    }

                };

                return (

                    <Box

                        sx={{

                            bgcolor:

                                colors[params.row.difficulty]?.bg,

                            color:

                                colors[params.row.difficulty]?.color,

                            px: 2,

                            py: .5,

                            borderRadius: 5,

                            fontWeight: 700,

                            textTransform: "capitalize",

                            fontSize: 12

                        }}

                    >

                        {params.row.difficulty}

                    </Box>

                );

            }

        },

        {

            field: "marks",

            headerName: "Marks",

            flex: .7,

            renderCell: (params) => (

                <Typography

                    fontWeight="bold"

                >

                    {params.row.marks}

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

        <Tooltip title="Browse Question">

            <IconButton

                color="success"

                onClick={()=>

                    loadQuestionDetails(

                        params.row

                    )

                }

            >

                <Visibility/>

            </IconButton>

        </Tooltip>

        <Tooltip title="Edit">

            <IconButton

                color="primary"

                onClick={()=>{

                    setSelectedQuestion(

                        params.row

                    );

                    setOpenDialog(true);

                }}

            >

                <Edit/>

            </IconButton>

        </Tooltip>

        <Tooltip title="Delete">

            <IconButton

                color="error"

                onClick={()=>

                    handleDelete(

                        params.row.id

                    )

                }

            >

                <Delete/>

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

                    display:"flex",

                    justifyContent:"space-between",

                    alignItems:"center",

                    mb:4

                }}

            >

                <Box>

                    <Typography

                        variant="h4"

                        fontWeight="bold"

                    >

                        Question Management

                    </Typography>

                    <Typography

                        color="text.secondary"

                        mt={1}

                    >

                        Create and manage quiz questions

                    </Typography>

                </Box>

                <Button

                    variant="contained"

                    startIcon={<Add/>}

                    onClick={()=>{

                        setSelectedQuestion(null);

                        setOpenDialog(true);

                    }}

                    sx={{

                        px:4,

                        py:1.4,

                        borderRadius:3,

                        textTransform:"none",

                        fontWeight:700

                    }}

                >

                    Add Question

                </Button>

            </Box>

            <Paper

                elevation={0}

                sx={{

                    p:3,

                    borderRadius:4

                }}

            >

                <TextField

                    fullWidth

                    placeholder="Search Question..."

                    value={search}

                    onChange={(e)=>

                        setSearch(

                            e.target.value

                        )

                    }

                    sx={{

                        mb:3

                    }}

                    InputProps={{

                        startAdornment:(

                            <InputAdornment position="start">

                                <Search/>

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

    viewingQuestion &&

    (

        <Card

            elevation={3}

            sx={{

                mt:4,

                borderRadius:4

            }}

        >

            <CardContent>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Typography

                        variant="h5"

                        fontWeight="bold"

                    >

                        Question Details

                    </Typography>

                    <Button

                        variant="outlined"

                        onClick={()=>{

                            setViewingQuestion(null);

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

                    <Grid item xs={12} md={4}>

                        <Card sx={{bgcolor:"#EEF2FF"}}>

                            <CardContent>

                                <Typography color="text.secondary">

                                    Quiz

                                </Typography>

                                <Typography

                                    fontWeight="bold"

                                >

                                    {

                                        details?.quiz?.title ||

                                        "-"

                                    }

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Card sx={{bgcolor:"#ECFDF5"}}>

                            <CardContent>

                                <Typography color="text.secondary">

                                    Category

                                </Typography>

                                <Typography

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

                    <Grid item xs={12} md={4}>

                        <Card sx={{bgcolor:"#FEF3C7"}}>

                            <CardContent>

                                <Typography color="text.secondary">

                                    Created

                                </Typography>

                                <Typography

                                    fontWeight="bold"

                                >

                                    {

                                        formatDate(

                                            details?.question?.created_at

                                        )

                                    }

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

                <Divider sx={{mb:3}}/>

                <Typography

                    variant="h6"

                    fontWeight="bold"

                >

                    {

                        details?.question?.question_text

                    }

                </Typography>

                <Stack

                    direction="row"

                    spacing={1}

                    mt={2}

                    mb={3}

                    flexWrap="wrap"

                >

                    <Chip

                        label={

                            details?.question?.question_type

                        }

                        color="primary"

                    />

                    <Chip

                        label={

                            details?.question?.difficulty

                        }

                        color="warning"

                    />

                    <Chip

                        label={`${details?.question?.marks} Marks`}

                        color="success"

                    />

                </Stack>

                <Typography

                    fontWeight="bold"

                    mb={2}

                >

                    Options

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

    <>

        <Grid

            container

            spacing={2}

            mb={3}

        >

            {

                details?.question?.options?.map(

                    (

                        option,

                        index

                    )=>(

                        <Grid

                            item

                            xs={12}

                            sm={6}

                            key={index}

                        >

                            <Paper

                                variant="outlined"

                                sx={{

                                    p:2,

                                    borderRadius:3,

                                    bgcolor:

                                        option===

                                        details?.question?.correct_answer

                                        ?

                                        "#ECFDF5"

                                        :

                                        "#F8FAFC",

                                    border:

                                        option===

                                        details?.question?.correct_answer

                                        ?

                                        "2px solid #22C55E"

                                        :

                                        "1px solid #E5E7EB"

                                }}

                            >

                                <Typography>

                                    {option}

                                </Typography>

                            </Paper>

                        </Grid>

                    )

                )

            }

        </Grid>

        <Divider

            sx={{

                my:3

            }}

        />

        <Typography

            variant="subtitle1"

            fontWeight="bold"

            gutterBottom

        >

            Correct Answer

        </Typography>

        <Chip

            label={

                details?.question?.correct_answer

            }

            color="success"

            sx={{

                fontWeight:"bold",

                mb:3

            }}

        />

        {

            details?.question?.tags?.length>0 &&

            <>

                <Typography

                    variant="subtitle1"

                    fontWeight="bold"

                    gutterBottom

                >

                    Tags

                </Typography>

                <Stack

                    direction="row"

                    spacing={1}

                    flexWrap="wrap"

                    useFlexGap

                >

                    {

                        details.question.tags.map(

                            (

                                tag,

                                index

                            )=>(

                                <Chip

                                    key={index}

                                    label={tag}

                                    variant="outlined"

                                    color="secondary"

                                />

                            )

                        )

                    }

                </Stack>

            </>

        }

    </>

}

            </CardContent>

        </Card>

    )

}

<QuestionDialog

    open={openDialog}

    handleClose={()=>

        setOpenDialog(false)

    }

    selectedQuestion={selectedQuestion}

    refreshQuestions={loadQuestions}

/>

</Box>

);

}

export default Questions;

            