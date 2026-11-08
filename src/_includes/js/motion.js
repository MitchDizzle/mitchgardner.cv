// Pause button for the site's animations (the fire lines). Inlined in <head> by both
// layouts, so a visitor who paused never sees a moving frame on the next page.
// The choice is remembered per browser; visitors who ask for reduced motion never
// get the animation or the button (see the CSS).
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    if (localStorage.getItem("motion") === "paused") root.setAttribute("data-motion", "paused");
  } catch (e) {
    // storage blocked: the animation just starts unpaused
  }

  function sync() {
    var label = root.getAttribute("data-motion") === "paused" ? "Play animation" : "Pause animation";
    var buttons = document.querySelectorAll("[data-motion-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", label);
      buttons[i].title = label;
    }
  }

  document.addEventListener("DOMContentLoaded", sync);
  document.addEventListener("click", function (e) {
    var button = e.target.closest && e.target.closest("[data-motion-toggle]");
    if (!button) return;
    var paused = root.getAttribute("data-motion") !== "paused";
    if (paused) root.setAttribute("data-motion", "paused");
    else root.removeAttribute("data-motion");
    try {
      localStorage.setItem("motion", paused ? "paused" : "on");
    } catch (e2) {
      // not remembered, still works on this page
    }
    sync();
  });
})();
