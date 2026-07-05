// СПІЛЬНИЙ КОМПОНЕНТ: СІТКА КАРТОК
function renderCardGrid(container, items, getInfo, onClick) {
  container.innerHTML = "";

  items.forEach((item) => {
    const { icon, name, desc } = getInfo(item);

    const card = document.createElement("div");
    card.className = "choice-card";
    card.dataset.tooltip = name;

    const iconEl = document.createElement("span");
    iconEl.className = "choice-card__icon";
    iconEl.innerHTML = icon;

    const body = document.createElement("div");
    body.className = "choice-card__body";

    const title = document.createElement("h3");
    title.className = "choice-card__title";
    title.textContent = name;

    const descEl = document.createElement("p");
    descEl.className = "choice-card__desc";
    descEl.textContent = desc;

    body.appendChild(title);
    body.appendChild(descEl);

    const arrow = document.createElement("span");
    arrow.className = "choice-card__arrow";
    arrow.textContent = "→";

    card.appendChild(iconEl);
    card.appendChild(body);
    card.appendChild(arrow);

    card.addEventListener("click", () => onClick(item));
    container.appendChild(card);
  });
}
