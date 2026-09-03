import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Avatar
} from "@mui/material";

import {
    Dashboard,
    Category,
    Quiz,
    Help,
    Assessment,
    EmojiEvents,
    Logout
} from "@mui/icons-material";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const menu = [

    {
        text: "Dashboard",
        icon: <Dashboard />,
        path: "/admin/dashboard"
    },

    {
        text: "Categories",
        icon: <Category />,
        path: "/admin/categories"
    },

    {
        text: "Quizzes",
        icon: <Quiz />,
        path: "/admin/quizzes"
    },

    {
        text: "Questions",
        icon: <Help />,
        path: "/admin/questions"
    },

    {
        text: "Results",
        icon: <Assessment />,
        path: "/admin/results"
    },

    {
        text: "Leaderboard",
        icon: <EmojiEvents />,
        path: "/admin/leaderboard"
    }

];

function Sidebar() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleLogout = () => {

        logout();

        navigate("/login", {

            replace: true

        });

    };

    return (

        <Box

            sx={{

                width: 260,

                height: "100vh",

                background:
                    "linear-gradient(180deg,#312E81,#4338CA)",

                color: "white",

                position: "fixed",

                left: 0,

                top: 0,

                display: "flex",

                flexDirection: "column",

                boxShadow:
                    "5px 0px 30px rgba(0,0,0,.12)"

            }}

        >

            <Box sx={{ p: 3 }}>

                <Avatar

                    sx={{

                        width: 56,

                        height: 56,

                        bgcolor: "#ffffff",

                        color: "#4338CA",

                        fontWeight: "bold",

                        mb: 2

                    }}

                >

                    A

                </Avatar>

                <Typography

                    variant="h6"

                    fontWeight="bold"

                >

                    Assessment Portal

                </Typography>

                <Typography

                    variant="body2"

                    sx={{

                        opacity: .8,

                        mt: .5

                    }}

                >

                    Administrator

                </Typography>

            </Box>

            <Divider

                sx={{

                    background: "#ffffff30"

                }}

            />

            <List sx={{ flex: 1, mt: 1 }}>

                {

                    menu.map((item) => (

                        <ListItemButton

                            key={item.text}

                            component={NavLink}

                            to={item.path}

                            sx={{

                                color: "white",

                                py: 1.6,

                                mx: 1.2,

                                borderRadius: 2,

                                mb: .5,

                                transition: ".25s",

                                "&.active": {

                                    background: "#ffffff20",

                                    fontWeight: "bold"

                                },

                                "&:hover": {

                                    background: "#ffffff18"

                                }

                            }}

                        >

                            <ListItemIcon

                                sx={{

                                    color: "white",

                                    minWidth: 42

                                }}

                            >

                                {item.icon}

                            </ListItemIcon>

                            <ListItemText

                                primary={item.text}

                            />

                        </ListItemButton>

                    ))

                }

            </List>

            <Divider

                sx={{

                    background: "#ffffff30"

                }}

            />

            <Box sx={{ p: 1 }}>

                <ListItemButton

                    onClick={handleLogout}

                    sx={{

                        color: "white",

                        borderRadius: 2,

                        "&:hover": {

                            background: "#ffffff18"

                        }

                    }}

                >

                    <ListItemIcon

                        sx={{

                            color: "white"

                        }}

                    >

                        <Logout />

                    </ListItemIcon>

                    <ListItemText

                        primary="Logout"

                    />

                </ListItemButton>

            </Box>

        </Box>

    );

}

export default Sidebar;