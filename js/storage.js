// ЗБЕРЕЖЕННЯ ПРОГРЕСУ ТЕСТУ
const STORAGE_KEY = "scoreup_quiz_progress";

function saveProgress() {
  const state = {
    questions: currentQuestions,
    answers: userAnswers,
    index: currentIndex,
    seconds: timerSeconds,
    title: document.getElementById("test-title")?.textContent || "",
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("ScoreUp: не вдалось зберегти прогрес", e);
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

function checkSavedProgress() {
  const state = loadProgress();
  if (!state || !state.questions || state.questions.length === 0) return;

  const banner = document.getElementById("resume-banner");
  if (!banner) return;

  const minutesAgo = Math.round((Date.now() - state.savedAt) / 60000);
  const timeLabel =
    minutesAgo < 1
      ? "щойно"
      : minutesAgo < 60
        ? `${minutesAgo} хв тому`
        : "давно";

  const answered = Object.keys(state.answers).length;
  const total = state.questions.length;

  document.getElementById("resume-info").textContent =
    `«${state.title}» — ${answered} з ${total} відповідено (збережено ${timeLabel})`;

  banner.classList.add("active");
}

function resumeQuiz() {
  const state = loadProgress();
  if (!state) return;

  currentQuestions = state.questions;
  userAnswers = state.answers;
  currentIndex = state.index;
  timerSeconds = state.seconds;

  hideBanner();
  setText("test-title", state.title);
  showPage("page-test-all");
  renderQuestionNav();
  renderQuestion();

  stopTimer();
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
    saveProgress();
  }, 1000);
}

function hideBanner() {
  const banner = document.getElementById("resume-banner");
  if (banner) banner.classList.remove("active");
}

function discardSavedProgress() {
  clearProgress();
  hideBanner();
}
