import {
    Box,
    Button,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    CircularProgress,
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

import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import {

    getCategories,

    deleteCategory,

    getCategoryDetails

} from "../services/categoryService";

import CategoryDialog from "./CategoryDialog";
function Categories() {

    const [rows,setRows]=useState([]);

    const [loading,setLoading]=useState(true);

    const [search,setSearch]=useState("");

    const [openDialog,setOpenDialog]=useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    const [viewingCategory, setViewingCategory] = useState(null);

    const [details,setDetails]=useState(null);

    const [loadingDetails,setLoadingDetails]=useState(false);
        useEffect(()=>{

        loadCategories();

    },[]);

    const loadCategories=async()=>{

        try{

            setLoading(true);

            const response=await getCategories();

            const data=response.data||[];

            setRows(

                data.map(item=>({

                    id:item.id||item._id,

                    name:item.name,

                    description:item.description,

                    created_at:item.created_at

                }))

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Unable to fetch categories"

            );

        }

        finally{

            setLoading(false);

        }

    };
        const loadCategoryDetails=async(category)=>{

        try{

            setLoadingDetails(true);

            const response=

            await getCategoryDetails(

                category.id

            );

            setViewingCategory(category);

            setDetails(

                response.data

            );

        }

        catch{

            toast.error(

                "Unable to fetch category details"

            );

        }

        finally{

            setLoadingDetails(false);

        }

    };

    const handleDelete=async(id)=>{

        try{

            await deleteCategory(id);

            toast.success(

                "Category deleted"

            );

            loadCategories();

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Delete failed"

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

    const filteredRows = rows.filter(

        (row) =>

            row.name

                .toLowerCase()

                .includes(

                    search.toLowerCase()

                )

    );

    const columns = [

        {

            field: "name",

            headerName: "Category",

            flex: 1.2

        },

        {

            field: "description",

            headerName: "Description",

            flex: 2

        },

        {

            field: "created_at",

            headerName: "Created",

            flex: 1,

            valueFormatter: (params) =>

                formatDate(params)

        },

        {

            field: "actions",

            headerName: "Actions",

            width: 180,

            sortable: false,

            renderCell: (params) => (

                <Stack

                    direction="row"

                    spacing={1}

                >

                    <Tooltip title="Browse Category">

                        <IconButton

                            color="success"

                            onClick={() =>

                                loadCategoryDetails(

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

                                setEditingCategory(

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

            <Stack

                direction="row"

                justifyContent="space-between"

                alignItems="center"

                mb={4}

            >

                <Typography

                    variant="h4"

                    fontWeight="bold"

                >

                    Categories

                </Typography>

                <Button

                    variant="contained"

                    startIcon={<Add />}

                    onClick={() => {

                        setEditingCategory(null);

                        setOpenDialog(true);

                    }}

                    sx={{

                        borderRadius: 3,

                        px: 3

                    }}

                >

                    Add Category

                </Button>

            </Stack>

            <Paper

                elevation={0}

                sx={{

                    p: 3,

                    borderRadius: 4

                }}

            >

                <TextField

                    fullWidth

                    placeholder="Search Category..."

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

                />

                {

                    loading

                    ?

                    <Box

                        sx={{

                            display: "flex",

                            justifyContent: "center",

                            py: 8

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

                                backgroundColor:"#EEF2FF",

                                fontWeight:"bold"

                            },

                            "& .MuiDataGrid-row:hover":{

                                backgroundColor:"#F8FAFC"

                            }

                        }}

                    />

                }

            </Paper>            {

                viewingCategory &&

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

                                            details?.category?.name

                                        }

                                    </Typography>

                                    <Typography

                                        color="text.secondary"

                                    >

                                        {

                                            details?.category?.description

                                        }

                                    </Typography>

                                </Box>

                                <Button

                                    variant="outlined"

                                    onClick={()=>{

                                        setViewingCategory(null);

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

                                                Total Quizzes

                                            </Typography>

                                            <Typography

                                                variant="h4"

                                                fontWeight="bold"

                                            >

                                                {

                                                    details?.quizzes?.length || 0

                                                }

                                            </Typography>

                                        </CardContent>

                                    </Card>

                                </Grid>

                                <Grid item xs={12} md={4}>

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

                                                Total Questions

                                            </Typography>

                                            <Typography

                                                variant="h4"

                                                fontWeight="bold"

                                            >

                                                {

                                                    details?.questions?.length || 0

                                                }

                                            </Typography>

                                        </CardContent>

                                    </Card>

                                </Grid>

                                <Grid item xs={12} md={4}>

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

                                                Created

                                            </Typography>

                                            <Typography

                                                fontWeight="bold"

                                            >

                                                {

                                                    formatDate(

                                                        details?.category?.created_at

                                                    )

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

                                variant="h6"

                                fontWeight="bold"

                                mb={2}

                            >

                                📘 Quizzes

                            </Typography>

                            {

                                loadingDetails

                                ?

                                <Box

                                    sx={{

                                        display:"flex",

                                        justifyContent:"center",

                                        py:4

                                    }}

                                >

                                    <CircularProgress/>

                                </Box>

                                :

                                details?.quizzes?.length===0

                                ?

                                <Typography

                                    color="text.secondary"

                                >

                                    No quizzes found.

                                </Typography>

                                :

                                <Grid

                                    container

                                    spacing={2}

                                >

                                    {

                                        details.quizzes.map(

                                            (quiz)=>(

                                                <Grid

                                                    item

                                                    xs={12}

                                                    md={6}

                                                    lg={4}

                                                    key={quiz.id}

                                                >

                                                    <Card

                                                        variant="outlined"

                                                        sx={{

                                                            borderRadius:3,

                                                            height:"100%"

                                                        }}

                                                    >

                                                        <CardContent>

                                                            <Typography

                                                                variant="h6"

                                                                fontWeight="bold"

                                                            >

                                                                {

                                                                    quiz.title

                                                                }

                                                            </Typography>

                                                            <Typography

                                                                mt={1}

                                                                color="text.secondary"

                                                            >

                                                                {

                                                                    quiz.description

                                                                }

                                                            </Typography>

                                                            <Stack

                                                                direction="row"

                                                                spacing={1}

                                                                mt={2}

                                                            >

                                                                <Chip

                                                                    label={`${quiz.duration} min`}

                                                                    color="primary"

                                                                    size="small"

                                                                />

                                                                <Chip

                                                                    label={`${quiz.total_marks} Marks`}

                                                                    color="success"

                                                                    size="small"

                                                                />

                                                            </Stack>

                                                        </CardContent>

                                                    </Card>

                                                </Grid>

                                            )

                                        )

                                    }

                                </Grid>

                            }

                            <Divider

                                sx={{

                                    my:4

                                }}

                            />

                            <Typography

                                variant="h6"

                                fontWeight="bold"

                                mb={2}

                            >

                                ❓ Questions

                            </Typography>

                            <Grid

                                container

                                spacing={2}

                            >                                {

                                    loadingDetails

                                    ?

                                    <Grid item xs={12}>

                                        <Box

                                            sx={{

                                                display:"flex",

                                                justifyContent:"center",

                                                py:4

                                            }}

                                        >

                                            <CircularProgress/>

                                        </Box>

                                    </Grid>

                                    :

                                    details?.questions?.length===0

                                    ?

                                    <Grid item xs={12}>

                                        <Typography

                                            color="text.secondary"

                                        >

                                            No questions found.

                                        </Typography>

                                    </Grid>

                                    :

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

                                                            boxShadow:

                                                            "0 10px 25px rgba(0,0,0,.12)",

                                                            transform:

                                                            "translateY(-3px)"

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

                                                            <Box

                                                                mt={3}

                                                            >

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

                        </CardContent>

                    </Card>

                )

            }

            <CategoryDialog

                open={openDialog}

                handleClose={()=>

                    setOpenDialog(false)

                }

                selectedCategory={editingCategory}

                refreshCategories={loadCategories}

            />

        </Box>

    );

}

export default Categories;