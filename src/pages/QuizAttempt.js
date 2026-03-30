import { useState, useEffect } from "react";
import axios from "axios";

function QuizAttempt(){

const quizId = 1;

const [questions,setQuestions] = useState([]);
const [answers,setAnswers] = useState({});
const [score,setScore] = useState(null);

useEffect(()=>{
loadQuestions();
},[]);

const loadQuestions = async ()=>{

const res = await axios.get(
"http://localhost:8080/api/questions/quiz/" + quizId
);

setQuestions(res.data);

};

const selectAnswer = (questionId,value)=>{

setAnswers({
...answers,
[questionId]: value
});

};

const submitQuiz = ()=>{

let total = questions.length;
let correct = 0;

questions.forEach(q=>{

if(answers[q.id] === q.correctAnswer){
correct++;
}

});

setScore(correct);

};

return(

<div style={{padding:"40px"}}>

<h2>Quiz</h2>

{questions.map((q,index)=>(

<div key={q.id} style={{marginBottom:"30px"}}>

<h3>
{index+1}. {q.question}
</h3>

<div>

<label>

<input
type="radio"
name={"q"+q.id}
onChange={()=>selectAnswer(q.id,"A")}
/>

{q.optionA}

</label>

</div>

<div>

<label>

<input
type="radio"
name={"q"+q.id}
onChange={()=>selectAnswer(q.id,"B")}
/>

{q.optionB}

</label>

</div>

<div>

<label>

<input
type="radio"
name={"q"+q.id}
onChange={()=>selectAnswer(q.id,"C")}
/>

{q.optionC}

</label>

</div>

<div>

<label>

<input
type="radio"
name={"q"+q.id}
onChange={()=>selectAnswer(q.id,"D")}
/>

{q.optionD}

</label>

</div>

</div>
))}

<button onClick={submitQuiz}>
Submit Quiz
</button>

{score !== null &&

<div style={{marginTop:"20px"}}>

<h2>
Score: {score} / {questions.length}
</h2>

</div>

}

</div>

);

}

export default QuizAttempt;
