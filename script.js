/* ============ EDIT THIS PART ============ */
const CONFIG = {
  name: "Babuuuu",
  from: "Bebuuuuuuuuuuuu",

  passcode: "tulips",              // leave "" to remove the lock
  hint: "Hint: floweeeeeer",

  greeting: "Happy Birthday, Babuuuu!",
  subtitle: "To the most genuine person I know. I made this just for you.",

  candles: 3,

  together: "2025-02-25",        // date you became a couple (YYYY-MM-DD)

  letter: [
    "Dear Babuuu,",
    "Happy birthday to this very genuine person. You stay real no matter what, and I love that about you.",
    "Thank you for the little things, the laughs, and for always making me feel like enough.",
    "I hope today is full of everything you deserve. I love you so much.",
    "Always yours,",
    "Bebuuuu"
  ],

  // Put pictures inside the "photos" folder
  photos: [
    { src: "photos/ph2.jpg", caption: "Our first photo together" },
    { src: "photos/ph3.jpg", caption: "My favorite day" },
    { src: "photos/2.jpg", caption: "You, being you" }
  ],

  reasons: [
    "You are genuine in everything you do.",
    "Your laugh makes my whole day better.",
    "You care about people so deeply.",
    "You make ordinary days feel special.",
    "You are my favorite person to talk to.",
    "You make me want to be better."
  ],

  scratchText: "I love you more than yesterday 💖",

  vouchers: [
    "One dinner date, your choice",
    "One movie night, you pick the movie",
    "One long hug, no questions asked",
    "One surprise from me"
  ],

  finalTitle: "I love you so much",
  finalText: "Thank you for being you. Happy birthday, my love. Here's to many more years together.",

  music: "happybirthdaysong.mp3" // example: "music.mp3" (put the file in the same folder)
};
/* ========================================= */

const $ = (id) => document.getElementById(id);
const screens = [...document.querySelectorAll(".screen")];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- navigation ---------- */
const enter = {
  greeting: runGreeting,
  cake: buildCake,
  letter: resetLetter,
  photos: () => showPhoto(0),
  counter: startCounter,
  reasons: resetReasons,
  scratch: setupScratch,
  final: resetFinal
};

function show(id) {
  screens.forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  if (enter[id]) enter[id]();
}

document.querySelectorAll("[data-next]").forEach((b) =>
  b.addEventListener("click", () => {
    startMusic();
    show(b.dataset.next);
  })
);

/* ---------- static text ---------- */
$("lockTitle").textContent = `For ${CONFIG.name} 🔒`;
$("hint").textContent = CONFIG.hint;
$("introTitle").textContent = `Hi, ${CONFIG.name}`;
$("scratchText").textContent = CONFIG.scratchText;
$("finalTitle").textContent = CONFIG.finalTitle + " 💖";
$("finalText").textContent = CONFIG.finalText;
$("sign").textContent = "With all my love, " + CONFIG.from;

/* ---------- floating hearts ---------- */
setInterval(() => {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = ["💗", "💖", "💕", "🤍"][Math.floor(Math.random() * 4)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 16 + Math.random() * 16 + "px";
  h.style.animationDuration = 5 + Math.random() * 5 + "s";
  $("hearts").appendChild(h);
  setTimeout(() => h.remove(), 10000);
}, 600);

/* tap anywhere = little heart burst */
document.addEventListener("click", (e) => {
  for (let i = 0; i < 6; i++) {
    const p = document.createElement("span");
    p.className = "pop";
    p.textContent = "💗";
    p.style.left = e.clientX + "px";
    p.style.top = e.clientY + "px";
    p.style.setProperty("--dx", Math.random() * 120 - 60 + "px");
    p.style.setProperty("--dy", Math.random() * -120 - 20 + "px");
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
});

/* ---------- confetti ---------- */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let running = false;

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

function confetti(count = 160) {
  const colors = ["#ff4d7d", "#ffd166", "#06d6a0", "#4cc9f0", "#c77dff", "#ffffff"];
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 300,
      vx: Math.random() * 4 - 2,
      vy: 2 + Math.random() * 4,
      s: 6 + Math.random() * 6,
      r: Math.random() * 6,
      vr: Math.random() * 0.2 - 0.1,
      c: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  if (!running) {
    running = true;
    loop();
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 20);
  if (pieces.length) requestAnimationFrame(loop);
  else running = false;
}

/* ---------- music ---------- */
const audio = $("music");
let musicStarted = false;

if (CONFIG.music) {
  audio.src = CONFIG.music;
  $("musicBtn").classList.remove("hidden");
}
function startMusic() {
  if (!CONFIG.music || musicStarted) return;
  musicStarted = true;
  audio.play().then(() => ($("musicBtn").textContent = "🔊")).catch(() => {});
}
$("musicBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  if (audio.paused) {
    audio.play();
    $("musicBtn").textContent = "🔊";
  } else {
    audio.pause();
    $("musicBtn").textContent = "🔇";
  }
});

