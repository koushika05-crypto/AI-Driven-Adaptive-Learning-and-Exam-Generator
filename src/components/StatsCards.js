import React from "react";
import "../styles/dashboard.css";

function StatsCards({subjects,topics,materials}){

return(

<div className="stats">

<div className="stat-card">
<h3>Total Courses</h3>
<p>{subjects}</p>
</div>

<div className="stat-card">
<h3>Total Topics</h3>
<p>{topics}</p>
</div>

<div className="stat-card">
<h3>Total Videos</h3>
<p>{materials}</p>
</div>

<div className="stat-card">
<h3>Total Students</h3>
<p>325</p>
</div>

</div>

);

}

export default StatsCards;
