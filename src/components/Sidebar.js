import React from "react";
import "../styles/instructor.css";

function Sidebar({setPage}){

return(

<div className="sidebar">

<h2>Instructor</h2>

<button onClick={()=>setPage("course")}>
Course Manager </button>

<button onClick={()=>setPage("subject")}>
Subject Manager </button>

<button onClick={()=>setPage("material")}>
Material Manager </button>

<button className="logout">
Logout
</button>

</div>

)

}

export default Sidebar;
