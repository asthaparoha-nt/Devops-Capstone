import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    LinearProgress,
    Radio,
    RadioGroup,
    FormControlLabel,
    Stack,
    CircularProgress,
    Chip
} from "@mui/material";

import {
    AccessTime,
    ArrowBack,
    ArrowForward
} from "@mui/icons-material";

import {
    useEffect,
    useState,
    useRef,
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

import {

    getQuestionsByQuiz

} from "../services/questionService";

import {

    saveAnswer,

    submitAttempt

} from "../services/attemptService";

function AttemptQuiz(){

    const { attemptId } = useParams();

    const navigate = useNavigate();

    const [loading,setLoading]=useState(true);

    const [questions,setQuestions]=useState([]);

    const [currentIndex,setCurrentIndex]=useState(0);

    const [answers,setAnswers]=useState({});
    const [submitted,setSubmitted]=useState(false);
    const submittingRef = useRef(false);
  const attempt = JSON.parse(

    localStorage.getItem(

        "currentAttempt"

    )

);

const [timeLeft,setTimeLeft]=useState(

    attempt

        ?

        attempt.time_limit * 60

        :

        1800

);

    useEffect(()=>{

        loadQuestions();

    },[]);

    const loadQuestions=async()=>{

        try{

            const quizId=

                localStorage.getItem(

                    "currentQuiz"

                );

            const response=

                await getQuestionsByQuiz(

                    quizId

                );

            setQuestions(

                response.data||[]

            );

        }

        catch{

            toast.error(

                "Unable to load questions"

            );

        }

        finally{

            setLoading(false);

        }

    };

    useEffect(()=>{

        if(!questions.length)

            return;

        const timer=setInterval(()=>{

            setTimeLeft((prev)=>{

                if(prev<=1){

                    clearInterval(timer);

                    autoSubmit();

                    return 0;

                }

                return prev-1;

            });

        },1000);

        return()=>clearInterval(timer);

    },[questions]);

    const formatTime=(seconds)=>{

        const minutes=Math.floor(seconds/60);

        const remaining=seconds%60;

        return `${minutes}:${
            remaining<10
            ?
            "0"+remaining
            :
            remaining
        }`;

    };

    if(loading){

        return(

            <Box

                sx={{

                    display:"flex",

                    justifyContent:"center",

                    alignItems:"center",

                    height:"80vh"

                }}

            >

                <CircularProgress/>

            </Box>

        );

    }

    const question=

        questions[currentIndex];

    const progress=

        ((currentIndex+1)/questions.length)*100;
            const handleAnswerChange = async (answer) => {

        const updatedAnswers = {

            ...answers,

            [question.id]: answer

        };

        setAnswers(updatedAnswers);

        try {

            await saveAnswer(

                attemptId,

                {

                    question_id: question.id,

                    selected_answer: answer

                }

            );

        }

        catch {

            toast.error(

                "Unable to save answer"

            );

        }

    };

    const handleNext = () => {

        if (

            currentIndex <

            questions.length - 1

        ) {

            setCurrentIndex(

                currentIndex + 1

            );

        }

    };

    const handlePrevious = () => {

        if (

            currentIndex > 0

        ) {

            setCurrentIndex(

                currentIndex - 1

            );

        }

    };
    const autoSubmit = async () => {

    if(submittingRef.current){

    return;

}

submittingRef.current = true;

setSubmitted(true);

    try{

        await submitAttempt(

            attemptId

        );

        localStorage.removeItem(

            "currentQuiz"

        );

        localStorage.removeItem(

            "currentAttempt"

        );

        toast.success(

            "Time is over. Quiz submitted automatically."

        );


setTimeout(() => {

    navigate("/student/dashboard");

}, 1200);
    }

    catch(error){

    if(

        error.response?.data?.message?.includes("submitted")

    ){

        navigate(`/student/result/${attemptId}`);

        return;

    }

    toast.error("Unable to submit quiz.");

}

};
    const handleSubmit = async () => {if(submittingRef.current){

    return;

}

submittingRef.current = true;

setSubmitted(true);

        const result = await Swal.fire({

            title: "Submit Quiz?",

            text: "You won't be able to modify your answers.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Submit",

            cancelButtonText: "Cancel",

            confirmButtonColor: "#4F46E5"

        });

        if (!result.isConfirmed){

    submittingRef.current = false;

    setSubmitted(false);

    return;

}

        try {

            await submitAttempt(

                attemptId

            );

localStorage.removeItem(

    "currentAttempt"

);

            toast.success(

                "Quiz Submitted"

            );

            localStorage.removeItem(

                "currentQuiz"

            );

            navigate(

                `/student/result/${attemptId}`

            );

        }

        catch (error) {

            toast.error(

                error.response?.data?.detail ||

                error.response?.data?.message ||

                "Submission Failed"

            );

        }

    };

    return (

        <Box
            sx={{
                maxWidth: 950,
                mx: "auto",
                py: 4
            }}
        >

            <Card
                sx={{
                    borderRadius: 5
                }}
            >

                <CardContent
                    sx={{
                        p: 4
                    }}
                >

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

                            Question

                            {

                                currentIndex + 1

                            }

                            /

                            {

                                questions.length

                            }

                        </Typography>

                        <Chip

                            icon={<AccessTime />}

                            color="error"

                            label={formatTime(timeLeft)}

                        />

                    </Stack>

                    <LinearProgress

                        variant="determinate"

                        value={progress}

                        sx={{

                            height: 10,

                            borderRadius: 10,

                            mb: 4

                        }}

                    />

                    <Typography

                        variant="h6"

                        fontWeight="bold"

                        mb={4}

                    >

                        {

                            question.question_text

                        }

                    </Typography>

                    <RadioGroup

    disabled={submitted}

                        value={

                            answers[question.id] ||

                            ""

                        }

                        onChange={(e)=>

                            handleAnswerChange(

                                e.target.value

                            )

                        }

                    >

                        {

                            question.options.map(

                                (option,index)=>(

                                    <Card

                                        key={index}

                                        sx={{

                                            mb:2,

                                            borderRadius:3,

                                            transition:".25s",

                                            border:

                                            answers[question.id]===option

                                            ?

                                            "2px solid #4F46E5"

                                            :

                                            "1px solid #E5E7EB"

                                        }}

                                    >

                                        <CardContent>

                                            <FormControlLabel

                                                value={option}

                                                control={

    <Radio

        disabled={submitted}

    />

}

                                                label={option}

                                                sx={{

                                                    width:"100%"

                                                }}

                                            />

                                        </CardContent>

                                    </Card>

                                )

                            )

                        }

                    </RadioGroup>                    <Stack

                        direction="row"

                        justifyContent="space-between"

                        mt={4}

                    >

                        <Button

                            variant="outlined"

                            startIcon={<ArrowBack />}

                            disabled={submitted}

                            onClick={handlePrevious}

                        >

                            Previous

                        </Button>

                        {

                            currentIndex===

                            questions.length-1

                            ?

                            <Button

                                variant="contained"

                                color="success"

                                onClick={handleSubmit}
                                disabled={submitted}
                            >

                                Submit Quiz

                            </Button>

                            :

                            <Button

                                variant="contained"

                                endIcon={<ArrowForward />}

                                onClick={handleNext}
                                disabled={submitted}

                            >

                                Next

                            </Button>

                        }

                    </Stack>

                    <Typography

                        variant="h6"

                        fontWeight="bold"

                        mt={5}

                        mb={2}

                    >

                        Question Navigator

                    </Typography>

                    <Box

                        sx={{

                            display:"grid",

                            gridTemplateColumns:

                                "repeat(auto-fill,minmax(50px,1fr))",

                            gap:1

                        }}

                    >

                        {

                            questions.map((item,index)=>(

                                <Button

                                    key={item.id}

                                    variant={

                                        currentIndex===index

                                        ?

                                        "contained"

                                        :

                                        answers[item.id]

                                        ?

                                        "outlined"

                                        :

                                        "text"

                                    }
                                    disabled={submitted}
                                    color={

                                        answers[item.id]

                                        ?

                                        "success"

                                        :

                                        "primary"

                                    }

                                    sx={{

                                        minWidth:50,

                                        height:50,

                                        borderRadius:2

                                    }}

                                    onClick={()=>

                                        setCurrentIndex(

                                            index

                                        )

                                    }

                                >

                                    {index+1}

                                </Button>

                            ))

                        }

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

}

export default AttemptQuiz;