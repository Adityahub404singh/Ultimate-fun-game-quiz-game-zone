/* ================= GLOBAL VARIABLES ================= */

let playerName = "";
let playerEmail = "";
let score = 0;
let currentQuestion = 0;
let timer = null;
let timeLeft = 20;
let quizType = "single";
let answered = false;

let kidsScore = 0;
let kidsTimer = null;
let kidsTimeLeft = 20;

/* ================= EASY QUIZ QUESTIONS ================= */

const questions = [
{ question:"2 + 2 = ?", options:["3","4","5","6"], answer:[1] },
{ question:"Sun rises from?", options:["East","West","North","South"], answer:[0] },
{ question:"Which animal says Meow?", options:["Dog","Cat","Cow","Lion"], answer:[1] },
{ question:"5 + 3 = ?", options:["6","7","8","9"], answer:[2] },
{ question:"Which is fruit?", options:["Carrot","Potato","Apple","Onion"], answer:[2] },
{ question:"Sky color is?", options:["Blue","Green","Pink","Red"], answer:[0] },
{ question:"Select fruits", options:["Apple","Banana","Car","Mango"], answer:[0,1,3] },
{ question:"Water freezes at?", options:["0°C","50°C","10°C","100°C"], answer:[0] },
{ question:"Which can fly?", options:["Dog","Eagle","Cat","Cow"], answer:[1] },
{ question:"3 + 3 = ?", options:["5","6","7","8"], answer:[1] }
];

/* ================= ELEMENTS ================= */

const startBtn = document.getElementById("startGameBtn");
const userForm = document.getElementById("userForm");
const modeSection = document.getElementById("modeSection");
const quizSection = document.getElementById("quizSection");
const quizTypeSection = document.getElementById("quizTypeSection");
const kidsSection = document.getElementById("kidsSection");
const resultSection = document.getElementById("resultSection");
const hero = document.querySelector(".hero");

/* ================= START FLOW ================= */

startBtn.onclick = () => {
hero.style.display="none";
document.getElementById("userInfoSection").style.display="block";
};

userForm.onsubmit = (e) => {
e.preventDefault();
playerName = document.getElementById("playerName").value;
playerEmail = document.getElementById("playerEmail").value;
document.getElementById("userInfoSection").style.display="none";
modeSection.style.display="block";
};

/* ================= MODE ================= */

document.getElementById("quizModeBtn").onclick=()=>{
modeSection.style.display="none";
quizTypeSection.style.display="block";
};

document.getElementById("kidsModeBtn").onclick=()=>{
modeSection.style.display="none";
kidsSection.style.display="block";
};

document.getElementById("singleChoiceBtn").onclick=()=>{
quizType="single";
startQuiz();
};

document.getElementById("multiChoiceBtn").onclick=()=>{
quizType="multiple";
startQuiz();
};

/* ================= QUIZ ================= */

function startQuiz(){
quizTypeSection.style.display="none";
quizSection.style.display="block";
score=0;
currentQuestion=0;
document.getElementById("score").innerText=0;
showQuestion();
}

function showQuestion(){

answered=false;
clearInterval(timer);

let q = questions[currentQuestion];

document.getElementById("question").innerText = q.question;
document.getElementById("current-question").innerText = currentQuestion+1;
document.getElementById("total-question").innerText = questions.length;

let optionsHTML="";
q.options.forEach((opt,index)=>{
optionsHTML += `<button class="option-btn" data-index="${index}">${opt}</button>`;
});

document.getElementById("options").innerHTML = optionsHTML;
document.getElementById("nextBtn").style.display="none";

startTimer();
}

function startTimer(){
timeLeft = 20;
document.getElementById("time").innerText = timeLeft;

timer = setInterval(()=>{
timeLeft--;
document.getElementById("time").innerText = timeLeft;

if(timeLeft<=0){
clearInterval(timer);
checkAnswer();
}
},1000);
}

/* ================= OPTION SELECT ================= */

document.getElementById("options").onclick=(e)=>{
if(!answered && e.target.classList.contains("option-btn")){

if(quizType==="single"){
document.querySelectorAll(".option-btn").forEach(btn=>btn.classList.remove("selected"));
e.target.classList.add("selected");
}else{
e.target.classList.toggle("selected");
}

}
};

/* ================= SUBMIT ================= */

