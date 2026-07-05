// ТОЧКА ВХОДУ
document.addEventListener("DOMContentLoaded", () => {
  renderTestTopics();
  renderLearnTopics();

  const allCard = document.querySelector(".choice-card--full");
  if (allCard) {
    allCard.addEventListener("click", () => {
      const allQuestions = topics.flatMap((t) => getTopicQuestions(t));
      openCountModal(allQuestions, "Всі розділи");
    });
  }

  checkSavedProgress();
});
