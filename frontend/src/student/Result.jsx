import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    CircularProgress,
    Divider,
    Paper
} from "@mui/material";

import {
    EmojiEvents,
    CheckCircle,
    Cancel
} from "@mui/icons-material";

import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { toast } from "react-toastify";

import {
    getResult
} from "../services/resultService";

function Result() {

    const { attemptId } = useParams();

    const navigate = useNavigate();

    const [

        loading,

        setLoading

    ] = useState(true);

    const [

        result,

        setResult

    ] = useState(null);

    useEffect(() => {

        loadResult();

    }, []);

    const loadResult = async () => {

        try {

            const response = await getResult(

                attemptId

            );

            setResult(

                response.data

            );

        }

        catch (error) {

            toast.error(

                error.response?.data?.detail ||

                error.response?.data?.message ||

                "Unable to load result"

            );

            navigate(

                "/student/dashboard"

            );

        }

        finally {

            setLoading(false);

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

    const passed =

        result.status === "PASS";

    const submittedDate =

        result.submitted_at

        ?

        new Date(

            result.submitted_at

        ).toLocaleString(

            "en-GB",

            {

                day: "2-digit",

                month: "2-digit",

                year: "2-digit",

                hour: "2-digit",

                minute: "2-digit"

            }

        )

        :

        "-";

    return (

        <Box

            sx={{

                maxWidth: 950,

                mx: "auto",

                py: 5

            }}

        ><Card

    sx={{

        borderRadius:5,

        overflow:"hidden"

    }}

>

    <Box

        sx={{

            background:

                passed

                ?

                "linear-gradient(135deg,#16A34A,#22C55E)"

                :

                "linear-gradient(135deg,#DC2626,#EF4444)",

            color:"#fff",

            textAlign:"center",

            p:5

        }}

    >

        <Typography

            variant="h3"

            fontWeight="bold"

        >

            {

                passed

                ?

                "🎉 Congratulations!"

                :

                "Assessment Completed"

            }

        </Typography>

        <Typography

            mt={2}

            fontSize={18}

        >

            {result.quiz_title}

        </Typography>

    </Box>

    <CardContent

        sx={{

            p:5

        }}

    >

        <Stack

            direction={{

                xs:"column",

                md:"row"

            }}

            spacing={5}

            alignItems="center"

            justifyContent="space-between"

        >

            <Box

                sx={{

                    width:220,

                    height:220

                }}

            >

                <CircularProgressbar

                    value={result.percentage}

                    text={`${result.percentage}%`}

                    styles={buildStyles({

                        pathColor:

                            passed

                            ?

                            "#16A34A"

                            :

                            "#DC2626",

                        textColor:

                            passed

                            ?

                            "#16A34A"

                            :

                            "#DC2626",

                        trailColor:"#E5E7EB"

                    })}

                />

            </Box>

            <Box

                flex={1}

            >

                <Chip

                    icon={

                        passed

                        ?

                        <CheckCircle/>

                        :

                        <Cancel/>

                    }

                    label={result.status}

                    color={

                        passed

                        ?

                        "success"

                        :

                        "error"

                    }

                    sx={{

                        fontSize:16,

                        px:2,

                        py:2.5,

                        mb:3

                    }}

                />

                <Typography

                    variant="h5"

                    fontWeight="bold"

                >

                    Score

                </Typography>

                <Typography

                    variant="h3"

                    color="primary"

                    fontWeight="bold"

                    mb={3}

                >

                    {result.score}

                    {" / "}

                    {result.total_marks}

                </Typography>

                <Divider

                    sx={{

                        mb:3

                    }}

                />

                <Typography

                    color="text.secondary"

                >

                    Submitted At

                </Typography>

                <Typography

                    fontWeight="bold"

                    mb={3}

                >

                    {submittedDate}

                </Typography>

                <Stack

                    direction="row"

                    spacing={2}

                    mt={4}

                >

                    <Button

                        variant="contained"

                        startIcon={<EmojiEvents/>}

                        onClick={()=>

                            navigate(

                                "/student/history"

                            )

                        }

                    >

                        View History

                    </Button>

                    <Button

                        variant="outlined"

                        onClick={()=>

                            navigate(

                                "/student/dashboard"

                            )

                        }

                    >

                        Back Dashboard

                    </Button>

                </Stack>

            </Box>

        </Stack>

    </CardContent>

</Card>{

    result.answers?.length > 0 && (

        <Card

            sx={{

                mt:4,

                borderRadius:5

            }}

        >

            <CardContent>

                <Typography

                    variant="h5"

                    fontWeight="bold"

                    mb={3}

                >

                    Answer Review

                </Typography>

                {

                    result.answers.map(

                        (

                            answer,

                            index

                        )=>(

                            <Paper

                                key={index}

                                elevation={0}

                                sx={{

                                    mb:3,

                                    p:3,

                                    borderRadius:3,

                                    border:

                                        answer.is_correct

                                        ?

                                        "1px solid #BBF7D0"

                                        :

                                        "1px solid #FECACA",

                                    background:

                                        answer.is_correct

                                        ?

                                        "#F0FDF4"

                                        :

                                        "#FEF2F2"

                                }}

                            >

                                <Typography

                                    fontWeight="bold"

                                    mb={2}

                                >

                                    Question {index + 1}

                                </Typography>

                                <Typography

                                    mb={3}

                                >

                                    {answer.question}

                                </Typography>

                                <Divider

                                    sx={{

                                        mb:2

                                    }}

                                />

                                <Typography

                                    color="text.secondary"

                                >

                                    Your Answer

                                </Typography>

                                <Typography

                                    fontWeight="bold"

                                    color={

                                        answer.is_correct

                                        ?

                                        "success.main"

                                        :

                                        "error.main"

                                    }

                                    mb={2}

                                >

                                    {answer.selected_answer}

                                </Typography>

                                <Typography

                                    color="text.secondary"

                                >

                                    Correct Answer

                                </Typography>

                                <Typography

                                    fontWeight="bold"

                                    color="success.main"

                                    mb={2}

                                >

                                    {answer.correct_answer}

                                </Typography>

                                <Chip

                                    icon={

                                        answer.is_correct

                                        ?

                                        <CheckCircle/>

                                        :

                                        <Cancel/>

                                    }

                                    label={

                                        answer.is_correct

                                        ?

                                        "Correct"

                                        :

                                        "Incorrect"

                                    }

                                    color={

                                        answer.is_correct

                                        ?

                                        "success"

                                        :

                                        "error"

                                    }

                                />

                            </Paper>

                        )

                    )

                }

            </CardContent>

        </Card>

    )

}

</Box>

);

}

export default Result;