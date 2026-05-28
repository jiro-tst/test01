const STORAGE_KEY = "fitnessLogsV2";

const logForm = document.getElementById("logForm");
const logList = document.getElementById("logList");

const dateInput = document.getElementById("date");
const weightInput = document.getElementById("weight");
const breakfastInput = document.getElementById("breakfast");
const lunchInput = document.getElementById("lunch");
const dinnerInput = document.getElementById("dinner");
const snackInput = document.getElementById("snack");
const proteinInput = document.getElementById("protein");
const fatInput = document.getElementById("fat");
const carbsInput = document.getElementById("carbs");
const cardioInput = document.getElementById("cardio");
const workoutInput = document.getElementById("workout");
const memoInput = document.getElementById("memo");

const latestWeightEl = document.getElementById("latestWeight");
const averageProteinEl = document.getElementById("averageProtein");
const workoutDaysEl = document.getElementById("workoutDays");
const totalCardioEl = document.getElementById("totalCardio");

let logs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function setTodayIfEmpty() {
  if (!dateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }
}

function saveLogs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function parseNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatNumber(value, unit = "") {
  if (value === "" || value === null || value === undefined) return "-";
  return `${value}${unit}`;
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatText(text) {
  if (!text || !text.trim()) return "—";
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function sortLogsByDate(data) {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

function renderSummary() {
  const sortedLogs = sortLogsByDate(logs);

  if (sortedLogs.length === 0) {
    latestWeightEl.textContent = "-";
    averageProteinEl.textContent = "-";
    workoutDaysEl.textContent = "-";
    totalCardioEl.textContent = "-";
    return;
  }

  const latestLogWithWeight = sortedLogs.find(log => log.weight !== "" && log.weight !== null && log.weight !== undefined);
  latestWeightEl.textContent = latestLogWithWeight ? `${latestLogWithWeight.weight} kg` : "-";

  const proteinLogs = logs.filter(log => log.protein !== "" && !Number.isNaN(Number(log.protein)));
  const proteinAverage = proteinLogs.length
    ? (proteinLogs.reduce((sum, log) => sum + parseNumber(log.protein), 0) / proteinLogs.length).toFixed(1)
    : "-";
  averageProteinEl.textContent = proteinAverage === "-" ? "-" : `${proteinAverage} g`;

  const workoutDays = logs.filter(log => log.workout && log.workout.trim() !== "").length;
  workoutDaysEl.textContent = `${workoutDays} 日`;

  const totalCardio = logs.reduce((sum, log) => sum + parseNumber(log.cardio), 0);
  totalCardioEl.textContent = `${totalCardio} 分`;
}

function renderLogs() {
  const sortedLogs = sortLogsByDate(logs);

  if (sortedLogs.length === 0) {
    logList.innerHTML = `
      <div class="empty-state">
        まだ記録がありません。<br />
        上のフォームから最初のログを追加してみてください。
      </div>
    `;
    return;
  }

  logList.innerHTML = sortedLogs
    .map((log) => {
      return `
        <article class="log-item">
          <div class="log-top">
            <div>
              <h3 class="log-date">${escapeHtml(log.date || "-")}</h3>
              <div class="badge-row">
                <span class="badge">体重: ${formatNumber(log.weight, " kg")}</span>
                <span class="badge">P: ${formatNumber(log.protein, "g")}</span>
                <span class="badge">F: ${formatNumber(log.fat, "g")}</span>
                <span class="badge">C: ${formatNumber(log.carbs, "g")}</span>
                <span class="badge">有酸素: ${formatNumber(log.cardio, " 分")}</span>
              </div>
            </div>
          </div>

          <div class="log-section">
            <p class="log-section-title">朝食</p>
            <p class="log-text">${formatText(log.breakfast)}</p>
          </div>

          <div class="log-section">
            <p class="log-section-title">昼食</p>
            <p class="log-text">${formatText(log.lunch)}</p>
          </div>

          <div class="log-section">
            <p class="log-section-title">夕食</p>
            <p class="log-text">${formatText(log.dinner)}</p>
          </div>

          <div class="log-section">
            <p class="log-section-title">間食</p>
            <p class="log-text">${formatText(log.snack)}</p>
          </div>

          <div class="log-section">
            <p class="log-section-title">トレーニング内容</p>
            <p class="log-text">${formatText(log.workout)}</p>
          </div>

          <div class="log-section">
            <p class="log-section-title">メモ</p>
            <p class="log-text">${formatText(log.memo)}</p>
          </div>

          <button class="delete-btn" data-id="${log.id}">削除</button>
        </article>
      `;
    })
    .join("");
}

function clearForm() {
  logForm.reset();
  setTodayIfEmpty();
}

function addLog(event) {
  event.preventDefault();

  const newLog = {
    id: Date.now().toString(),
    date: dateInput.value,
    weight: weightInput.value,
    breakfast: breakfastInput.value,
    lunch: lunchInput.value,
    dinner: dinnerInput.value,
    snack: snackInput.value,
    protein: proteinInput.value,
    fat: fatInput.value,
    carbs: carbsInput.value,
    cardio: cardioInput.value,
    workout: workoutInput.value,
    memo: memoInput.value,
  };

  if (!newLog.date) {
    alert("日付を入力してね");
    return;
  }

  logs.push(newLog);
  saveLogs();
  renderSummary();
  renderLogs();
  clearForm();
}

function deleteLog(id) {
  logs = logs.filter((log) => log.id !== id);
  saveLogs();
  renderSummary();
  renderLogs();
}

logForm.addEventListener("submit", addLog);

logList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;
    deleteLog(id);
  }
});

setTodayIfEmpty();
renderSummary();
renderLogs();
