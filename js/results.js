// РЕЗУЛЬТАТИ
function showResults() {
  const total = currentQuestions.length;

  let score = 0;
  currentQuestions.forEach((q, qi) => {
    if (userAnswers[qi] === q.correct) score++;
  });

  const pct = Math.round((score / total) * 100);

  setText("final-score", score);
  setText("max-score", total);

  const icons = {
    trophy: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
    star: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    book: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    retry: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>`,
  };

  let iconKey = "retry";
  let label = "Варто ще попрацювати над темами.";
  if (pct >= 90) {
    iconKey = "trophy";
    label = "Відмінний результат!";
  } else if (pct >= 70) {
    iconKey = "star";
    label = "Гарний результат! Є куди рости.";
  } else if (pct >= 50) {
    iconKey = "book";
    label = "Непогано, але є над чим попрацювати.";
  }

  const iconWrap = document.getElementById("results-icon");
  iconWrap.innerHTML = `
    <button class="results-restart-btn" onclick="restartLastTest()" title="Пройти цей тест знову">
      <span class="results-restart-btn__icon">${icons[iconKey]}</span>
      <span class="results-restart-btn__label">Повторити</span>
    </button>
  `;
  setText("results-label", label);

  // Час виконання
  setText("results-time", formatTime(finalTime));

  renderReview();
  showPage("page-results");
}

// ДЕТАЛЬНИЙ ЗВІТ
function renderReview() {
  const container = document.getElementById("review-list");
  if (!container) return;
  container.innerHTML = "";

  currentQuestions.forEach((q, qi) => {
    const userAns = userAnswers[qi];
    const isCorrect = userAns === q.correct;

    const item = document.createElement("div");
    item.className =
      "review-item " + (isCorrect ? "review-item--ok" : "review-item--err");

    const header = document.createElement("div");
    header.className = "review-item__header";

    const num = document.createElement("span");
    num.className = "review-num";
    num.textContent = qi + 1;

    const qText = document.createElement("span");
    qText.className = "review-q";
    qText.textContent = q.q;

    const iconEl = document.createElement("span");
    iconEl.className = "review-icon";
    iconEl.textContent = isCorrect ? "✓" : "✗";

    header.appendChild(num);
    header.appendChild(qText);
    header.appendChild(iconEl);
    item.appendChild(header);

    const hint = document.createElement("div");
    hint.className = "review-hint";

    if (isCorrect) {
      const correctLine = document.createElement("p");
      correctLine.className = "review-hint__correct";
      correctLine.textContent =
        "Ваша відповідь: " + (userAns !== undefined ? q.options[userAns] : "—");
      hint.appendChild(correctLine);
    } else {
      if (userAns !== undefined) {
        const wrongLine = document.createElement("p");
        wrongLine.className = "review-hint__wrong";
        wrongLine.textContent = "Ваша відповідь: " + q.options[userAns];
        hint.appendChild(wrongLine);
      } else {
        const skippedLine = document.createElement("p");
        skippedLine.className = "review-hint__wrong";
        skippedLine.textContent = "Питання пропущено";
        hint.appendChild(skippedLine);
      }

      const correctLine = document.createElement("p");
      correctLine.className = "review-hint__correct";
      correctLine.textContent = "Правильна відповідь: " + q.options[q.correct];
      hint.appendChild(correctLine);
    }

    item.appendChild(hint);
    container.appendChild(item);
  });
}
