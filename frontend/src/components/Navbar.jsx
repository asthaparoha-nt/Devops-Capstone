import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    Badge
} from "@mui/material";

import {
    NotificationsNone,
    Search,
    KeyboardArrowDown
} from "@mui/icons-material";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function Navbar() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    return (

        <AppBar

            position="fixed"

            elevation={0}

            sx={{

                ml: "260px",

                width: "calc(100% - 260px)",

                bgcolor: "rgba(255,255,255,.85)",

                backdropFilter: "blur(15px)",

                color: "#111",

                borderBottom: "1px solid #E5E7EB"

            }}

        >

            <Toolbar>

                <Typography

                    variant="h5"

                    fontWeight="bold"

                >

                    Dashboard

                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <TextField

                    size="small"

                    placeholder="Search..."

                    sx={{

                        width: 280,

                        mr: 3,

                        bgcolor: "white",

                        borderRadius: 3

                    }}

                    InputProps={{

                        startAdornment: (

                            <InputAdornment position="start">

                                <Search />

                            </InputAdornment>

                        )

                    }}

                />

                <IconButton>

                    <Badge

                        color="error"

                        badgeContent={4}

                    >

                        <NotificationsNone />

                    </Badge>

                </IconButton>

                <IconButton

                    onClick={(e) =>

                        setAnchorEl(e.currentTarget)

                    }

                >

                    <Avatar

                        sx={{

                            ml: 2,

                            bgcolor: "#4F46E5"

                        }}

                    >

                        A

                    </Avatar>

                    <KeyboardArrowDown />

                </IconButton>

                <Menu

                    anchorEl={anchorEl}

                    open={open}

                    onClose={() =>

                        setAnchorEl(null)

                    }

                >

                    <MenuItem>

                        Profile

                    </MenuItem>

                    <MenuItem

                        onClick={handleLogout}

                    >

                        Logout

                    </MenuItem>

                </Menu>

            </Toolbar>

        </AppBar>

    );

}

export default Navbar;