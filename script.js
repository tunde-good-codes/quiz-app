import { quizData } from "./questions.js";

// ================= VARIABLES =================
let studentName = "";
let studentClass = "";
let currentSubject = "";
let questions = [];
let currentIndex = 0;
let answers = [];
let timer;
let timeLeft = 0;

// ================= ELEMENTS =================
const formPage = document.getElementById("form-page");
const instructionPage = document.getElementById("instruction-page");
const quizPage = document.getElementById("quiz-page");
const resultPage = document.getElementById("result-page");

const form = document.getElementById("student-form");
const subjectSelect = document.getElementById("subject-select");
const startBtn = document.getElementById("start-quiz");

const quizSubject = document.getElementById("quiz-subject");
const timerDisplay = document.getElementById("timer");
const questionContainer = document.getElementById("question-container");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");

const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

// ================= HELPERS =================
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  page.classList.add("active");
}

// Shuffle questions function 
function shuffleQuestions(questionsArray) {
  const shuffled = [...questionsArray]; // Create a copy to avoid mutating original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function startTimer(seconds) {
  timeLeft = seconds;
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      finishQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  let min = Math.floor(timeLeft / 60);
  let sec = timeLeft % 60;
  timerDisplay.textContent = `Time Left: ${min}:${sec < 10 ? "0" : ""}${sec}`;
  
  // Change color when time is running low
  if (timeLeft < 60) {
    timerDisplay.style.background = "#c0392b";
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  questionContainer.innerHTML = `
    <h3>Q${currentIndex + 1}. ${q.q}</h3>
    ${q.options.map((opt, i) => `
      <label>
        <input type="radio" name="answer" value="${i}" ${answers[currentIndex] == i ? "checked" : ""}>
        ${opt}
      </label>
    `).join("")}
  `;
  
  // Update button states
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === questions.length - 1;
  
  if (prevBtn.disabled) {
    prevBtn.style.opacity = "0.5";
    prevBtn.style.cursor = "not-allowed";
  } else {
    prevBtn.style.opacity = "1";
    prevBtn.style.cursor = "pointer";
  }
  
  if (nextBtn.disabled) {
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";
  } else {
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
  }
}

function calculateScore() {
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] == q.answer) score++;
  });
  return Math.round((score / questions.length) * 100);
}
function finishQuiz() {
  const score = calculateScore();
  let remark = "";
  let resultColor = "";
  
  // Get class arm value
  const classArm = document.getElementById("class-arm").value;
  const classArmDisplay = classArm.charAt(0).toUpperCase() + classArm.slice(1);
  
  // Determine remark, color and emoji based on score
  if (score >= 90) {
    remark = "Outstanding Performance!";
    resultColor = "#27ae60"; // Deep green
  } else if (score >= 80) {
    remark = "Excellent Work!";
    resultColor = "#2ecc71"; // Green
  } else if (score >= 70) {
    remark = "Very Good Performance";
    resultColor = "#3498db"; // Blue
  } else if (score >= 60) {
    remark = "Good Effort";
    resultColor = "#f39c12"; // Orange
  } else if (score >= 50) {
    remark = "Satisfactory - Keep Practicing";
    resultColor = "#e67e22"; // Dark orange
  } else if (score >= 40) {
    remark = "Needs Improvement";
    resultColor = "#e74c3c"; // Light red
  } else {
    remark = "Requires More Study";
    resultColor = "#c0392b"; // Deep red
  }

  // Apply styling to result text
  resultText.style.background = resultColor;
  resultText.style.color = "white";
  resultText.style.padding = "25px";
  resultText.style.borderRadius = "10px";
  resultText.style.fontWeight = "bold";
  resultText.style.fontSize = "18px";
  resultText.style.lineHeight = "1.6";
  
  // Create a more comprehensive result display
  resultText.innerHTML = `
    
    <div style="background: rgba(255,255,255,0.2); padding: 5px; border-radius: 8px; margin: 2px 0;">
      <strong>Student Details:</strong><br>
      Name: ${studentName}<br>
      Class: ${studentClass}<br>
      Class Arm: ${classArmDisplay}
    </div>
    
    <div style="background: rgba(255,255,255,0.2); padding: 5px; border-radius: 8px; margin: 12px 0;">
      <strong>Subject:</strong> ${currentSubject.toUpperCase()}<br>
      <strong>Score:</strong> ${score}%<br>
      <strong>Performance:</strong> ${remark}
    </div>
    
  `;
  
  showPage(resultPage);
}

// function finishQuiz() {
//   const score = calculateScore();
//   let remark = "";
//   let resultColor = "";
  
//   // Determine remark and color based on score
//   if (score >= 80) {
//     remark = "Excellent";
//     resultColor = "#27ae60"; // Deep green
//   } else if (score >= 70) {
//     remark = "Very Good";
//     resultColor = "#2ecc71"; // Light green
//   } else if (score >= 50) {
//     remark = "Good";
//     resultColor = "#e67e22"; // Orange
//   } else {
//     remark = "Failed";
//     resultColor = "#e74c3c"; // Light red
//   }

//   // Apply styling to result text
//   resultText.style.background = resultColor;
//   resultText.style.color = "white";
//   resultText.style.padding = "20px";
//   resultText.style.borderRadius = "8px";
//   resultText.style.fontWeight = "bold";
  
//   resultText.textContent = `${studentName}, you scored ${score}%. You got "${remark}" in ${currentSubject.toUpperCase()}.`;
//   showPage(resultPage);
// }

// ================= EVENTS =================
form.addEventListener("submit", e => {
  e.preventDefault();
  studentName = document.getElementById("name").value.trim();
  studentClass = document.getElementById("class").value.trim();
  showPage(instructionPage);
});

startBtn.addEventListener("click", () => {
  currentSubject = subjectSelect.value;
  
  // Shuffle questions before starting the quiz
  const originalQuestions = quizData[currentSubject].questions;
  questions = shuffleQuestions(originalQuestions);
  
  answers = Array(questions.length).fill(null);
  currentIndex = 0;

  quizSubject.textContent = `Subject: ${currentSubject.toUpperCase()}`;
  renderQuestion();
  startTimer(quizData[currentSubject].time);

  showPage(quizPage);
});

nextBtn.addEventListener("click", () => {
  const selected = document.querySelector("input[name='answer']:checked");
  if (selected) answers[currentIndex] = parseInt(selected.value);
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

submitBtn.addEventListener("click", () => {
  const selected = document.querySelector("input[name='answer']:checked");
  if (selected) answers[currentIndex] = parseInt(selected.value);
  
  const notAnswered = answers.filter(a => a === null).length;
  if (notAnswered > 0) {
    const confirmSubmit = confirm(`You have ${notAnswered} unanswered questions. Submit anyway?`);
    if (!confirmSubmit) return;
  }
  clearInterval(timer);
  finishQuiz();
});

restartBtn.addEventListener("click", () => {
  showPage(formPage);
});