import { Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

function DashboardCard({

    title,

    value,

    icon,

    color,

    growth

}) {

    return (

        <motion.div

            whileHover={{

                y: -8,

                scale: 1.03

            }}

            transition={{

                duration: .25

            }}

        >

            <Paper

                elevation={0}

                sx={{

                    p: 3,

                    borderRadius: 5,

                    background: "#fff",

                    border: "1px solid #ECECEC",

                    boxShadow:

                        "0 10px 30px rgba(0,0,0,.06)",

                    overflow: "hidden",

                    position: "relative"

                }}

            >

                <Box

                    sx={{

                        width: 55,

                        height: 55,

                        borderRadius: 3,

                        bgcolor: color,

                        color: "white",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        mb: 3

                    }}

                >

                    {icon}

                </Box>

                <Typography

                    color="text.secondary"

                >

                    {title}

                </Typography>

                <Typography

                    variant="h3"

                    fontWeight="bold"

                    mt={1}

                >

                    {value}

                </Typography>

                <Typography

                    mt={2}

                    fontWeight={600}

                    color="#16A34A"

                >

                    ↑ {growth}

                </Typography>

                <Box

                    sx={{

                        position: "absolute",

                        right: -20,

                        top: -20,

                        width: 120,

                        height: 120,

                        borderRadius: "50%",

                        bgcolor: color,

                        opacity: .08

                    }}

                />

            </Paper>

        </motion.div>

    );

}

export default DashboardCard;