// Importing necessary functions and variables from "main.js"
import { questionBank, insertQuestions } from "./main.js";

// Selecting elements from the DOM
const quizDashboard = document.querySelector(".quiz-dashboard");
const optionsTag = ["A", "B", "C", "D"];
const titleDisplayer = document.querySelector(".title-displayer");

// Selecting all elements with the class "start-quiz-btn"
let startQuizBtns = document.querySelectorAll(".start-quiz-btn");

// Adding event listener to each "start-quiz-btn" button
Array.from(startQuizBtns).forEach(btn => {
     btn.addEventListener("click", function () {
          // Extracting the title from the clicked button and displaying questions
          const title = this.querySelector(".title").textContent;
          displayQuestions(title);
     })
})

// Function to display questions based on the selected category title
function displayQuestions(title) {
     // Finding the category object in questionBank array based on title
     let questionsToRender = questionBank.find(category => {
          return category.title === title;
     });

     // Clearing the quiz dashboard and title displayer
     quizDashboard.innerHTML = "";
     titleDisplayer.innerHTML = "";

     // Extracting title and icon from the selected category
     const quizTitle = questionsToRender.title;
     const quizIcon = questionsToRender.icon;

     // Finding the index of the selected category in the questionBank array
     let indexOfTitle = questionBank.indexOf(questionsToRender);

     // Displaying the selected category title in the title displayer
     titleDisplayer.innerHTML = startQuizBtns[indexOfTitle].innerHTML;

     // Checking if questionsToRender is not null
     if (questionsToRender) {
          // Iterating through each question in the selected category
          questionsToRender.questions.forEach((que, index) => {
               // Creating elements to display each question
               let questionContainer = document.createElement("div");
               questionContainer.classList.add("question-container");

               const questionDisplayer = document.createElement("section");
               questionDisplayer.classList.add("question-displayer");

               let questionIndexDisplayer = document.createElement("h5");
               questionIndexDisplayer.classList.add("question-index-displayer");
               questionIndexDisplayer.textContent = `Questions ${index + 1} of ${questionsToRender.questions.length}`;

               let question = document.createElement("h2");
               question.classList.add("question");
               question.textContent = que.question;

               let progressDisplayer = document.createElement("progress");
               progressDisplayer.classList.add("progress-displayer");
               progressDisplayer.max = questionsToRender.questions.length;
               progressDisplayer.value = index + 1;

               questionDisplayer.append(questionIndexDisplayer, question, progressDisplayer);

               // Creating buttons for each answer option
               let selectButtonContainer = document.createElement("div");
               selectButtonContainer.classList.add("select-button-container");

               que.options.forEach((opt, position) => {
                    let selectAnswerButton = document.createElement("button");
                    selectAnswerButton.classList.add("select-answer-button");
                    const optionTag = document.createElement("p");
                    optionTag.classList.add("option-tag");
                    optionTag.textContent = optionsTag[position];

                    const option = document.createElement("p");
                    option.classList.add("option");
                    option.textContent = opt;
                    selectAnswerButton.append(optionTag, option)
                    selectAnswerButton.addEventListener("click", function () {
                         // Adding an active class and displaying alert message
                         addActive(this, alertMessage);
                    })

                    selectButtonContainer.append(selectAnswerButton);
               })

               // Creating a button to submit the answer
               let submitAnswerButton = document.createElement("button");
               submitAnswerButton.classList.add("submit-answer-button");
               submitAnswerButton.textContent = "submit answer";
               submitAnswerButton.setAttribute("data-info", index);
               submitAnswerButton.addEventListener("click", function () {
                    // Checking the answer and displaying an alert message
                    checkAnswer(que.answer, this, alertMessage, indexOfTitle)
               })

               selectButtonContainer.append(submitAnswerButton);

               // Creating an alert message element
               const alertMessage = document.createElement("p");
               alertMessage.classList.add("alert");
               selectButtonContainer.appendChild(alertMessage);

               // Appending question elements to the question container
               questionContainer.append(questionDisplayer, selectButtonContainer);
               // Appending the question container to the quiz dashboard
               quizDashboard.append(questionContainer);
          });
     }

     // Displaying the first question and applying the theme
     displayCurrentQuestion(0);
     applyTheme()
};

