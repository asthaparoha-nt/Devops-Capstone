import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    MenuItem,
    Chip,
} from "@mui/material";

import {
    Search
} from "@mui/icons-material";

import {
    DataGrid
} from "@mui/x-data-grid";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    toast
} from "react-toastify";

import {
    getQuizzes
} from "../services/quizService";

import {
    getQuizResults
} from "../services/resultService";

function Results(){

    const [

        rows,

        setRows

    ] = useState([]);

    const [

        quizzes,

        setQuizzes

    ] = useState([]);

    const [

        selectedQuiz,

        setSelectedQuiz

    ] = useState("");

    const [

        search,

        setSearch

    ] = useState("");

    const [

        loading,

        setLoading

    ] = useState(false);

    useEffect(()=>{

        loadQuizzes();

    },[]);

    useEffect(()=>{

        if(!selectedQuiz){

            setRows([]);

            return;

        }

        loadResults();

    },[selectedQuiz]);

    const loadQuizzes = async()=>{

        try{

            const response = await getQuizzes();

            setQuizzes(

                response.data || []

            );

        }

        catch{

            toast.error(

                "Unable to load quizzes"

            );

        }

    };

    const loadResults = async()=>{

        try{

            setLoading(true);

            const response = await getQuizResults(

                selectedQuiz

            );

            const data =

                response.data || [];

            setRows(

                data.map(

                    (

                        item,

                        index

                    )=>({

                        id:index+1,

                        ...item

                    })

                )

            );

        }

        catch{

            toast.error(

                "Unable to load quiz results"

            );

        }

        finally{

            setLoading(false);

        }

    };

    const formatDate=(value)=>{

        if(!value){

            return "-";

        }

        return new Date(

            value

        ).toLocaleDateString(

            "en-GB",

            {

                day:"2-digit",

                month:"2-digit",

                year:"2-digit"

            }

        );

    };

    const filteredRows = useMemo(()=>{

        const value =

        search.toLowerCase();

        return rows.filter(

            (row)=>

                row.student_email

                ?.toLowerCase()

                .includes(value)

                ||

                row.status

                ?.toLowerCase()

                .includes(value)

                ||

                String(

                    row.score

                ).includes(value)

                ||

                String(

                    row.percentage

                ).includes(value)

        );

    },[

        rows,

        search

    ]);
    const columns = [

    {

        field:"student_email",

        headerName:"Student",

        flex:2,

        minWidth:240

    },

    {

        field:"score",

        headerName:"Score",

        width:110,

        align:"center",

        headerAlign:"center"

    },

    {

        field:"total_marks",

        headerName:"Total",

        width:110,

        align:"center",

        headerAlign:"center"

    },

    {

        field:"percentage",

        headerName:"Percentage",

        width:140,

        align:"center",

        headerAlign:"center",

        renderCell:(params)=>(

            <Typography

                fontWeight="bold"

                color={

                    params.row.percentage>=60

                    ?

                    "success.main"

                    :

                    "error.main"

                }

            >

                {params.row.percentage}%

            </Typography>

        )

    },

    {

        field:"status",

        headerName:"Status",

        width:130,

        align:"center",

        headerAlign:"center",

        renderCell:(params)=>(

            <Chip

                label={params.value}

                color={

                    params.value==="PASS"

                    ?

                    "success"

                    :

                    "error"

                }

                size="small"

                sx={{

                    width:90,

                    fontWeight:"bold"

                }}

            />

        )

    },

    {

        field:"submitted_at",

        headerName:"Submitted",

        flex:1,

        minWidth:150,

        valueFormatter:(params)=>

            formatDate(

                params

            )

    }

];return(

    <Box>

        <Typography

            variant="h4"

            fontWeight="bold"

            mb={4}

        >

            Quiz Results

        </Typography>

        <Paper

            elevation={0}

            sx={{

                p:3,

                borderRadius:4,

                mb:3

            }}

        >

            <Box

                sx={{

                    display:"flex",

                    gap:3,

                    flexWrap:"wrap"

                }}

            >

                <TextField

                    placeholder="Search Student..."

                    value={search}

                    onChange={(e)=>

                        setSearch(

                            e.target.value

                        )

                    }

                    sx={{

                        flex:1,

                        minWidth:280

                    }}

                    InputProps={{

                        startAdornment:(

                            <InputAdornment position="start">

                                <Search/>

                            </InputAdornment>

                        )

                    }}

                />

                <TextField

                    select

                    value={selectedQuiz}

                    label="Select Quiz"

                    onChange={(e)=>

                        setSelectedQuiz(

                            e.target.value

                        )

                    }

                    sx={{

                        flex:1,

                        minWidth:380

                    }}

                >

                    {

                        quizzes.map(

                            (quiz)=>(

                                <MenuItem

                                    key={quiz.id}

                                    value={quiz.id}

                                >

                                    {quiz.title}

                                </MenuItem>

                            )

                        )

                    }

                </TextField>

            </Box>

        </Paper>

        {

            !selectedQuiz

            ?

            <Paper

                elevation={0}

                sx={{

                    borderRadius:4,

                    py:10,

                    textAlign:"center"

                }}

            >

                <Typography

                    variant="h6"

                    color="text.secondary"

                >

                    Select a quiz to view student results.

                </Typography>

                <Typography

                    color="text.secondary"

                    mt={1}

                >

                    Student attempts and scores will appear here after selecting a quiz.

                </Typography>

            </Paper>

            :

            loading

            ?

            <Paper

                elevation={0}

                sx={{

                    borderRadius:4,

                    py:10,

                    textAlign:"center"

                }}

            >

                <Typography

                    variant="h6"

                >

                    Loading quiz results...

                </Typography>

            </Paper>

            :

            <Paper

                elevation={0}

                sx={{

                    p:2,

                    borderRadius:4

                }}

            >

                <DataGrid

                    rows={filteredRows}

                    columns={columns}

                    autoHeight

                    disableRowSelectionOnClick

                    pageSizeOptions={[5,10,20]}

                    initialState={{

                        pagination:{

                            paginationModel:{

                                page:0,

                                pageSize:5

                            }

                        }

                    }}

                    sx={{

                        border:0,

                        borderRadius:3,

                        "& .MuiDataGrid-columnHeaders":{

                            background:"#EEF2FF",

                            fontWeight:"bold",

                            fontSize:15

                        },

                        "& .MuiDataGrid-cell":{

                            py:1

                        },

                        "& .MuiDataGrid-row:hover":{

                            background:"#F8FAFC"

                        }

                    }}

                />

            </Paper>

        }

    </Box>

);

}

export default Results;