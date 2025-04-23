const userInput = document.getElementById("user-input");
const chatOutput = document.getElementById("chat-output");
const voiceBtn = document.getElementById("voice-btn");
const sendBtn = document.getElementById("send-btn");

// Utility: Random thank you reply
const thankYouReply = () => {
  const responses = [
    "You're most welcome!",
    "Happy to help!",
    "Anytime! Let me know if you need anything else.",
    "Glad I could assist you!",
    "It's my pleasure!"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Utility: Speak text
const speakMessage = (message) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.voice = synth.getVoices()[0]; // Customize voice if needed
  utterance.rate = 1;
  utterance.volume = 1;
  utterance.pitch = 1;
  synth.speak(utterance);
};

// Add message to chat window
function sendMessage(message, sender = "user") {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = message;
  chatOutput.appendChild(msg);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Typing animation for Astra's reply
function typeMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message astra";
  chatOutput.appendChild(msg);

  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.animationDelay = `${i * 0.03}s`;
    msg.appendChild(span);
  });

  chatOutput.scrollTop = chatOutput.scrollHeight;
  speakMessage(text);
}

// Greet on load
function wishMe() {
  const hour = new Date().getHours();
  if (hour < 12) speakMessage("Good Morning Sir...");
  else if (hour < 17) speakMessage("Good Afternoon Sir...");
  else speakMessage("Good Evening Sir...");
}

window.addEventListener("load", () => {
  speakMessage("Initializing Astra...");
  wishMe();
});

// Voice input setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const transcript = event.results[event.resultIndex][0].transcript;
  sendMessage(transcript, "user");
  takeCommand(transcript.toLowerCase());
};

voiceBtn.addEventListener("click", () => {
  recognition.start();
});

sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleUserInput();
});

// Handle text input
function handleUserInput() {
  const input = userInput.value.trim();
  if (input === "") return;
  sendMessage(input, "user");
  userInput.value = "";
  takeCommand(input.toLowerCase());
}

// Command logic
function takeCommand(message) {
  if (message.includes("hello") || message.includes("hey")) {
    typeMessage("Hello Sir, how can I help you?");
  } else if (message.includes("time")) {
    const time = new Date().toLocaleTimeString();
    typeMessage("The current time is " + time);
  } else if (message.includes("date")) {
    const date = new Date().toLocaleDateString();
    typeMessage("Today's date is " + date);
  } else if (message.includes("your name")) {
    typeMessage("My name is Astra, your virtual assistant.");
  } else if (message.includes("thank you") || message.includes("thanks") || message.includes("thankyou") || message.includes("thank you so much")) {
    const reply = thankYouReply();
    typeMessage(reply);
  } else if (message.includes("dark mode")) {
    document.body.classList.add("dark-mode");
    typeMessage("Dark mode activated.");
  } else if (message.includes("light mode")) {
    document.body.classList.remove("dark-mode");
    typeMessage("Light mode activated.");
  } else if (message.includes("calculator") || message.includes("plus") || message.includes("minus") || message.includes("divide") || message.includes("multiply")) {
    calculate(message);
  } else {
    typeMessage("Sorry, I couldn't understand that. Please try something else.");
  }
}

// Simple calculator
function calculate(msg) {
  try {
    const expression = msg.replace(/plus/g, "+")
                          .replace(/minus/g, "-")
                          .replace(/into|multiply|times/g, "*")
                          .replace(/divide|by/g, "/");
    const result = eval(expression);
    typeMessage(`The result is ${result}`);
  } catch {
    typeMessage("Sorry, I couldn't calculate that.");
  }
}
