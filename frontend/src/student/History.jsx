import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Chip
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {

    useEffect,

    useState

} from "react";

import { toast } from "react-toastify";

import {

    getHistory

} from "../services/resultService";

function History(){

    const [loading,setLoading]=useState(true);

    const [rows,setRows]=useState([]);

    useEffect(()=>{

        loadHistory();

    },[]);
    const formatDate = (date) => {

    if (!date) {

        return "-";

    }

    return new Date(date).toLocaleDateString(

        "en-GB",

        {

            day: "2-digit",

            month: "2-digit",

            year: "2-digit"

        }

    );

};
    const loadHistory=async()=>{

        try{

            const response=

                await getHistory();

            const formatted=(

                response.data||[]

            ).map((item,index)=>({

                id:

                    item.attempt_id ||

                    index,

                quiz:

                    item.quiz_title,

                score:

                    `${item.score}/${item.total_marks}`,

                percentage:

                    `${item.percentage}%`,

                status:

                    item.status,

                submitted:

                    item.submitted_at

            }));

            setRows(

                formatted

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Unable to load history"

            );

        }

        finally{

            setLoading(false);

        }

    };

    const columns=[

        {

            field:"quiz",

            headerName:"Quiz",

            flex:2

        },

        {

            field:"score",

            headerName:"Score",

            flex:1

        },

        {

            field:"percentage",

            headerName:"Percentage",

            flex:1

        },

        {

            field:"status",

            headerName:"Status",

            flex:1,

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

                />

            )

        },

        {

    field: "submitted",

    headerName: "Submitted At",

    flex: 1.5,

    valueFormatter: (params) =>

        formatDate(params)

}

    ];

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

    return(

        <Box sx={{p:4}}>            <Typography

                variant="h4"

                fontWeight="bold"

                mb={4}

            >

                Assessment History

            </Typography>

            <Paper

                elevation={2}

                sx={{

                    borderRadius:4,

                    p:2

                }}

            >

                <DataGrid

                    rows={rows}

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

                        },

                        borderRadius:3

                    }}

                />

            </Paper>

        </Box>

    );

}

export default History;