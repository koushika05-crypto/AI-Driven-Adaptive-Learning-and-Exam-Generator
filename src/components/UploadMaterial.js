import React,{useState} from "react";
import axios from "axios";

function UploadMaterial({topicId}){

const API="http://localhost:8080";

const [title,setTitle]=useState("");
const [type,setType]=useState("VIDEO");
const [difficulty,setDifficulty]=useState("Easy");
const [fileUrl,setFileUrl]=useState("");

const uploadMaterial=async(e)=>{

e.preventDefault();

await axios.post(API+"/materials",{

title:title,
type:type,
difficulty:difficulty,
fileUrl:fileUrl,
topic:{id:topicId}

});

alert("Material Uploaded");

setTitle("");
setFileUrl("");

};

return(

<div className="table-card">

<h2>Upload Material</h2>

<form onSubmit={uploadMaterial}>

<input
placeholder="Material Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<select
value={type}
onChange={(e)=>setType(e.target.value)}

>

<option>VIDEO</option>
<option>PDF</option>
<option>LINK</option>

</select>

<select
value={difficulty}
onChange={(e)=>setDifficulty(e.target.value)}

>

<option>Easy</option>
<option>Medium</option>
<option>Hard</option>

</select>

<input
placeholder="Video / PDF URL"
value={fileUrl}
onChange={(e)=>setFileUrl(e.target.value)}
/>

<button className="btn-view">Upload</button>

</form>

</div>

);

}

export default UploadMaterial;
