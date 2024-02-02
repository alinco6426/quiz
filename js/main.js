let questionBank = JSON.parse(localStorage.getItem("questionBank")) || [];

async function fetchQeustions(){
     try{
          const response = await fetch("data.json");
          const data = await response.json();
          return data.quizzes;
     }
     catch(err){
          console.log(`Error: ${err}`);
          throw err
     }
}
fetchQeustions();

async function insertQuestions(){
     try{
          let questions = await fetchQeustions();
          if(questionBank.length === 0 ){
               questionBank = questions;
               localStorage.setItem("questionBank", JSON.stringify(questions));
          }
     }
     catch (err) {
          console.log(`Error: ${err}`);
          throw err
     }
}
insertQuestions()

export {insertQuestions , questionBank}