// СТОРІНКА ВИБОРУ ТЕСТУ
function renderTestTopics() {
  const grid = document.getElementById("topics-grid");
  renderCardGrid(
    grid,
    topics,
    (t) => ({
      icon: t.iconSvg,
      name: t.name,
      desc: `Питань: ${getTopicQuestionCount(t)}`,
    }),
    (t) => openTopicTestPage(t.id),
  );
}

function openTopicTestPage(topicId) {
  const topic = findTopic(topicId);
  if (!topic) return;

  setText("topic-test-page-icon", topic.icon);
  setText("topic-test-page-title", topic.name);

  const allCard = document.getElementById("topic-test-all-card");
  allCard.innerHTML = "";

  const icon = document.createElement("span");
  icon.className = "choice-card__icon";
  icon.innerHTML = topic.iconSvg;

  const body = document.createElement("div");
  body.className = "choice-card__body";

  const titleText = `Весь розділ «${topic.name}»`;

  const title = document.createElement("h3");
  title.className = "choice-card__title";
  title.textContent = titleText;

  const desc = document.createElement("p");
  desc.className = "choice-card__desc";
  desc.textContent = `Питань: ${getTopicQuestionCount(topic)} • усі підрозділи`;

  body.appendChild(title);
  body.appendChild(desc);

  const arrow = document.createElement("span");
  arrow.className = "choice-card__arrow";
  arrow.textContent = "→";

  allCard.dataset.tooltip = titleText;
  allCard.appendChild(icon);
  allCard.appendChild(body);
  allCard.appendChild(arrow);
  allCard.onclick = () => {
    openCountModal(getTopicQuestions(topic), topic.name);
  };

  const subGrid = document.getElementById("topic-test-subtopics-grid");
  renderCardGrid(
    subGrid,
    topic.subtopics,
    (s) => ({
      icon: topic.iconSvg,
      name: s.name,
      desc: `Питань: ${s.questions.length}`,
    }),
    (s) => {
      setText("test-title", `${topic.name} — ${s.name}`);
      startTest(s.questions);
    },
  );

  showPage("page-topic-tests");
}