// Variable to store the user's score
let score = 0;

// Function to check the user's answer
function checkAnswer(value, btn, alert, index) {
     // Get the index of the current question from the button's data-info attribute
     const currentIndex = parseInt(btn.getAttribute("data-info"));

     // Get all containers that hold answer buttons
     let selectButtonContainers = document.querySelectorAll(".select-button-container");
     const containersLength = selectButtonContainers.length;

     // Get the container of the current question
     let currentButtonContainer = selectButtonContainers[currentIndex];

     // Get all answer buttons in the current container
     const selectAnswerButtons = currentButtonContainer.querySelectorAll(".select-answer-button");

     // Find the currently active button (user's selected answer)
     let activeBtn = Array.from(selectAnswerButtons).find(btn => {
          return btn.classList.contains("active");
     });

     // Check if the "Submit Answer" button is clicked and no answer is selected
     if (btn.textContent === "submit answer" && !activeBtn) {
          alert.innerHTML = `<img src="assets/images/icon-error.svg" alt="icon-error"> Please select an answer`;
          btn.textContent = "submit answer";
     } else {
          // Check if the "Submit Answer" button is clicked
          if (btn.textContent === "submit answer") {
               // Get the text content of the selected option
               const option = activeBtn.querySelector(".option").textContent;

               // Check if the selected option is correct
               if (option === value) {
                    // Increase the score, mark the selected button as correct, and remove the active class
                    score++;
                    activeBtn.classList.add("correct");
                    activeBtn.querySelector(".option-tag").classList.add("correct");
                    activeBtn.classList.remove("active");
               } else if (option !== value) {
                    // Mark the selected button as wrong
                    activeBtn.classList.add("wrong");
                    activeBtn.querySelector(".option-tag").classList.add("wrong");

                    // Find the button with the correct answer and mark it as 'show'
                    let correctAnswerButton = Array.from(selectAnswerButtons).find(btn => {
                         return btn.querySelector(".option").textContent === value;
                    });

                    correctAnswerButton.classList.add("show");
               }
               // Clear the alert message, change button text to "Next Question"
               alert.innerHTML = "";
               btn.textContent = "next question";
          }
          // Check if the "Next Question" button is clicked and there are more questions
          else if (btn.textContent === "next question" && currentIndex < containersLength - 1) {
               // Display the next question
               displayNextQuestion(btn);
          }
          // Check if the "Next Question" button is clicked and it's the last question
          else if (btn.textContent === "next question" && currentIndex === containersLength - 1) {
               // Render and display the result
               let result = renderResult(index);
               quizDashboard.innerHTML = "";
               quizDashboard.append(result);
               applyTheme();
          }
     }
};

// Function to add the "active" class to the selected answer button and clear the alert message
function addActive(btn, alert) {
     // Get the parent container of the clicked button
     let btnParent = btn.parentElement;

     // Get all answer buttons and option tags in the parent container
     let optionBtns = btnParent.querySelectorAll(".select-answer-button");
     const optionsTags = btnParent.querySelectorAll(".option-tag");

     // Remove the "active" class from all answer buttons and option tags
     for (const btn of optionBtns) {
          btn.classList.remove("active");
     }
     for (const option of optionsTags) {
          option.classList.remove("active");
     }

     // Add the "active" class to the clicked answer button and its option tag
     btn.classList.add("active");
     btn.querySelector(".option-tag").classList.add("active");

     // Clear the alert message if it is not empty
     if (alert.innerHTML !== "") {
          alert.innerHTML = "";
     }
}

