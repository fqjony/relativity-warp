function toggleCollapse(id) {
  var content = document.getElementById(id);
  var isActive = content.classList.contains("active");

  // Close all other collapsibles
  var allCollapsibles = document.querySelectorAll(".collapsible-content");
  allCollapsibles.forEach(function (item) {
    item.classList.remove("active");
  });

  // If the clicked one wasn't active, open it
  if (!isActive) {
    content.classList.add("active");
  }
}

function renderResearchLinks(items) {
  var container = document.getElementById("research-links");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!items || !items.length) {
    var empty = document.createElement("p");
    empty.className = "list-item";
    empty.textContent = "• No research entries yet.";
    container.appendChild(empty);
    return;
  }

  items.forEach(function (item) {
    var row = document.createElement("p");
    row.className = "list-item";
    row.appendChild(document.createTextNode("• "));

    var link = document.createElement("a");
    link.href = item.url || item.path || "#";
    link.textContent = item.title || item.url || item.path;
    link.target = "_blank";
    link.rel = "noopener";

    row.appendChild(link);
    container.appendChild(row);
  });
}

function loadResearchLinks() {
  fetch("research/index.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load research index");
      }
      return response.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : data.items;
      renderResearchLinks(items || []);
    })
    .catch(function () {
      renderResearchLinks([]);
    });
}

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

  var title = container.querySelector(".tip-inline-title");
  var body = container.querySelector(".tip-inline-body");

  if (!title || !body) {
    container.innerHTML = "";
    title = document.createElement("div");
    title.className = "tip-inline-title";
    body = document.createElement("div");
    body.className = "tip-inline-body";
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
  fetch("spectrum/engineering-tips.json", { cache: "no-store" })
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

function buildDataCard(item, linkLabel) {
  var card = document.createElement("div");
  card.className = "spectrum-card";

  var title = document.createElement("div");
  title.className = "spectrum-title";
  title.textContent = item.title || item.name || "Untitled";

  var description = document.createElement("div");
  description.className = "spectrum-description";
  description.textContent = item.description || "No description provided.";

  var meta = document.createElement("div");
  meta.className = "spectrum-meta";

  if (item.category) {
    var category = document.createElement("span");
    category.className = "pill";
    category.textContent = item.category;
    meta.appendChild(category);
  }

  if (item.format) {
    var format = document.createElement("span");
    format.className = "pill";
    format.textContent = item.format;
    meta.appendChild(format);
  }

  if (item.path) {
    var link = document.createElement("a");
    link.className = "pill";
    link.textContent = linkLabel;
    link.href = item.path;
    link.target = "_blank";
    link.rel = "noopener";
    meta.appendChild(link);
  }

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(meta);
  return card;
}

function renderDataCollection(items, containerId, emptyLabel, linkLabel) {
  var container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!items || !items.length) {
    var empty = document.createElement("p");
    empty.className = "list-item";
    empty.textContent = emptyLabel;
    container.appendChild(empty);
    return;
  }

  var expanded = container.getAttribute("data-expanded") === "true";
  var limit = 1;
  var visibleItems = expanded ? items : items.slice(0, limit);

  visibleItems.forEach(function (item) {
    container.appendChild(buildDataCard(item, linkLabel));
  });

  if (items.length > limit) {
    var toggle = document.createElement("button");
    toggle.className = "button button-compact button-ghost expand-button";
    toggle.type = "button";
    toggle.textContent = expanded ? "Less" : "More";
    toggle.addEventListener("click", function () {
      container.setAttribute("data-expanded", expanded ? "false" : "true");
      renderDataCollection(items, containerId, emptyLabel, linkLabel);
    });
    container.appendChild(toggle);
  }
}

function renderSpectrum(items) {
  renderDataCollection(
    items,
    "spectrum-grid",
    "• No spectrum entries available.",
    "JSON"
  );
}

function loadSpectrumIndex() {
  fetch("spectrum/index.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load spectrum index");
      }
      return response.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : data.items;
      renderSpectrum(items || []);
    })
    .catch(function () {
      renderSpectrum([]);
    });
}

function renderPrompts(items) {
  renderDataCollection(
    items,
    "prompts-grid",
    "• No prompts available.",
    "Prompt"
  );
}

function loadPromptsIndex() {
  fetch("src/prompts/index.json", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load prompts index");
      }
      return response.json();
    })
    .then(function (data) {
      var items = Array.isArray(data) ? data : data.items;
      renderPrompts(items || []);
    })
    .catch(function () {
      renderPrompts([]);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadResearchLinks();
  loadTips();
  loadSpectrumIndex();
  loadPromptsIndex();

  var themeToggle = document.getElementById("theme-toggle");
  var themeJoke = document.getElementById("theme-joke");
  var savedTheme = window.localStorage.getItem("rw-theme");

  function getPreferredTheme() {
    if (savedTheme) {
      return savedTheme;
    }
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }

  document.body.setAttribute("data-theme", getPreferredTheme());

  function updateThemeNotice() {
    if (!themeJoke) {
      return;
    }
    var isLight = document.body.getAttribute("data-theme") === "light";
    if (isLight) {
      themeJoke.textContent = "Light mode? Bold choice. Sunglasses engaged.";
      themeJoke.classList.add("is-visible");
    } else {
      themeJoke.textContent = "";
      themeJoke.classList.remove("is-visible");
    }
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.textContent = isLight ? "🌙 Dark" : "🌞 Light";
    }
  }

  updateThemeNotice();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme =
        document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", nextTheme);
      window.localStorage.setItem("rw-theme", nextTheme);
      updateThemeNotice();
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

  var tabs = document.querySelectorAll(".data-tab");
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var panelId = tab.getAttribute("data-panel");
        tabs.forEach(function (item) {
          item.classList.remove("is-active");
          item.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        document.querySelectorAll(".data-panel").forEach(function (panel) {
          if (panel.id === panelId) {
            panel.classList.remove("is-hidden");
          } else {
            panel.classList.add("is-hidden");
          }
        });
      });
    });
  }
});
