import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    TextField,
    InputAdornment,
    Stack,
    CircularProgress
} from "@mui/material";

import {
    Search,
    Timer,
    EmojiEvents,
    PlayArrow,
    Logout,
    Quiz,
    Category,
    Assessment,
    TrendingUp,
    History
} from "@mui/icons-material";

import {
    useEffect,
    useState,
    useMemo
} from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { getQuizzes } from "../services/quizService";
import { getCategories } from "../services/categoryService";
import { getHistory } from "../services/resultService";
function Dashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [quizzes, setQuizzes] = useState([]);

    const [categories, setCategories] = useState([]);

    const [history, setHistory] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            setLoading(true);

            const quizResponse = await getQuizzes();

            const categoryResponse = await getCategories();

            const historyResponse = await getHistory();

            setQuizzes(

                quizResponse.data || []

            );

            setCategories(

                categoryResponse.data || []

            );

            setHistory(

                historyResponse.data || []

            );

        }

        catch {

            toast.error(

                "Unable to load dashboard"

            );

        }

        finally {

            setLoading(false);

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        localStorage.removeItem("currentQuiz");

        localStorage.removeItem("currentAttempt");

        toast.success(

            "Logged out successfully"

        );

        navigate("/login");

    };

    const categoryMap = useMemo(() => {

        const map = {};

        categories.forEach((category) => {

            map[

                category.id || category._id

            ] = category.name;

        });

        return map;

    }, [categories]);

    const filteredQuizzes = quizzes.filter((quiz) => {

        const searchMatch =

            quiz.title

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                );

        const categoryMatch =

            selectedCategory === "All"

            ||

            categoryMap[

                quiz.category_id

            ] === selectedCategory;

        return searchMatch && categoryMatch;

    });

    const averageScore =

        history.length

            ?

            Math.round(

                history.reduce(

                    (sum, item) =>

                        sum +

                        item.percentage,

                    0

                ) / history.length

            )

            :

            0;

    const today = new Date().toLocaleDateString(

        "en-IN",

        {

            day: "numeric",

            month: "long",

            year: "numeric"

        }

    );
        if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh"
                }}
            >

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Box>

            {/* Hero */}

            <Card

                sx={{

                    mb:4,

                    borderRadius:5,

                    background:

                    "linear-gradient(135deg,#4F46E5,#7C3AED)",

                    color:"#fff"

                }}

            >

                <CardContent sx={{p:5}}>

                    <Stack

                        direction="row"

                        alignItems="flex-start"

                        spacing={2}

                    >

                        <Box

    sx={{

        flex:1

    }}

