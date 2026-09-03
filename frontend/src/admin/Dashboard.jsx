import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Avatar,
    TextField,
    InputAdornment,
    CircularProgress,
    Chip,
    Divider,
    IconButton,
    Tooltip as MuiTooltip
} from "@mui/material";

import {
    Logout,
    Search,
    Category,
    Quiz,
    Help,
    School,
    AssignmentTurnedIn,
    TrendingUp,
    Add,
    CalendarMonth,
    ArrowForward,
    BarChart,
    PieChart as PieChartIcon
} from "@mui/icons-material";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart as ReBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import { toast } from "react-toastify";

import api from "../api/axios";

import {
    getCategories
} from "../services/categoryService";

import {
    getQuizzes
} from "../services/quizService";

import {
    getQuestions
} from "../services/questionService";
function Dashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState({});

    const [categories, setCategories] = useState([]);

    const [quizzes, setQuizzes] = useState([]);

    const [questions, setQuestions] = useState([]);

    const [search, setSearch] = useState("");

    const colors = [
        "#4F46E5",
        "#0EA5E9",
        "#22C55E",
        "#F59E0B",
        "#EF4444",
        "#7C3AED"
    ];
        useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [

                dashboardResponse,

                categoryResponse,

                quizResponse,

                questionResponse

            ] = await Promise.all([

                api.get("/dashboard/admin"),

                getCategories(),

                getQuizzes(),

                getQuestions()

            ]);

            setDashboard(
                dashboardResponse.data.data || {}
            );

            setCategories(
                categoryResponse.data || []
            );

            setQuizzes(
                quizResponse.data || []
            );

            setQuestions(
                questionResponse.data || []
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

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(

            "en-GB",

            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }

        );

    };
        const searchResults = useMemo(() => {

        if (!search.trim()) {

            return [];

        }

        const value = search.toLowerCase();

        return [

            ...categories

                .filter((category) =>

                    category.name

                        .toLowerCase()

                        .includes(value)

                )

                .map((category) => ({

                    type: "Category",

                    title: category.name,

                    subtitle: "Browse Category",

                    route: "/admin/categories"

                })),

            ...quizzes

                .filter((quiz) =>

                    quiz.title

                        .toLowerCase()

                        .includes(value)

                )

                .map((quiz) => ({

                    type: "Quiz",

                    title: quiz.title,

                    subtitle: "Manage Quiz",

                    route: "/admin/quizzes"

                })),

            ...questions

                .filter((question) =>

                    question.question_text

                        .toLowerCase()

                        .includes(value)

                )

                .map((question) => ({

                    type: "Question",

                    title: question.question_text,

                    subtitle: "Manage Question",

                    route: "/admin/questions"

                }))

        ];

    }, [

        search,

        categories,

        quizzes,

        questions

    ]);

    const stats = [

        {

            title: "Students",

            value: dashboard.total_students || 0,

            icon: <School />,

            color: "#4F46E5"

        },

        {

            title: "Categories",

            value: dashboard.total_categories || 0,

            icon: <Category />,

            color: "#06B6D4"

        },

        {

            title: "Quizzes",

            value: dashboard.total_quizzes || 0,

            icon: <Quiz />,

            color: "#22C55E"

        },

        {

            title: "Questions",

            value: dashboard.total_questions || 0,

            icon: <Help />,

            color: "#F59E0B"

        },

        {

            title: "Attempts",

            value: dashboard.total_attempts || 0,

            icon: <AssignmentTurnedIn />,

            color: "#EF4444"

        },

        {

            title: "Average",

            value: dashboard.average_score || 0,

            icon: <TrendingUp />,

            color: "#7C3AED"

        }

    ];

    const chartData = [

        {

            name: "Categories",

            value: dashboard.total_categories || 0

        },

        {

            name: "Quizzes",

            value: dashboard.total_quizzes || 0

        },

        {

            name: "Questions",

            value: dashboard.total_questions || 0

        },

        {

            name: "Students",

            value: dashboard.total_students || 0

        }

    ];

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

        <Box

            sx={{

                p: 4,

                background: "#F8FAFC",

                minHeight: "100vh"

            }}

        >            {/* Hero Section */}

            <Card

                elevation={0}

                sx={{

                    mb: 4,

                    borderRadius: 5,

                    overflow: "hidden",

                    background:

                        "linear-gradient(135deg,#4338CA,#7C3AED)",

                    color: "#fff"

                }}

            >

                <CardContent sx={{ p: 5 }}>

                    <Stack

                        direction={{

                            xs: "column",

                            md: "row"

                        }}

                        justifyContent="space-between"

                        spacing={4}

                    >

                        <Box>

                            <Typography

                                variant="h3"

                                fontWeight="bold"

                            >

                                Welcome Back 👋

                            </Typography>

                            <Typography

                                mt={1}

                                sx={{

                                    opacity: .9

                                }}

                            >

                                Assessment Portal Administration

                            </Typography>

                            <Stack

                                direction="row"

                                spacing={1}

                                mt={3}

                                alignItems="center"

                            >

                                <CalendarMonth/>

                                <Typography>

                                    {

                                        formatDate(

                                            new Date()

                                        )

                                    }

                                </Typography>

                            </Stack>

                        </Box>

                        <Stack

                            direction="row"

                            spacing={2}

                            alignItems="center"

                        >

                            <Avatar

                                sx={{

                                    width: 60,

                                    height: 60,

                                    bgcolor: "#fff",

                                    color: "#4338CA",

                                    fontWeight: "bold",

                                    fontSize: 22

                                }}

                            >

                                A

                            </Avatar>

                           
                        </Stack>

                    </Stack>

                </CardContent>

            </Card>

            {/* Search */}

            <TextField

                fullWidth

                placeholder="Search Categories, Quizzes or Questions..."

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                InputProps={{

                    startAdornment:(

                        <InputAdornment position="start">

                            <Search/>

                        </InputAdornment>

                    )

                }}

                sx={{

                    mb:3,

                    "& .MuiOutlinedInput-root":{

                        bgcolor:"#fff",

                        borderRadius:3

                    }

                }}

            />

            {

                search.trim()!=="" &&

                <Card

                    sx={{

                        mb:4,

                        borderRadius:3

                    }}

                >

                    <CardContent>

                        {

                            searchResults.length===0

                            ?

                            <Typography

                                color="text.secondary"

                            >

                                No results found.

                            </Typography>

                            :

                            searchResults

                            .slice(0,8)

                            .map((item,index)=>(

                                <Button

                                    key={index}

                                    fullWidth

                                    sx={{

                                        justifyContent:"space-between",

                                        py:1.5,

                                        textTransform:"none"

                                    }}

                                    onClick={()=>navigate(item.route)}

                                >

                                    <Box

                                        textAlign="left"

                                    >

                                        <Typography

                                            fontWeight="bold"

                                        >

                                            {item.title}

                                        </Typography>

                                        <Typography

                                            variant="body2"

                                            color="text.secondary"

                                        >

                                            {item.subtitle}

                                        </Typography>

                                    </Box>

                                    <Chip

                                        label={item.type}

                                        color="primary"

                                        size="small"

                                    />

                                </Button>

                            ))

                        }

                    </CardContent>

                </Card>

            }

            {/* Statistics */}

            <Grid

                container

                spacing={3}

                mb={4}

            >                {

                    stats.map((item,index)=>(

                        <Grid

                            item

                            xs={12}

                            sm={6}

                            md={4}

                            lg={2}

                            key={index}

                        >

                            <Card

                                elevation={3}

                                sx={{

                                    borderRadius:4,

                                    height:"100%",

                                    transition:"0.35s",

                                    cursor:"pointer",

                                    "&:hover":{

                                        transform:"translateY(-8px)",

                                        boxShadow:"0 18px 40px rgba(0,0,0,.15)"

                                    }

                                }}

                            >

                                <CardContent>

                                    <Stack

                                        direction="row"

                                        justifyContent="space-between"

                                        alignItems="center"

                                    >

                                        <Avatar

                                            sx={{

                                                bgcolor:item.color,

                                                width:56,

                                                height:56

                                            }}

                                        >

                                            {item.icon}

                                        </Avatar>

                                        <TrendingUp

                                            sx={{

                                                color:"#D1D5DB"

                                            }}

                                        />

                                    </Stack>

                                    <Typography

                                        color="text.secondary"

                                        mt={3}

                                    >

                                        {item.title}

                                    </Typography>

                                    <Typography

                                        variant="h4"

                                        fontWeight="bold"

                                        mt={1}

                                    >

                                        {item.value}

                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>

                    ))

                }

            </Grid>

            {/* Quick Actions */}

            <Typography

                variant="h5"

                fontWeight="bold"

                mb={2}

            >

                Quick Actions

            </Typography>

            <Grid

                container

                spacing={3}

                mb={5}

            >

                <Grid item xs={12} md={4}>

                    <Card

                        sx={{

                            borderRadius:4,

                            transition:".3s",

                            "&:hover":{

                                transform:"translateY(-6px)"

                            }

                        }}

                    >

                        <CardContent>

                            <Button

                                fullWidth

                                variant="contained"

                                startIcon={<Add/>}

                                sx={{

                                    py:2,

                                    borderRadius:3

                                }}

                                onClick={()=>

                                    navigate(

                                        "/admin/categories"

                                    )

                                }

                            >

                                Add Category

                            </Button>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid item xs={12} md={4}>

                    <Card

                        sx={{

                            borderRadius:4,

                            transition:".3s",

                            "&:hover":{

                                transform:"translateY(-6px)"

                            }

                        }}

                    >

                        <CardContent>

                            <Button

                                fullWidth

                                variant="contained"

                                startIcon={<Add/>}

                                sx={{

                                    py:2,

                                    borderRadius:3

                                }}

                                onClick={()=>

                                    navigate(

                                        "/admin/quizzes"

                                    )

                                }

                            >

                                Add Quiz

                            </Button>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid item xs={12} md={4}>

                    <Card

                        sx={{

                            borderRadius:4,

                            transition:".3s",

                            "&:hover":{

                                transform:"translateY(-6px)"

                            }

                        }}

                    >

                        <CardContent>

                            <Button

                                fullWidth

                                variant="contained"

                                startIcon={<Add/>}

                                sx={{

                                    py:2,

                                    borderRadius:3

                                }}

                                onClick={()=>

                                    navigate(

                                        "/admin/questions"

                                    )

                                }

                            >

                                Add Question

                            </Button>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            {/* Charts */}

            <Grid

                container

                spacing={3}

            >                {/* System Overview */}

                <Grid item xs={12} lg={7}>

                    <Card

                        elevation={3}

                        sx={{

                            borderRadius:4,

                            height:"100%"

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

                                    variant="h6"

                                    fontWeight="bold"

                                >

                                    System Analytics

                                </Typography>

                                <BarChart

                                    color="primary"

                                />

                            </Stack>

                            <ResponsiveContainer

                                width="100%"

                                height={330}

                            >

                                <ReBarChart

                                    data={chartData}

                                >

                                    <CartesianGrid

                                        strokeDasharray="3 3"

                                    />

                                    <XAxis

                                        dataKey="name"

                                    />

                                    <YAxis/>

                                    <Tooltip/>

                                    <Bar

                                        dataKey="value"

                                        radius={[8,8,0,0]}

                                    >

                                        {

                                            chartData.map(

                                                (entry,index)=>(

                                                    <Cell

                                                        key={index}

                                                        fill={

                                                            colors[

                                                                index%

                                                                colors.length

                                                            ]

                                                        }

                                                    />

                                                )

                                            )

                                        }

                                    </Bar>

                                </ReBarChart>

                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                </Grid>

                {/* Distribution */}

                <Grid item xs={12} lg={5}>

                    <Card

                        elevation={3}

                        sx={{

                            borderRadius:4,

                            height:"100%"

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

                                    variant="h6"

                                    fontWeight="bold"

                                >

                                    Distribution

                                </Typography>

                                <PieChartIcon/>

                            </Stack>

                            <ResponsiveContainer

                                width="100%"

                                height={330}

                            >

                                <PieChart>

                                    <Pie

                                        data={chartData}

                                        dataKey="value"

                                        nameKey="name"

                                        outerRadius={115}

                                        innerRadius={55}

                                        label

                                    >

                                        {

                                            chartData.map(

                                                (entry,index)=>(

                                                    <Cell

                                                        key={index}

                                                        fill={

                                                            colors[

                                                                index%

                                                                colors.length

                                                            ]

                                                        }

                                                    />

                                                )

                                            )

                                        }

                                    </Pie>

                                    <Tooltip/>

                                </PieChart>

                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

            <Divider

                sx={{

                    my:5

                }}

            />

            {/* Browse Categories */}

            <Typography

                variant="h5"

                fontWeight="bold"

                mb={3}

            >

                Browse Categories

            </Typography>

            <Grid

                container

                spacing={3}

            >

                {

                    categories.map((category)=>{

                        const categoryId=

                            category.id||

                            category._id;

                        const categoryQuizzes=

                            quizzes.filter(

                                quiz=>

                                quiz.category_id===categoryId

                            );

                        const questionCount=

                            questions.filter(

                                question=>

                                    categoryQuizzes.some(

                                        quiz=>

                                        quiz.id===

                                        question.quiz_id

                                    )

                            ).length;

                        return(

                            <Grid

                                item

                                xs={12}

                                md={6}

                                lg={4}

                                key={categoryId}

                            >

                                <Card

                                    elevation={2}

                                    sx={{

                                        borderRadius:4,

                                        transition:".35s",

                                        cursor:"pointer",

                                        "&:hover":{

                                            transform:

                                            "translateY(-8px)",

                                            boxShadow:

                                            "0 18px 40px rgba(0,0,0,.15)"

                                        }

                                    }}

                                >

                                    <CardContent>

                                        <Stack

                                            direction="row"

                                            justifyContent="space-between"

                                            alignItems="center"

                                        >

                                            <Avatar

                                                sx={{

                                                    bgcolor:"#4F46E5"

                                                }}

                                            >

                                                <Category/>

                                            </Avatar>

                                            <Chip

                                                label={

                                                    `${categoryQuizzes.length} Quizzes`

                                                }

                                                color="primary"

                                            />

                                        </Stack>

                                        <Typography

                                            variant="h6"

                                            fontWeight="bold"

                                            mt={3}

                                        >

                                            {category.name}

                                        </Typography>

                                        <Typography

                                            color="text.secondary"

                                            mt={1}

                                        >

                                            {questionCount} Questions

                                        </Typography>

                                        <Button

                                            fullWidth

                                            endIcon={<ArrowForward/>}

                                            sx={{

                                                mt:3,

                                                borderRadius:3

                                            }}

                                            onClick={()=>{

                                                navigate(

                                                    "/admin/categories"

                                                );

                                            }}

                                        >

                                            Browse Category

                                        </Button>

                                    </CardContent>

                                </Card>

                            </Grid>

                        );

                    })

                }

            </Grid>            <Divider sx={{ my: 5 }} />

            {/* Recent Attempts */}

            <Card

                elevation={3}

                sx={{

                    borderRadius:4,

                    mb:5

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

                            Recent Quiz Attempts

                        </Typography>

                        <Button

                            variant="outlined"

                            onClick={()=>

                                navigate(

                                    "/admin/results"

                                )

                            }

                        >

                            View All

                        </Button>

                    </Stack>

                    {

                        !dashboard.recent_attempts ||

                        dashboard.recent_attempts.length===0

                        ?

                        <Box

                            sx={{

                                py:6,

                                textAlign:"center"

                            }}

                        >

                            <Typography

                                variant="h6"

                                color="text.secondary"

                            >

                                No Attempts Available

                            </Typography>

                        </Box>

                        :

                        dashboard.recent_attempts.map(

                            (attempt,index)=>(

                                <Card

                                    key={index}

                                    variant="outlined"

                                    sx={{

                                        mb:2,

                                        borderRadius:3,

                                        "&:hover":{

                                            boxShadow:

                                            "0 10px 25px rgba(0,0,0,.08)"

                                        }

                                    }}

                                >

                                    <CardContent>

                                        <Grid

                                            container

                                            alignItems="center"

                                            spacing={2}

                                        >

                                            <Grid

                                                item

                                                xs={12}

                                                md={4}

                                            >

                                                <Typography

                                                    fontWeight="bold"

                                                >

                                                    {

                                                        attempt.student_email

                                                    }

                                                </Typography>

                                            </Grid>

                                            <Grid

                                                item

                                                xs={12}

                                                md={2}

                                            >

                                                <Chip

                                                    label={

                                                        `${attempt.score} Marks`

                                                    }

                                                    color="success"

                                                />

                                            </Grid>

                                            <Grid

                                                item

                                                xs={12}

                                                md={3}

                                            >

                                                <Typography

                                                    color="text.secondary"

                                                >

                                                    {

                                                        formatDate(

                                                            attempt.submitted_at

                                                        )

                                                    }

                                                </Typography>

                                            </Grid>

                                            <Grid

                                                item

                                                xs={12}

                                                md={3}

                                                textAlign="right"

                                            >

                                                <MuiTooltip

                                                    title="Open Results"

                                                >

                                                    <IconButton

                                                        color="primary"

                                                        onClick={()=>

                                                            navigate(

                                                                "/admin/results"

                                                            )

                                                        }

                                                    >

                                                        <ArrowForward/>

                                                    </IconButton>

                                                </MuiTooltip>

                                            </Grid>

                                        </Grid>

                                    </CardContent>

                                </Card>

                            )

                        )

                    }

                </CardContent>

            </Card>

        </Box>

    );

}

export default Dashboard;