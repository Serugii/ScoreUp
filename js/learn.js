// СТОРІНКА НАВЧАЛЬНИХ МАТЕРІАЛІВ
function renderLearnTopics() {
  const grid = document.getElementById("learn-topics-grid");
  renderCardGrid(
    grid,
    topics,
    (t) => ({
      icon: t.iconSvg,
      name: t.name,
      desc: `Підрозділів: ${t.subtopics.length}`,
    }),
    (t) => openTopicLearnPage(t.id),
  );
}

function openTopicLearnPage(topicId) {
  const topic = findTopic(topicId);
  if (!topic) return;

  setText("topic-learn-page-icon", topic.icon);
  setText("topic-learn-page-title", topic.name);

  const intro = document.getElementById("topic-learn-intro");
  intro.innerHTML = "";

  const introDesc = document.createElement("p");
  introDesc.textContent = topic.description;
  intro.appendChild(introDesc);

  if (topic.keyPoints && topic.keyPoints.length) {
    const ul = document.createElement("ul");
    ul.className = "key-points";
    topic.keyPoints.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      ul.appendChild(li);
    });
    intro.appendChild(ul);
  }

  const list = document.getElementById("topic-learn-subtopics");
  list.innerHTML = "";

  topic.subtopics.forEach((s) => {
    const item = document.createElement("div");
    item.className = "learn-item";
    item.id = "learn-" + topic.id + "-" + s.id;

    const header = document.createElement("div");
    header.className = "learn-item__header";

    const headerIcon = document.createElement("span");
    headerIcon.className = "learn-item__icon";
    headerIcon.textContent = topic.icon;

    const headerName = document.createElement("span");
    headerName.className = "learn-item__name";
    headerName.textContent = s.name;

    const chevron = document.createElement("span");
    chevron.className = "learn-item__chevron";
    chevron.textContent = "▼";

    header.appendChild(headerIcon);
    header.appendChild(headerName);
    header.appendChild(chevron);
    header.addEventListener("click", () => item.classList.toggle("open"));

    const body = document.createElement("div");
    body.className = "learn-item__body";

    const desc = document.createElement("p");
    desc.textContent = s.description;
    body.appendChild(desc);

    const ul = document.createElement("ul");
    s.keyPoints.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      ul.appendChild(li);
    });
    body.appendChild(ul);

    item.appendChild(header);
    item.appendChild(body);
    list.appendChild(item);
  });

  showPage("page-topic-learn");
}
