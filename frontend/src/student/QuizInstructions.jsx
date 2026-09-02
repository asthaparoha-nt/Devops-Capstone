import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Checkbox,
    FormControlLabel,
    CircularProgress,
    Chip
} from "@mui/material";

import {
    AccessTime,
    EmojiEvents,
    School
} from "@mui/icons-material";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { toast } from "react-toastify";

import { getQuizzes } from "../services/quizService";
import { getCategories } from "../services/categoryService";
import { startAttempt } from "../services/attemptService";

function QuizInstructions() {

    const { quizId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [agree, setAgree] = useState(false);

    const [quiz, setQuiz] = useState(null);

    const [category, setCategory] = useState("");

    useEffect(() => {

        loadQuiz();

    }, []);

    const loadQuiz = async () => {

        try {

            const quizzes = await getQuizzes();

            const categories = await getCategories();

            const selectedQuiz = quizzes.data.find(

                item =>

                    (item.id || item._id) === quizId

            );

            if (!selectedQuiz) {

                toast.error("Quiz not found");

                navigate("/student/dashboard");

                return;

            }

            setQuiz(selectedQuiz);

            const selectedCategory = categories.data.find(

                item =>

                    (item.id || item._id) ===

                    selectedQuiz.category_id

            );

            setCategory(

                selectedCategory?.name ||

                "General"

            );

        }

        catch {

            toast.error(

                "Unable to load quiz"

            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleStart = async () => {

        if (!agree) {

            toast.warning(

                "Please accept the instructions"

            );

            return;

        }

        try {

            const response = await startAttempt(

    quizId

);

localStorage.setItem(

    "currentQuiz",

    quizId

);

localStorage.setItem(

    "currentAttempt",

    JSON.stringify(response.data)

);

toast.success(

    "Quiz Started"

);

navigate(

    `/student/attempt/${response.data.id}`

);

        }

        catch (error) {

            toast.error(

                error.response?.data?.detail ||

                error.response?.data?.message ||

                "Unable to start quiz"

            );

        }

    };

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

        <Box sx={{ maxWidth: 900, mx: "auto", py: 4 }}>        <Card
            elevation={4}
            sx={{
                borderRadius: 5,
                overflow: "hidden"
            }}
        >

            <Box
                sx={{
                    background:
                        "linear-gradient(135deg,#4F46E5,#7C3AED)",
                    color: "#fff",
                    p: 4
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >

                    {quiz.title}

                </Typography>

                <Typography mt={1}>

                    {quiz.description}

                </Typography>

            </Box>

            <CardContent sx={{ p: 4 }}>

                <Stack
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    mb={4}
                >

                    <Chip
                        icon={<School />}
                        label={category}
                        color="primary"
                    />

                    <Chip
                        icon={<AccessTime />}
                        label={`${quiz.duration} Minutes`}
                    />

                    <Chip
                        icon={<EmojiEvents />}
                        label={`${quiz.total_marks} Marks`}
                        color="success"
                    />

                </Stack>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={2}
                >

                    Instructions

                </Typography>

                <Stack spacing={2} mb={4}>

                    <Typography>
                        • Read every question carefully before answering.
                    </Typography>

                    <Typography>
                        • Each question carries marks as specified.
                    </Typography>

                    <Typography>
                        • Your answers are automatically saved.
                    </Typography>

                    <Typography>
                        • You can change answers before submission.
                    </Typography>

                    <Typography>
                        • Timer cannot be paused after starting.
                    </Typography>

                    <Typography>
                        • Quiz will auto submit when time expires.
                    </Typography>

                    <Typography color="error">

                        Attempts Remaining :

                        {" "}

                        <strong>

                        {quiz.attempts_remaining}/2

                        </strong>

                    </Typography>

                </Stack>

                <FormControlLabel

                    control={

                        <Checkbox

                            checked={agree}

                            onChange={(e)=>

                                setAgree(

                                    e.target.checked

                                )

                            }

                        />

                    }

                    label="I have read and agree to the above instructions."

                />

                <Button

                    fullWidth

                    variant="contained"

                    size="large"

                    sx={{

                        mt:4,

                        py:1.6,

                        borderRadius:3,

                        textTransform:"none",

                        fontWeight:"bold",

                        fontSize:17,

                        background:

                        "linear-gradient(90deg,#4F46E5,#7C3AED)",

                        "&:hover":{

                            background:

                            "linear-gradient(90deg,#4338CA,#6D28D9)"

                        }

                    }}

                    onClick={handleStart}

                >

                    Start Assessment

                </Button>

            </CardContent>

        </Card>

    </Box>

);

}

export default QuizInstructions;