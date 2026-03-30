import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
return (
<div style={{padding:"10px",background:"#333"}}>
<Link style={{color:"white",marginRight:"15px"}} to="/login">Login</Link>
<Link style={{color:"white",marginRight:"15px"}} to="/register">Register</Link>
<Link style={{color:"white"}} to="/instructor-dashboard">Instructor Dashboard</Link> </div>
);
}

export default Navbar;