document.getElementById("submitAnswerBtn").onclick=()=>{
if(!answered){
checkAnswer();
}
};

/* ================= CHECK ANSWER (FINAL FIX) ================= */

function checkAnswer(){

if(answered) return;
answered = true;

clearInterval(timer);

let selected=[];
document.querySelectorAll(".option-btn.selected").forEach(btn=>{
selected.push(parseInt(btn.dataset.index));
});

let correct = [...questions[currentQuestion].answer].sort();
let userAnswer = [...selected].sort();

if(JSON.stringify(correct) === JSON.stringify(userAnswer)){
score++;
document.getElementById("correctSound").play();
confetti({particleCount:120,spread:80});
}else{
document.getElementById("wrongSound").play();
}

document.getElementById("score").innerText = score;
document.getElementById("nextBtn").style.display="inline-block";
}

/* ================= NEXT ================= */

document.getElementById("nextBtn").onclick=()=>{
currentQuestion++;
if(currentQuestion<questions.length){
showQuestion();
}else{
showResult();
}
};

/* ================= RESULT ================= */

function showResult(){

quizSection.style.display="none";
resultSection.style.display="block";

document.getElementById("finalResult").innerHTML =
`Name: ${playerName}<br>
Email: ${playerEmail ? playerEmail : "Not Provided"}<br>
Score: ${score}/${questions.length}`;

saveLeaderboard(score);
}

/* ================= PLAY AGAIN ================= */

document.getElementById("restartBtn").onclick=()=>{

clearInterval(timer);
clearInterval(kidsTimer);

resultSection.style.display="none";
kidsSection.style.display="none";
quizSection.style.display="none";
quizTypeSection.style.display="none";
modeSection.style.display="block";

score=0;
currentQuestion=0;
kidsScore=0;

document.getElementById("score").innerText=0;
document.getElementById("kidsScore").innerText=0;
};

/* ================= BACK HOME ================= */

document.getElementById("backHomeBtn").onclick=()=>{
resultSection.style.display="none";
hero.style.display="block";
};

/* ================= LEADERBOARD ================= */

/* ================= LEADERBOARD ================= */

function saveLeaderboard(finalScore){
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    // Add new score at top
    leaderboard.unshift({name:playerName, score:finalScore});
    
    // Keep only latest 5
    if(leaderboard.length > 5){
        leaderboard = leaderboard.slice(0,5);
    }

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard();
}

function displayLeaderboard(){
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let list = document.getElementById("leaderboardList");
    list.innerHTML = "";

    leaderboard.forEach(item => {
        list.innerHTML += `<li>${item.name} - ${item.score}</li>`;
    });
}

displayLeaderboard();


/* ================= KIDS GAME ================= */

document.getElementById("startKidsGameBtn").onclick=()=>{
kidsScore=0;
kidsTimeLeft=20;
document.getElementById("kidsScore").innerText=0;
startKidsTimer();
spawnEmoji();
};

function startKidsTimer(){
clearInterval(kidsTimer);

kidsTimer=setInterval(()=>{
kidsTimeLeft--;
document.getElementById("kidsTime").innerText=kidsTimeLeft;

if(kidsTimeLeft<=0){
clearInterval(kidsTimer);
kidsSection.style.display="none";
resultSection.style.display="block";

document.getElementById("finalResult").innerHTML=
`Name: ${playerName}<br>Kids Score: ${kidsScore}`;

saveLeaderboard(kidsScore);
}
},1000);
}

function spawnEmoji(){
if(kidsTimeLeft<=0) return;

const emojis=["😀","🎯","⭐","🍭","🍎","🚀","🐶","🌈"];
let area=document.getElementById("gameArea");

let emoji=document.createElement("div");
emoji.className="catch-emoji";
emoji.innerText=emojis[Math.floor(Math.random()*emojis.length)];
emoji.style.left=Math.random()*90+"%";
emoji.style.top=Math.random()*80+"%";

emoji.onclick=()=>{
kidsScore++;
document.getElementById("kidsScore").innerText=kidsScore;
emoji.remove();
};

area.appendChild(emoji);

setTimeout(()=>emoji.remove(),1000);
setTimeout(spawnEmoji,800);
}

/* ================= DARK MODE ================= */

document.getElementById("themeToggle").onclick=()=>{
document.body.classList.toggle("light-mode");
};