/* ---------- lock ---------- */
function tryUnlock() {
  const ok = $("pass").value.trim().toLowerCase() === CONFIG.passcode.toLowerCase();
  if (ok) {
    startMusic();
    show("intro");
  } else {
    $("pass").classList.add("shake");
    setTimeout(() => $("pass").classList.remove("shake"), 450);
  }
}
$("unlockBtn").addEventListener("click", tryUnlock);
$("pass").addEventListener("keydown", (e) => e.key === "Enter" && tryUnlock());
if (!CONFIG.passcode) show("intro");

/* ---------- greeting (typing) ---------- */
let typingTimer;
function runGreeting() {
  clearInterval(typingTimer);
  const el = $("typed");
  el.textContent = "";
  $("subtitle").classList.add("hidden");
  $("greetNext").classList.add("hidden");
  $("subtitle").textContent = CONFIG.subtitle;
  let i = 0;
  typingTimer = setInterval(() => {
    i++;
    el.textContent = CONFIG.greeting.slice(0, i);
    if (i >= CONFIG.greeting.length) {
      clearInterval(typingTimer);
      confetti(140);
      $("subtitle").classList.remove("hidden");
      $("greetNext").classList.remove("hidden");
    }
  }, 60);
}

/* ---------- cake ---------- */
function buildCake() {
  const box = $("candles");
  box.innerHTML = "";
  $("cakeHint").textContent = "Tap each candle to blow it out";
  $("cakeNext").classList.add("hidden");
  let lit = CONFIG.candles;
  for (let i = 0; i < CONFIG.candles; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = '<div class="flame"></div>';
    c.addEventListener("click", () => {
      if (!c.querySelector(".flame")) return;
      c.innerHTML = '<div class="smoke">~</div>';
      lit--;
      if (lit === 0) {
        $("cakeHint").textContent = "Your wish is on its way 💫";
        confetti(220);
        $("cakeNext").classList.remove("hidden");
      }
    });
    box.appendChild(c);
  }
}

/* ---------- letter ---------- */
function resetLetter() {
  $("envelope").classList.remove("open", "hidden");
  $("envHint").classList.remove("hidden");
  $("paper").classList.add("hidden");
  $("paper").innerHTML = "";
  $("letterNext").classList.add("hidden");
}
$("envelope").addEventListener("click", async () => {
  if ($("envelope").classList.contains("open")) return;
  $("envelope").classList.add("open");
  $("envHint").classList.add("hidden");
  await wait(700);
  $("envelope").classList.add("hidden");
  $("paper").classList.remove("hidden");
  for (const line of CONFIG.letter) {
    const p = document.createElement("p");
    p.textContent = line;
    $("paper").appendChild(p);
    $("paper").scrollTop = $("paper").scrollHeight;
    await wait(1100);
  }
  $("letterNext").classList.remove("hidden");
});

/* ---------- photos ---------- */
let photoIndex = 0;
function showPhoto(i) {
  photoIndex = i;
  const p = CONFIG.photos[i];
  $("photo").src = p.src;
  $("caption").textContent = p.caption;
  $("photoCount").textContent = `${i + 1} / ${CONFIG.photos.length}`;
  $("prevPhoto").disabled = i === 0;
  $("nextPhoto").disabled = i === CONFIG.photos.length - 1;
  $("photoNext").classList.toggle("hidden", i !== CONFIG.photos.length - 1);
  const box = $("polaroid");
  box.classList.remove("swap");
  void box.offsetWidth;
  box.classList.add("swap");
}
$("prevPhoto").addEventListener("click", () => showPhoto(photoIndex - 1));
$("nextPhoto").addEventListener("click", () => showPhoto(photoIndex + 1));

