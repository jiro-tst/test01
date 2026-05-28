const dateInput = document.getElementById("date");
const weightInput = document.getElementById("weight");
const mealInput = document.getElementById("meal");
const workoutInput = document.getElementById("workout");
const proteinInput = document.getElementById("protein");
const saveBtn = document.getElementById("saveBtn");
const logList = document.getElementById("logList");

let logs = JSON.parse(localStorage.getItem("fitnessLogs")) || [];

function saveLogs() {
  localStorage.setItem("fitnessLogs", JSON.stringify(logs));
}

function renderLogs() {
  logList.innerHTML = "";

  if (logs.length === 0) {
    logList.innerHTML = "<p>まだ記録がありません。</p>";
    return;
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedLogs.forEach((log) => {
    const item = document.createElement("div");
    item.className = "log-item";

    item.innerHTML = `
      <div class="log-date">${log.date}</div>
      <div class="log-meta">体重：${log.weight || "-"} kg</div>
      <div class="log-meta">タンパク質：${log.protein || "-"} g</div>
      <p><strong>食事：</strong><br>${log.meal || "-"}</p>
      <p><strong>トレーニング：</strong><br>${log.workout || "-"}</p>
      <button class="delete-btn" onclick="deleteLog('${log.id}')">削除</button>
    `;

    logList.appendChild(item);
  });
}

function addLog() {
  const log = {
    id: Date.now().toString(),
    date: dateInput.value,
    weight: weightInput.value,
    meal: mealInput.value,
    workout: workoutInput.value,
    protein: proteinInput.value,
  };

  if (!log.date) {
    alert("日付を入力");
    return;
  }

  logs.push(log);
  saveLogs();
  renderLogs();

  dateInput.value = "";
  weightInput.value = "";
  mealInput.value = "";
  workoutInput.value = "";
  proteinInput.value = "";
}

function deleteLog(id) {
  logs = logs.filter((log) => log.id !== id);
  saveLogs();
  renderLogs();
}

saveBtn.addEventListener("click", addLog);

renderLogs();
