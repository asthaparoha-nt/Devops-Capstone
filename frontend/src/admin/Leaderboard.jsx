import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    MenuItem,
    Avatar,
    Chip,
    Stack
} from "@mui/material";

import {
    Search,
    EmojiEvents
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
    getLeaderboard
} from "../services/resultService";

function Leaderboard(){

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

        loadLeaderboard();

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

    const loadLeaderboard = async()=>{

        try{

            setLoading(true);

            const response = await getLeaderboard(

                selectedQuiz

            );

            setRows(

                (response.data || []).map(

                    (

                        item,

                        index

                    )=>({

                        id:index+1,

                        rank:index+1,

                        ...item

                    })

                )

            );

        }

        catch{

            toast.error(

                "Unable to load leaderboard"

            );

        }

        finally{

            setLoading(false);

        }

    };

    const filteredRows = useMemo(()=>{

        const value =

        search.toLowerCase();

        return rows.filter(

            (row)=>

                row.student_email

                ?.toLowerCase()

                .includes(value)

        );

    },[

        rows,

        search

    ]);
    const columns = [

    {

        field:"rank",

        headerName:"Rank",

        width:110,

        align:"center",

        headerAlign:"center",

        renderCell:(params)=>{

            if(params.value===1){

                return(

                    <Stack

                        direction="row"

                        spacing={1}

                        alignItems="center"

                    >

                        <EmojiEvents

                            sx={{

                                color:"#F59E0B"

                            }}

                        />

                        <Typography

                            fontWeight="bold"

                        >

                            #1

                        </Typography>

                    </Stack>

                );

            }

            if(params.value===2){

                return(

                    <Stack

                        direction="row"

                        spacing={1}

                        alignItems="center"

                    >

                        <EmojiEvents

                            sx={{

                                color:"#9CA3AF"

                            }}

                        />

                        <Typography

                            fontWeight="bold"

                        >

                            #2

                        </Typography>

                    </Stack>

                );

            }

            if(params.value===3){

                return(

                    <Stack

                        direction="row"

                        spacing={1}

                        alignItems="center"

                    >

                        <EmojiEvents

                            sx={{

                                color:"#B45309"

                            }}

                        />

                        <Typography

                            fontWeight="bold"

                        >

                            #3

                        </Typography>

                    </Stack>

                );

            }

            return(

                <Typography

                    fontWeight="bold"

                >

                    #{params.value}

                </Typography>

            );

        }

    },

    {

        field:"student_email",

        headerName:"Student",

        flex:2,

        minWidth:260,

        renderCell:(params)=>(

            <Stack

                direction="row"

                spacing={2}

                alignItems="center"

                sx={{

                    height:"100%"

                }}

            >

                <Avatar>

                    {

                        params.value

                        ?.charAt(0)

                        .toUpperCase()

                    }

                </Avatar>

                <Typography>

                    {params.value}

                </Typography>

            </Stack>

        )

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

    }

];
return(

    <Box>

        <Typography

            variant="h4"

            fontWeight="bold"

            mb={4}

        >

            Leaderboard

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

                    label="Select Quiz"

                    value={selectedQuiz}

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

                    Select a quiz to view the leaderboard.

                </Typography>

                <Typography

                    mt={1}

                    color="text.secondary"

                >

                    Rankings will be generated based on student scores.

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

                    Loading leaderboard...

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

                    pageSizeOptions={[

                        5,

                        10,

                        20

                    ]}

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

                        "& .MuiDataGrid-row:hover":{

                            background:"#F8FAFC"

                        },

                        "& .MuiDataGrid-cell":{

                            py:1

                        }

                    }}

                />

            </Paper>

        }

    </Box>

);

}

export default Leaderboard;