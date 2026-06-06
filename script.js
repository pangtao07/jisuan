const modeSelect = document.getElementById("modeSelect");
const countSelect = document.getElementById("countSelect");
const restartBtn = document.getElementById("restartBtn");
const againBtn = document.getElementById("againBtn");
const app = document.getElementById("app");
const practiceView = document.getElementById("practiceView");
const finishView = document.getElementById("finishView");
const questionCard = document.getElementById("questionCard");
const questionText = document.getElementById("questionText");
const currentNumber = document.getElementById("currentNumber");
const totalCount = document.getElementById("totalCount");
const elapsedTime = document.getElementById("elapsedTime");
const finalTime = document.getElementById("finalTime");
const answerList = document.getElementById("answerList");

let questions = [];
let currentIndex = 0;
let startTime = 0;
let timerId = null;
let finished = false;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const copied = items.slice();
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = getRandomInt(0, i);
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

// 构建全部合法算式，确保加法不超过20、减法不小于0。
function buildProblemPool(mode) {
  const problems = [];

  if (mode === "mixed" || mode === "addition") {
    for (let left = 0; left <= 20; left += 1) {
      for (let right = 0; right <= 20 - left; right += 1) {
        problems.push({
          left,
          right,
          operator: "+",
          answer: left + right
        });
      }
    }
  }

  if (mode === "mixed" || mode === "subtraction") {
    for (let left = 0; left <= 20; left += 1) {
      for (let right = 0; right <= left; right += 1) {
        problems.push({
          left,
          right,
          operator: "-",
          answer: left - right
        });
      }
    }
  }

  return problems;
}

// 从打乱后的题库取题，题库足够时避免重复。
function generateQuestions() {
  const pool = shuffle(buildProblemPool(modeSelect.value));
  const count = Number(countSelect.value);
  const result = pool.slice(0, count);

  while (result.length < count) {
    result.push(pool[getRandomInt(0, pool.length - 1)]);
  }

  return result;
}

function startPractice() {
  questions = generateQuestions();
  currentIndex = 0;
  finished = false;
  startTime = Date.now();
  totalCount.textContent = String(questions.length);
  elapsedTime.textContent = "00:00";
  finalTime.textContent = "00:00";
  practiceView.classList.remove("hidden");
  finishView.classList.add("hidden");
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const problem = questions[currentIndex];
  currentNumber.textContent = String(currentIndex + 1);
  questionText.textContent = `${problem.left} ${problem.operator} ${problem.right} = ?`;
}

function nextQuestion() {
  if (finished) {
    return;
  }

  currentIndex += 1;
  if (currentIndex >= questions.length) {
    finishPractice();
    return;
  }

  renderQuestion();
}

function finishPractice() {
  finished = true;
  updateElapsedTime();
  stopTimer();
  finalTime.textContent = elapsedTime.textContent;
  renderAnswers();
  practiceView.classList.add("hidden");
  finishView.classList.remove("hidden");
}

function renderAnswers() {
  answerList.innerHTML = "";
  questions.forEach((problem) => {
    const item = document.createElement("li");
    item.textContent = `${problem.left} ${problem.operator} ${problem.right} = ${problem.answer}`;
    answerList.appendChild(item);
  });
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(updateElapsedTime, 1000);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function updateElapsedTime() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  elapsedTime.textContent = formatSeconds(seconds);
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
  return number < 10 ? `0${number}` : String(number);
}

function isControlClick(target) {
  return Boolean(target.closest("select, button, label, details, summary, .settings, .finish-view"));
}

app.addEventListener("click", (event) => {
  if (isControlClick(event.target)) {
    return;
  }
  nextQuestion();
});

questionCard.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startPractice);
againBtn.addEventListener("click", startPractice);
modeSelect.addEventListener("change", startPractice);
countSelect.addEventListener("change", startPractice);

startPractice();
