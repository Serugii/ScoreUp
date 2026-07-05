// СТАН ТЕСТУ
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};

let lastTestQuestions = [];
let lastTestTitle = "";

// ТАЙМЕР
let timerInterval = null;
let timerSeconds = 0;
let finalTime = 0;

function startTimer() {
  stopTimer();
  timerSeconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
    saveProgress();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const s = String(timerSeconds % 60).padStart(2, "0");
  setText("quiz-timer", `${m}:${s}`);
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s} сек`;
  if (s === 0) return `${m} хв`;
  return `${m} хв ${s} сек`;
}

// ЗАПУСК ТЕСТУ
function startTest(questions) {
  hideBanner();

  lastTestQuestions = questions;
  lastTestTitle = document.getElementById("test-title")?.textContent || "";

  const shuffledQuestions = shuffleArray(questions);
  currentQuestions = shuffledQuestions.map((q) => {
    const optionsWithMeta = q.options.map((text, i) => ({
      text,
      isCorrect: i === q.correct,
    }));
    const shuffledOptions = shuffleArray(optionsWithMeta);
    return {
      q: q.q,
      options: shuffledOptions.map((o) => o.text),
      correct: shuffledOptions.findIndex((o) => o.isCorrect),
    };
  });

  currentIndex = 0;
  userAnswers = {};

  showPage("page-test-all");
  renderQuestionNav();
  renderQuestion();
  startTimer();
}

// АНІМАЦІЯ МІЖ ПИТАННЯМИ
let isAnimating = false;

function animateToQuestion(newIndex) {
  if (newIndex < 0 || newIndex >= currentQuestions.length) return;
  if (isAnimating) return;

  const wrap = document.getElementById("quiz-question-wrap");
  if (!wrap) {
    currentIndex = newIndex;
    renderQuestion();
    return;
  }

  isAnimating = true;

  setNavButtonsDisabled(true);

  wrap.classList.add("quiz-slide-out");

  wrap.addEventListener(
    "animationend",
    function handler() {
      wrap.removeEventListener("animationend", handler);
      wrap.classList.remove("quiz-slide-out");

      currentIndex = newIndex;
      renderQuestion();

      wrap.classList.add("quiz-slide-in");
      wrap.addEventListener(
        "animationend",
        function h2() {
          wrap.removeEventListener("animationend", h2);
          wrap.classList.remove("quiz-slide-in");

          isAnimating = false;
          setNavButtonsDisabled(false);
          renderQuestion();
        },
        { once: true },
      );
    },
    { once: true },
  );
}

function setNavButtonsDisabled(disabled) {
  const prev = document.getElementById("btn-prev");
  const next = document.getElementById("btn-next");
  if (prev) prev.disabled = disabled;
  if (next) next.disabled = disabled;
}

// РЕНДЕР ПИТАННЯ
function renderQuestion() {
  const q = currentQuestions[currentIndex];
  const total = currentQuestions.length;

  document.getElementById("progress-bar").style.width =
    ((currentIndex + 1) / total) * 100 + "%";
  setText("quiz-counter", `Питання ${currentIndex + 1} з ${total}`);
  setText("quiz-question", q.q);

  const container = document.getElementById("quiz-options");
  container.innerHTML = "";

  const selected = userAnswers[currentIndex];

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.dataset.index = i;
    if (i === selected) btn.classList.add("selected");
    btn.addEventListener("click", () => selectAnswer(i));
    container.appendChild(btn);
  });

  if (!isAnimating) {
    const prevBtn = document.getElementById("btn-prev");
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
  }

  const nextBtn = document.getElementById("btn-next");
  const isLast = currentIndex === currentQuestions.length - 1;
  nextBtn.textContent = isLast ? "Завершити тест ✓" : "Наступне питання →";

  updateQuestionNav();
}

// ВИБІР ВІДПОВІДІ
function selectAnswer(selectedIndex) {
  userAnswers[currentIndex] = selectedIndex;
  renderQuestion();
  saveProgress();
}

function goToQuestion(index) {
  if (index < 0 || index >= currentQuestions.length) return;
  animateToQuestion(index);
}

function prevQuestion() {
  goToQuestion(currentIndex - 1);
}

function nextQuestion() {
  if (currentIndex < currentQuestions.length - 1) {
    goToQuestion(currentIndex + 1);
    return;
  }
  attemptFinishTest();
}

function attemptFinishTest() {
  const unanswered = currentQuestions.findIndex(
    (_, qi) => !(qi in userAnswers),
  );
  if (unanswered !== -1) {
    showUnansweredModal(unanswered);
    return;
  }

  finishTest();
}

function finishTest() {
  finalTime = timerSeconds;
  stopTimer();
  clearProgress();
  showResults();
}

function restartLastTest() {
  if (!lastTestQuestions.length) return;
  setText("test-title", lastTestTitle);
  startTest(lastTestQuestions);
}

// ПІДТВЕРДЖЕННЯ ВИХОДУ З ТЕСТУ
const MODAL_ICONS = {
  exit: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  warn: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  count: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
};

// ВИБІР КІЛЬКОСТІ ПИТАНЬ ПЕРЕД СТАРТОМ ТЕСТУ
function openCountModal(questions, title) {
  const total = questions.length;
  const defaultCount = Math.min(10, total);

  const overlay = document.getElementById("modal-overlay");
  const bodyEl = document.getElementById("modal-body");
  bodyEl.innerHTML = "";

  const iconEl = document.createElement("div");
  iconEl.className = "modal-icon";
  iconEl.innerHTML = MODAL_ICONS.count;

  const titleEl = document.createElement("h3");
  titleEl.className = "modal-title";
  titleEl.textContent = "Скільки питань пройти?";

  const msgEl = document.createElement("p");
  msgEl.className = "modal-msg";
  msgEl.textContent = `Доступно питань: ${total}. Оберіть кількість зі списку або введіть власну.`;

  const presetsEl = document.createElement("div");
  presetsEl.className = "modal-count-presets";

  const presetValues = [
    ...new Set([5, 10, 20, 30].filter((v) => v < total).concat(total)),
  ];

  const input = document.createElement("input");
  input.type = "number";
  input.className = "modal-count-field";
  input.min = 1;
  input.max = total;
  input.value = defaultCount;

  function markActivePreset(val) {
    presetsEl.querySelectorAll(".count-chip").forEach((c) => {
      c.classList.toggle("count-chip--active", Number(c.dataset.value) === val);
    });
  }

  presetValues.forEach((val) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "count-chip";
    chip.dataset.value = val;
    chip.textContent = val === total ? `Усі (${total})` : String(val);
    chip.addEventListener("click", () => {
      input.value = val;
      markActivePreset(val);
    });
    presetsEl.appendChild(chip);
  });
  markActivePreset(defaultCount);

  input.addEventListener("input", () => markActivePreset(Number(input.value)));

  const fieldWrap = document.createElement("div");
  fieldWrap.className = "modal-count-field-wrap";
  const fieldLabel = document.createElement("label");
  fieldLabel.className = "modal-count-label";
  fieldLabel.textContent = "Кількість питань:";
  fieldWrap.appendChild(fieldLabel);
  fieldWrap.appendChild(input);

  const actionsEl = document.createElement("div");
  actionsEl.className = "modal-actions";

  const startBtn = document.createElement("button");
  startBtn.className = "btn btn--primary";
  startBtn.textContent = "Почати тест";
  startBtn.addEventListener("click", () => {
    let count = parseInt(input.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > total) count = total;
    closeModal();
    setText("test-title", title);
    startTest(pickRandomQuestions(questions, count));
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn btn--secondary";
  cancelBtn.textContent = "Скасувати";
  cancelBtn.addEventListener("click", closeModal);

  actionsEl.appendChild(startBtn);
  actionsEl.appendChild(cancelBtn);

  bodyEl.appendChild(iconEl);
  bodyEl.appendChild(titleEl);
  bodyEl.appendChild(msgEl);
  bodyEl.appendChild(presetsEl);
  bodyEl.appendChild(fieldWrap);
  bodyEl.appendChild(actionsEl);

  overlay.classList.add("active");
}

function confirmExitQuiz() {
  showModal({
    icon: MODAL_ICONS.exit,
    title: "Вийти з тесту?",
    msg: "Ваш прогрес збережено. Ви зможете повернутись і продовжити пізніше.",
    buttons: [
      {
        label: "Продовжити тест",
        className: "btn--primary",
        onClick: closeModal,
      },
      {
        label: "Вийти",
        className: "btn--secondary",
        onClick: () => {
          closeModal();
          saveProgress();
          showPage("page-tests");
        },
      },
    ],
  });
}

// МОДАЛЬНЕ ВІКНО (універсальне)
function showModal({ icon, title, msg, buttons }) {
  const overlay = document.getElementById("modal-overlay");
  const bodyEl = document.getElementById("modal-body");
  bodyEl.innerHTML = "";

  const iconEl = document.createElement("div");
  iconEl.className = "modal-icon";
  iconEl.innerHTML = icon;

  const titleEl = document.createElement("h3");
  titleEl.className = "modal-title";
  titleEl.textContent = title;

  const msgEl = document.createElement("p");
  msgEl.className = "modal-msg";
  msgEl.textContent = msg;

  const actionsEl = document.createElement("div");
  actionsEl.className = "modal-actions";

  buttons.forEach(({ label, className, onClick }) => {
    const btn = document.createElement("button");
    btn.className = `btn ${className}`;
    btn.textContent = label;
    btn.addEventListener("click", onClick);
    actionsEl.appendChild(btn);
  });

  bodyEl.appendChild(iconEl);
  bodyEl.appendChild(titleEl);
  bodyEl.appendChild(msgEl);
  bodyEl.appendChild(actionsEl);

  overlay.classList.add("active");
}

function showUnansweredModal(unansweredIndex) {
  const answered = Object.keys(userAnswers).length;
  const total = currentQuestions.length;

  showModal({
    icon: MODAL_ICONS.warn,
    title: "Не всі питання відповідено",
    msg: `Ви відповіли на ${answered} з ${total} питань. Хочете перейти до питання ${unansweredIndex + 1}?`,
    buttons: [
      {
        label: `Перейти до питання ${unansweredIndex + 1}`,
        className: "btn--primary",
        onClick: () => {
          closeModal();
          goToQuestion(unansweredIndex);
        },
      },
      {
        label: "Завершити так",
        className: "btn--secondary",
        onClick: () => {
          closeModal();
          finishTest();
        },
      },
    ],
  });
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

// БІЧНА НАВІГАЦІЯ ПО ПИТАННЯХ (з пагінацією по 40 питань)
const QNAV_PAGE_SIZE = 40;
let navPage = 0;

function getQuestionNavTotalPages() {
  return Math.max(1, Math.ceil(currentQuestions.length / QNAV_PAGE_SIZE));
}

function renderQuestionNav() {
  const nav = document.getElementById("question-nav");
  if (!nav) return;

  navPage = 0;

  const prevBtn = document.getElementById("qnav-prev-page");
  const nextBtn = document.getElementById("qnav-next-page");
  if (prevBtn) prevBtn.onclick = () => goToNavPage(navPage - 1);
  if (nextBtn) nextBtn.onclick = () => goToNavPage(navPage + 1);

  renderNavGrid();
  updateNavPager();
  updateQuestionNav();
}

function renderNavGrid() {
  const nav = document.getElementById("question-nav");
  if (!nav) return;
  nav.innerHTML = "";

  const total = currentQuestions.length;
  const totalPages = getQuestionNavTotalPages();
  const start = navPage * QNAV_PAGE_SIZE;
  const end = Math.min(start + QNAV_PAGE_SIZE, total);

  for (let qi = start; qi < end; qi++) {
    const btn = document.createElement("button");
    btn.className = "qnav-btn";
    btn.textContent = qi + 1;
    btn.dataset.index = qi;
    btn.setAttribute("aria-label", `Перейти до питання ${qi + 1}`);
    btn.addEventListener("click", () => goToQuestion(qi));
    nav.appendChild(btn);
  }

  if (totalPages > 1) {
    const emptySlots = QNAV_PAGE_SIZE - (end - start);
    for (let i = 0; i < emptySlots; i++) {
      const filler = document.createElement("div");
      filler.className = "qnav-btn qnav-btn--empty";
      filler.setAttribute("aria-hidden", "true");
      nav.appendChild(filler);
    }
  }

  markNavButtons();
}

function markNavButtons() {
  const nav = document.getElementById("question-nav");
  if (!nav) return;
  nav.querySelectorAll(".qnav-btn[data-index]").forEach((btn) => {
    const qi = Number(btn.dataset.index);
    btn.classList.toggle("qnav-btn--current", qi === currentIndex);
    btn.classList.toggle("qnav-btn--answered", qi in userAnswers);
  });
}

function updateNavPager() {
  const pager = document.getElementById("quiz-nav-pager");
  if (!pager) return;

  const totalPages = getQuestionNavTotalPages();

  if (totalPages <= 1) {
    pager.style.display = "none";
    return;
  }
  pager.style.display = "";

  const total = currentQuestions.length;
  const start = navPage * QNAV_PAGE_SIZE;
  const end = Math.min(start + QNAV_PAGE_SIZE, total);

  setText("qnav-page-label", `${start + 1}–${end}`);

  const prevBtn = document.getElementById("qnav-prev-page");
  const nextBtn = document.getElementById("qnav-next-page");
  if (prevBtn) prevBtn.disabled = navPage === 0;
  if (nextBtn) nextBtn.disabled = navPage === totalPages - 1;
}

function goToNavPage(page) {
  const totalPages = getQuestionNavTotalPages();
  if (page < 0 || page >= totalPages) return;
  navPage = page;
  renderNavGrid();
  updateNavPager();
}

function updateQuestionNav() {
  const nav = document.getElementById("question-nav");
  if (!nav) return;

  const answeredCount = Object.keys(userAnswers).length;
  setText("qnav-answered", answeredCount);
  setText("qnav-total", currentQuestions.length);

  const pageOfCurrent = Math.floor(currentIndex / QNAV_PAGE_SIZE);
  if (pageOfCurrent !== navPage) {
    navPage = pageOfCurrent;
    renderNavGrid();
    updateNavPager();
  } else {
    markNavButtons();
  }
}
