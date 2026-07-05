// УТИЛІТИ
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findTopic(topicId) {
  return topics.find((t) => t.id === topicId);
}

function getTopicQuestions(topic) {
  return topic.subtopics.flatMap((s) => s.questions);
}

function getTopicQuestionCount(topic) {
  return getTopicQuestions(topic).length;
}

function pickRandomQuestions(questions, count) {
  if (!count || count >= questions.length) return [...questions];
  return shuffleArray(questions).slice(0, count);
}
