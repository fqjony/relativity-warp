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

  container.innerHTML = "";

  if (!tip) {
    var empty = document.createElement("p");
    empty.className = "list-item";
    empty.textContent = "• No tips available.";
    container.appendChild(empty);
    return;
  }

  var title = document.createElement("div");
  title.className = "tip-title";
  title.textContent = tip.Tip;

  var why = document.createElement("div");
  why.className = "tip-why";
  why.textContent = tip.Why || "";

  var meta = document.createElement("div");
  meta.className = "tip-meta";
  meta.textContent = tip.Group || "General";

  container.appendChild(title);
  container.appendChild(why);
  container.appendChild(meta);
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

function renderSpectrum(items) {
  var container = document.getElementById("spectrum-grid");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!items || !items.length) {
    var empty = document.createElement("p");
    empty.className = "list-item";
    empty.textContent = "• No spectrum entries available.";
    container.appendChild(empty);
    return;
  }

  items.forEach(function (item) {
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
      link.textContent = "Open JSON";
      link.href = item.path;
      link.target = "_blank";
      link.rel = "noopener";
      meta.appendChild(link);
    }

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);
    container.appendChild(card);
  });
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

document.addEventListener("DOMContentLoaded", function () {
  loadResearchLinks();
  loadTips();
  loadSpectrumIndex();

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
