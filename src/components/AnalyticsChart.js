import React from "react";
import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function AnalyticsChart({subjects,topics,materials}){

const data={
labels:["Courses","Topics","Materials"],
datasets:[
{
label:"SkillForge Analytics",
data:[subjects,topics,materials],
backgroundColor:[
"#3498db",
"#2ecc71",
"#9b59b6"
]
}
]
};

return(

<div style={{background:"white",padding:"20px",borderRadius:"10px"}}>

<h2>Platform Analytics</h2>

<Bar data={data}/>

</div>

);

}

export default AnalyticsChart;