// Function to display the current question based on its index
function displayCurrentQuestion(currentIndex) {
     // Get all question containers
     let questionContainers = document.querySelectorAll(".question-container");

     // Hide all question containers
     for (const container of questionContainers) {
          container.style.display = "none";
     }

     // Display the current question container
     questionContainers[currentIndex].style.display = "flex";
}

// Function to display the next question when the "Next Question" button is clicked
function displayNextQuestion(btn) {
     // Get the index of the current question from the button's data-info attribute
     let index = btn.getAttribute("data-info");

     // If the index exists, increment it and display the next question
     if (index) {
          index++;
          displayCurrentQuestion(index);
     }
}


// Function to render the result message and score display at the end of the quiz
function renderResult(index) {
     // Create a container for the result
     const resultContainer = document.createElement("div");
     resultContainer.classList.add("result-container");

     // Create a section for the result message
     let resultMessage = document.createElement("section");
     resultMessage.classList.add("result-message");
     resultMessage.innerHTML =
          `<h1>Quiz completed</h1>
     <h1>You scored...</h1>`;

     // Create a section to display the final score
     const scoreDisplayContainer = document.createElement("section");
     scoreDisplayContainer.classList.add("score-display-container");

     // Create a div to display the quiz title and final score
     let scoreDisplayer = document.createElement("div");
     scoreDisplayer.classList.add("score-displayer");
     scoreDisplayer.innerHTML =
          `<h3 class="title-displayer">${startQuizBtns[index].innerHTML}</h3>
     <h1 class="score">${score}</h1>
     <p>out of 10</p>`;

     // Create a button to reset and play the quiz again
     const resetBtn = document.createElement("button");
     resetBtn.classList.add("reset-btn");
     resetBtn.innerHTML = "Play Again";
     resetBtn.addEventListener("click", function () {
          // Reset the score and reload the page
          score = 0;
          location.reload();
     });

     // Append score and reset button to the score display container
     scoreDisplayContainer.append(scoreDisplayer, resetBtn);

     // Append result message and score display to the result container
     resultContainer.append(resultMessage, scoreDisplayContainer);

     return resultContainer;
}



// Selecting the theme changer button
let themeChanger = document.querySelector(".changer");
themeChanger.addEventListener("click", function () {
     // Toggle the theme when the button is clicked
     toggleTheme();

     // Update the theme class on the button based on the current theme
     if (isDarkMode) {
          this.classList.add("dark");
     } else {
          this.classList.remove("dark");
     }
});

// Retrieving the current theme mode from local storage or setting it to true (dark mode) by default
let isDarkMode = JSON.parse(localStorage.getItem("isDarkMode"));
if (isDarkMode === null || isDarkMode === undefined) {
     isDarkMode = true;
}

// Function to apply the theme to all elements
function applyTheme() {
     // Selecting necessary elements
     const body = document.body;
     const allElementsInBody = document.querySelectorAll("body *");
     const iconSun = document.querySelector(".icon-sun");
     const iconMoon = document.querySelector(".icon-moon");

     // Applying the theme class to all elements based on the current theme mode
     for (const element of allElementsInBody) {
          if (isDarkMode) {
               element.classList.add("dark");
          } else {
               element.classList.remove("dark");
          }
     }

     // Updating specific elements and their attributes based on the current theme mode
     if (isDarkMode) {
          body.classList.add("dark");
          iconSun.setAttribute("src", "assets/images/icon-sun-light.svg");
          iconMoon.setAttribute("src", "assets/images/icon-moon-light.svg");
     } else {
          body.classList.remove("dark");
          iconSun.setAttribute("src", "assets/images/icon-sun-dark.svg");
          iconMoon.setAttribute("src", "assets/images/icon-moon-dark.svg");
     }
}

// Function to toggle between dark and light theme
function toggleTheme() {
     // Inverting the current theme mode
     isDarkMode = !isDarkMode;

     // Saving the updated theme mode to local storage
     localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));

     // Applying the updated theme
     applyTheme();
}

// Applying the initial theme when the script runs
applyTheme();

