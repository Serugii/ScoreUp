// НАВІГАЦІЯ МІЖ СТОРІНКАМИ
function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pageId === "page-home" || pageId === "page-tests") {
    checkSavedProgress();
  }
}