/* ---------- counter ---------- */
let counterTimer;
function startCounter() {
  clearInterval(counterTimer);
  const start = new Date(CONFIG.together + "T00:00:00");
  const tick = () => {
    let diff = Math.max(0, Math.floor((Date.now() - start) / 1000));
    $("cd").textContent = Math.floor(diff / 86400);
    $("ch").textContent = Math.floor((diff % 86400) / 3600);
    $("cm").textContent = Math.floor((diff % 3600) / 60);
    $("cs").textContent = diff % 60;
  };
  tick();
  counterTimer = setInterval(tick, 1000);
}

/* ---------- reasons ---------- */
let order = [];
let seen = 0;
function resetReasons() {
  order = [...CONFIG.reasons].sort(() => Math.random() - 0.5);
  seen = 0;
  $("reason").textContent = "Tap the button below";
  $("reasonCount").textContent = "";
  $("reasonBtn").classList.remove("hidden");
  $("reasonNext").classList.add("hidden");
}
$("reasonBtn").addEventListener("click", () => {
  const card = $("reason");
  card.textContent = order[seen];
  card.classList.remove("swap");
  void card.offsetWidth;
  card.classList.add("swap");
  seen++;
  $("reasonCount").textContent = `${seen} / ${order.length}`;
  $("reasonBtn").textContent = "Another reason";
  if (seen === order.length) {
    $("reasonBtn").classList.add("hidden");
    $("reasonNext").classList.remove("hidden");
    confetti(80);
  }
});

/* ---------- scratch card ---------- */
function setupScratch() {
  const c = $("scratchCanvas");
  const g = c.getContext("2d");
  $("scratchNext").classList.add("hidden");
  g.globalCompositeOperation = "source-over";
  const grad = g.createLinearGradient(0, 0, 300, 150);
  grad.addColorStop(0, "#c9c9d6");
  grad.addColorStop(1, "#9d9db0");
  g.fillStyle = grad;
  g.fillRect(0, 0, 300, 150);
  g.fillStyle = "#fff";
  g.font = "500 18px Poppins, sans-serif";
  g.textAlign = "center";
  g.fillText("Scratch here ✨", 150, 80);
  g.globalCompositeOperation = "destination-out";

  let drawing = false;
  let done = false;
  let moves = 0;

  const pos = (e) => {
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (300 / r.width), y: (e.clientY - r.top) * (150 / r.height) };
  };
  const scratch = (e) => {
    if (!drawing || done) return;
    const { x, y } = pos(e);
    g.beginPath();
    g.arc(x, y, 18, 0, Math.PI * 2);
    g.fill();
    if (++moves % 8 === 0) checkCleared();
  };
  const checkCleared = () => {
    const data = g.getImageData(0, 0, 300, 150).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 16) if (data[i] === 0) clear++;
    if (clear / (data.length / 16) > 0.5) {
      done = true;
      c.style.transition = "opacity .6s";
      c.style.opacity = 0;
      confetti(160);
      $("scratchNext").classList.remove("hidden");
    }
  };

  c.style.opacity = 1;
  c.onpointerdown = (e) => { drawing = true; c.setPointerCapture(e.pointerId); scratch(e); };
  c.onpointermove = scratch;
  c.onpointerup = () => (drawing = false);
}

/* ---------- final ---------- */
const SAVE_KEY = "bday-redeemed";
function getSaved() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || []; } catch { return []; }
}
function save(list) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); } catch {}
}

function resetFinal() {
  $("finalStart").classList.remove("hidden");
  $("finalBox").classList.add("hidden");
}

$("surpriseBtn").addEventListener("click", () => {
  $("finalStart").classList.add("hidden");
  $("finalBox").classList.remove("hidden");
  confetti(300);
  renderVouchers();
});

function renderVouchers() {
  const box = $("vouchers");
  box.innerHTML = "";
  const saved = getSaved();
  CONFIG.vouchers.forEach((v, i) => {
    const b = document.createElement("button");
    b.className = "voucher" + (saved.includes(i) ? " done" : "");
    b.textContent = (saved.includes(i) ? "Redeemed ✔ " : "🎟️ ") + v;
    b.addEventListener("click", () => {
      const list = getSaved();
      if (list.includes(i)) return;
      list.push(i);
      save(list);
      confetti(60);
      renderVouchers();
    });
    box.appendChild(b);
  });
}

$("replay").addEventListener("click", () => show("greeting"));