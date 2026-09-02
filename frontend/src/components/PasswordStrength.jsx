import zxcvbn from "zxcvbn";

import {

LinearProgress,

Typography,

Box

} from "@mui/material";

function PasswordStrength({

password

}) {

if (!password) return null;

const result = zxcvbn(password);

const score = result.score;

const colors = [

"#EF4444",

"#F97316",

"#FACC15",

"#22C55E",

"#16A34A"

];

const labels = [

"Weak",

"Fair",

"Good",

"Strong",

"Excellent"

];

return (

<Box mt={1}>

<LinearProgress

variant="determinate"

value={(score+1)*20}

sx={{

height:8,

borderRadius:5,

background:"#E5E7EB",

"& .MuiLinearProgress-bar":{

background:colors[score]

}

}}

/>

<Typography

fontSize={13}

mt={.5}

color={colors[score]}

>

Password Strength :

{labels[score]}

</Typography>

</Box>

);

}

export default PasswordStrength;