import { useEffect } from "react";
import api from "../../api/axios";

function TestConnection(){

    useEffect(()=>{

        api.get("/")

        .then((res)=>{

            console.log(res.data)

        })

        .catch((err)=>{

            console.log(err)

        })

    },[])

    return(

        <h1>

            Backend Connected

        </h1>

    )

}

export default TestConnection;