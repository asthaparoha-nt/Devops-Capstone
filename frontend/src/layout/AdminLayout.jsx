import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout() {

    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "#F8FAFC"
            }}
        >

            <Sidebar />

            <Box
                sx={{
                    flex: 1,
                    ml: "260px"
                }}
            >

                <Navbar />

                <Box
                    sx={{
                        mt: "80px",
                        p: 4,
                        minHeight: "calc(100vh - 80px)"
                    }}
                >
                    

                    <Outlet />

                </Box>

            </Box>

        </Box>

    );

}

export default AdminLayout;