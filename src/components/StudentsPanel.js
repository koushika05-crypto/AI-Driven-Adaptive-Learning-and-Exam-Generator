import React from "react";

function StudentsPanel(){

const students=[
{id:1,name:"Rahul",course:"Java Programming"},
{id:2,name:"Priya",course:"React"},
{id:3,name:"Arjun",course:"Spring Boot"}
];

return(

<div className="table-card">

<h2>My Students</h2>

<table>

<thead>

<tr>
<th>ID</th>
<th>Name</th>
<th>Course</th>
</tr>

</thead>

<tbody>

{students.map((s)=>(

<tr key={s.id}>
<td>{s.id}</td>
<td>{s.name}</td>
<td>{s.course}</td>
</tr>
))}

</tbody>

</table>

</div>

);

}

export default StudentsPanel;