>

                            <Typography

                                variant="h3"

                                fontWeight="bold"

                            >

                                Welcome Back 

                            </Typography>

                            <Typography

                                mt={1}

                            >

                                Ready to take today's assessment?

                            </Typography>

                            <Typography

                                mt={2}

                                sx={{

                                    opacity:.85

                                }}

                            >

                                {today}

                            </Typography>

                        </Box>

                        <Button

                            variant="contained"

                            startIcon={<Logout/>}

                            onClick={logout}

                           sx={{

    bgcolor:"#fff",

    color:"#4F46E5",

    fontWeight:"bold",

    px:4,

    py:1.6,

    minWidth:170,

    height:56,

    borderRadius:3,

    ml:"auto",

    boxShadow:3,

    "&:hover":{

        bgcolor:"#F8FAFC"

    }

}}
                        >

                            Logout

                        </Button>

                    </Stack>

                </CardContent>

            </Card>

            {/* Statistics */}

            <Grid

                container

                spacing={3}

                mb={4}

            >

                <Grid item xs={12} sm={6} md={3}>

                    <Card sx={{borderRadius:4}}>

                        <CardContent>

                            <Quiz

                                color="primary"

                                sx={{fontSize:42}}

                            />

                            <Typography mt={2}>

                                Available Quizzes

                            </Typography>

                            <Typography

                                variant="h4"

                                fontWeight="bold"

                            >

                                {quizzes.length}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid item xs={12} sm={6} md={3}>

                    <Card sx={{borderRadius:4}}>

                        <CardContent>

                            <Category

                                color="secondary"

                                sx={{fontSize:42}}

                            />

                            <Typography mt={2}>

                                Categories

                            </Typography>

                            <Typography

                                variant="h4"

                                fontWeight="bold"

                            >

                                {categories.length}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid item xs={12} sm={6} md={3}>

                    <Card sx={{borderRadius:4}}>

                        <CardContent>

                            <History

                                color="success"

                                sx={{fontSize:42}}

                            />

                            <Typography mt={2}>

                                Attempts

                            </Typography>

                            <Typography

                                variant="h4"

                                fontWeight="bold"

                            >

                                {history.length}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid item xs={12} sm={6} md={3}>

                    <Card sx={{borderRadius:4}}>

                        <CardContent>

                            <TrendingUp

                                color="warning"

                                sx={{fontSize:42}}

                            />

                            <Typography mt={2}>

                                Avg Score

                            </Typography>

                            <Typography

                                variant="h4"

                                fontWeight="bold"

                            >

                                {averageScore}%

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            {/* Search */}

            <TextField

                fullWidth

                placeholder="Search Quiz"

                value={search}

                onChange={(e)=>

                    setSearch(

                        e.target.value

                    )

                }

                sx={{mb:3}}

                InputProps={{

                    startAdornment:(

                        <InputAdornment position="start">

                            <Search/>

                        </InputAdornment>

                    )

                }}

            />

            {/* Categories */}

            <Stack

                direction="row"

                spacing={1}

                flexWrap="wrap"

                mb={4}

            >

                <Chip

                    label="All"

                    clickable

                    color={

                        selectedCategory==="All"

                        ?

                        "primary"

                        :

                        "default"

                    }

                    onClick={()=>

                        setSelectedCategory("All")

                    }

                />

                {

                    categories.map((category)=>(

                        <Chip

                            key={

                                category.id||

                                category._id

                            }

                            label={category.name}

                            clickable

                            color={

                                selectedCategory===category.name

                                ?

                                "primary"

                                :

                                "default"

                            }

                            onClick={()=>

                                setSelectedCategory(

                                    category.name

                                )

                            }

                        />

                    ))

                }

            </Stack>

            <Typography

                variant="h4"

                fontWeight="bold"

                mb={3}

            >

                Available Quizzes

            </Typography>

            <Grid container spacing={3}>                {

                    filteredQuizzes.length === 0

                    ?

                    <Grid item xs={12}>

                        <Card

                            sx={{

                                p:5,

                                borderRadius:4,

                                textAlign:"center"

                            }}

                        >

                            <Typography

                                variant="h6"

                                color="text.secondary"

                            >

                                No quizzes found

                            </Typography>

                        </Card>

                    </Grid>

                    :

                    filteredQuizzes.map((quiz)=>(

                        <Grid

                            item

                            xs={12}

                            sm={6}

                            lg={4}

                            key={

                                quiz.id||

                                quiz._id

                            }

                        >

                            <Card

                                elevation={3}

                                sx={{

                                    height:"100%",

                                    borderRadius:4,

                                    transition:".3s",

                                    "&:hover":{

                                        transform:

                                        "translateY(-8px)",

                                        boxShadow:

                                        "0 18px 40px rgba(0,0,0,.15)"

                                    }

                                }}

                            >

                                <CardContent>

                                    <Chip

                                        label={

                                            categoryMap[

                                                quiz.category_id

                                            ]||

                                            "General"

                                        }

                                        color="primary"

                                        size="small"

                                    />

                                    <Typography

                                        variant="h5"

                                        fontWeight="bold"

                                        mt={2}

                                    >

                                        {quiz.title}

                                    </Typography>

                                    <Typography

                                        mt={1}

                                        color="text.secondary"

                                        sx={{

                                            minHeight:60

                                        }}

                                    >

                                        {quiz.description}

                                    </Typography>

                                    <Stack

                                        direction="row"

                                        spacing={1}

                                        mt={3}

                                        mb={3}

                                    >

                                        <Chip

                                            icon={<Timer/>}

                                            label={`${quiz.duration} mins`}

                                        />

                                        <Chip

                                            icon={<EmojiEvents/>}

                                            label={`${quiz.total_marks} Marks`}

                                        />

                                    </Stack>

                                    <Button

                                        fullWidth

                                        variant="contained"

                                        startIcon={<PlayArrow/>}

                                        sx={{

                                            py:1.4,

                                            borderRadius:3,

                                            textTransform:"none",

                                            fontWeight:"bold",

                                            background:

                                            "linear-gradient(90deg,#4F46E5,#7C3AED)",

                                            "&:hover":{

                                                background:

                                                "linear-gradient(90deg,#4338CA,#6D28D9)"

                                            }

                                        }}

                                        onClick={()=>

                                            navigate(

                                                `/student/quiz/${

                                                    quiz.id||

                                                    quiz._id

                                                }`

                                            )

                                        }

                                    >

                                        Start Quiz

                                    </Button>

                                </CardContent>

                            </Card>

                        </Grid>

                    ))

                }

            </Grid>

            <Card

                sx={{

                    mt:5,

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

                            Recent Attempts

                        </Typography>

                        <Button

                            onClick={()=>

                                navigate(

                                    "/student/history"

                                )

                            }

                        >

                            View Full History

                        </Button>

                    </Stack>

                    {

                        history.length===0

                        ?

                        <Typography

                            color="text.secondary"

                        >

                            No attempts available.

                        </Typography>

                        :

                        history

                        .slice(0,5)

                        .map((attempt,index)=>(

                            <Stack

                                key={index}

                                direction="row"

                                justifyContent="space-between"

                                alignItems="center"

                                sx={{

                                    py:2,

                                    borderBottom:

                                    index===4

                                    ?

                                    "none"

                                    :

                                    "1px solid #E5E7EB"

                                }}

                            >

                                <Box>

                                    <Typography

                                        fontWeight="bold"

                                    >

                                        {

                                            attempt.quiz_title

                                        }

                                    </Typography>

                                    <Typography

                                        color="text.secondary"

                                        fontSize={14}

                                    >

                                        {

                                            attempt.score

                                        }

                                        /

                                        {

                                            attempt.total_marks

                                        }

                                        {" • "}

                                        {

                                            attempt.percentage

                                        }%

                                    </Typography>

                                </Box>

                                <Chip

                                    label={

                                        attempt.status

                                    }

                                    color={

                                        attempt.status==="PASS"

                                        ?

                                        "success"

                                        :

                                        "error"

                                    }

                                />

                            </Stack>

                        ))

                    }

                </CardContent>

            </Card>

        </Box>

    );

}

export default Dashboard;