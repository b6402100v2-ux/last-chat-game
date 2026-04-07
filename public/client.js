const socket = io();

let role = "";
let chatIndex = 0;

const chats = {
  Jamie:[
    "Alex: Are you free tonight?",
    "Jamie: Yeah why?",
    "Alex: I found something strange.",
    "Jamie: Sounds serious..."
  ],
  Taylor:[
    "Alex: We need to talk.",
    "Taylor: About last week?",
    "Alex: Yes...",
    "Taylor: I’ll explain everything."
  ],
  Chris:[
    "Chris: Meeting tonight?",
    "Alex: Maybe late.",
    "Chris: Don’t mess the project.",
    "Alex: I’ll handle it."
  ],
  Morgan:[
    "Morgan: You seem stressed.",
    "Alex: Just a weird day.",
    "Morgan: Going out tonight?",
    "Alex: Yeah meeting someone."
  ]
};

socket.emit("join-game");

socket.on("role-assigned", r=>{
  role = r;
  document.getElementById("header").innerText = "Role: " + role;
  startChat();
});

function startChat(){
  let arr = chats[role];
  let chatBox = document.getElementById("chat");

  let timer = 60;
  let timerUI = document.getElementById("timer");

  let t = setInterval(()=>{
    timerUI.innerText = "Time: " + timer;
    timer--;
    if(timer<0){
      clearInterval(t);
      showQuestion();
    }
  },1000);

  function next(){
    if(chatIndex < arr.length){
      let div = document.createElement("div");
      div.className = "msg " + (chatIndex%2==0 ? "left":"right");
      div.innerText = arr[chatIndex];
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
      chatIndex++;
      setTimeout(next,2000);
    } else {
      showQuestion();
    }
  }

  next();
}

function showQuestion(){
  document.getElementById("chat").style.display="none";
  document.getElementById("question").style.display="block";
}

function submitHP(score){
  socket.emit("submit-hp", score);
  document.getElementById("question").style.display="none";
  document.getElementById("vote").style.display="block";
}

function vote(name){
  socket.emit("vote", name);
}

socket.on("game-result", data=>{
  document.getElementById("vote").style.display="none";

  document.getElementById("result").innerHTML = `
    <h3>Killer: ${data.killer}</h3>
    <p>${data.clues.join("<br>")}</p>
  `;
});
