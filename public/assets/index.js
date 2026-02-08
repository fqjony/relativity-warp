var tipsCache = [];

function flattenTips(groups) {
  if (!Array.isArray(groups)) {
    return [];
  }

  var flattened = [];
  groups.forEach(function (group) {
    if (!group || !Array.isArray(group.Tips)) {
      return;
    }
    group.Tips.forEach(function (tip) {
      if (!tip || !tip.Tip) {
        return;
      }
      flattened.push({
        Tip: tip.Tip,
        Why: tip.Why,
        Group: group.Group || "General",
      });
    });
  });

  return flattened;
}

function renderTip(tip) {
  var container = document.getElementById("tip-widget");
  if (!container) {
    return;
  }

  var title = container.querySelector(".hero-tip-title");
  var body = container.querySelector(".hero-tip-body");

  if (!title || !body) {
    container.innerHTML = "";
    title = document.createElement("div");
    title.className = "hero-tip-title";
    body = document.createElement("div");
    body.className = "hero-tip-body";
    container.appendChild(title);
    container.appendChild(body);
  }

  if (!tip) {
    title.textContent = "Tip";
    body.textContent = "No tips available.";
    return;
  }

  title.textContent = tip.Group || "Tip";
  body.textContent = tip.Tip || "";
}

function pickRandomTip() {
  if (!tipsCache.length) {
    renderTip(null);
    return;
  }

  var index = Math.floor(Math.random() * tipsCache.length);
  renderTip(tipsCache[index]);
}

function loadTips() {
  return fetch("tips.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load tips");
      }
      return response.json();
    })
    .then(function (data) {
      tipsCache = flattenTips(data);
      pickRandomTip();
    })
    .catch(function () {
      tipsCache = [];
      renderTip(null);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  Promise.allSettled([loadTips()]);

  var themeToggle = document.getElementById("theme-toggle");
  var themeJoke = document.getElementById("theme-tooltip");
  var tooltipTimer;

  var themeJokes = [
    "Starlight says: keep the orbit steady.",
    "Starlight hums best in the dark.",
    "Starlight approves: hold the line.",
  ];

  function pickThemeJoke() {
    return themeJokes[Math.floor(Math.random() * themeJokes.length)];
  }

  function showThemeTooltip(message) {
    if (!themeJoke) {
      return;
    }
    themeJoke.textContent = message;
    themeJoke.classList.add("is-visible");
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function () {
      themeJoke.classList.remove("is-visible");
    }, 1800);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      showThemeTooltip(pickThemeJoke());
    });
  }

  var refreshButton = document.getElementById("tip-refresh");
  if (refreshButton) {
    refreshButton.addEventListener("click", function () {
      if (!tipsCache.length) {
        loadTips();
        return;
      }
      pickRandomTip();
    });
  }
});
